import React from "react"
import "./account_landing.css";
import { Link, NavLink } from 'react-router-dom';

const UserAccount = () => {
    return (
        <div name="account-container" class="page-container">
            <h1>User Account</h1>
            <div id="profile-container" class="container">
                <section id="profile">
                    <h2>Hello, [FETCH USER]!</h2>
                </section>
                <section id="acctmovie-container">
                    <section id="list-container">
                        <div id="favorite-list" class="list">
                            <h3>Your Favorite Movies</h3>
                            <p>No movies favorited!</p>
                        </div>
                        <div id="towatch-list" class="list">
                            <h3>Your Movies To Watch</h3>
                            <p>No movies planned to watch!</p>
                        </div>
                    </section>
                    <section id="recommender">
                        Give Me a ReelMatch!
                        <Link to ="/Quiz"><button>Take Our Quiz!</button></Link>
                    </section>
                </section>
            </div>
        </div>
    )
}

export default UserAccount