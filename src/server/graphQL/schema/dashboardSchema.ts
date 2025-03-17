import { gql } from "@apollo/client";

export const dashboardTypeDefs = gql`
  type Stats {
    totalUser: Int!
    totalSnippet: Int!
    totalProblem: Int!
    todayTotalSubmission: Int!  
  }

  type MonthProps {
    month: String!
    count: Int!
  }

  type MonthlyStats {
    monthlyRegisteredUser: [MonthProps!]!
    monthlyCreatedProblem: [MonthProps!]!
    monthlyCreatedSnippet: [MonthProps!]!
  }

  type WeeklyProps {
    day: String!
    count: Int!
  }

  type WeeklyStats {
    weeklySubmissions: [WeeklyProps!]!
  }

  type TagDistribution {
    name: String!
    count: Int! 
  }

  type DashboardData {
    stats: Stats!
    monthlyStats: MonthlyStats!
    weeklyStats: WeeklyStats!
    tagDistribution: [TagDistribution!]!
  }

  type Response {
    success: Boolean!
    message: String!
    result: DashboardData
  }

  type Query {
    getDashboardData: Response!
  }
`;
