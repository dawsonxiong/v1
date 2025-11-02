import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Activity } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    const startDate = new Date(date + 'T00:00:00-05:00');
    const endDate = new Date(date + 'T23:59:59-05:00');

    const { data, error } = await supabaseAdmin
      .from("activity")
      .select("*")
      .gte("completed_at", startDate.toISOString())
      .lte("completed_at", endDate.toISOString())
      .order("completed_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch activities" },
        { status: 500 },
      );
    }

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
