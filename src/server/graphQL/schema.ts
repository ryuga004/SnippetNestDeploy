// Define GraphQL Schema
export const typeDefs = `#graphql
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
    users: [User!]!
    user(id: ID!): User
    achievements(userId: ID!): [Achievement!]!
  }

  type Mutation {
    createUser(
      avatar: String!,
      coverImage: String,
      bio: String,
      username: String!,
      email: String!
    ): User!

    addAchievement(
      userId: ID!,
      title: String!,
      icon: String!,
      date: String!
    ): Achievement!
  }
`;