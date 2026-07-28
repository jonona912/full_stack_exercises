import { useState } from 'react'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useField } from '../services/formFields'
import blogsService from '../services/blogs'

// Comment form layout: Paper wraps the form, Stack arranges the fields,
// and TextField collects the comment text.
export const CommentForm = ({ blogId }) => {
  const { reset, ...commentFields } = useField('text')
  const [submitting, setSubmitting] = useState(false)

  const handleCommentSubmit = async (event) => {
    event.preventDefault()

    const trimmedComment = commentFields.value.trim()
    if (trimmedComment === '') {
      return
    }

    setSubmitting(true)
    try {
      await blogsService.addComment(blogId, trimmedComment)
      reset()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor: 'rgba(248, 250, 252, 0.9)',
        borderColor: 'divider',
      }}
    >
      <Stack component="form" onSubmit={handleCommentSubmit} spacing={1.5}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Add a comment
          </Typography>
          <Typography variant="body2" color="text.secondary">
                        Keep it short and helpful.
          </Typography>
        </Box>

        <TextField
          {...commentFields}
          label="Comment"
          placeholder="Share your thoughts"
          multiline
          minRows={3}
          fullWidth
          size="small"
        />

        <Stack direction="row" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || commentFields.value.trim() === ''}
          >
            {submitting ? 'Posting...' : 'Add Comment'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  )
}
