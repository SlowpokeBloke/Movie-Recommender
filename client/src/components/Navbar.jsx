import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import "./Navbar.css";


export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

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
                    <NavLink to="/Quiz/:user_id">Quiz</NavLink>
                </li>
                <li>
                    <NavLink to="/UserAccount">Account</NavLink>
                </li>
                <li>
                    <NavLink to="/">Logout</NavLink>
                </li>
            </ul>
        </nav>
    );
};
