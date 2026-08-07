import { ALL_BOOKS } from "../queries"
import { useQuery } from "@apollo/client/react"
import { useState } from "react"

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const variables = {
    authorToSearch: null,
    genreToSearch: genre ?? null
  }
  const result = useQuery(ALL_BOOKS, { variables })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }
  if (result.error) {
    console.error('Error fetching books:', result.error)
    return <div>Error fetching books</div>
  }

  const books = result.data.allBooks
  const allGenres = Array.from(new Set(books.flatMap(book => book.genres)))

  return (
    <div>
      <h2>books</h2>
      {genre && <p>in genre <strong>{genre}</strong></p>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {allGenres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
