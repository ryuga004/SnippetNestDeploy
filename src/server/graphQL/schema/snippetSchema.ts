import { gql } from "@apollo/client";

export const snippetTypeDefs = gql`
type Snippet {
    id: ID!
    title: String!
    description: String
    language: String!
    tags: [String!]!
    sourceCode: String!
    author: User!
    createdAt: String!
    updatedAt: String!
}

type Query {
    getAllSnippets: getAllSnippetResponse!
    getSnippetById(id: ID!): getSnippetByIdResponse!
}

type Mutation {
    createSnippet(input: createSnippetInput!): createResponse!
    updateSnippet(input: updateSnippetInput!): Response!
    deleteSnippet(id: ID!): Response!
}

input createSnippetInput {
    title : String!,
    description : String,
    language : String!,
    tags : [String!]!,
    sourceCode : String!,
}
input updateSnippetInput {
    id : ID!,
    title : String!,
    description : String,
    language : String!,
    tags : [String!]!,
    sourceCode : String!
}
type Response {
    success : Boolean!,
    message : String!,
}
type createResponse {
    success : Boolean!,
    message : String!,
    snippet : Snippet!
}

type getAllSnippetResponse {
    success: Boolean!,
    message: String !,
    snippets: [Snippet!]!
}
type getSnippetByIdResponse {
    success: Boolean!,
    message: String!,
    snippet: Snippet!
}
`