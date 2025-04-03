import { fetchCodeforcesContests } from "./codeForces";




export async function getContests() {
  const contests = [
    ...(await fetchCodeforcesContests()),
  ];

  console.log("Contests updated!");
 return  contests;

}
