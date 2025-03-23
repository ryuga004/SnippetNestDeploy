import { gql } from "@apollo/client";

// ** USER ** //

export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    registerUser(username: $username, email: $email, password: $password) {
      success
      message
      user {
        id
        username
        email
        avatar
      }
    }
  }
`;


export const LOGIN_USER = gql`
    mutation LoginUser($username: String!, $password: String!) {
  loginUser(username: $username, password: $password) {
    success,
    message,
    user {
        id
        username
        email
        avatar
      }
  }
}
`
export const GET_ME = gql`
  query GetMe {
  GetMe {
    success,
    message,
    user {
      id ,
      username,
      avatar,
      email,
      role
    }
  }
}
`

export const LOGOUT_USER = gql`
mutation LogoutUser {
  logoutUser {
    message,
    success
  }
}
`

export const GET_ALL_USER = gql`
query{
 getAllUsers {
   success,
   message,
   users{
     id ,
     username,
     avatar,
     email 
   }  
 }
}`

export const UPDATE_USER = gql`
mutation UpdateUser($updateUserId: ID!, $input: UpdateUserInput!) {
  updateUser(id: $updateUserId, input: $input) {
    
    success,
    message,
    user {
      id,
      username,
      avatar,
      email,
      role,
      coverImage,
      bio,
      points,
      social {
        github,
        linkedin,
        twitter
      },
    }
  }
}`

export const GET_USER_BY_ID = gql`
query GetUserById($id: ID!) {
  getUserById(id: $id) {
    success,
    message,
    user {
      id,
      username,
      avatar,
      email,
      role,
      coverImage,
      bio,
      points,
      social {
        github,
        linkedin,
        twitter
      },
      stats {
        contributions,
        problemSolved,
        rank
      }
      achievements {
        id,
        title,
        date,
      }
    }
  }
}
`


//  ** PROBLEM ** //

export const CREATE_PROBLEM = gql`
mutation CreateCodingProblem($input: CodingProblemInput!) {
  createCodingProblem(input: $input) {
    id 
  }
}
`

export const GET_ALL_PROGLEM = gql`
query GetAllCodingProblems {
  getAllCodingProblems {
    success,
    problems {
  id,
  title,
  description,
  topic,  
  inputFormat,
  outputFormat,
  constraints,
  exampleInput,
  exampleOutput,
  difficulty,
  testCases {
    input,
    expectedOutput
  }
  }
  }
}
`



export const DELETE_PROBLEM = gql`
mutation DeleteCodingProblem($id: ID!) {
  deleteCodingProblem(id: $id)
}
`

export const UPDATE_PROBLEM = gql`
mutation UpdateCodingProblem($updateCodingProblemId: ID!, $input: CodingProblemInput!) {
  updateCodingProblem(id: $updateCodingProblemId, input: $input) {
    id,
  }
}
`


// ** SNIPPETS ** // 

export const CREATE_SNIPPET = gql`
mutation CreateSnippet($input: createSnippetInput!) {
  createSnippet(input: $input) {
    success,
    message,
    snippet {
      id 
    }
  }
}
`

export const GET_ALL_SNIPPETS_ADMIN = gql`
 query GetAllSnippets {
  getAllSnippets {
    success,
    message,
    snippets {
      id,
      title,
      description,
      language,
      tags,
      sourceCode,
      author {
        id ,
        username,
        avatar
      }
    }
  }
}
`

export const DELETE_SNIPPET = gql`
  mutation DeleteSnippet($deleteSnippetId: ID!) {
  deleteSnippet(id: $deleteSnippetId) {
    success,
    message
  }
}
`

export const UPDATE_SNIPPET = gql`
  mutation UpdateSnippet($input: updateSnippetInput!) {
  updateSnippet(input: $input) {
    success ,
    message ,
  }
}
`
// ** SUBMISSIONS ** // 

export const CREATE_SUBMISSION = gql`
  mutation CreateSubmission($input: createSubmissionInput!) {
  createSubmission(input: $input) {
    success,
    message,
    submission {
      id,
    problem {
        id,
    },
    author {
        id,
    }
    createdAt,
    language,
    status,
    submittedCode
    }    
  }
}
`
export const GET_SUBMISSION_USER = gql`
  query GetAllSubmissionsByUser($userId: ID!) {
  getAllSubmissionsByUser(userId: $userId) {
    success,
    submissions { 
        id,
      problem {
          id,
      },
      author {
          id,
      }
      language,
      status,
      submittedCode,
    }
  }
}
`


// ** SOLUTION ** // 

export const GET_SOLUTION = gql`
query GetSolution($problemId: ID!) {
  getSolution(problemId: $problemId) {
    success,
    message,
    solution {
      id,
      explanation,
      answers {
        id,
        language,
        code 
      }
    }
  }
}
`
// ** ADMIN ** //
export const GET_DASHBOARD_DATA = gql`
query GetDashboardData {
  getDashboardData {
    success
    message
    result {
      stats {
        totalUser
        totalSnippet
        totalProblem
        todayTotalSubmission
      }
      monthlyStats {
        monthlyRegisteredUser {
          month
          count
        }
        monthlyCreatedProblem {
          month
          count
        }
        monthlyCreatedSnippet {
          month
          count
        }
      }
      weeklyStats {
        weeklySubmissions {
          day
          count
        }
      }
      tagDistribution {
        name
        count
      }
    }
  }
}
`