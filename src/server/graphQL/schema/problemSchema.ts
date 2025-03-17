import { gql } from "@apollo/client";

export const problemtypeDefs = gql`
  enum Difficulty {
    EASY
    MEDIUM
    HARD
  }

  type CodingProblem {
    id: ID!
    title: String!
    description: String!
    inputFormat: String!
    outputFormat: String!
    exampleInput: String!
    exampleOutput: String!
    constraints: String!
    difficulty: Difficulty!
    topic: [String!]!
    testCases: [TestCase!]!
  }

  type TestCase {
    id: ID!
    input: String!
    expectedOutput: String!
  }
  input TestCaseInput {
  input: String!
  expectedOutput: String!
}
input CodingProblemInput {
  title: String!
  description: String!
  inputFormat: String!
  outputFormat: String!
  exampleInput: String!
  exampleOutput: String!
  constraints: String!
  difficulty: Difficulty!
  topic: [String!]!
  testCases: [TestCaseInput!]!
}

  type Query {
    getAllCodingProblems: getAllCodingProblemsResponse!
    getCodingProblem(id: ID!): CodingProblem
    getAllTestCases(problemId: ID!): [TestCase!]!
  }

  type Mutation {
    createCodingProblem(input : CodingProblemInput!): CodingProblem!

  updateCodingProblem(
    id: ID!,
    input : CodingProblemInput!
  ): CodingProblem!

    deleteCodingProblem(id: ID!): Boolean!

  }
   type getAllCodingProblemsResponse {
    success : Boolean!,
    problems : [CodingProblem!]!
   } 
`;
