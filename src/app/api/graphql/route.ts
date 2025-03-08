import { resolvers } from "@/server/graphQL/resolver";
import { typeDefs } from "@/server/graphQL/schema";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";


const server = new ApolloServer({
    typeDefs,
    resolvers
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };

