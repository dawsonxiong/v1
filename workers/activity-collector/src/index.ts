import { createClient } from '@supabase/supabase-js'

interface Activity {
  id: string
  source: 'wakatime' | 'monkeytype'
  type: 'coding' | 'typing_test'
  title: string
  creators: string[] | null
  url: string | null
  started_at: string | null
  completed_at: string
  duration_seconds: number | null
  raw: any
}

// WakaTime API integration
async function fetchWakaTimeData(apiKey: string): Promise<Activity[]> {
  const response = await fetch('https://wakatime.com/api/v1/users/current/durations/today', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    console.error('WakaTime API error:', response.status, response.statusText)
    return []
  }

  const data = await response.json() as { data: any[] }

  return data.data.map((duration: any) => ({
    id: `wakatime-${duration.id}`,
    source: 'wakatime' as const,
    type: 'coding' as const,
    title: duration.project || 'Unknown Project',
    creators: null,
    url: null,
    started_at: duration.start_time,
    completed_at: duration.end_time || new Date().toISOString(),
    duration_seconds: duration.duration,
    raw: duration
  }))
}

// Monkeytype API integration
async function fetchMonkeytypeData(apiKey: string, username: string): Promise<Activity[]> {
  const response = await fetch(`https://api.monkeytype.com/users/${username}/results`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    console.error('Monkeytype API error:', response.status, response.statusText)
    return []
  }

  const data = await response.json() as { data: any[] }

  return data.data.slice(0, 5).map((result: any) => ({
    id: `monkeytype-${result._id}`,
    source: 'monkeytype' as const,
    type: 'typing_test' as const,
    title: `${result.wpm} WPM - ${result.acc}% accuracy`,
    creators: null,
    url: `https://monkeytype.com/results/${result._id}`,
    started_at: new Date(result.timestamp).toISOString(),
    completed_at: new Date(result.timestamp).toISOString(),
    duration_seconds: Math.round(result.testDuration),
    raw: result
  }))
}

// Main worker handler
export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    console.log('Starting activity collection...')

    const supabase = createClient(env.SUPABASE_DB_URL, env.SUPABASE_SERVICE_ROLE_KEY)

    try {
      // Fetch data from WakaTime and Monkeytype
      const [wakatimeData, monkeytypeData] = await Promise.all([
        fetchWakaTimeData(env.WAKATIME_API_KEY),
        fetchMonkeytypeData(env.MONKEYTYPE_API_KEY, env.MONKEYTYPE_USERNAME)
      ])

      const allActivities = [...wakatimeData, ...monkeytypeData]

      if (allActivities.length === 0) {
        console.log('No new activities found')
        return
      }

      // Insert activities with conflict handling
      const { error } = await supabase
        .from('activity')
        .upsert(allActivities, { onConflict: 'id' })

      if (error) {
        console.error('Error inserting activities:', error)
        return
      }

      console.log(`Successfully inserted ${allActivities.length} activities`)

    } catch (error) {
      console.error('Error in activity collection:', error)
    }
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response('Activity collector worker is running')
  }
} satisfies ExportedHandler<Env>;

interface Env {
  SUPABASE_DB_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  WAKATIME_API_KEY: string
  MONKEYTYPE_API_KEY: string
  MONKEYTYPE_USERNAME: string
}
