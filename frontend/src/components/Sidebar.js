import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//material-ui components
import { Box } from "@mui/system";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
//icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

//logo
import logo from "../images/cover.png";

const Sidebar = ({ allUsers, setCurrentPage }) => {
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(1);

  const handleClick = (page) => {
    setIsSelected(page);
    setCurrentPage(page);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  //if user is admin show a different sidebar
  if (allUsers) {
    return (
      <>
        <Box
          width={200}
          style={{
            backgroundColor: "#eeeeee",
            height: "100vh",
          }}
        >
          <Link to="/">
            <img src={logo} style={{ width: 200 }} alt="logo" />
          </Link>

          <List>
            <ListItem
              disablePadding
              selected={isSelected === 1 ? true : false}
              onClick={() => handleClick(1)}
            >
              <ListItemButton>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText>Your Details</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              selected={isSelected === 2 ? true : false}
              onClick={() => handleClick(2)}
            >
              <ListItemButton>
                <ListItemIcon>
                  <FavoriteBorderIcon />
                </ListItemIcon>
                <ListItemText>Wishlist</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding onClick={() => navigate("/basket")}>
              <ListItemButton>
                <ListItemIcon>
                  <ShoppingBasketOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Basket</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              selected={isSelected === 3 ? true : false}
              onClick={() => handleClick(3)}
            >
              <ListItemButton>
                <ListItemIcon>
                  <PeopleOutlineIcon />
                </ListItemIcon>
                <ListItemText>Users</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              selected={isSelected === 4 ? true : false}
              onClick={() => handleClick(4)}
            >
              <ListItemButton>
                <ListItemIcon>
                  <LibraryBooksOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Products</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              selected={isSelected === 5 ? true : false}
              onClick={() => handleClick(5)}
            >
              <ListItemButton>
                <ListItemIcon>
                  <AddCircleOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText>New Product</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding onClick={logout}>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </>
    );
  } else {
    //user is a customer
    return (
      <Box width={200} style={{ backgroundColor: "#eeeeee", height: "100vh" }}>
        <Link to="/">
          <img src={logo} style={{ width: 200 }} alt="logo" />
        </Link>
        <List>
          <ListItem
            disablePadding
            selected={isSelected === 1 ? true : false}
            onClick={() => handleClick(1)}
          >
            <ListItemButton>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText>Your Details</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            selected={isSelected === 2 ? true : false}
            onClick={() => handleClick(2)}
          >
            <ListItemButton>
              <ListItemIcon>
                <FavoriteBorderIcon />
              </ListItemIcon>
              <ListItemText>Wishlist</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => navigate("/basket")}>
            <ListItemButton>
              <ListItemIcon>
                <ShoppingBasketOutlinedIcon />
              </ListItemIcon>
              <ListItemText>Basket</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={logout}>
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    );
  }
};

export default Sidebar;
