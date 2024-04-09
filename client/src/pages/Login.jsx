import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Validation from "../components/LoginValidation";
import axios from 'axios';
import "../App.css";
import logo from "../components/imgs/logo.png";

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
            //debugging
            //console.log("User ID: ", user_id);
            axios.post('http://localhost:8800/login', values)
                .then(res => {
                    console.log("Login API Response:", res); 
                    if (res.data.status === "Success"){
                        // shows user_id in navigation as a token ot pass user_id 
                        const user_id = res.data.user_id;
                        navigate(`/Quiz/${user_id}`);

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