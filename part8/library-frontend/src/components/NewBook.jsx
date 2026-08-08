import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_BOOK, ALL_AUTHORS, ALL_BOOKS } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('testbook')
  const [author, setAuthor] = useState('testauthor')
  const [published, setPublished] = useState('1234')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState(['testgenre'])
  const variables = {
    authorToSearch: null,
    genreToSearch: null
  }
  const [createBook] = useMutation(CREATE_BOOK, {
    update: (cache, { data }) => {
    const newBook = data?.addBook
    if (!newBook) return

    cache.updateQuery(
      {
        query: ALL_BOOKS,
        variables: {
          authorToSearch: null,
          genreToSearch: null
        }
      },
      (existing) => {
        if (!existing?.allBooks) {
          return existing
        }

        return {
          ...existing,
          allBooks: existing.allBooks.concat(newBook) 
        }
      }
      )
      cache.updateQuery(
        { query: ALL_AUTHORS },
        (existing) => {
          if (!existing?.allAuthors) {
            return existing
          }

          const alreadyExists = existing.allAuthors.some(
            (a) => a.id === newBook.author.id
          )

          if (alreadyExists) {
            return existing
          }

          return {
            ...existing,
            allAuthors: existing.allAuthors.concat(newBook.author)
          }
        }
      )
    }
    })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    try {
      await createBook({
        variables: {
          title,
          author,
          published: parseInt(published, 10),
          genres 
        }
      })
    } catch (error) {
      console.error('createBook mutation failed:', error)
    }
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            title
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            published
            <input
              type="number"
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            genre
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
          </label>
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
