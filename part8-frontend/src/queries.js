import { gql } from "@apollo/client";

export const GET_AUTHORS = gql`
  query {
    allAuthors {
      bookCount
      name
      born
      id
    }
  }
`;

export const GET_BOOKS = gql`
  query ($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
        bookCount
        born
        id
      }
      published
      genres
      id
    }
  }
`;

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published
    author {
      id
      bookCount
      name
      born
    }
    genres
  }
`;

export const ADD_BOOK = gql`
  mutation (
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;

export const UPDATE_AUTHOR = gql`
  mutation ($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      bookCount
      born
      id
    }
  }
`;

export const LOGIN = gql`
  mutation ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const GET_ME = gql`
  query {
    me {
      favoriteGenre
      username
    }
  }
`;
