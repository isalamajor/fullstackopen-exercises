import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, onBlogLiked, onDeleteClicked }) => {
  const [showDetails, setShowDetails] = useState(false);
  const username = JSON.parse(localStorage.getItem("username"));
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
    display: "flex",
    flex: "column",
  };

  const deleteClicked = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete blog ${blog.title} by ${blog.author}?`
      )
    ) {
      onDeleteClicked();
    }
  };

  return (
    <div>
      <div className={blogStyle} data-testid={"blog-test-id"}>
        {blog.title}

        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide" : "View"}
        </button>

        {showDetails && (
          <div className={blogStyle}>
            <div>{blog.author}</div>
            <div>{blog.url}</div>
            <div>
              {blog.user?.username}
              {username === blog.user?.username && (
                <button onClick={deleteClicked}>Delete</button>
              )}
            </div>
            <div>
              {blog.likes} likes
              <button onClick={onBlogLiked}>Like</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
