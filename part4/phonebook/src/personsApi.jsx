import axios from 'axios'
const baseUrl = 'https://phonebook-backend-basf.onrender.com/persons'
//const baseUrl = '/persons'
//const baseUrl = 'http://localhost:3001/persons'

const getAllPersons = () => {
  const request = axios.get(`${baseUrl}`)
  
  return request.then(response => response.data)
}

const createPerson = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const updatePerson = (newObject) => {
  const request = axios.put(`${baseUrl}/${newObject.id}`, newObject)
  return request.then(response => response.data)
}

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data) 
}

export { getAllPersons, createPerson, updatePerson, deletePerson }