import React, { useEffect, useState } from "react"
import "./UserAccount.css";
import { Link, NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import useDropDown from "../components/UseDropDown";
import check from '../icon_pics/check.png';
import popcorn from '../icon_pics/popcorn_icon.png';
import movie_ticket from '../user-acct-pics/movie-ticket.png';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const UserAccount = () => {
    const {user_id} = useParams();
    const [movies, setMovies] = useState([]);
    const [actors, setActors] = useState([]);
    const [genres, setGenres] = useState([]);

    const [fav_genres, setFavGenres] = useState([]);
    const [fav_actors, setFavActors] = useState([]);

    const [wlMovies, setWatchList] = useState([]);
    const [completedMovies, setCompleted] = useState([]);
    const [profile, setProfile] = useState([]);
  
    const movieDropDown = useDropDown();
    const [searchInput, setSearchInput] = useState("");
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedMovies, setSelectedMovies] = useState([]);

    const actorDropDown = useDropDown();
    const [faInput, setFASearchInput] = useState("");
    const [filteredActors, setFilteredActors] = useState([]);
    const [selectedActors, setSelectedActors] = useState([]);
    
    const genreDropDown = useDropDown();
    const [fgInput, setFGSearchInput] = useState("");
    const [filteredGenres, setFilteredGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);

    useEffect(()=> {
        //fetching movies, actors, and genres for search funcs
        const getMovies = async () => {
            try {
                const res = await fetch('http://localhost:8800/movie');
                if (!res.ok) {
                    throw new Error('Network error')
                }
                const getData = await res.json();
                setMovies(getData);
                console.log( getData);
            } catch (error) {
                console.error("Couldn't fetch movie: ", error);
            }
        };
        getMovies();

        const getActors = async () => {
            try {
                const res = await fetch('http://localhost:8800/actor');
                if (!res.ok) {
                    throw new Error('Network error')
                }
                const getData = await res.json();
                setActors(getData);
                console.log( getData);
            } catch (error) {
                console.error("Couldn't fetch actor: ", error);
            }
        };
        getActors();

        const getGenres = async () => {
            try {
                const res = await fetch('http://localhost:8800/genre');
                if (!res.ok) {
                    throw new Error('Network error')
                }
                const getData = await res.json();
                setGenres(getData);
                console.log( getData);
            } catch (error) {
                console.error("Couldn't fetch genre: ", error);
            }
        };
        getGenres();

        //fetching user data to display on page
        const fetchProfile = async () =>{
            try{
                const res = await axios.get(`http://localhost:8800/p/${user_id}`);
                setProfile([res.data]);
                console.log(res.data);
            }catch(err){
                console.log("Failed to fetch profile info\nerror message: " + err);
            }
        }
        fetchProfile();
        // console.log(profile.full_name);
        // console.log(profile.age);

        //fetches favorite genres for list
        const fetchFavGenres = async ()=>{
            try{
                const res = await axios.get(`http://localhost:8800/fav_genres/${user_id}`)
                setFavGenres(res.data);
            }catch(err){
                console.log("Failed to fetch fav genres\nerror message:" + err);
            }
        }
        fetchFavGenres();

        //fetches favorite actors for list
        const fetchFavActors = async ()=> {
            try{
                const res = await axios.get(`http://localhost:8800/fav_actors/${user_id}`)
                setFavActors(res.data);
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
        const fetchCompleted = async ()=>{
            try{
                const res = await axios.get(`http://localhost:8800/completed_list/${user_id}`)
                setCompleted(res.data);

            }catch(err){
                console.log("Failed to fetch completed list\nerror message: " + err);
            }
        }
        fetchCompleted();
    },[user_id]);

    //movie watchlist handler functions
    const handleSearchInputChange = (event) => { setSearchInput(event.target.value); };
    //const handleItemSelect = (dropdownList, value) => dropdownList.selectList(value);
    useEffect(() => {
        const filtered = movies.filter(movie =>
            movie.title.toLowerCase().includes(searchInput.toLowerCase())
        ).slice(0, 10);
        setFilteredMovies(filtered);
    }, [searchInput, movies]);
        const handleMovieSelect = async (movie_id, title) => {
        setSelectedMovies(currSelectedMovies => {
            if (currSelectedMovies.includes(movie_id)) {
                return currSelectedMovies.filter(id => id !== movie_id);
            } else {
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
            window.location.reload();
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
        console.log("refreshing on del");
        window.location.reload();
    };
    const handleWLUpdate = async (watch_list_id) => {
        const dataToSubmit = {
            watch_list_id: watch_list_id,
        };
            console.log("data: " +  dataToSubmit.watch_list_id);
        try {
            console.log("before post call")
            const response = await axios.post('http://localhost:8800/updateList', dataToSubmit);
            console.log("****movie updated" + response.data);
        } catch (err) {
            console.log(err);
        }
        console.log("refreshing on update");
        window.location.reload();
    };

    //favorite actor handler functions
    const handleFASearchInputChange = (event) => { setFASearchInput(event.target.value); };
    //const handleItemSelect = (dropdownList, value) => dropdownList.selectList(value);
    useEffect(() => {
        const filtered = actors.filter(actor =>
            actor.actor_name.toLowerCase().includes(faInput.toLowerCase())
        ).slice(0, 10);
        setFilteredActors(filtered);
    }, [faInput, actors]);
        const handleActorSelect = async (actor_id, title) => {
        setSelectedActors(currSelectedActors => {
            if (currSelectedActors.includes(actor_id)) {
                return currSelectedActors.filter(id => id !== actor_id);
            } else {
                return [...currSelectedActors, actor_id];
            }
        });

        // if(newSelection){
            const dataToSubmit = {
            user_id: user_id,
            actor_id: actor_id,
            };
            console.log("data: " +  dataToSubmit.actor_id);
            try {
                console.log("before post call")
                const response = await axios.post('http://localhost:8800/submitToFavActors', dataToSubmit);
                console.log("****actor submitted" + response.data);
            } catch (err) {
                console.log(err);
            }
            window.location.reload();
        // }
    };

    const handleFADelete = async (actor_id) => {
        const dataToSubmit = {
            user_id: user_id,
            actor_id: actor_id,
        };
            console.log("data: " +  dataToSubmit);
        try {
            console.log("before post call")
            const response = await axios.post('http://localhost:8800/deleteFavActor', dataToSubmit);
            console.log("****fav actor deleted" + response.data);
        } catch (err) {
            console.log(err);
        }
        console.log("refreshing on del");
        window.location.reload();
    };

    //favorite genre handler functions
    const handleFGSearchInputChange = (event) => { setFGSearchInput(event.target.value); };
    //const handleItemSelect = (dropdownList, value) => dropdownList.selectList(value);
    useEffect(() => {
        const filtered = genres.filter(genre =>
            genre.genre_name.toLowerCase().includes(fgInput.toLowerCase())
        ).slice(0, 10);
        setFilteredGenres(filtered);
    }, [fgInput, genres]);
        const handleGenreSelect = async (genre_id, title) => {
        setSelectedGenres(currSelectedGenres => {
            if (currSelectedGenres.includes(genre_id)) {
                return currSelectedGenres.filter(id => id !== genre_id);
            } else {
                return [...currSelectedGenres, genre_id];
            }
        });

        // if(newSelection){
            const dataToSubmit = {
            user_id: user_id,
            genre_id: genre_id,
            };
            console.log("data: " +  dataToSubmit);
            try {
                console.log("before post call")
                const response = await axios.post('http://localhost:8800/submitToFavGenres', dataToSubmit);
                console.log("****genre submitted" + response.data);
            } catch (err) {
                console.log(err);
            }
            window.location.reload();
        // }
    };

    const handleFGDelete = async (genre_id) => {
        const dataToSubmit = {
            user_id: user_id,
            genre_id: genre_id,
        };
            console.log("data: " +  dataToSubmit);
        try {
            console.log("before post call")
            const response = await axios.post('http://localhost:8800/deleteFavGenre', dataToSubmit);
            console.log("****fav genre deleted" + response.data);
        } catch (err) {
            console.log(err);
        }
        console.log("refreshing on del");
        window.location.reload();
    };

    return (
        <div id="account-container">
            <div id="profile-container" class="profile-acct-container">
                <div className= "default-icon-user">
                    <img className="cute-popcorn" src={popcorn} alt="popcorn"></img>
                    <img className="movie-ticket" src={movie_ticket} alt="movie-ticket"></img>
                </div>
                <section id="profile">
                    {profile.map((person)=>(
                        <section className="profile-info" key={person.user_id}>
                            <div id="pText">
                                <div className="pName">{person.full_name}</div>
                                <div className="pAge">{person.age}</div>
                                {/* <div className="reel-mood">Reel Mood
                                <div className="type-mood">
                                    <input className = "input-mood"placeholder="Type your status"></input>
                                </div>
                                </div> */}
                            </div>
                        </section>
                    ))}
                    {/* <h2>Hello, {profile.full_name}!</h2> */}
                </section>
            </div>
            <div id="account-content" class="acct-container">
                <section id="acctmovie-container" class="acct-container">
                    <section id="list-section">
                        <div id="completed-list" class="list-container">
                            <h3>Your Completed Movies</h3>
                            {/* <p>No movies favorited!</p> */}
                            {completedMovies.map((movie)=>(
                                <div class="movie" key={movie.watch_list_id}>
                                    <p>
                                        <button onClick={() => handleWLDelete(movie.watch_list_id)}><DeleteIcon/></button>
                                        {movie.title}
                                    </p>
                                </div>
                            ))}
                        </div>
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
                                    <div class="movie" key={movie.watch_list_id}>
                                        <p>
                                            <button onClick={()=> handleWLUpdate(movie.watch_list_id)} class="completebtn"><CheckIcon/>Complete</button>
                                            <button onClick={() => handleWLDelete(movie.watch_list_id)} class="deletebtn"><DeleteIcon/></button>
                                            {movie.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                    </section>

                <section id="movie-prefs" class="acct-container">

                    <div className="fav-title" class="fav-container">
                        <h3>Favorite Genres</h3>
                        <div class="dropdown">
                                {/* <button onclick={movieDropDown.toggleList}class="dropbtn">Add a Movie</button> */}
                                <input
                                type="text"
                                className="search-bar"
                                placeholder="Search Genres..."
                                value={fgInput}
                                onChange={handleFGSearchInputChange}
                            />
                            {/* Display filtered actors */}
                            {fgInput && (
                                <ul className="movie-list">
                                    {filteredGenres.slice(0, 10).map((genre) => (
                                        <li
                                            key={genre.genre_id}
                                            className={`movie-item ${selectedGenres.includes(genre.genre_id) ? 'selected' : ''}`}
                                            onClick={() => handleGenreSelect(genre.genre_id)}
                                        >
                                            <span className={`check-pic ${selectedGenres.includes(genre.genre_id) ? '' : 'check-pic-hidden'}`}>
                                                <img src={check} alt="Check" width="10" height="10" />
                                            </span>
                                            <span className="movie-item-text">{genre.genre_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            </div>

                            {/* <p>No movies planned to watch!</p> */}
                            <div className="selected-movies">
                                <ul className="selected-movies-list">
                                    {selectedGenres.map((genre_id) => (
                                        <li key={genre_id} className="selected-movie-item">
                                            {genres.find((genre) => genre.genre_id === genre_id)?.genre_name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <ul className="genreList">
                                {fav_genres.map((genre)=>(
                                    <li className="genre" key={genre.genre_id}>
                                        <button onClick={() => handleFGDelete(genre.genre_id)}><DeleteIcon/></button>
                                        {genre.genre_name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div id="fav_actors" class="fav-container">
                            <h3>Favorite Actors</h3>
                            <div class="dropdown">
                                {/* <button onclick={movieDropDown.toggleList}class="dropbtn">Add a Movie</button> */}
                                <input
                                type="text"
                                className="search-bar"
                                placeholder="Search Actors..."
                                value={faInput}
                                onChange={handleFASearchInputChange}
                            />
                            {/* Display filtered actors */}
                            {faInput && (
                                <ul className="movie-list">
                                    {filteredActors.slice(0, 10).map((actor) => (
                                        <li
                                            key={actor.actor_id}
                                            className={`movie-item ${selectedActors.includes(actor.actor_id) ? 'selected' : ''}`}
                                            onClick={() => handleActorSelect(actor.actor_id)}
                                        >
                                            <span className={`check-pic ${selectedActors.includes(actor.actor_id) ? '' : 'check-pic-hidden'}`}>
                                                <img src={check} alt="Check" width="10" height="10" />
                                            </span>
                                            <span className="movie-item-text">{actor.actor_name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            </div>

                            {/* <p>No movies planned to watch!</p> */}
                            <div className="selected-movies">
                                <ul className="selected-movies-list">
                                    {selectedActors.map((actor_id) => (
                                        <li key={actor_id} className="selected-movie-item">
                                            {actors.find((actor) => actor.actor_id === actor_id)?.actor_name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <ul className="actorList">
                                {fav_actors.map((actor)=>(
                                    <li className="actor" key={actor.actor_id}>
                                        <button onClick={() => handleFADelete(actor.actor_id)}><DeleteIcon/></button>
                                        {actor.actor_name}
                                    </li>
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