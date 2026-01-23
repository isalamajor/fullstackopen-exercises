import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { LOGIN } from "../queries";

const LoginForm = ({ onLoginSuccess, show }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [login] = useMutation(LOGIN);

  const onSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    login({
      variables: { username, password },
      update: (cache, response) => {
        localStorage.setItem("token", response.data.login.value);
        onLoginSuccess();
      },
      onError: (error) => {
        localStorage.removeItem("token");
        setMessage(error.message);
      },
    });
    setUsername("");
    setPassword("");
  };

  if (!show) {
    return null;
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        value={username}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Log In</button>
      {message}
      You can use user 'isaplus' with password 'secret'
    </form>
  );
};

export default LoginForm;
