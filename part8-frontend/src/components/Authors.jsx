import {
  useMutation,
  useQuery,
  useLazyQuery,
  useSubscription,
  useApolloClient,
} from "@apollo/client/react";
import { GET_AUTHORS, UPDATE_AUTHOR, BOOK_ADDED } from "../queries";
import { useEffect, useState } from "react";
import Select from "react-select";

const Authors = (props) => {
  const client = useApolloClient();
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [updateAuthor] = useMutation(UPDATE_AUTHOR);
  const [getAuthors, { data, loading, error }] = useLazyQuery(GET_AUTHORS);

  useEffect(() => {
    getAuthors();
  }, []);

  const updateCacheWith = (bookAdded) => {
    const includedIn = (set, object) =>
      set.map((p) => p.id).includes(object.id);

    const dataInStore = client.readQuery({ query: GET_AUTHORS });

    if (!includedIn(dataInStore.allAuthors, bookAdded.author)) {
      client.writeQuery({
        query: GET_AUTHORS,
        data: { allAuthors: dataInStore.allAuthors.concat(bookAdded.author) },
      });
    } else {
      const authorsUpdated = dataInStore.allAuthors.map((a) =>
        a.id === bookAdded.author.id
          ? { ...bookAdded.author, bookCount: bookAdded.author.bookCount + 1 }
          : a,
      );
      client.writeQuery({
        query: GET_AUTHORS,
        data: { allAuthors: authorsUpdated },
      });
    }
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      updateCacheWith(data.data.bookAdded);
      getAuthors();
    },
  });
  if (loading) return <div>loading...</div>;
  if (error) return <div>an error ocurrer when fetching data</div>;
  if (!props.show) return null;

  const authors = data?.allAuthors || [];
  const options = authors.map((author) => {
    return {
      value: author.name,
      label: author.name,
    };
  });

  const submit = (event) => {
    event.preventDefault();
    updateAuthor({
      variables: { name: name, setBornTo: parseInt(year) },
      refetchQueries: [{ query: GET_AUTHORS }],
    });
    setName("");
    setYear("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.loggedIn && (
        <>
          <h2>Set birthyear</h2>

          <form onSubmit={submit}>
            <Select
              options={options}
              onChange={(selected) => setName(selected.value)}
            />
            <div>
              birthyear
              <input
                value={year}
                onChange={({ target }) => setYear(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
