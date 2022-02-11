import axios from "axios";

const createUser = async (details) => {
  try {
    let data = await axios.post(
      "http://localhost:5000/api/user/signup",
      details,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    localStorage.setItem("token", data.data.token)
    return data.data;
  } catch (e) {
    let response = e.response.data;
    return response;
  }
};

const loginUser = async (details) => {
  try {
    const data = await axios.post(
      "http://localhost:5000/api/user/login",
      details,
      {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage.getItem("token"),
        },
        withCredentials: true,
      }
    );
    localStorage.setItem("token", data.data.token);
    return data.data;
  } catch (e) {
    return false;
  }
};

const fetchUsers = async () => {
  try {
    const data = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { "x-access-token": localStorage.getItem("token") },
    });
    return data.data.data;
  } catch (e) {
    let responseMessage = e.response.data.message;
    return responseMessage;
  }
};

const getUserDetails = async () => {
  try {
    if (localStorage.getItem("token")) {
      const data = await axios.get("http://localhost:5000/api/user/userInfo", {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      return data.data;
    }
  } catch (e) {
    return e.response.data;
  }
};

export { createUser, loginUser, fetchUsers, getUserDetails };
