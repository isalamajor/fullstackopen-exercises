const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
require("dotenv").config();

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async (root) => Book.collection.countDocuments(),
    authorCount: async (root) => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {};
      if (args.author) {
        filter.author = args.author;
      }
      if (args.genre) {
        filter.genres = args.genre;
      }
      const books = await Book.find(filter).populate("author");
      return books;
    },
    allAuthors: async (root) => {
      const authors = await Author.find({});
      return authors;
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Unauthorized");
      }

      const authorName = args.author;

      if (args.title.length < 5) {
        throw new GraphQLError("Title is too short", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      if (authorName.length < 5) {
        throw new GraphQLError("Name of the author is too short", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      let author = await Author.findOne({ name: authorName });

      if (!author) {
        author = await new Author({
          name: authorName,
          bookCount: 1,
        }).save();
      } else {
        author.bookCount++;
        await author.save();
      }

      // Create book
      const book = new Book({ ...args, author: author._id });
      const newBook = await book.save();
      const bookReturn = await Book.findById(newBook._id).populate("author");
      pubsub.publish("BOOK_ADDED", { bookAdded: bookReturn });
      return bookReturn;
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) throw new GraphQLError("Unauthorized");
      const author = await Author.findOne({ name: args.name });
      if (!author) return null;
      author.born = args.setBornTo;
      const authorUpdated = await author.save();
      return authorUpdated;
    },
    createUser: async (root, args) => {
      try {
        if (args.username.length < 3) {
          throw new GraphQLError("Username is too short", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.username,
            },
          });
        }
        if (args.favoriteGenre.length < 3) {
          throw new GraphQLError("favoriteGenre is too short", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.favoriteGenre,
            },
          });
        }
        const existed = await User.findOne({ username: args.username });
        if (existed) {
          throw new GraphQLError("Username is already taken", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.username,
            },
          });
        }
        const user = new User({ ...args });
        await user.save();
        return user;
      } catch (error) {
        throw new GraphQLError("Saving user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
    },
    login: async (root, args) => {
      try {
        const user = await User.findOne({ username: args.username });

        if (!user || args.password !== "secret") {
          throw new GraphQLError("wrong credentials", {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        }

        const userForToken = {
          username: user.username,
          id: user._id,
        };
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
      } catch (err) {
        throw new GraphQLError(err);
      }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
