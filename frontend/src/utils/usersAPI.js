import axios from "axios";

const createUser = async (details) => {
  let user = await axios.post("http://localhost:5000/api/signup", {
    ...details,
  });
  console.log(user);
};

export { createUser };
