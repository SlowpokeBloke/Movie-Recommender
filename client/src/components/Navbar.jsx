import React, { useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import "./Navbar.css";


export const Navbar = () => {
    const { user_id} = useParams() || {};
    console.log(useParams());
    console.log("user_id from useParams:", user_id);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav>
            <Link to="/" className='title'>ReelMatch</Link>
            <div className='menu' onClick={() => {
                setMenuOpen(!menuOpen);
            }}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? "open" : ""}>
            {user_id ? (
                    <>
                        <li><NavLink to={`/Quiz/${user_id}`}>Quiz</NavLink></li>
                        <li><NavLink to={`/UserAccount/${user_id}`}>Account</NavLink></li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/Login">Login</NavLink></li>
                        <li><NavLink to="/CreateAccount">Create Account</NavLink></li>
                    </>
                )}
                <li><NavLink to="/">Logout</NavLink></li>
            </ul>
        </nav>
    );
};
