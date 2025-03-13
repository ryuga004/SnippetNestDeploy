import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { cookies } from "next/headers";
import { typeDefs } from "@/server/graphQL/schema/index";
import { resolvers } from "@/server/graphQL/resolver/index";
import { getUserFromToken } from "@/server/controllers/user";

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
    context: async (req, res) => {
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth")?.value;
        const user = (await getUserFromToken(authToken)) || undefined;
        return { res, req, authToken, user };
    },
});

export async function GET(req: Request) {
    return handler(req);
}

export async function POST(req: Request) {
    return handler(req);
}