import axios from "axios";
type DataType ={
  name : string ,
  start_time : Date,
  url : string,
}
export async function fetchLeetCodeContests() {
  const url = "https://kontests.net/api/v1/leet_code";
  const response = await axios.get(url);
  return response.data.map((c :DataType) => ({
    name: c.name,
    startTime: new Date(c.start_time),
    link: c.url,
    platform: "LeetCode",
  }));
}
