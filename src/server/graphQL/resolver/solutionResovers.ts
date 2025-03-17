import prisma from "@/server/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Answer {
    language: string;
    code: string;
}
const apiKey = process.env.GEMINIA_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

export const SolutionResolvers = {
    Query: {
        getSolution: async (_: unknown, { problemId }: { problemId: string }) => {
            let solution = await prisma.solution.findFirst({
                where: { problemId },
                include: { answers: true },
            });
            const problem = await prisma.codingProblem.findUnique({
                where: {
                    id: problemId,
                }
            })
            if (!problem) {
                throw new Error("Problem Not Found");
            }

            if (!solution) {
                console.log(`Solution not found for problem ${problemId}. Generating with Gemini AI...`);

                const generatedSolution = await generateSolutionWithGemini(problem.description);


                solution = await prisma.solution.create({
                    data: {
                        problemId,
                        ...generatedSolution,
                    },
                    include: { answers: true },
                });

                console.log("New solution generated and stored.");
            }

            return {
                success: true,
                message: "Solution is fetched Successfully!",
                solution: solution
            }
        },
    },

    Mutation: {
        addSolution: async (_: unknown, { problemId, explanation, answers }: {
            problemId: string;
            explanation: string;
            answers: Answer[];
        }) => {
            const solution = await prisma.solution.create({
                data: {
                    problemId,
                    explanation,
                    answers: {
                        create: answers.map((ans) => ({
                            language: ans.language,
                            code: ans.code,
                        })),
                    },
                },
                include: { answers: true },
            });
            if (!solution) {
                throw new Error("Unable to create Solution!");
            }
            return {
                success: true,
                message: "Solution Created Successfully",
                solution: solution,
            }
        },
    },
};


// async function generateSolutionWithGemini(problemDescription: string) {
//     try {
//         const query = `You are an expert programmer. Generate a coding solution based on this problem description:${problemDescription}. 
//             The output should be strictly in this JSON format:
//             {
//                 "explanation": "string",
//                 "answers" : {
//                     "language" : "string",
//                     "code" : "string",
//                 }[]
//             }

//             lanuages will be c++ , java and python and respective code will be the solution for the problem in respective language 
//             `;

//         const result = await model.generateContent(query);
//         const generatedCode = result.response.text();

//         // Parse AI response into JSON format
//         const parsedResult = JSON.parse(generatedCode);

//         return {
//             explanation: parsedResult.explanation,
//             answers: {
//                 create: [
//                     {
//                         language: parsedResult.language,
//                         code: parsedResult.code,
//                     },
//                 ],
//             },
//         };
//     } catch (error) {
//         console.error("Error generating solution with Gemini:", error);
//         throw new Error("AI-generated solution failed.");
//     }
// }

async function generateSolutionWithGemini(problemDescription: string) {
    try {
        const query = `You are an expert programmer. Generate coding solutions in C++, Java, and Python based on this problem description:
        
        "${problemDescription}"

        The output must be strictly in this JSON format:
        {
            "explanation": "string",
            "answers": [
                { "language": "C++", "code": "string" },
                { "language": "Java", "code": "string" },
                { "language": "Python", "code": "string" }
            ]
        }`;

        const result = await model.generateContent(query);
        const generatedCode = result.response.text();

        // Extract JSON from the response
        const jsonMatch = generatedCode.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No valid JSON found in response.");
            throw new Error("AI-generated solution format is incorrect.");
        }

        const parsedResult = JSON.parse(jsonMatch[0]);

        if (!parsedResult.explanation || !Array.isArray(parsedResult.answers)) {
            throw new Error("Invalid AI response format.");
        }

        return {
            explanation: parsedResult.explanation,
            answers: {
                create: parsedResult.answers.map((ans: { language: string; code: string }) => ({
                    language: ans.language.toLowerCase(), // Normalize language names
                    code: extractCodeBlock(ans.code),
                })),
            },
        };
    } catch (error) {
        console.error("Error generating solution with Gemini:", error);
        throw new Error("AI-generated solution failed.");
    }
}

// Function to extract code from AI response
function extractCodeBlock(text: string) {
    const codeMatch = text.match(/```(?:cpp|java|python|.*)?\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1].trim() : text.trim();
}
