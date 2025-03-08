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
      }
    }
  }
`;


export const LOGIN_USER = gql`
    mutation LoginUser($username: String!, $password: String!) {
  loginUser(username: $username, password: $password) {
    success,
    message,
  }
}
`