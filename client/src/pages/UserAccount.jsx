import React, { useEffect, useState } from "react"
import "./UserAccount.css";
import { Link, NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import useDropDown from "../components/UseDropDown";
import check from '../icon_pics/check.png';
import popcorn from '../icon_pics/popcorn_icon.png';
import movie_ticket from '../user-acct-pics/movie-ticket.png';
import romance from '../user-acct-pics/romance.png';
import moviestar from '../user-acct-pics/movie_star.png';


const UserAccount = () => {
    const { user_id } = useParams();
    const [movies, setMovies] = useState([]);
    const [wlMovies, setWatchList] = useState([]);
    const [fav_genres, setGenres] = useState([]);
    const [fav_actors, setActors] = useState([]);

    const [profile, setProfile] = useState([]);
    useEffect(()=> {

        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/p/${user_id}`);
                setProfile([res.data]);
                console.log(res.data);
            } catch (err) {
                console.log("Failed to fetch profile info\nerror message: " + err);
            }
        }
        fetchProfile();
        console.log(profile.full_name);
        console.log(profile.age);
        //fetches favorite genres for list
        const fetchFavGenres = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/fav_genres/${user_id}`)
                setGenres(res.data);
            } catch (err) {
                console.log("Failed to fetch fav genres\nerror message:" + err);
            }
        }
        fetchFavGenres();
        //fetches favorite actors for list
        const fetchFavActors = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/fav_actors/${user_id}`)
                setActors(res.data);
            } catch (err) {
                console.log("Failed to fetch fav actors\nerror message: " + err);
            }
        }
        fetchFavActors();

        const fetchWatchList = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/watch_list/${user_id}`)
                setWatchList(res.data);

            } catch (err) {
                console.log("Failed to fetch watchlist\nerror message: " + err);
            }
        }
        fetchWatchList();
    }, [user_id]);

    const movieDropDown = useDropDown();
    const [searchInput, setSearchInput] = useState("");
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);

    const handleSearchInputChange = (event) => {setSearchInput(event.target.value);};
    useEffect(() => {
        const filtered = movies.filter(movie =>
            movie.title.toLowerCase().includes(searchInput.toLowerCase())
        ).slice(0, 10);
        setFilteredMovies(filtered);
    }, [searchInput, movies]);
    const handleMovieSelect = async (movie_id, title) => {
        var newSelection=false;
        console.log("movie id: " + movie_id);
        setSelectedMovies(currSelectedMovies => {
            if (currSelectedMovies.includes(movie_id)) {
                newSelection=false;
                console.log("inside filter;expected false: "+newSelection)
                return currSelectedMovies.filter(id => id !== movie_id);
            } else {
                newSelection=true;
                console.log("inside filter;expected true: "+newSelection)
                return [...currSelectedMovies, movie_id];
            }
        });

        // if(newSelection){
            const dataToSubmit = {
            user_id: user_id,
            movie_id: movie_id,
            };
            console.log("data: " +  dataToSubmit.movie_id);
            try {
                console.log("before post call")
                const response = await axios.post('http://localhost:8800/submitToList', dataToSubmit);
                console.log("****movie submitted" + response.data);
            } catch (err) {
                console.log(err);
            }
        // }
    };
    const handleWLDelete = async (watch_list_id) => {
        const dataToSubmit = {
            watch_list_id: watch_list_id,
        };
            console.log("data: " +  dataToSubmit.watch_list_id);
        try {
            console.log("before post call")
            const response = await axios.post('http://localhost:8800/deleteFromList', dataToSubmit);
            console.log("****movie deleted" + response.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
        <div id="account-container">
            <div id="profile-container" class="acct-container">
                <div className="default-icon-user">
                    <img className="cute-popcorn" src={popcorn} alt="popcorn"></img>
                    <img className="movie-ticket" src={movie_ticket} alt="movie-ticket"></img>
                </div>
                <section id="profile">

                    {profile.map((person) => (
                        <section className="profile-info" key={person.user_id}>
                            <div className="pName">{person.full_name}</div>
                            <div className="pAge">{person.age}</div>
                            <div className="reel-mood">Reel Mood
                                <div className="type-mood">
                                    <input className="input-mood" placeholder="Type your status"></input>
                                </div>
                            </div>
                        </section>
                    ))}
                    {/* <h2>Hello, {profile.full_name}!</h2> */}
                </section>
            </div>

            <div id="account-content" class="acct-container">

                <h2 className="completed-heading-with-image">
                    Completed
                    <img src={require("../user-acct-pics/stars.png")} alt="stars" className="image" />
                </h2>

                <section id="acctmovie-container">

                    {/* <div id="favorite-list" class="list-container">
                            <h3>Your Favorite Movies</h3>
                            <p>No movies favorited!</p>
                        </div> */}
                    <div class="dropdown">
                        <div className="features">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Type your movies..."
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <div  className="basic-buttons">
                        <button className="add-button">Add</button>
                        <button className="delete-button">Delete</button>
                        </div>
                        </div>
                        {/* Display filtered actors */}
                        {searchInput && (
                            <ul className="movie-list">
                                {filteredMovies.slice(0, 10).map((movie) => (
                                    <li
                                        key={movie.movie_id}
                                        className={`movie-item ${selectedMovies.includes(movie.movie_id) ? 'selected' : ''}`}
                                        onClick={() => handleMovieSelect(movie.movie_id)}
                                    >
                                        <span className={`check-pic ${selectedMovies.includes(movie.movie_id) ? '' : 'check-pic-hidden'}`}>
                                            <img src={check} alt="Check" width="10" height="10" />
                                        </span>
                                        <span className="movie-item-text">{movie.title}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>


                </section>


                <h2 className="plan-heading-with-image">
                    Plan to Watch
                    <img src={require("../user-acct-pics/3d-glasses.png")} alt="3d-glasses" className="image" />
                </h2>


                <section id="acctmovie-container">

                    {/* <div id="favorite-list" class="list-container">
                            <h3>Your Favorite Movies</h3>
                            <p>No movies favorited!</p>
                        </div> */}
                    <div class="dropdown">
                        <input
                            type="text"
                            className="search-bar"
                            placeholder="Type your movies..."
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <div className="basic-buttons">
                        <button className="add-button">Add</button>
                        <button className="delete-button">Delete</button>
                        </div>
                        {/* Display filtered actors */}
                        {searchInput && (
                            <ul className="movie-list">
                                {filteredMovies.slice(0, 10).map((movie) => (
                                    <li
                                        key={movie.movie_id}
                                        className={`movie-item ${selectedMovies.includes(movie.movie_id) ? 'selected' : ''}`}
                                        onClick={() => handleMovieSelect(movie.movie_id)}
                                    >
                                        <span className={`check-pic ${selectedMovies.includes(movie.movie_id) ? '' : 'check-pic-hidden'}`}>
                                            <img src={check} alt="Check" width="10" height="10" />
                                        </span>
                                        <span className="movie-item-text">{movie.title}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                </section>
                        {wlMovies.map((movie)=>(
                                    <div class="movie" key={movie.watch_list_id}>
                                        <p>{movie.title} <button onClick={() => handleWLDelete(movie.watch_list_id)}>Del</button></p>
                                    </div>
                                ))}
                        </div>

                <section id="movie-prefs" class="acct-container">

                    <div className="fav-title">
                        <h2>Favorite Genres</h2>
                        <div id="fav_genres" class="fav-container">
                            <img src={romance} alt="heart with reel" className="romance" />
                            <ul className="genreList">
                                {fav_genres.map((genre) => (
                                    <li className="genre" key={genre.genre_id}>{genre.genre_name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="fav-title">
                        <h2>Favorite Actors</h2>
                        <div id="fav_actors" class="fav-container">
                            <ul className="actorList">
                                {fav_actors.map((actor) => (
                                    <li className="actor" key={actor.actor_id}>{actor.actor_name}</li>
                                ))}
                            </ul>
                            <img src={moviestar} alt="fabulous movie star" className="movie-star" />

                        </div>
                    </div>


                </section>


            </div>
        </div>
    )
}
export default UserAccount