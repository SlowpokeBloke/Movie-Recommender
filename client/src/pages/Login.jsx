import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Validation from "../components/LoginValidation";
import axios from 'axios';
import "../App.css";
import logo from "../logo.png";

const Login = () => {
    const [values, setValues] =  useState({
        email: '',
        password: ''
    })
    
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);
        if (err.email === "" && err.password === "") {
            axios.post('http://localhost:8800/login', values)
                .then(res => {
                    if (res.data === "Success"){
                        navigate("/Quiz");
                    }
                    else {
                        alert("Login failed");
                    }
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className="Login">

            <div className="header">
                <img src={logo} alt="Reel Match Logo" className="logo"/> 
                <h3>ReelMatch</h3>
            </div>

            <h1>Welcome back</h1>


            <div>
                <form action="" onSubmit={handleSubmit}>
                    <div className="log">
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder="Enter Email" name="email" onChange={handleInput}/>
                        {errors.email && <span className="text-danger"> {errors.email}</span>}
                    </div>
                    <div className="log">
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="Enter Password" name="password" onChange={handleInput}/>
                        {errors.password && <span className="text-danger"> {errors.password}</span>}

                    </div>
                    <button type="submit">Login</button>
                    
                    <h6>New User?</h6>

                    <Link to="/CreateAccount"><button>Create Account</button></Link>
                </form>
            </div>
        </div>
    )
}

export default Login