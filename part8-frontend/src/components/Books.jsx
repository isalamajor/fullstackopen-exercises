import {
  useLazyQuery,
  useQuery,
  useSubscription,
  useApolloClient,
} from "@apollo/client/react";
import { GET_BOOKS, BOOK_ADDED } from "../queries";
import { useEffect, useState } from "react";

const Books = (props) => {
  const client = useApolloClient();
  const [genre, setGenre] = useState("");
  const resGetBooks = useQuery(GET_BOOKS);
  const [getBooks, { data, loading, error }] = useLazyQuery(GET_BOOKS);

  useEffect(() => {
    getBooks({ variables: { genre: genre } });
  }, [genre]);

  const updateCacheWith = (bookAdded) => {
    const includedIn = (set, object) =>
      set.map((p) => p.id).includes(object.id);

    const dataInStore = client.readQuery({ query: GET_BOOKS });

    if (!includedIn(dataInStore.allBooks, bookAdded)) {
      client.writeQuery({
        query: GET_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(bookAdded) },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      updateCacheWith(data.data.bookAdded);
      getBooks();
      window.alert(`New book added: '${data.data.bookAdded.title}'`);
    },
  });

  if (!props.show) {
    return null;
  }
  if (loading) return <div>loading...</div>;

  const allGenres = resGetBooks.data?.allBooks
    ? [...new Set(resGetBooks.data.allBooks.flatMap((book) => book.genres))]
    : [];

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {data.allBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {allGenres.length > 0 &&
        allGenres.map((g, i) => (
          <button
            key={g + i}
            onClick={() => setGenre(g)}
            style={{ backgroundColor: genre === g ? "#96bde6ff" : "#e9ecef" }}
          >
            {g}
          </button>
        ))}
      <button
        onClick={() => setGenre("")}
        style={{ backgroundColor: genre === "" ? "#96bde6ff" : "#e9ecef" }}
      >
        All
      </button>
    </div>
  );
};

export default Books;
