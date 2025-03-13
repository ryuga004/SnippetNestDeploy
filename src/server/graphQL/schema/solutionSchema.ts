import { gql } from "@apollo/client";


export const solutionTypeDef = gql`

type Solution {
  id: ID!
  problem: CodingProblem!
  problemId: ID!
  explanation: String!
  answers: [Answer!]!
}

type Answer {
  id: ID!
  language: String!
  code: String!
  solution: Solution!
  solutionId: ID!
}

type Query {
  getSolution(problemId: ID!): Response!
}

type Mutation {
  addSolution(problemId: ID!, explanation: String!, answers: [AnswerInput!]!): Response!
}

input AnswerInput {
  language: String!
  code: String!
}
type Response {
    success: Boolean!,
    message: String!,
    solution: Solution!
}
`