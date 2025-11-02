import { createClient } from "@supabase/supabase-js";

// Client-side Supabase instance
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase instance (for API routes)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export type Activity = {
  id: string;
  source: "wakatime" | "monkeytype" | "listenbrainz";
  type: "coding" | "typing_test" | "music";
  title: string;
  creators: string[] | null;
  url: string | null;
  started_at: string | null;
  completed_at: string;
  duration_seconds: number | null;
  raw: any;
  created_at: string;
};
