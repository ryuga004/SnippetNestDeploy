import { gql } from "@apollo/client";

export const submissionTypeDefs = gql`
type Submission {
  id: ID!
  problem: CodingProblem!
  author: User!
  createdAt: String!
  language: String!
  status: Boolean!
  submittedCode: String!
}

type Query {
    getAllSubmissions: getAllSubmissionsResponse!
    getAllSubmissionsByUser(userId: ID!): getAllSubmissionsByUserResponse!
}

type Mutation {
    createSubmission(input: createSubmissionInput!): createSubmissionResponse!
}

input createSubmissionInput {
   problemId : String!,
   language : String!,
   status : Boolean!,
   submittedCode : String!,
}
type createSubmissionResponse {
    success : Boolean!,
    message : String!,
    submission : Submission!,
}
type getAllSubmissionsByUserResponse {
    success: Boolean!,
    message: String !,
    submissions:[Submission!]!
}
type getAllSubmissionsResponse {
    success: Boolean!,
    message: String!,
    submissions: [Submission!]!
}
`