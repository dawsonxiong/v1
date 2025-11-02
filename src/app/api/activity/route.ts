import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Activity } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    const { data, error } = await supabaseAdmin
      .from("activity")
      .select("*")
      .eq("completed_at::date", date)
      .order("completed_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch activities" },
        { status: 500 },
      );
    }

    // Group activities by source
    const groupedActivities = data.reduce(
      (acc: Record<string, Activity[]>, activity) => {
        if (!acc[activity.source]) {
          acc[activity.source] = [];
        }
        acc[activity.source].push(activity);
        return acc;
      },
      {},
    );

    return NextResponse.json({
      date,
      activities: groupedActivities,
      total: data.length,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
