import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import "./Navbar.css";
import logo from "../components/imgs/logo.png";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false); // Correctly initialize menuOpen and setMenuOpen using array destructuring

    return (
        <nav>
            <Link to="/" className='title'>
                <div className="header">
                    <img src={logo} alt="Reel Match Logo" className="logo"/>
                    <h3>ReelMatch</h3>
                </div>
            </Link>
            <div className='menu' onClick={() => {
                setMenuOpen(!menuOpen);
            }}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? "open" : ""}>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/Quiz">Quiz</NavLink>
                </li>
                <li>
                    <NavLink to="/UserAccount">Account</NavLink>
                </li>
                <li>
                    <NavLink to="/Login">Login</NavLink>
                </li>
            </ul>
        </nav>
    );
};
