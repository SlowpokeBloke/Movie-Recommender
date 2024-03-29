import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Validation from "../components/CreateAccountValidation";
import axios from 'axios';
import logo from "../logo.png";


const CreateAccount = () => {
    const [values, setValues] = useState({
        full_name: '',
        age: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const err = Validation(values);
        setErrors(err);
        if (err.full_name === "" && err.age === "" && err.email === "" && err.password === "") {
            axios.post('http://localhost:8800/createAccount', values)
                .then(res => {
                    navigate("/Login"); // Navigate to Login page
                })
                .catch(err => console.log(err));
        }
    };

    return (
        <div className="CreateAccount">

            <div className="header">
                <img src={logo} alt="Reel Match Logo" className="logo"/> 
                <h3>ReelMatch</h3>
            </div>

            <h1>Create your account</h1>

            <h6>Create an account to save your movie selections and better your movie recommendations.</h6>

            <div>
                <form onSubmit={handleSubmit} className="form">
                    <div className="signup">
                        <label htmlFor="full_name">Full Name</label>
                        <input type="text" placeholder="Enter Full Name" name="full_name" onChange={handleInput} />
                        {errors.full_name && <span className="text-danger"> {errors.full_name}</span>}
                    </div>
                    <div className="signup">
                        <label htmlFor="age">Age</label>
                        <input type="number" placeholder="Enter Age" name="age" onChange={handleInput} min="1" max="100"/>
                        {errors.age && <span className="text-danger"> {errors.age}</span>}
                    </div>
                    <div className="signup">
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder="Enter Email" name="email" onChange={handleInput} />
                        {errors.email && <span className="text-danger"> {errors.email}</span>}
                    </div>
                    <div className="signup">
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="Enter Password" name="password" onChange={handleInput} />
                        {errors.password && <span className="text-danger"> {errors.password}</span>}
                    </div>
                    <div className="signup" style={{ marginTop: "0px" }}>
                        <button type="submit">Sign Up</button>
                    </div>

                    <h6>Already have an account?</h6>
                    <Link to="/Login"><button>Login</button></Link>
                </form>
            </div>

        </div>
    );
};

export default CreateAccount;