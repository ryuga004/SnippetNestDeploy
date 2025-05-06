"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCodeforcesRating } from "@/server/scrapper/codeForces";
import { ExternalLink } from "lucide-react";
import React, { useEffect, useState } from "react";

export interface CodingProfile {
  handle: string;
  firstName: string;
  lastName: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  avatar: string;
  titlePhoto: string;
  organization: string;
  country: string;
  city: string;
}

interface CodingProfileCardProps {
  handle?: string;
}

const CodingProfileCard: React.FC<CodingProfileCardProps> = ({
  handle = "",
}) => {
  const [profile, setProfile] = useState<CodingProfile>({
    handle: "",
    firstName: "",
    lastName: "",
    rating: 0,
    maxRating: 0,
    rank: "",
    maxRank: "",
    avatar: "",
    titlePhoto: "",
    organization: "",
    country: "",
    city: "",
  });
  useEffect(() => {
    const fetchProfile = async () => {
      return await getCodeforcesRating("Ryuga01");
    };
    fetchProfile().then((data) => {
      setProfile(data);
    });
  }, [handle]);
  return (
    <Card className="w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700 p-4">
      <CardHeader className="flex items-center space-x-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={profile.avatar} alt={profile.handle} />
        </Avatar>
        <div>
          <CardTitle className="text-lg font-semibold">
            {profile.handle}
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {profile.organization || "No Organization"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Rating:</span>
          <span className="font-semibold">
            {profile.rating} (Max: {profile.maxRating})
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Rank:</span>
          <Badge variant="outline" className="capitalize">
            {profile.rank}
          </Badge>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Country:</span>
          <span>{profile.country}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">City:</span>
          <span>{profile.city || "N/A"}</span>
        </div>

        <Button
          variant="outline"
          className="w-full flex justify-center items-center"
          asChild
        >
          <a
            href={`https://codeforces.com/profile/${profile.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Profile</span>
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CodingProfileCard;
