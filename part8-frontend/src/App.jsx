import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/Login";
import Recommendations from "./components/Recommendations";
import { useSubscription } from "@apollo/client/react";
import { BOOK_ADDED } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setLoggedIn(true);
  }, []);

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {loggedIn ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommendations")}>
              recommended
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setLoggedIn(false);
                setPage("login");
              }}
            >
              logout
            </button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} loggedIn={loggedIn} />

      <Books show={page === "books"} />

      <LoginForm
        show={page === "login"}
        onLoginSuccess={() => {
          setLoggedIn(true);
          setPage("authors");
        }}
      />

      <NewBook show={page === "add" && loggedIn} />
      <Recommendations show={page === "recommendations" && loggedIn} />
    </div>
  );
};

export default App;
