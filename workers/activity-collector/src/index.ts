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
  const response = await fetch('https://wakatime.com/api/v1/users/current/summaries?start=today&end=today', {
    headers: {
      'Authorization': `Basic ${btoa(apiKey)}`
    }
  })

  if (!response.ok) {
    return []
  }

  const data = await response.json() as { data: any[] }

  if (!data.data || data.data.length === 0) {
    return []
  }

  const todaySummary = data.data[0]
  const projects = todaySummary.projects || []

  return projects.map((project: any) => ({
    id: `wakatime-${todaySummary.range.date}-${project.name}`,
    source: 'wakatime' as const,
    type: 'coding' as const,
    title: project.name || 'Unknown Project',
    creators: null,
    url: null,
    started_at: todaySummary.range.start,
    completed_at: todaySummary.range.end,
    duration_seconds: Math.round(project.total_seconds),
    raw: project
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
    return []
  }

  const data = await response.json() as { data: any[] }

  if (!data.data || data.data.length === 0) {
    return []
  }

  return data.data.map((result: any) => {
    // Extract test type from raw data
    const testType = result.mode === 'time' 
      ? `${result.mode2}s` 
      : result.mode === 'words' 
      ? `${result.mode2} words` 
      : result.mode
    
    return {
      id: `monkeytype_${result._id}`,
      source: 'monkeytype' as const,
      type: 'typing_test' as const,
      title: `${Math.round(result.wpm)} WPM · ${Math.round(result.acc)}% · ${testType}`,
      creators: null,
      url: null,
      started_at: new Date(result.timestamp).toISOString(),
      completed_at: new Date(result.timestamp).toISOString(),
      duration_seconds: Math.round(result.testDuration),
      raw: result
    }
  })
}

// ListenBrainz API integration
async function fetchListenBrainzData(username: string): Promise<Activity[]> {
  const response = await fetch(
    `https://api.listenbrainz.org/1/user/${username}/listens?count=5`
  )

  if (!response.ok) {
    return []
  }

  const data = await response.json() as { payload: { listens: any[] } }

  if (!data.payload?.listens || data.payload.listens.length === 0) {
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
    const supabase = createClient(env.SUPABASE_DB_URL, env.SUPABASE_SERVICE_ROLE_KEY)

    try {
      const [wakatimeData, monkeytypeData] = await Promise.all([
        fetchWakaTimeData(env.WAKATIME_API_KEY),
        fetchMonkeytypeData(env.MONKEYTYPE_API_KEY)
      ])

      const allActivities = [...wakatimeData, ...monkeytypeData]

      if (allActivities.length === 0) {
        return
      }

      await supabase
        .from('activity')
        .upsert(allActivities, { onConflict: 'id' })

    } catch (error) {
      // Silent fail
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
