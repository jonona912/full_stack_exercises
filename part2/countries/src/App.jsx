import { useState, useEffect } from 'react'
import axios from 'axios'

// get countries list
// filter from data given
// return a result
// pass the result to another function that decides what to render
// if >10 return "too many matches"
// if 1-10 return list of countries
// if 1 return country data
const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const CountryInfo = ({ country }) => {
  const [weatherData, setWeather] = useState(null)
  console.log("country in CountryInfo: ", country)
  if (!country) {
    return null
  }

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${apiKey}&units=metric`)
      .then(response => {
        console.log("weather api response: ", response.data)
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Error fetching weather:', error)
      })
  }, [country.capital]) 

  return(
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => 
          <li key={language}>{language}</li>  
        )}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
      <h3>Weather in {country.capital[0]}</h3>
      {weatherData ? (
        <div>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Wind: {weatherData.wind.speed} m/s</p>
          <img 
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} 
            alt={weatherData.weather[0].description} 
          />
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  )
}

const RenderList = ({ countries, onShow }) => {
  console.log("countries in RenderList: ", countries)
  if (!countries) {
    return
  }
  if (countries.length > 10) {
    return(
        <span>Too many matches, specify another filter</span>
    )
  }
  else if (countries.length > 1) {
    return(
      <div>
        {countries.map(country => 
          <p key={country.name.common}>{country.name.common} <button onClick={() => onShow(country)}>Show</button></p>  
        )}
      </div>
    )
  }
  else if (countries.length === 1) {
    const country = countries[0]
    return(
      <CountryInfo country={country} />
    )
  }
  else {
    return(
      <span>No matches found</span>
    )
  }
}

function App() {
  const [countries, setCountries] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)

  const getCountries = (e) => {
    setSelectedCountry(null)
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        const result = response.data
        const searchTerm = e.target.value
        const countriesList = result.filter(country => {
          return country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
        })
        setCountries(countriesList)
      })
      .catch(error => {
        console.error('Error fetching countries:', error)
      })
  }

  return (
    <>
      <div>
        <span>find countries </span>
        <input onChange={getCountries}></input>
      </div>
      <RenderList countries={countries} onShow={setSelectedCountry} />
      {/* {selectedCountry && countryInfo(selectedCountry)} */}
      <CountryInfo country={selectedCountry} />
    </>
  )
}

export default App