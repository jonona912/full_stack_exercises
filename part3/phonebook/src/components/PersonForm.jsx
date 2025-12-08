import { useState } from 'react'

const PersonForm = ({ handleSubmit, newName, handleNameChange, newPhoneNum, handlePhoneNumChange }) => (
  <form>
    <div>
      name: <input
        value={newName}
        onChange={handleNameChange}
      />
    </div>
    <div>
      number: <input 
        value={newPhoneNum}
        onChange={handlePhoneNumChange}
      />
    </div>
    <div>
      <button type="submit" onClick={handleSubmit}>add</button>
    </div>
  </form>
)

export default PersonForm