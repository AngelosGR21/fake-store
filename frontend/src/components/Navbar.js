import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge, Typography, Breadcrumbs } from "@mui/material";

//Icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import img from "../images/cover.png";

//Stylesheet
import "../stylesheets/Navbar.scss";

//User data
import { getUserDetails } from "../utils/usersAPI";

const Navbar = () => {
  const [showMore, setShowMore] = useState({ clothing: false, shoes: false });
  const [user, setUser] = useState(false);

  //verifying if user is logged in
  const verifyUser = async () => {
    const userDetails = await getUserDetails();
    if (userDetails) {
      if (userDetails.request) {
        setUser(true);
      }
    }
  };

  const handleDropdown = (state) => {
    //if true leave dropdown open
    if (state) {
      //if the clothing dropdown is open keep it open else keep shoes open
      showMore.clothing
        ? setShowMore({ ...showMore, clothing: true })
        : setShowMore({ ...showMore, shoes: true });
    }
    //if false close the dropdown
    else {
      //if the clothing dropdown is open close it else close the shoes
      showMore.clothing
        ? setShowMore({ ...showMore, clothing: false })
        : setShowMore({ ...showMore, shoes: false });
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <>
      <nav className="navbar">
        {/* main links */}
        <ul
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <ul className="categoriesContainer">
            <Breadcrumbs separator="|" className="breadcrumbs" component="ul">
              <Link to="/men-home/" className="gender">
                Men
              </Link>
              <Link to="/women-home/" className="gender">
                Women
              </Link>
            </Breadcrumbs>
            <Link
              to="/clothing"
              className="category"
              onMouseEnter={() => setShowMore({ shoes: false, clothing: true })}
              onMouseLeave={() => setShowMore({ ...showMore, clothing: false })}
            >
              <Typography component="li">Clothing</Typography>
            </Link>
            <Typography
              component="li"
              className="category"
              onMouseEnter={() => setShowMore({ clothing: false, shoes: true })}
              onMouseLeave={() => setShowMore({ ...showMore, shoes: false })}
            >
              <Link to="/shoes">Shoes</Link>
            </Typography>
          </ul>
          <img src={img} alt="logo" className="logo"></img>
          <ul className="authCartContainer">
            {/* if the user is logged in show avatar */}
            {user ? (
              <>
                <Link to="/profile">
                  <AccountCircleIcon />
                </Link>
                <Link to="/profile/wishlist">
                  <FavoriteBorderIcon />
                </Link>
              </>
            ) : (
              // else show the links
              <>
                <Link to="/signup">Sign up </Link>
                <Link to="/login">Log in</Link>
              </>
            )}

            <Badge color="success" showZero max={99} className="cartIcon">
              <Link to="/basket">
                <ShoppingBasketIcon />
              </Link>
            </Badge>
          </ul>
        </ul>
        {/* dropdown categories that are hidden */}
        <div
          className="categoriesDropdown"
          onMouseEnter={() => handleDropdown(true)}
          onMouseLeave={() => handleDropdown(false)}
          style={{
            transform:
              showMore.clothing || showMore.shoes ? "scaleY(1)" : "scaleY(0)",
          }}
        >
          {showMore.clothing && "Clothing dropdown"}
          {showMore.shoes && "Shoes Dropdown"}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
