import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import "./Navbar.css";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false); // Correctly initialize menuOpen and setMenuOpen using array destructuring

    return (
        <nav>
            <Link to="/" className='title'>Movie Recommender</Link>
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
                    <NavLink to="/Quiz">Take Quiz</NavLink>
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
