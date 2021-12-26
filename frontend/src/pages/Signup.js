import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

import { createUser } from "../utils/usersAPI";

const Signup = () => {
  //user details state
  const [details, setDetails] = useState({
    firstName: "",
    surname: "",
    email: "",
    username: "",
    password: "",
  });

  //Creating user on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(details);
    setDetails({
      firstName: "",
      surname: "",
      email: "",
      username: "",
      password: "",
    });
  };

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
        onChange={(e) => setDetails({ ...details, email: e.target.value })}
        size="small"
        label="Email"
        type="email"
        required
        style={{ width: "450px" }}
      />
      <Box>
        <TextField
          value={details.username}
          onChange={(e) => setDetails({ ...details, username: e.target.value })}
          size="small"
          label="Username"
          required
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

      <Button variant="contained" type="submit">
        Register
      </Button>
    </Box>
  );
};

export default Signup;
