"use client";

import { useState, useEffect } from "react";
import { Activity } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, Code, Keyboard, Music } from "lucide-react";

interface ActivityData {
  date: string;
  activities: Record<string, Activity[]>;
  total: number;
}

interface ActivityFeedProps {
  initialDate?: string;
}

const sourceIcons = {
  wakatime: Code,
  monkeytype: Keyboard,
  listenbrainz: Music,
};

const sourceLabels = {
  wakatime: "Coding",
  monkeytype: "Typing Tests",
  listenbrainz: "Music",
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ActivityFeed({ initialDate }: ActivityFeedProps) {
  const [selectedDate, setSelectedDate] = useState(
    initialDate || new Date().toISOString().split("T")[0],
  );
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSources, setExpandedSources] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    fetchActivities(selectedDate);
  }, [selectedDate]);

  const fetchActivities = async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/activity?date=${date}`);
      const data = (await response.json()) as ActivityData;
      setActivityData(data);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = (source: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [source]: !prev[source],
    }));
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-0">
          <div className="text-center text-zinc-500">Loading activities...</div>
        </CardContent>
      </Card>
    );
  }

  if (!activityData || activityData.total === 0) {
    return (
      <Card>
        <CardContent className="pt-0">
          <div className="text-center text-zinc-500">
            No activities found for {selectedDate}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Activity Feed</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {selectedDate} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {generateDateOptions().map((date) => (
                <DropdownMenuItem
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={date === selectedDate ? "bg-zinc-100" : ""}
                >
                  {date}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(activityData.activities).map(([source, activities]) => {
          const Icon = sourceIcons[source as keyof typeof sourceIcons];
          const isExpanded = expandedSources[source];

          return (
            <div key={source} className="border rounded-lg">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto"
                    onClick={() => toggleSource(source)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-zinc-600" />
                      <span className="font-medium">
                        {sourceLabels[source as keyof typeof sourceLabels]}
                      </span>
                      <span className="text-sm text-zinc-500">
                        ({activities.length})
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  {activities.map((activity) => (
                    <DropdownMenuItem
                      key={activity.id}
                      className="p-4 cursor-default"
                    >
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            {activity.title}
                          </p>
                          <span className="text-xs text-zinc-500">
                            {formatTime(activity.completed_at)}
                          </span>
                        </div>
                        {activity.duration_seconds && (
                          <p className="text-xs text-zinc-600">
                            {formatDuration(activity.duration_seconds)}
                          </p>
                        )}
                        {activity.creators && activity.creators.length > 0 && (
                          <p className="text-xs text-zinc-600">
                            {activity.creators.join(", ")}
                          </p>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
