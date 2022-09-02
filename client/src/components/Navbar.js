import React from "react";
import { Link } from "react-router-dom";
import NavbarCSS from "./styles/Navbar.module.css"

export default function Navbar() {
    return (
        <div className={NavbarCSS.container}>
            <li className={NavbarCSS.tab}>
                <Link to="/" style={{ textDecoration: "none", color: "white" }}>Home</Link>
            </li>
            <li className={NavbarCSS.tab}>
                <Link to="/booking" style={{ textDecoration: "none", color: "white" }}>Booking</Link>
            </li>
            <li className={NavbarCSS.tab}>
                <Link to="/about" style={{ textDecoration: "none", color: "white"}}>About</Link>
            </li>
        </div>
    );
};

