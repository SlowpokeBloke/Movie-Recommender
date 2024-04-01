import React from "react"
import { Link, NavLink } from 'react-router-dom';

const UserAccount = () => {
    return (
        <div name="profile-container" class="container">
            <h1>User Account</h1>
            <div id="profile">
                <h2>Hello, [FETCH USER]!</h2>
            </div>
            <div id="list-container">
                <div id="list">sample list</div>
            </div>
            <div id="recommender">
                Give Me a ReelMatch!
                <Link to ="/Quiz"><button>Take Our Quiz!</button></Link>
            </div>
        </div>
    )
}

export default UserAccount