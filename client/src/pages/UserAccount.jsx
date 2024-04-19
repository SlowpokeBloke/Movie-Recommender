import React, { useEffect, useState } from "react"
import "./UserAccount.css";
import { Link, NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import useDropDown from "../components/UseDropDown";
import check from '../icon_pics/check.png';

const UserAccount = () => {
    const {user_id} = useParams();
    const [movies, setMovies] = useState([]);
    const [wlMovies, setWatchList] = useState([]);
    const [fav_genres, setGenres] = useState([]);
    const [fav_actors, setActors] = useState([]);

    const [profile, setProfile] = useState([]);
    useEffect(()=> {

        const fetchProfile = async () =>{
            try{
                const res = await axios.get(`http://localhost:8800/p/${user_id}`);
                setProfile(res.data);
                console.log(res.data);
            }catch(err){
                console.log("Failed to fetch profile info\nerror message: " + err);
            }
        }
        fetchProfile();
        console.log(profile.full_name);
        console.log(profile.age);
        //fetches favorite genres for list
        const fetchFavGenres = async ()=>{
            try{
                const res = await axios.get(`http://localhost:8800/fav_genres/${user_id}`)
                setGenres(res.data);
            }catch(err){
                console.log("Failed to fetch fav genres\nerror message:" + err);
            }
        }
        fetchFavGenres();
        //fetches favorite actors for list
        const fetchFavActors = async ()=> {
            try{
                const res = await axios.get(`http://localhost:8800/fav_actors/${user_id}`)
                setActors(res.data);
            }catch(err){
                console.log("Failed to fetch fav actors\nerror message: " + err);
            }
        }
        fetchFavActors();

        const fetchWatchList = async ()=>{
            try{
                const res = await axios.get(`http://localhost:8800/watch_list/${user_id}`)
                setWatchList(res.data);

            }catch(err){
                console.log("Failed to fetch watchlist\nerror message: " + err);
            }
        }
        fetchWatchList();
    },[user_id]);

    const movieDropDown = useDropDown();
    const [searchInput, setSearchInput] = useState("");
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);

    const handleSearchInputChange = (event) => {setSearchInput(event.target.value);};
    //const handleItemSelect = (dropdownList, value) => dropdownList.selectList(value);
    useEffect(() => {
        const filtered = movies.filter(movie =>
            movie.title.toLowerCase().includes(searchInput.toLowerCase())
        ).slice(0, 10);
        setFilteredMovies(filtered);
    }, [searchInput, movies]);
    const handleMovieSelect = (movie_id, title) => {
        setSelectedMovies(currSelectedMovies => {
            if (currSelectedMovies.includes(movie_id)) {
                return currSelectedMovies.filter(id => id !== movie_id);
            } else {
                return [...currSelectedMovies, movie_id];
            }
        });
    };
    return (
        <div id="account-container">
            <div id="profile-container" class="acct-container">
                <section id="profile">
                    {profile.map((p)=>(
                        <section className="profile-info" key={p.user_id}>
                            <h2 className="pName">{p.full_name}</h2>
                            <h3 className="pAge">{p.age}</h3>
                        </section>
                    ))}
                    {/* <h2>Hello, {profile.full_name}!</h2> */}
                </section>
            </div>
            <div id="account-content" class="acct-container">
                <section id="acctmovie-container" class="acct-container">
                    <section id="list-section">
                        {/* <div id="favorite-list" class="list-container">
                            <h3>Your Favorite Movies</h3>
                            <p>No movies favorited!</p>
                        </div> */}
                        <div id="towatch-list" class="list-container">
                            <h3>Your Movie Watchlist</h3>
                            <div class="dropdown">
                                {/* <button onclick={movieDropDown.toggleList}class="dropbtn">Add a Movie</button> */}
                                <input
                                type="text"
                                className="search-bar"
                                placeholder="Search Movies..."
                                value={searchInput}
                                onChange={handleSearchInputChange}
                            />
                            {/* Display filtered movies */}
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

                            {/* <p>No movies planned to watch!</p> */}
                            <div className="selected-movies">
                            <ul className="selected-movies-list">
                                {selectedMovies.map((movie_id) => (
                                    <li key={movie_id} className="selected-movie-item">
                                        {movies.find((movie) => movie.movie_id === movie_id)?.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                                {wlMovies.map((movie)=>(
                                    <div class="movie" key={movie.movie_id}>
                                        <p>{movie.title} <button onClick={null}>Del</button></p>
                                    </div>
                                ))}
                        </div>
                    </section>
                    <section id="movie-prefs" class="acct-container">
                        <div id="fav_genres" class="fav-container">
                            <h3>Favorite Genres</h3>

                            <ul className="genreList">
                                {fav_genres.map((genre)=>(
                                    <li className="genre" key={genre.genre_id}>{genre.genre_name}</li>
                                ))}
                            </ul>

                        </div>
                        <div id="fav_actors" class="fav-container">
                            <h3>Favorite Actors</h3>
                            <ul className="actorList">
                                {fav_actors.map((actor)=>(
                                    <li className="actor" key={actor.actor_id}>{actor.actor_name}</li>
                                ))}
                            </ul>

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