import Blog from './Blog'
import { useBlogsStore } from '../services/store'
import { Box, Divider, Paper, Stack, Typography } from '@mui/material'

// Blog feed layout: Paper creates the page surface, Stack organizes the heading
// and list, and Divider separates the title area from the entries.
const BlogsList = () => {
  const { blogs, handleBlogUpdate, deleteBlog } = useBlogsStore()

  const onLike = (blogObject) => {
    handleBlogUpdate(blogObject)
  }

  const onDelete = (blogObject) => {
    deleteBlog(blogObject)
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mt: 2,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
      }}
    >
      <Stack spacing={2}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.2 }}>
            Blog feed
          </Typography>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            Latest posts
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Blogs are sorted by likes, so the most popular posts stay on top.
          </Typography>
        </Box>

        <Divider />

        <Stack spacing={2.5}>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} onLike={onLike} onDelete={onDelete} />
            ))}
          {blogs.length === 0 && (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                backgroundColor: 'background.paper',
                color: 'text.secondary',
              }}
            >
              No blogs yet. Create the first post to start the feed.
            </Paper>
          )}
        </Stack>
      </Stack>
    </Paper>
  )
}

export default BlogsList
