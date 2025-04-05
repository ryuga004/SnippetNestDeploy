"use client";
import CircularLoader from "@/components/Loaders/circularLoader";
import SectionWrapper from "@/hoc/sectionWrapper";
import { GET_LEADERBOARD } from "@/lib/services";
import { useQuery } from "@apollo/client";

interface User {
  id: string;
  username: string;
  avatar: string;
  points: number;
  stats: {
    rank: number;
    contributions: number;
    problemSolved: number;
  };
}

const Leaderboard = () => {
  const { loading, error, data } = useQuery(GET_LEADERBOARD);

  if (loading) return <CircularLoader />;
  if (error) return <p>Error: {error.message}</p>;

  const users: User[] = data.getLeaderBoardUsers.users;
  return (
    <SectionWrapper>
      <div className="h-full bg-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 py-4">
          Leaderboard
        </h1>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-gray-600">Rank</th>
              <th className="border-b px-4 py-2 text-gray-600">Username</th>
              <th className="border-b px-4 py-2 text-gray-600">Points</th>
              <th className="border-b px-4 py-2 text-gray-600">
                Contributions
              </th>
              <th className="border-b px-4 py-2 text-gray-600">
                Problems Solved
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">
                  {user.stats?.rank || "-"}
                </td>
                <td className="border-b px-4 py-2 flex items-center">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  {user.username}
                </td>
                <td className="border-b px-4 py-2">{user.points}</td>
                <td className="border-b px-4 py-2">
                  {user.stats?.contributions}
                </td>
                <td className="border-b px-4 py-2">
                  {user.stats?.problemSolved}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionWrapper>
  );
};

export default Leaderboard;
