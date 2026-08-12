import { ALL_AUTHORS } from "../queries"
import { useQuery } from "@apollo/client/react"
import EditAuthorForm from "./EditAuthorForm"

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const token = props.token

  if (!props.show) {
    return null
  }
  if (result.loading) {
    return (
      <div>
        <h2>authors</h2>
        <div>loading...</div>
      </div>
    )
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      {token && <EditAuthorForm authors={authors} />}
    </div>
  )
}

export default Authors
