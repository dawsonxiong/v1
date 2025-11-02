import { createClient } from '@supabase/supabase-js'

interface Activity {
  id: string
  source: 'wakatime' | 'monkeytype' | 'listenbrainz'
  type: 'coding' | 'typing_test' | 'music'
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
async function fetchMonkeytypeData(apeKey: string): Promise<Activity[]> {
  const response = await fetch('https://api.monkeytype.com/results?limit=5', {
    headers: {
      'Authorization': `ApeKey ${apeKey}`
    }
  })

  if (!response.ok) {
    console.error('Monkeytype API error:', response.status, response.statusText)
    const errorText = await response.text()
    console.error('Monkeytype error details:', errorText)
    return []
  }

  const data = await response.json() as { data: any[] }

  if (!data.data || data.data.length === 0) {
    console.log('No Monkeytype results found')
    return []
  }

  return data.data.map((result: any) => ({
    id: `monkeytype-${result._id}`,
    source: 'monkeytype' as const,
    type: 'typing_test' as const,
    title: `${result.wpm} WPM - ${result.acc}% accuracy`,
    creators: null,
    url: null,
    started_at: new Date(result.timestamp).toISOString(),
    completed_at: new Date(result.timestamp).toISOString(),
    duration_seconds: Math.round(result.testDuration),
    raw: result
  }))
}

// ListenBrainz API integration
async function fetchListenBrainzData(username: string): Promise<Activity[]> {
  const response = await fetch(
    `https://api.listenbrainz.org/1/user/${username}/listens?count=5`
  )

  if (!response.ok) {
    console.error('ListenBrainz API error:', response.status, response.statusText)
    return []
  }

  const data = await response.json() as { payload: { listens: any[] } }

  if (!data.payload?.listens || data.payload.listens.length === 0) {
    console.log('No ListenBrainz listens found')
    return []
  }

  return data.payload.listens.map((listen: any) => {
    const trackName = listen.track_metadata?.track_name || 'Unknown Track'
    const artistName = listen.track_metadata?.artist_name || 'Unknown Artist'
    const listenedAt = listen.listened_at
    const recordingMsid = listen.recording_msid || Math.random().toString(36)
    
    return {
      id: `listenbrainz-${listenedAt}-${recordingMsid}`,
      source: 'listenbrainz' as const,
      type: 'music' as const,
      title: trackName,
      creators: [artistName],
      url: listen.track_metadata?.additional_info?.spotify_id 
        ? `https://open.spotify.com/track/${listen.track_metadata.additional_info.spotify_id}`
        : null,
      started_at: new Date(listenedAt * 1000).toISOString(),
      completed_at: new Date(listenedAt * 1000).toISOString(),
      duration_seconds: listen.track_metadata?.additional_info?.duration_ms 
        ? Math.round(listen.track_metadata.additional_info.duration_ms / 1000)
        : null,
      raw: listen
    }
  })
}

// Main worker handler
export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    console.log('Starting activity collection...')

    const supabase = createClient(env.SUPABASE_DB_URL, env.SUPABASE_SERVICE_ROLE_KEY)

    try {
      // Fetch data from WakaTime, Monkeytype, and ListenBrainz
      const [wakatimeData, monkeytypeData, listenbrainzData] = await Promise.all([
        fetchWakaTimeData(env.WAKATIME_API_KEY),
        fetchMonkeytypeData(env.MONKEYTYPE_APE_KEY),
        fetchListenBrainzData(env.LISTENBRAINZ_USER)
      ])

      const allActivities = [...wakatimeData, ...monkeytypeData, ...listenbrainzData]

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
  MONKEYTYPE_APE_KEY: string
  LISTENBRAINZ_USER: string
}
