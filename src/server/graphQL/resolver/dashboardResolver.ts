import prisma from "@/server/prisma";

interface MonthProps {
    month: string;
    count: number;
}

interface WeeklyProps {
    day: string;
    count: number;
}

interface TagDistribution {
    name: string;
    count: number;
}

export const dashboardResolvers = {
    Query: {
        getDashboardData: async () => {
            try {
                const totalUser = await prisma.user.count();
                const totalSnippet = await prisma.snippet.count();
                const totalProblem = await prisma.codingProblem.count();

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayTotalSubmission = await prisma.submission.count({
                    where: { createdAt: { gte: today } },
                });

                const monthlyRegisteredUser = (await prisma.$queryRaw<MonthProps[]>`
                    SELECT TO_CHAR("createdAt", 'Mon') AS month, COUNT(*)::int AS count
                    FROM "User"
                    GROUP BY month
                    ORDER BY MIN("createdAt");
                `) || [];

                const monthlyCreatedProblem = (await prisma.$queryRaw<MonthProps[]>`
                    SELECT TO_CHAR("createdAt", 'Mon') AS month, COUNT(*)::int AS count
                    FROM "coding_problems"
                    GROUP BY month
                    ORDER BY MIN("createdAt");
                `) || [];

                const monthlyCreatedSnippet = (await prisma.$queryRaw<MonthProps[]>`
                    SELECT TO_CHAR("createdAt", 'Mon') AS month, COUNT(*)::int AS count
                    FROM "snippets"
                    GROUP BY month
                    ORDER BY MIN("createdAt");
                `) || [];

                const weeklySubmissions = (await prisma.$queryRaw<WeeklyProps[]>`
                    SELECT TO_CHAR("createdAt", 'Dy') AS day, COUNT(*)::int AS count
                    FROM "submissions"
                    WHERE "createdAt" >= NOW() - INTERVAL '7 days'
                    GROUP BY day
                    ORDER BY MIN("createdAt");
                `) || [];

                const tagDistribution = await prisma.$queryRaw<TagDistribution[]>`
                    SELECT UNNEST(tags) AS name, COUNT(*)::int AS count
                    FROM "snippets"
                    GROUP BY name
                    ORDER BY count DESC;
                `;



                return {
                    success: true,
                    message: "Dashboard data fetched successfully!",
                    result: {
                        stats: {
                            totalUser,
                            totalSnippet,
                            totalProblem,
                            todayTotalSubmission,
                        },
                        monthlyStats: {
                            monthlyRegisteredUser: monthlyRegisteredUser || [],
                            monthlyCreatedProblem: monthlyCreatedProblem || [],
                            monthlyCreatedSnippet: monthlyCreatedSnippet || [],
                        },
                        weeklyStats: {
                            weeklySubmissions: weeklySubmissions || [],
                        },
                        tagDistribution: tagDistribution || [],
                    },
                };
            } catch (error: unknown) {
                console.error("❌ Error fetching dashboard data:", error);

                return {
                    success: false,
                    message: `Failed to fetch dashboard data. ${error instanceof Error ? error.message : "Unknown error"
                        }`,
                    result: null,
                };
            }
        },
    },
};
