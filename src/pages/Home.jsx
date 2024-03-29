import React from "react"
import logo from "../logo.png";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="Home">
            
            <div className="header">
                <img src={logo} alt="Reel Match Logo" className="logo"/> 
                <h3>ReelMatch</h3>
            </div>
    
            <div className="greeting">
                <h1>Find you Reel movie match at ReelMatch in just a few clicks.</h1>

                <div className="new">
                    <h2>New User?</h2>
                    <Link to="/CreateAccount"><button>Create Account</button></Link>
                </div>
                
                <div className="returning">
                    <h2>Returning User?</h2>
                    <Link to="/Login"><button>Login</button></Link>
                </div>
            </div>
        </div>
    )
}

export default Home