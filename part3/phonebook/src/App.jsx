import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm.jsx'
import Filter from './components/Filter.jsx'
import Persons from './components/Persons.jsx'
import phonebook_api from './services/phonebook_api.jsx'
import Notification from './components/Notification.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhoneNum, setNewPhoneNum] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [showFiltered, setShowFiltered] = useState([])
  const [updateMsg, setUpdateMsg] = useState('')
  const [notificationColor, setNotificationColor] = useState('purple')
  useEffect(() => {
    phonebook_api.getContacts().then(contacts => {
      console.log("phonebook_api response: ", contacts)
      setPersons(contacts)
      setShowFiltered(contacts)
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault() // to prevent from page reaload call
    const personObject = {
      name: newName,
      number: newPhoneNum
    }
    const exists = persons.some((obj) => obj.name === personObject.name)
    if (exists) {
      const confirmStatus = confirm(`${personObject.name} is already added to phonebook`)
      if (confirmStatus) {
        const personToUpdate = persons.find(obj => obj.name === personObject.name)
        console.log("updating contact: ", personToUpdate)
        const updatedPerson = { ...personToUpdate, number: newPhoneNum }
        phonebook_api.updateContact(personToUpdate.id, updatedPerson)
        .then(returnedContact => {
          console.log("updated contact response: ", returnedContact)
          setPersons(persons.map(person => person.id !== personToUpdate.id ? person : returnedContact))
          setShowFiltered(showFiltered.map(person => person.id !== personToUpdate.id ? person : returnedContact))
          setNewName('')
          setNewPhoneNum('')
        })
        .catch(failureResponse => {
          console.log("Caught update error: ", failureResponse)
          setUpdateMsg(`Information of ${personObject.name} has already been removed from server`)
          setNotificationColor('red')
          setTimeout(() => {
            setUpdateMsg(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== personToUpdate.id))
          setShowFiltered(showFiltered.filter(person => person.id !== personToUpdate.id))
        })
        return
      }
    }
    else {
      phonebook_api.addContact(personObject)
      .then(returnedContact => {
        setPersons(persons.concat(returnedContact))
        setShowFiltered(showFiltered.concat(returnedContact))
        setNewName('')
        setNewPhoneNum('')
      })
      .catch((failure) => {
        console.log("Cuaght add error", failure)
      })
      setUpdateMsg(`Added ${personObject.name}`)
      setNotificationColor('green')
      setTimeout(() => {
        setUpdateMsg(null)
      }, 5000)
    }
  }

  const handleNameChange = (e) => {
    console.log(e.target.value)
    setNewName(e.target.value)
  }

  const handlePhoneNumChange = (e) => {
    setNewPhoneNum(e.target.value)
  }

  const handleShowFiltered = (e) => {
    console.log("handle Show Filtered: ", e.target.value)
    setNewFilter(e.target.value)
    const newSet = persons.filter(person => 
      person.name.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setShowFiltered(newSet)
  }

  const deleteContact = (id) => {
    const contactToDelete = persons.find(obj => obj.id === id)
    const confirmStatus = confirm(`Delete ${contactToDelete.name}`)
    if (confirmStatus) {
      phonebook_api.deleteContact(contactToDelete.id)
      .then(() => {
        const newPersons = persons.filter(obj => obj.id !== id)
        setPersons(newPersons)
        setShowFiltered(showFiltered.filter(obj => obj.id !== id))
      })
    }
  }

  return (
    <div>
      <Notification message={updateMsg} themeColor={notificationColor} />
      <h2>Phonebook</h2>
      <form>
        <Filter newFilter={newFilter} handleShowFiltered={handleShowFiltered} />
      </form>
      <h2>Add a new</h2>
      <PersonForm 
        handleSubmit={handleSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newPhoneNum={newPhoneNum}
        handlePhoneNumChange={handlePhoneNumChange}
      />
      <h2>Numbers</h2>
      <Persons 
        persons={showFiltered}
        deleteContact={deleteContact}
      />
    </div>
  )
}

export default App
