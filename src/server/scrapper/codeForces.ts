import { CodingProfile } from "@/components/cards/codingProfileCard";
import axios from "axios";


type ContestApiType = {
  id: number;
  name: string;
  type: string;
  phase: string;
  durationSeconds: number;
  startTimeSeconds: number;
  frozen :boolean;
  relativeTimeSeconds : number;
 
};
export async function fetchCodeforcesContests() {
    const url = "https://codeforces.com/api/contest.list";
    const response = await axios.get(url);
    const contests = response.data.result;
  
    return contests
      .filter((c : ContestApiType) => c.phase === "BEFORE") 
      .map((c : ContestApiType) => ({
          id : c.id ,
        name: c.name,
        startTime: new Date(c.startTimeSeconds * 1000),
        link: `https://codeforces.com/contest/${c.id}`,
        platform: "Codeforces",
      }));
  }


  export async function getCodeforcesRating(handle : string = "") : Promise<CodingProfile>{
    const url = `https://codeforces.com/api/user.info?handles=${handle}`;
    const { data } = await axios.get(url);
    return data.result;
  }
  