import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//material-ui
import { Box } from "@mui/system";

//data functions
import { fetchUsers, getUserDetails } from "../utils/usersAPI";

//components
import Sidebar from "../components/Sidebar.js";
import ProfileDetails from "../components/ProfileDetails";
import ProfileWishlist from "../components/ProfileWishlist";
import AdminUsers from "../components/AdminUsers";
import AdminProducts from "../components/AdminProducts";
import AdminAddProduct from "../components/AdminAddProduct";

const Profile = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [userDetails, setUserDetails] = useState(false);

  const verifyIfAdmin = async () => {
    let details = await getUserDetails();
    //if the request was not successfull redirect to login page
    if (details === undefined) {
      navigate("/login");
    } else {
      if (details.request) {
        setUserDetails(details.userDetails);
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
    return (
      <Box style={{ display: "flex" }}>
        <Sidebar allUsers={allUsers} setCurrentPage={setCurrentPage} />
        {currentPage === 1 && <ProfileDetails userDetails={userDetails} />}
        {currentPage === 2 && <ProfileWishlist />}
        {currentPage === 3 && <AdminUsers />}
        {currentPage === 4 && <AdminProducts />}
        {currentPage === 5 && <AdminAddProduct />}
      </Box>
    );
  } else {
    return (
      <Box style={{ display: "flex" }}>
        <Sidebar setCurrentPage={setCurrentPage} />
        {currentPage === 1 && <ProfileDetails userDetails={userDetails} />}
        {currentPage === 2 && <ProfileWishlist />}
      </Box>
    );
  }
};

export default Profile;
