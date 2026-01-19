import { useState, useReducer, useContext } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import Blog from "./components/Blog";
import PostBlogForm from "./components/PostBlogForm";
import blogService from "./services/blogs";
import { UserContext } from "./provider/userContextProvider";

const reducerNotification = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "CLEAR":
      return "";
    default:
      return state;
  }
};

const App = () => {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState(null);
  const [notification, notificationDispatch] = useReducer(
    reducerNotification,
    ""
  );

  const [showAddBlog, setShowAddBlog] = useState(false);
  const { userdata, userDispatch } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogs = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await blogService.getAll();
      if (res.ok) {
        return res.blogs.sort((a, b) => b.likes - a.likes);
      } else throw new Error("Failed to fetch blogs");
    },
  });

  const postBlogMutation = useMutation({
    mutationFn: blogService.postBlog,
    onSuccess: (res) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(res.blog));
      showNotification(`New blog '${res.blog.title}' was added`);
    },
    onerror: () =>
      notificationDispatch({
        type: "SET",
        payload: "Error when posting new blog",
      }),
  });

  const likeMutation = useMutation({
    mutationFn: (blog) =>
      blogService.updateBlog({ ...blog, likes: blog.likes + 1 }),
    onSuccess: (res) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((b) => (b.id === res.blog.id ? res.blog : b))
      );
    },
    onerror: () => showNotification("Error when posting new blog"),
  });

  const deleteMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: (res) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((b) => b.id !== res.deleted)
      );
      showNotification("Blog deleted successfully");
    },
    onerror: () => showNotification("Error when deleting blog"),
  });

  if (blogs.isLoading) return <p>Loading...</p>;
  if (blogs.error) return <p>An error occurred when fetching data</p>;

  const showNotification = (message) => {
    notificationDispatch({
      type: "SET",
      payload: message,
    });
    setTimeout(
      () =>
        notificationDispatch({
          type: "CLEAR",
        }),
      5000
    );
  };

  const logout = () => {
    window.localStorage.clear();
    userDispatch({ type: "CLEAR" });
    setUsername("");
    setPassword("");
    queryClient.setQueryData(["blogs"], []);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const res = await blogService.login(username, password);
    if (res.ok) {
      userDispatch({
        type: "SET",
        payload: { username: username, token: res.token },
      });
    } else {
      setErrorMessage(res.error);
    }
  };

  return (
    <>
      <h1>Blogs App</h1>
      <p
        style={{
          display: "inline-block",
          marginRight: "10px",
          color: "red",
          fontWeight: "bold",
        }}
      >
        {errorMessage}
      </p>
      <p
        style={{ display: "inline-block", color: "green", fontWeight: "bold" }}
      >
        {notification}
      </p>
      {!userdata.token ? (
        /* Login Form */
        <>
          <h1>Login to BlogsApp</h1>
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                type="text"
                value={username}
                name="Username"
                placeholder="Username"
                onChange={({ target }) => {
                  setUsername(target.value);
                  setErrorMessage(null);
                }}
              />
            </div>
            <div>
              password
              <input
                type="password"
                value={password}
                name="Password"
                placeholder="Password"
                onChange={({ target }) => {
                  setPassword(target.value);
                  setErrorMessage(null);
                }}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </>
      ) : (
        /* Blogs */
        <div>
          <button onClick={() => logout()}>Logout</button>
          <h2>Blogs List</h2>
          {blogs.data &&
            blogs.data.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                onBlogLiked={() => likeMutation.mutate(blog)}
                onDeleteClicked={() => deleteMutation.mutate(blog.id)}
              />
            ))}
          {showAddBlog ? (
            <>
              <PostBlogForm
                onSubmit={(title, author, url) =>
                  postBlogMutation.mutate({ title, author, url })
                }
              />
              <button onClick={() => setShowAddBlog(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setShowAddBlog(true)}>Add Blog</button>
          )}
        </div>
      )}
    </>
  );
};

export default App;
