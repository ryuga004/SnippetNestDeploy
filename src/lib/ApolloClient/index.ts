"use client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
    link: new HttpLink({
        uri: process.env.NEXT_PUBLIC_API_URL || "https://snippet-nest.vercel.app/api/graphql",
        credentials: "include",
    }),
    cache: new InMemoryCache(),
});

export default client;
