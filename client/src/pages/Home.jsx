import React from "react"
import logo from "../components/imgs/logo.png";
import { Link } from "react-router-dom";
import pulp from "../movie_pics/pulp-finction.jpg";
import war from "../movie_pics/WorldWarZ.jpg";
import avatar from "../movie_pics/avatar-poster.jpg";
import titanic from "../movie_pics/titanic.jpg";
import us from "../movie_pics/us-poster.jpg";
import mamma from "../movie_pics/Mamma-Mia-Poster.jpg";
import batman from "../movie_pics/The-Dark-Knight.jpg";
import silence from "../movie_pics/silence_of_the_lambs_0.jpg";
import starwars from "../movie_pics/star-wars-poster.jpg";
import ant from "../movie_pics/ant-man.jpg";
import things from "../movie_pics/10-things.jpg";
import hunger from "../movie_pics/hunger-games.jpg";

const Home = () => {
    return (
        <div className="Home">

            <div className="header">
                <img src={logo} alt="Reel Match Logo" className="logo" />
                <h3>ReelMatch</h3>
            </div>

            < div className="row">
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

                <div className="middle">

                </div>

                <div className="collage">

                    <div class="skewed">
                        <div className="row">
                            <div className="poster"><img src={pulp} alt="pulp fiction poster" /></div>
                            <div className="poster"><img src={war} alt="world war z poster" /></div>
                            <div className="poster"><img src={avatar} alt="avatar poster" /></div>
                            <div className="poster"><img src={titanic} alt="titanic fiction poster" /></div>
                        </div>

                        <div className="row">
                            <div className="poster"><img src={us} alt="us poster" /></div>
                            <div className="poster"><img src={mamma} alt="mamma mia poster" /></div>
                            <div className="poster"><img src={batman} alt="the dark knight poster" /></div>
                            <div className="poster"><img src={silence} alt="silence of the lambs poster" /></div>

                        </div>

                        <div className="row">
                            <div className="poster"><img src={starwars} alt="star wars poster" /></div>
                            <div className="poster"><img src={ant} alt="ant man poster" /></div>
                            <div className="poster"><img src={things} alt="10 things i hate about you poster" /></div>
                            <div className="poster"><img src={hunger} alt="hunger games poster" /></div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home