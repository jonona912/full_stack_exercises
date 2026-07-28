import { useState } from 'react'
import { CommentForm } from './CommentForm'
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material'

// Blog card layout: Paper provides the surface, Stack keeps the content spaced,
// and Box groups related text blocks.
const Blog = ({ blog, onLike, onDelete }) => {
  const [visible, setVisible] = useState(false)
  const user = JSON.parse(window.localStorage.getItem('user'))

  return (
    <Paper
      elevation={10}
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        backgroundColor: visible ? 'rgba(255,255,255,0.92)' : 'background.paper',
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          borderColor: 'rgba(37, 99, 235, 0.35)',
        },
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
              {blog.title}
            </Typography>
            <Chip size="small" label={`${blog.likes} likes`} color="primary" variant="outlined" />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            by {blog.author || 'Unknown author'}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Button variant="contained" size="small" onClick={() => setVisible(!visible)}>
            {visible ? 'Hide details' : 'View details'}
          </Button>
        </Stack>

        {visible && (
          <Stack spacing={2}>
            <Divider />
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>URL:</strong> {blog.url}
              </Typography>
              <Typography variant="body2">
                <strong>Likes:</strong> {blog.likes}
              </Typography>
              <Typography variant="body2">
                <strong>User:</strong> {blog.user?.username || 'Unknown'}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={() => onLike(blog)}>
                Like
              </Button>
              {user && blog.user && user.username === blog.user.username && (
                <Button variant="contained" color="error" onClick={() => onDelete(blog)}>
                  Delete
                </Button>
              )}
            </Stack>

            <Box>
              <CommentForm blogId={blog.id} />
            </Box>

            {blog.comments?.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  Comments
                </Typography>
                <Stack component="ul" spacing={1} sx={{ pl: 2, m: 0 }}>
                  {blog.comments.map((comment, index) => (
                    <Typography component="li" key={index} variant="body2">
                      {comment}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

export default Blog
