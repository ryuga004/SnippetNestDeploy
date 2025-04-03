import prisma from "@/server/prisma";

interface Context {
    user?: { id: string };
}

interface CreateSnippetInput {
    title: string;
    description?: string;
    language: string;
    tags: string[];
    sourceCode: string;
}

interface UpdateSnippetArgs {
    id: string;
    title: string;
    description?: string;
    language: string;
    tags: string[];
    sourceCode: string;
}



export const snippetResolvers = {
    Query: {
        getAllSnippets: async () => {
            const snippets = await prisma.snippet.findMany({ include: { author: true } });
            if (!snippets) {
                throw new Error("Snippets not founds");
            }
            return {
                success: true,
                message: "snippet fetched successfully!",
                snippets: snippets,
            }
        },

        getSnippetById: async (_: unknown, { id }: { id: string }) => {
            const snippet = await prisma.snippet.findUnique({ where: { id }, include: { author: true } });
            if (!snippet) {
                throw new Error("Snippet not found");
            }
            return {
                success: true,
                message: "snippet fetched successfully",
                snippet: snippet,
            }
        },
    },

    Mutation: {
        createSnippet: async (_: unknown, { input }: { input: CreateSnippetInput }, context: Context) => {
            if (!context.user) throw new Error("You must be logged in");
            
            const newSnippet = await prisma.snippet.create({
                data: {
                    ...input,
                    authorId: context.user.id,
                },
                include: { author: true },
            });
            if (!newSnippet) {
                throw new Error("An error occured during creation of snippet");
            }
            const userStats = await prisma.stats.findUnique({
                where : {
                    userId : context.user.id ,
                }
            })
            if(userStats){
                await prisma.stats.update({
                    where: { userId: context.user.id },
                    data: {
                        contributions : {increment : 1},
                    },
                });
            }else {
                await prisma.stats.create({
                    data : {
                        userId : context.user.id , 
                        contributions : 1 
                    }
                })
            }
           
            return {
                success: true,
                message: "snippet created successfully!",
                snippet: newSnippet,
            }
        },

        updateSnippet: async (_: unknown, { input }: { input: UpdateSnippetArgs }, context: Context) => {
            if (!context.user) throw new Error("You must be logged in");

            const snippet = await prisma.snippet.findUnique({ where: { id: input.id } });
            if (!snippet) throw new Error("Snippet not found");
            if (snippet.authorId !== context.user.id) throw new Error("Not authorized to update this snippet");

            const updatedSnippet = await prisma.snippet.update({
                where: { id: input.id },
                data: { ...input },
                include: { author: true },
            });
            if (!updatedSnippet) {
                throw new Error("Snippet not update an error occured");
            }
            return {
                success: true,
                message: "snippet updated successfully",
            }
        },

        deleteSnippet: async (_: unknown, { id }: { id: string }, context: Context) => {
            if (!context.user) throw new Error("You must be logged in");

            const snippet = await prisma.snippet.findUnique({ where: { id } });
            if (!snippet) throw new Error("Snippet not found");
            if (snippet.authorId !== context.user.id) throw new Error("Not authorized to delete this snippet");

            const deletedSnippet = await prisma.snippet.delete({ where: { id } });
            if (!deletedSnippet) {
                throw new Error("Error Occured : Snippet not deleted");
            }
            return {
                success: true,
                message: "snippet deleted successfully",
            }
        },
    },
};
