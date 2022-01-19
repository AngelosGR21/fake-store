import { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getUserDetails, loginUser } from "../utils/usersAPI";

const Login = () => {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    username: "",
    password: "",
  });
  //checking if user is already logged in
  const verifyUser = async () => {
    let userDetails = await getUserDetails();
    //if user is logged in redirect to homepage
    if (userDetails) {
      if (userDetails.request) {
        navigate("/");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await loginUser(details);
    if (!res) {
      console.log("error passed to frontend");
    } else {
      console.log("Logged in");
      navigate("/");
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TextField
        size="small"
        label="Username"
        value={details.username}
        onChange={(e) => setDetails({ ...details, username: e.target.value })}
      />
      <TextField
        size="small"
        label="Password"
        type="password"
        value={details.password}
        onChange={(e) => setDetails({ ...details, password: e.target.value })}
      />
      <Button type="submit">Log in</Button>
    </Box>
  );
};

export default Login;
