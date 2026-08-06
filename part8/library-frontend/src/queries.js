import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql `
  query {
    allAuthors {
      name
      born
      id
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooksByNameGenre(
    $authorToSearch: String
    $genreToSearch: String
    ) {
      allBooks(author: $authorToSearch, genre: $genreToSearch) {
        title
        author {
          name
          born
          id
          bookCount
        }
        published
        genres
        id
      }
    }
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor(
    $name: String!
    $setBornTo: Int!
  ) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
      id
    }
  }
`
