import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//data functions
import { fetchUsers, getUserDetails } from "../utils/usersAPI";

//components
import Sidebar from "../components/Sidebar.js";

const Profile = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState(false);

  const verifyIfAdmin = async () => {
    let details = await getUserDetails();
    //if the request was not successfull redirect to login page
    if (details === undefined) {
      navigate("/login");
    } else {
      if (details.request) {
        //if user is admin fetch all users details
        if (details.userDetails.isAdmin) {
          let dets = await fetchUsers();
          setAllUsers(dets);
        }
      } else {
        console.log("Something went wrong with the request");
      }
    }
  };

  useEffect(() => {
    verifyIfAdmin();
  }, []);

  if (allUsers) {
    return <Sidebar props={allUsers} />;
  } else {
    return <Sidebar />;
  }
};

export default Profile;
