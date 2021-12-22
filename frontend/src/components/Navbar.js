import { React, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Typography, Breadcrumbs } from "@mui/material";

//Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import img from "../images/cover.png";

//Stylesheet
import "../stylesheets/Navbar.scss";

const Navbar = () => {
  const [rotateC, setRotateC] = useState(0);
  const [rotateS, setRotateS] = useState(0);
  return (
    <>
      <nav className="navbar">
        <div className="categoriesContainer">
          <Breadcrumbs separator="|" className="breadcrumbs">
            <Link to="/men-home" className="gender">
              Men
            </Link>
            <Link to="/women-home" className="gender selectedGender">
              Women
            </Link>
          </Breadcrumbs>
          <Typography
            className="category"
            onMouseEnter={() => setRotateC(180)}
            onMouseLeave={() => setRotateC(0)}
          >
            Clothing{" "}
            <ExpandMoreIcon
              style={{
                transition: "transform 1s",
                transform: `rotate(${rotateC}deg)`,
              }}
            />
          </Typography>
          <Typography
            className="category"
            onMouseEnter={() => setRotateS(180)}
            onMouseLeave={() => setRotateS(0)}
          >
            Shoes{" "}
            <ExpandMoreIcon
              style={{
                transition: "transform 1s",
                transform: `rotate(${rotateS}deg)`,
              }}
            />
          </Typography>
        </div>
        <img src={img} alt="logo" className="logo"></img>
        <div className="authCartContainer">
          <Link to="/signup">Sign up </Link>
          <Link to="/login">Log in</Link>
          <Badge color="success" showZero max={99} className="cartIcon">
            <Link to="/basket">
              <ShoppingBasketIcon />
            </Link>
          </Badge>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
