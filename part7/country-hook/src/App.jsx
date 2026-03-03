import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  // console.log('name====', name)
  useEffect(() => {
    console.log('useEffect called')
    const fetchCountry = async () => {
      try {
        const response = await fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        console.log('response', response.body)
        if (!response.ok) {
          throw new Error('Country not found')
        }
        const data = await response.json()
        // console.log('data', data.name.common)
        setCountry({ found: true, data: data })
      } catch (error) {
        setCountry({ found: false })
      }
    }

    if (name) {
      fetchCountry()
    }
  }, [name])

  return country
}

const Country = ({ country }) => {
  // console.log('country', country)
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flags.png} height='100' alt={`flag of ${country.data.name.common}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    console.log('fetching country', nameInput.value)
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App