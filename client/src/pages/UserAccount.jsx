import React from "react"
import "./account_landing.css";
import { Link, NavLink } from 'react-router-dom';

const UserAccount = () => {
    return (
        <div id="account-container">
            <div id="profile-container" class="acct-container">
                <section id="profile">
                    <h2>Hello, [FETCH USER]!</h2>
                </section>
            </div>
            <div id="account-content" class="acct-container">
                <section id="acctmovie-container" class="acct-container">
                    <section id="list-section">
                        <div id="favorite-list" class="list-container">
                            <h3>Your Favorite Movies</h3>
                            <p>No movies favorited!</p>
                        </div>
                        <div id="towatch-list" class="list-container">
                            <h3>Your Movies To Watch</h3>
                            <p>No movies planned to watch!</p>
                        </div>
                    </section>
                    <section id="movie-prefs" class="acct-container">
                        <div id="fav_genres" class="fav-container">
                            <h3>Placeholder</h3>
                        </div>
                        <div id="fav_actors" class="fav-container">
                            <h3>Placeholder</h3>
                        </div>
                    </section>
                    {/* <section id="recommender">
                        Give Me a ReelMatch!
                        <Link to ="/Quiz"><button>Take Our Quiz!</button></Link>
                    </section> */}
                </section>
            </div>
        </div>
    )
}

export default UserAccount