import prisma from "@/server/prisma";
import { CodingProblem, TestCase } from "@prisma/client";

interface CreateProblemInput {
    title: string;
    description: string;
    inputFormat: string;
    outputFormat: string;
    exampleInput: string;
    exampleOutput: string;
    constraints: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    topic: string[];
    testCases: Omit<TestCase, "id" | "problemId">[];
}


export const problemResolvers = {
    Query: {
        getAllCodingProblems: async () => {
            const problems = await prisma.codingProblem.findMany({
                include: { testCases: true },
            });
            return {
                success: true,
                problems,
            };
        },

        getCodingProblem: async (_: unknown, { id }: { id: string }) => {
            return prisma.codingProblem.findUnique({
                where: { id },
                include: { testCases: true },
            });
        },
    },

    Mutation: {
        createCodingProblem: async (
            _: unknown,
            { input }: { input: CreateProblemInput }
        ): Promise<CodingProblem> => {
            const { testCases, ...problemData } = input;

            return prisma.codingProblem.create({
                data: {
                    ...problemData,
                    testCases: {
                        create: testCases,
                    },
                },
                include: { testCases: true },
            });
        },

        updateCodingProblem: async (
            _: unknown,
            { id, input }: { id: string; input: CreateProblemInput }
        ): Promise<CodingProblem | null> => {
            const { testCases, ...problemData } = input;

            return prisma.codingProblem.update({
                where: { id },
                data: {
                    ...problemData,
                    testCases: {
                        deleteMany: { problemId: id },
                        create: testCases || [],
                    },
                },
                include: { testCases: true },
            });
        },

        deleteCodingProblem: async (_: unknown, { id }: { id: string }): Promise<boolean> => {
            try {
                const problem = await prisma.codingProblem.delete({
                    where: { id },
                });
                return !!problem;
            } catch {
                throw new Error("Unable to delete problem");
            }
        },
    },
};



// import prisma from "@/server/prisma";


// export const problemResolvers = {
//     Query: {

//         getAllCodingProblems: async () => {
//             const problems = await prisma.codingProblem.findMany({
//                 include: { testCases: true },
//             });
//             return {
//                 success: true,
//                 problems: problems
//             }
//         },


//         getCodingProblem: async (_: unknown, { id }: { id: string }) => {
//             return await prisma.codingProblem.findUnique({
//                 where: { id },
//                 include: { testCases: true },
//             });
//         },
//     },

//     Mutation: {

//         createCodingProblem: async (_: any, { input }: { input: any }) => {
//             const { testCases, ...problemData } = input;

//             return await prisma.codingProblem.create({
//                 data: {
//                     ...problemData,
//                     testCases: {
//                         create: testCases,
//                     },
//                 },
//                 include: { testCases: true },
//             });
//         },


//         updateCodingProblem: async (_: any, { id, input }: { id: string, input: any }) => {
//             const { testCases, ...problemData } = input;


//             const updatedProblem = await prisma.codingProblem.update({
//                 where: { id },
//                 data: {
//                     ...problemData,
//                     testCases: {
//                         deleteMany: { problemId: id },
//                         create: testCases,
//                     },
//                 },
//                 include: { testCases: true },
//             });

//             return updatedProblem;
//         },
//         deleteCodingProblem: async (_: unknown, { id }: { id: string }) => {
//             try {
//                 const problem = await prisma.codingProblem.delete({
//                     where: { id },
//                 })
//                 if (!problem) {
//                     throw new Error("Unable to find the problem");

//                 }
//                 return true;
//             } catch (error) {
//                 throw new Error("Unable to delete problem");
//             }
//         }

//     },
// };
