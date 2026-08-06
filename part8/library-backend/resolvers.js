// const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const User = require('./models/user')
const Book = require('./models/book')
const Author = require('./models/author')
const { errorLogger, debugLogger } = require('./logger')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const { authorId, genre } = args

      const filter = {}
      if (authorId) filter.author = authorId
      if (genre) filter.genres = genre
      const books = await Book.find(filter).populate('author')
      return books
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }
      // probably will need to create an Author if one doesn't exist or return existing Object
      if (!args.author) {
        throw new GraphQLError('Author name is required', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        })
      }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error,
            },
          })
        }
      }
      // Now we have an author, we can create the book with the author's ID
      args.author = author.id
      const existingBook = await Book.findOne({ title: args.title })
      if (existingBook) {
        throw new GraphQLError('Book title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }
      const book = new Book({ ...args })
      try {
        const savedBook = await book.save()
        return savedBook.populate('author') // Populate the author field before returning
      } catch (error) {
        throw new GraphQLError('Saving book failed!!!', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
  
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }
      const { name, setBornTo } = args
      const updatedAuthor = await Author.findOneAndUpdate(
        { name: name },
        { born: setBornTo },
        { returnDocument: 'after' } // Returns the modified document instead of the original
      )
    
      return updatedAuthor
    },
    createUser: async (root, args) => {
      const user = await User({username: args.username, favoriteGenre: args.favoriteGenre})
      try {
        const savedUser = await user.save()
        return savedUser
      } catch(error) {
          throw new GraphQLError('Saving user failed!!!', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: { username: args.username, favoriteGenre: args.favoriteGenre },
              error,
            },
          })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    },
  },
  Author: {
    bookCount: async (root) => {
      // Counts documents where the author field matches the current author's ID or name
      const count = await Book.countDocuments({ author: root.id })
      return count
    }
  }
  
  

}



module.exports = resolvers








