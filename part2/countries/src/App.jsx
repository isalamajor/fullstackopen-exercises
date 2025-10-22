import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [countries, setCountries] = useState([])
  const [countryData, setCountryData] = useState(null)

  const fetchCountries = (filter) => {
    return axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then((res) => res.data.filter((e) => e.name.common.toLowerCase().includes(filter.toLowerCase())))
    .catch(err => console.log(err))
  }
  
  const getCountryData = (country) => {
    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
    .then((response) => {
      const dataApi = response.data
      console.log("data ", dataApi);
      setCountryData({
        name: dataApi.name.common,
        capital: dataApi.capital[0],
        area: dataApi.area,
        flag: Object.values(dataApi.flags)[0],
        languages: Object.values(dataApi.languages)
      })
    })
  } 

  useEffect(() => {
    if (search) {
      fetchCountries(search).then(response => {
        if(response.length > 10) {
          setMessage('Too many matches, make a more specific query')
          setCountries([])
          setCountryData(null)
        } else if(response.length < 1) {
          setMessage('No matches')
          setCountries([])
          setCountryData(null)
        } else if (response.length === 1) {
          getCountryData(response[0].name.common)
        } else {
          setMessage('')
          setCountries(response.map((c) => c.name.common))
          setCountryData(null)
        }
        console.log(response)})
    }
  }, [search])


  return (
    <>
      <p>
        Find countries
        <input value={search} onChange={(e) => setSearch(e.target.value)}></input>
      </p>
      {message}
      {countries.length > 1 && countries.map(country => 
        <li key={country}>
          {country}
          <button key={country + "-btn"} onClick={() => getCountryData(country)}>Show</button>
        </li>
      )}

      {countryData &&
      <div>
        <h1>{countryData.name}</h1>  
        <p>Capital: {countryData.capital}</p>
        <p>Area: {countryData.area}</p>
        <h2>Languages</h2>
        <ul>
          {countryData.languages.map((lang) => 
            <li key={lang}>{lang}</li>
          )}
        </ul>
        <img src={countryData.flag} alt={countryData.name}></img>
      </div>}
    </>
  )
}

export default App
