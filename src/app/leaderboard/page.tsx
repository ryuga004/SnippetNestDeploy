"use client";
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const users: User[] = data.getLeaderBoardUsers.users;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 py-4">
          Leaderboard
        </h1>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-gray-600">Rank</th>
              <th className="border-b px-4 py-2 text-gray-600">Name</th>
              <th className="border-b px-4 py-2 text-gray-600">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">{user.stats?.rank}</td>
                <td className="border-b px-4 py-2 flex items-center">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  {user.username}
                </td>
                <td className="border-b px-4 py-2">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
