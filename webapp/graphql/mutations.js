import gql from "graphql-tag";

export const MUTATE_LOGIN = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const QUERY_POSTS = gql`
  query {
    posts {
      id,
      title,
      votes,
      author {
        id,
        name
      }
    }
  }
`;

export const MUTATE_WRITE = gql`
  mutation($title: String!) {
    write(post: {
      title: $title
    }) {
      id,
      title,
      votes,
      author {
        id,
        name
      }
    }
  }
`;

export const MUTATE_UPVOTE = gql`
  mutation($id: ID!) {
    upvote(id: $id) {
      id,
      title,
      votes,
      author {
        id,
        name
      }
    }
  }
`;

export const MUTATE_DOWNVOTE = gql`
  mutation($id: ID!) {
    downvote(id: $id) {
      id,
      title,
      votes,
      author {
        id,
        name
      }
    }
  }
`;
