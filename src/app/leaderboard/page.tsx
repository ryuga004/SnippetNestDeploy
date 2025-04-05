"use client";
import TableLoader from "@/components/Loaders/tableLoader";
import { Skeleton } from "@/components/ui/skeleton";
import SectionWrapper from "@/hoc/sectionWrapper";
import { GET_LEADERBOARD } from "@/lib/services";
import { useAppSelector } from "@/redux/redux-hooks";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

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
  const { user: currentUser } = useAppSelector((state) => state.user);
  const router = useRouter();
  const users: User[] = useMemo(() => {
    if (!data || !data.getLeaderBoardUsers) return [];
    if (data.getLeaderBoardUsers.error) return [];
    return data.getLeaderBoardUsers.users;
  }, [data, loading, error, currentUser]);
  if (loading) {
    return (
      <SectionWrapper>
        <div className="min-h-screen mx-w-3xl py-12">
          <header className="container  mx-auto flex h-[25vh] flex-col gap-4">
            <Skeleton className="h-full w-full" />
          </header>
          <main>
            <TableLoader />
          </main>
        </div>
      </SectionWrapper>
    );
  }
  if (error) {
    console.error("Error fetching leaderboard data:", error);
  }
  return (
    <SectionWrapper>
      <div className="min-h-[50vh] bg-gray-100 flex flex-col items-center justify-start p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 py-4">
          Leaderboard
        </h1>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200 ">
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
                  <Image
                    src={user.avatar || "/user_logo.png"}
                    alt={user.username}
                    className="w-6 h-6 rounded-full mr-2"
                    width={24}
                    height={24}
                  />
                  <span
                    className="hover:cursor-pointer hover:text-blue-500"
                    onClick={() => router.push(`/profile/${user.id}`)}
                  >
                    {user.username}
                  </span>
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
