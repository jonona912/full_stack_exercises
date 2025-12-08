import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getContacts = () => {
    const result = axios.get(baseUrl).then(response => response.data)
    return result
}

const addContact = contact => {
    const result = axios.post(baseUrl, contact).then(response => response.data)
    return result
}

const deleteContact = id => {
    const result = axios.delete(`${baseUrl}/${id}`).then(response => response.data)
    return result
}

const updateContact = (id, updatedContact) => {
    const result = axios.put(`${baseUrl}/${id}`, updatedContact).then(response => response.data)
    return result
}

export default { getContacts, addContact, deleteContact, updateContact }