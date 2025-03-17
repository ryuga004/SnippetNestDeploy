
export const userTypeDefs = `#graphql
  type User {
    id: ID!
    avatar: String
    coverImage: String
    points: Int!
    bio: String
    username: String!
    email: String!
    social: Social
    stats: Stats
    achievements: [Achievement!]!
    createdAt: String!
    updatedAt: String!
    role: String!
  }

  type Social {
    id: ID!
    github: String
    twitter: String
    linkedin: String
    user: User
  }

  type Stats {
    id: ID!
    contributions: Int!
    rank: Int!
    problemSolved: Int!
    user: User
  }

  type Achievement {
    id: ID!
    title: String!
    icon: String!
    date: String!
    user: User!
  }

  type Query {
    getAllUsers: GetAllUserResponse!
    getUserById(id: ID!): getUserByIdResponse!
    achievements(userId: ID!): [Achievement!]!
    GetMe: GetMeResponse!
  }

  type Mutation {
    registerUser(
      avatar: String,
      password : String!,
      username: String!,
      email: String!
    ): registerUserResponse!

    loginUser(
      username:String!,
      password:String!,
    ):loginUserResponse!
    
    updateUser(id: ID!, input: UpdateUserInput!):updateUserResponse!
    logoutUser:logoutUserResponse!
    deleteUser(id:ID!) : deleteUserResponse!
  }
  # reponses types 
  input UpdateUserInput {
    avatar: String
    coverImage: String
    bio: String
    points: Int
  }
  type registerUserResponse {
    success : Boolean!,
    message : String!,
    user : User!,
  } 
  type loginUserResponse {
    success : Boolean!,
    message : String!,
    user : User!,
  }
  type GetMeResponse {
    success : Boolean!,
    message : String!,
    user : User!
  }
  type GetAllUserResponse {
    success : Boolean!,
    message : String!,
    users : [User!],
  }
  type getUserByIdResponse {
    success : Boolean!,
    message : String!,
    user : User!,
  }
  type logoutUserResponse{
    success : Boolean!,
    message : String!,
  }
  type deleteUserResponse{
    success : Boolean!,
    message : String!,
  }
  type updateUserResponse {
    success: Boolean!
    message: String!
    user: User!
  }
`;