import { useBlogsStore } from '../services/store'
import { useField } from '../services/formFields'
import { TextField, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const CreateBlog = () => {
  const { reset: resetTitle, ...titleField } = useField('text')
  const { reset: resetAuthor, ...authorField } = useField('text')
  const { reset: resetUrl, ...urlField } = useField('text')
  const navigate = useNavigate()
  const { handleNewBlog } = useBlogsStore()

  const addBlog = (event) => {
    event.preventDefault()
    handleNewBlog({ title: titleField.value, author: authorField.value, url: urlField.value })
    navigate('/blogslist')
    resetTitle()
    resetAuthor()
    resetUrl()
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <TextField label="Title" {...titleField} fullWidth margin="normal" />
        <TextField label="Author" {...authorField} fullWidth margin="normal" />
        <TextField label="URL" {...urlField} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Create</Button>
      </form>
    </div>
  )
}

export default CreateBlog
