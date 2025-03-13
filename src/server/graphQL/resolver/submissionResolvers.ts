import prisma from "@/server/prisma";

interface Context {
    user?: { id: string };
}
interface createSubmissionType {
    problemId: string,
    language: string,
    status: boolean,
    submittedCode: string,
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
                orderBy: { createdAt: 'desc' },
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
                    status: input.status,
                },
                include: { problem: true, author: true },
            });

            if (!newSubmission) {
                throw new Error("Unable to Create Submission");
            }

            // update the points of user if submission is status is accepted and there is no previously accepted submission 
            const value = (newSubmission.problem.difficulty === "HARD") ? 8 : ((newSubmission.problem.difficulty === 'MEDIUM') ? 4 : 2);
            const existingAcceptedSubmission = await prisma.submission.findFirst({
                where: {
                    problemId: input.problemId,
                    authorId: context.user.id,
                    status: true,
                },
            });


            if (input.status === true && !existingAcceptedSubmission) {
                await prisma.user.update({
                    where: { id: context.user.id },
                    data: {
                        points: { increment: value },
                    },
                });
            }
            return {
                success: true,
                message: "Submission Code Successfully",
                submission: newSubmission,
            }
        }
    }
};
