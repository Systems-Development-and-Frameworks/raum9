import gql from "graphql-tag";

export const MUTATE_LOGIN = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;
