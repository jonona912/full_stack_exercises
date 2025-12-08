import { useState } from 'react'

// const Persons = ({ persons }) => (
//   <>
//     {persons.map(person => <p key={person.id}>{person.name} {person.number}</p>)}
//   </>
// )

// export default Persons

const Persons = ({ persons, deleteContact }) => {
  return (
    <> 
      {persons.map(person => (
      <div key={person.id}>
        <span> {person.name} {person.number} </span>
        <button onClick={() => deleteContact(person.id)}>
          delete
        </button>
      </div>
      ))}
    </>
  )
}

export default Persons