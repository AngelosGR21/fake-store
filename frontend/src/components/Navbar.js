import { React, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Typography, Breadcrumbs } from "@mui/material";

// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import img from "../images/cover.png";

const Navbar = () => {
  return (
    <>
      <nav
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Breadcrumbs separator="|" style={{ display: "flex", height: "50px" }}>
          <Link to="/men">Men</Link>
          <Link to="/women">Women</Link>
        </Breadcrumbs>
        <Typography>Clothing</Typography>
        <Typography>Shoes</Typography>
        <img
          src={img}
          alt="logo"
          style={{ width: "200px", borderRadius: "10px" }}
        ></img>
        <Link to="/signup">Sign up</Link>
        <Link to="/login">Log in</Link>
        <Badge color="success" showZero max={99}>
          <Link to="/basket">
            <ShoppingBasketIcon />
          </Link>
        </Badge>
      </nav>
    </>
  );
};

export default Navbar;
