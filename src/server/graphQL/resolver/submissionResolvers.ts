import prisma from "@/server/prisma";

interface Context {
    user?: { id: string };
}
interface createSubmissionType {
    problemId: string,
    language: string,
    status: boolean,
    submittedCode: string,
    createdAt: string,
}

export const submissionResolvers = {
    Query: {
        getAllSubmissions: async () => {
            const submissions = await prisma.submission.findMany({
                include: { problem: true, author: true },
            });
            if (!submissions) {
                throw new Error("Unable to fetch submissions");
            }
            return {
                success: true,
                message: "Submissions fetched successfully",
                submissions
            }
        },

        getAllSubmissionsByUser: async (_: unknown, { userId }: { userId: string }) => {
            const submissions = await prisma.submission.findMany({
                where: { authorId: userId },
                include: { problem: true, author: true },
            });
            if (!submissions) {
                throw new Error("Unable to fetch submissions");
            }
            return {
                success: true,
                message: "Submissions fetched successfully",
                submissions
            }
        }
    },

    Mutation: {
        createSubmission: async (_: unknown, { input }: { input: createSubmissionType }, context: Context) => {
            if (!context.user) throw new Error("You must be logged in");

            const newSubmission = await prisma.submission.create({
                data: {
                    problemId: input.problemId,
                    authorId: context.user.id,
                    language: input.language,
                    submittedCode: input.submittedCode,
                    status: false,
                },
                include: { problem: true, author: true },
            });

            if (!newSubmission) {
                throw new Error("Unable to Create Submission");
            }

            return {
                success: true,
                message: "Submission Code Successfully",
                submission: newSubmission,
            }
        }
    }
};
