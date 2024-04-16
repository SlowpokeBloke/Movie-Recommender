import React, { useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import "./Navbar.css";


export const Navbar = () => {
    const { user_id} = useParams();
    console.log(useParams());
    console.log("user_id from useParams:", user_id);
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
                    <NavLink to={"/Quiz/:user_id"}>Quiz</NavLink>
                </li>
                <li>
                    <NavLink to = {"/UserAccount/:user_id"}>Account</NavLink>
                </li>
                <li>
                    <NavLink to="/">Logout</NavLink>
                </li>
            </ul>
        </nav>
    );
};
