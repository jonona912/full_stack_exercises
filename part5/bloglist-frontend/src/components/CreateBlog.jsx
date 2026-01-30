const CreateBlog = ({ handleNewBlog }) => { 
  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        handleNewBlog({
          title: event.target.Title.value,
          author: event.target.Author.value,
          url: event.target.Url.value
        })
        event.target.reset()
      }}>
        <div>
          title:
          <input
            type="text"
            name="Title"
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="Author"
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="Url"
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateBlog