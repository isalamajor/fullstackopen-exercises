import { useState, useEffect } from 'react'
import axios from 'axios'
import { getAllPersons, createPerson, updatePerson, deletePerson } from './personsApi'

const App = () => {
  
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getAllPersons().then(res => setPersons(res))
  }, [])


  const onAddNewName = async (newName, newNumber) => {
    if (newName && newNumber) {
      const nameTaken = persons.find(p => p.name === newName)
      const numTaken = persons.find(p => p.number === newNumber)
      const numTakenBySameUser = nameTaken?.number === newNumber
      if (nameTaken) {
        if (numTakenBySameUser) {
          alert(`${newName} is already added to phonebook with that number`)
        } else {
          if (window.confirm(`${newName} is already added, replace the old number by this new one?`)) {
            console.log("Newnumber: ", newNumber)
            nameTaken.number = newNumber
            console.log("Update: ", nameTaken)
            updatePerson(nameTaken).then(res => {
              setPersons(persons.map(p => p === res ? res : p))
            })
            .catch(err => alert("There was an error when updating this register"))
          }
        }
      } else  if (numTaken) {
        alert("Other user has the same number")
      } else {
        createPerson({id: (persons.length + 1).toString(), name: newName, number: newNumber})
        .then(res => setPersons([...persons, res ]))
        .catch(err => alert("There was an error when creating this register"))
      }
    }
  } 

  const onDeletePerson = async (id) => {
    if (id && window.confirm('Are you sure you want to delete?')) {
      deletePerson(id).then(res => {
        if (res === 200) setPersons([... persons.filter( p => p.id !== id)])
      })
      .catch(err => alert("There was an error when deleting this register"))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onFilterChange={setFilter}/>
      
      <h2>Add new</h2>
      <PersonForm onSubmit={onAddNewName}/>
      
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} onDelete={onDeletePerson}/>
    </div>
  )
}

const Filter = ({ onFilterChange }) => {
  const [filter, setFilter] = useState('')
  return ( 
    <>
      Filter: <input value={filter} onChange={(e) => 
        {
          setFilter(e.target.value)
          onFilterChange(e.target.value.toLowerCase())
        }}></input>
    </>
  )
}


const Persons = ({persons, filter, onDelete}) => {
  return(
    <ul>
        {persons.filter(p => p.name.toLocaleLowerCase().includes(filter) || p.number.toLowerCase().includes(filter))
        .map(p => 
        <li key={p.name}>
          <p>{p.name} {p.number} <button onClick={() => onDelete(p.id)}>Delete</button></p>
        </li>
        )}
    </ul>
  )
}

const PersonForm = ({ onSubmit }) => {
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  return (
    <form>
      name: <input value={newName} onChange={(e) => setNewName(e.target.value)}/>        
      number: <input value={newNumber} onChange={(e) => setNewNumber(e.target.value)}/>
      <button type="submit" onClick={(e) => 
        {e.preventDefault(); onSubmit(newName, newNumber)}}>add</button>
    </form>
  )
}

export default App