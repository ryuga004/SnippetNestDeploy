import prisma from "@/server/prisma";

// Define Resolvers
export const resolvers = {
    Query: {
        users: async () => await prisma.user.findMany({ include: { social: true, stats: true, achievements: true } }),
        // user: async (_: any, { id }: { id: string }) => await prisma.user.findUnique({ where: { id }, include: { social: true, stats: true, achievements: true } }),
        // achievements: async (_: any, { userId }: { userId: string }) => await prisma.achievement.findMany({ where: { userId } }),
    },
    // Mutation: {
    //     createUser: async (_: any, { avatar, username, email, password }: { avatar?: string; username: string; email: string; password: string }) => {
    //         return await prisma.user.create({ data: { username, email, password, avatar } });
    //     },
    //     addAchievement: async (_: any, { userId, title, icon, date }: { userId: string; title: string; icon: string; date: string }) => {
    //         return await prisma.achievement.create({ data: { userId, title, icon, date: new Date(date) } });
    //     }
    // },
};