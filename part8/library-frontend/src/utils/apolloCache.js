import { ALL_BOOKS } from "../queries"

export const addBookToCache = (cache, addedBook) => {
 cache.updateQuery({ query: ALL_BOOKS }, (data) => {
   if (!data) {
     return { allBooks: [addedBook] }
   }

   const existsInCache = data.allBooks.some((book) => book.id === addedBook.id)
   if (existsInCache) {
     return data
   }
   window.alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`)
   return {
    allBooks: [...data.allBooks, addedBook],
   }
 })
}