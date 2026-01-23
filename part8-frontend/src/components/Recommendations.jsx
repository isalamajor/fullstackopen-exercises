import { useLazyQuery, useQuery } from "@apollo/client/react";
import { GET_BOOKS, GET_ME } from "../queries";
import { useEffect, useState } from "react";

const Recommendations = (props) => {
  const resGetMe = useQuery(GET_ME);
  const resGetBooks = useQuery(GET_BOOKS, {
    variables: { genre: resGetMe.data?.me?.favoriteGenre },
    skip: !resGetMe.data,
  });

  if (!props.show) {
    return null;
  }
  if (resGetBooks.loading || resGetMe.loading) return <div>loading...</div>;
  return (
    <div>
      <h2>Book recommendations</h2>
      <p>{`For your favorite genre ${resGetMe.data.me?.favoriteGenre}`}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {resGetBooks.data.allBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
