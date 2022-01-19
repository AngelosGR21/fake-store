import { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";

import { useNavigate } from "react-router-dom";

import { createUser, getUserDetails } from "../utils/usersAPI";

const Signup = () => {
  const navigate = useNavigate();
  //user details state
  const [details, setDetails] = useState({
    firstName: "",
    surname: "",
    email: "",
    username: "",
    password: "",
  });
  const [disableButton, setDisableButton] = useState(false);
  const [error, setError] = useState({
    email: false,
    username: false,
  });
  //verifying if user is logged in
  const verifyUser = async () => {
    let userDetails = await getUserDetails();
    //if user is logged in redirect to homepage
    if (userDetails.request) {
      navigate("/");
    }
  };

  //Creating user on submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let response = await createUser(details);
    if (response.request) {
      setDisableButton(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else if (
      response.message === "Username and email are already being used"
    ) {
      setError({
        email: true,
        username: true,
      });
    } else if (response.message === "Username is taken") {
      setError({
        ...error,
        username: true,
      });
    } else if (response.message === "Email is already being used") {
      setError({
        ...error,
        email: true,
      });
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
      <Box>
        <TextField
          value={details.firstName}
          onChange={(e) =>
            setDetails({ ...details, firstName: e.target.value })
          }
          size="small"
          label="First Name"
          required
        />
        <TextField
          value={details.surname}
          onChange={(e) => setDetails({ ...details, surname: e.target.value })}
          size="small"
          label="Surname"
          required
        />
      </Box>
      <TextField
        value={details.email}
        onChange={(e) => {
          setDetails({ ...details, email: e.target.value });
          setError({ ...error, email: false });
        }}
        size="small"
        label="Email"
        type="email"
        required
        style={{ width: "450px" }}
        error={error.email}
        helperText={error.email ? "Email already in use" : false}
      />
      <Box>
        <TextField
          value={details.username}
          onChange={(e) => {
            setDetails({ ...details, username: e.target.value });
            setError({ ...error, username: false });
          }}
          size="small"
          label="Username"
          required
          error={error.username}
          helperText={error.username ? "Username already in use" : false}
        />
        <TextField
          value={details.password}
          onChange={(e) => setDetails({ ...details, password: e.target.value })}
          size="small"
          label="Password"
          type="password"
          required
        />
      </Box>

      <Button variant="contained" type="submit" disabled={disableButton}>
        Register
      </Button>
    </Box>
  );
};

export default Signup;
