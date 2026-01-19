import axios from "axios";
const baseUrl = "/api/blog";

const getAll = async () => {
  try {
    const res = await axios.get(baseUrl);
    return { ok: true, blogs: res.data };
  } catch (error) {
    return {
      ok: false,
      error: error.response?.data.error || "Blogs Fetching Failed",
    };
  }
};

const postBlog = async (newObject) => {
  try {
    const token = JSON.parse(window.localStorage.getItem("token") || "");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(baseUrl, newObject, config);

    if (response.status === 201) {
      return { ok: true, blog: response.data };
    }

    return { ok: false, error: response.data.error || "Blog Posting Failed" };
  } catch (error) {
    return {
      ok: false,
      error: error.response?.data.error || "Blog Posting Failed",
    };
  }
};

const updateBlog = async (blog) => {
  try {
    const token = JSON.parse(window.localStorage.getItem("token") || "");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const id = blog.id;
    delete blog.id;
    const response = await axios.put(`${baseUrl}/${id}`, blog, config);

    if (response.status === 200) {
      return { ok: true, blog: response.data };
    }

    return { ok: false, error: response.data.error || "Blog Updating Failed" };
  } catch (error) {
    return {
      ok: false,
      error: error.response?.data.error || "Blog Updating Failed",
    };
  }
};

const login = async (username, password) => {
  try {
    const res = await axios.post("api/login", {
      username,
      password,
    });
    window.localStorage.setItem("token", JSON.stringify(res.data.token));
    window.localStorage.setItem("username", JSON.stringify(res.data.username));
    window.localStorage.setItem("name", JSON.stringify(res.data.name));
    return { ok: true, token: res.data.token };
  } catch (error) {
    return { ok: false, error: error.response?.data.error || "Login Failed" };
  }
};

const deleteBlog = async (blogId) => {
  try {
    const token = JSON.parse(window.localStorage.getItem("token") || "");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(`${baseUrl}/${blogId}`, config);

    if (response.status === 204) {
      return { ok: true, deleted: blogId };
    }

    return { ok: false, error: response.data.error || "Blog Deleting Failed" };
  } catch (error) {
    return {
      ok: false,
      error: error.response?.data.error || "Blog Deleting Failed",
    };
  }
};

export default { getAll, login, postBlog, updateBlog, deleteBlog };
