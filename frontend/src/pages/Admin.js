import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../utils/usersAPI";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const navigate = useNavigate();
  const users = async () => {
    let us = await fetchUsers();
    console.log(us);
  };
  users();

  return <div>{isAdmin && <h1>This is the data</h1>}</div>;
};

export default Admin;
