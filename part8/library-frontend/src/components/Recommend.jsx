import { ALL_BOOKS, ME } from "../queries"
import { useQuery } from "@apollo/client/react"
import { useState } from "react"

const Recommend = (props) => {
  const result = useQuery(ALL_BOOKS)
  const meResult = useQuery(ME, {
    skip: !props.show,
    fetchPolicy: 'network-only',
  })
  if (!props.show) {
    return null
  }

  if (result.loading || meResult.loading) {
    return <div>loading...</div>
  }
  if (result.error || meResult.error) {
    console.error('Error fetching books or user data:', result.error || meResult.error)
    return <div>Error fetching data</div>
  }

  const favoriteGenre = meResult.data?.me?.favoriteGenre || ''
  const recommendedBooks = result.data.allBooks.filter(book => book.genres.includes(favoriteGenre))

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
