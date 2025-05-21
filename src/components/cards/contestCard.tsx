"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { ContestType } from "@/lib/types";

export default function ContestCard({ contest }: { contest: ContestType }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const startTime = new Date(contest.startTime).getTime();
      const diff = startTime - now;

      if (diff <= 0) {
        setTimeLeft("Live Now");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [contest.startTime]);

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Codeforces":
        return "bg-blue-500";
      case "CodeChef":
        return "bg-purple-500";
      case "LeetCode":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="w-full max-w-lg p-4 transition-transform hover:scale-[1.02] shadow-md">
      <CardContent className="flex flex-col space-y-3">
        <Badge
          className={`text-white px-3 py-1 rounded-sm w-fit ${getPlatformColor(
            contest.platform
          )}`}
        >
          {contest.platform}
        </Badge>

        <h2 className="text-xl font-semibold">{contest.name}</h2>

        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar size={18} />
            <span>{new Date(contest.startTime).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={18} />
            <span>{timeLeft}</span>
          </div>
        </div>
        {/* edited comments  */}
        <a href={contest.link} target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-primary text-white hover:bg-primary/80">
            Join Contest
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}
