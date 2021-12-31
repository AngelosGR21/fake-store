import axios from "axios";

const createUser = async (details) => {
  try {
    await axios.post("http://localhost:5000/api/signup", {
      ...details,
    });
    return "success";
  } catch (e) {
    let responseMessage = e.response.data.message;
    return responseMessage;
  }
};

export { createUser };
