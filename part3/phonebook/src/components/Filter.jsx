import { useState } from 'react'

const Filter = ({ newFilter, handleShowFiltered }) => (
  <div>
    filter shown with <input 
      value={newFilter}
      onChange={handleShowFiltered}
    />
  </div>
)

export default Filter