import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./Quiz.css";
import "../components/UseDropDown"
import down from '../icon_pics/down.png';
import check from '../icon_pics/check.png';
import film1 from '../icon_pics/film1.png';
import film from '../icon_pics/film.png';
import videography from '../icon_pics/videography.png';
import cinema from '../icon_pics/cinema-clapboard.png'
import useDropDown from "../components/UseDropDown";
import { useNavigate, useParams } from "react-router-dom";
const Quiz = () => {
    const [night_type, setNightType] = useState({
        Date_night: false,
        Solo_night: false,
        Friends_night: false,
        Family_night: false
    });

    const handleCheckbox = event => {
        console.log("Type of night: ", event.target.value)
        const { value, checked } = event.target;
        const newState = {
            Date_night: false,
            Solo_night: false,
            Friends_night: false,
            Family_night: false
        };
        if (checked) {
            newState[value] = true;
        }
        setNightType(newState);

    };
    // navigation
    const navigate = useNavigate();


    // drop down lists
    const actorDropDown = useDropDown();
    const genreDropDown = useDropDown();
    const ratingDropDown = useDropDown();
    const releaseDateDropDown = useDropDown();

    // selected value in specific drop down list
    const handleItemSelect = (dropdownList, value) => dropdownList.selectList(value);
    // fetching data from genre and actors
    const [genres, setGenres] = useState([]);
    const [actors, setActors] = useState([]);
    useEffect(() => {
        const getGenre = async () => {
            try {
                const res = await fetch('http://localhost:8800/genre');
                if (!res.ok) {
                    throw new Error('Network error')
                }
                const getData = await res.json();
                setGenres(getData);
                console.log(getData);
            } catch (error) {
                console.error("Couldn't fetch genre: ", error);
            }
        };
        const getActor = async () => {
            const res = await fetch('http://localhost:8800/actor');
            try {
                if (!res.ok) {
                    throw new Error('Network error')
                }
                const getData = await res.json();
                setActors(getData);
                console.log(getData);
            } catch (error) {
                console.error("Couldn't fetch actor: ", error);
            }
        };


        getGenre();
        getActor();
    }, []);


    // selected genres which holds the array of values
    const [selectedGenres, setSelectedGenres] = useState([]);
    // multiple selected values 
    const handleGenreSelect = (genre_id) => {
        setSelectedGenres((currSelectedGenres) => {
            if (currSelectedGenres.includes(genre_id)) {
                {/* removes genre from selection once selected */ }
                return currSelectedGenres.filter(id => id !== genre_id);
            } else {
                return [...currSelectedGenres, genre_id];
            }
        });
    };

    const [searchInput, setSearchInput] = useState("");
    const [filteredActors, setFilteredActors] = useState([]);
    const [selectedActors, setSelectedActors] = useState([]);

    // Function to handle changes in the search input
    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    // Function to filter actors based on search input
    useEffect(() => {
        const filtered = actors.filter(actor =>
            actor.actor_name.toLowerCase().includes(searchInput.toLowerCase())
        ).slice(0, 10);
        setFilteredActors(filtered);
    }, [searchInput, actors]);

    // Function to handle selection of an actor
    const handleActorSelect = (actor_id, actor_name) => {
        setSelectedActors(currSelectedActors => {
            if (currSelectedActors.includes(actor_id)) {
                return currSelectedActors.filter(id => id !== actor_id);
            } else {
                return [...currSelectedActors, actor_id];
            }
        });
    };

    // details for form
    const selectedNightType = Object.keys(night_type).filter(key => night_type[key]);
    const [formSubmitted, setFormSubmitted] = useState(false);
    //contains user_id
    //debugging
    const { user_id} = useParams();
    console.log(useParams());
    console.log("user_id from useParams:", user_id);


    //submitting form
    const handleSubmit = async (e) => {
        e.preventDefault();
        //debugging
        console.log("handleSubmit called");
        if (formSubmitted) {
            console.log("Form already submitted. Preventing multiple submissions.");
            return;
        }
        console.log("Proceeding with form submission...");

        const dataToSubmit = {
            user_id: user_id,
            nightType: selectedNightType[0],
            genreType: selectedGenres,
            actorType: selectedActors,
            releaseDate: releaseDateDropDown.selectedValue,
            ratingChosen: ratingDropDown.selectedValue,
        };

        console.log("Submitting the following data:", dataToSubmit);
        setFormSubmitted(true);

        // true navigation w/params
        try {
            console.log("Submitting quiz for user_id:", user_id);
            const response = await axios.post('http://localhost:8800/submitQuiz', dataToSubmit);
            console.log("Quiz API Response:", response.data);
            if (response.data.status === "Success") {
                // shows user_id in navigation as a token ot pass user_id 
               // console.log(`Navigating to Selection with user_id: ${user_id} and selection_id: ${selection_id}`);
                 //fetches selection_id from backend
                 const {selection_id} = response.data;
                navigate(`/Selection/${user_id}/${selection_id}`);

            } else {
                console.error("Submission failed with status:", response.data.status);
                setFormSubmitted(false);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setFormSubmitted(false);
        }
    };


    return (
        <div className="container-wrapper">
            <form onSubmit={handleSubmit}>
                <div className="pics-above-container">
                    <img className="icons-above" src={film} alt="film"></img>
                    <img className="icons-above2" src={videography} alt="videog"></img>
                    <img className="icons-above" src={cinema} alt="cinema"></img>
                </div>
                <div className="parent-container-film">
                    <div className="film-wrapper-left">
                        <img className="film-wrap" src={film1} alt="film1"></img>
                    </div>
                    <div className="film-wrapper-left2">
                        <img className="film-wrap" src={film1} alt="film1"></img>
                    </div>
                    <div className="film-wrapper-left3">
                        <img className="film-wrap" src={film1} alt="film1"></img>
                    </div>
                    <div className="film-wrapper-left4">
                        <img className="film-wrap" src={film1} alt="film1"></img>
                    </div>
                    <div className="film-wrapper-left5">
                        <img className="film-wrap" src={film1} alt="film1"></img>
                    </div>
                    <div className="film-wrapper-left6">
                        <img className="film-wrap" src={film1} alt="film1"></img>
                    </div>
                    <div className="film-wrapper-left7">
                        <img className="film-wrap" src={film1} alt="film1"></img>
                    </div>
                    <div className="film-wrapper-left8">
                        <img className="film-wrap" src={film1} alt="film1"></img>
                    </div>
                    <div className="film-wrapper-right">
                        <img className="film-wrap" src={film1} alt="film2"></img>
                    </div>
                    <div className="film-wrapper-right2">
                        <img className="film-wrap" src={film1} alt="film2"></img>
                    </div>
                    <div className="film-wrapper-right3">
                        <img className="film-wrap" src={film1} alt="film2"></img>
                    </div>
                    <div className="film-wrapper-right4">
                        <img className="film-wrap" src={film1} alt="film2"></img>
                    </div>
                    <div className="film-wrapper-right5">
                        <img className="film-wrap" src={film1} alt="film2"></img>
                    </div>
                    <div className="film-wrapper-right6">
                        <img className="film-wrap" src={film1} alt="film2"></img>
                    </div>
                    <div className="film-wrapper-right7">
                        <img className="film-wrap" src={film1} alt="film2"></img>
                    </div>
                    <div className="film-wrapper-right8">
                        <img className="film-wrap" src={film1} alt="film2"></img>
                    </div>
                    <div className="container">

                        <div className="title">Questionnaire</div>
                        <div className="night-container"><span className="question">What type of movie night are you having?</span>
                            <p className="box"><input onChange={handleCheckbox} type='checkbox' name="night_type" value="Date_night" checked={night_type.Date_night}></input>Date night</p>
                            <p className="box"><input onChange={handleCheckbox} type='checkbox' name="night_type" value="Solo_night" checked={night_type.Solo_night}></input>Solo night</p>
                            <p className="box"><input onChange={handleCheckbox} type='checkbox' name="night_type" value="Friends_night" checked={night_type.Friends_night}></input><span className="friend">Friends night</span></p>
                            <p className="box"><input onChange={handleCheckbox} type='checkbox' name="night_type" value="Family_night" checked={night_type.Family_night}></input><span className="family">Family night</span></p>
                        </div>

                        <div className="genre-container"><span className="question">What genre are you interested in?</span>
                            {/*Recognize that created buttons are of a button type and not confused with the submission button*/}
                            <button type="button" className="select-genre-button" onClick={genreDropDown.toggleList}>Select Genres
                                <img className="down-pic" src={down} alt="Down"></img>
                            </button>
                            {/*Mapping genres ids to names */}
                            <ul className="list-items" style={{ display: genreDropDown.isOpen ? 'block' : 'none' }}>
                                {
                                    genres.map((getgenres) => (
                                        <li key={getgenres.genre_id} className="item" onClick={() => handleGenreSelect(getgenres.genre_id, getgenres.genre_name)}>
                                            <span className="checkboxes">
                                                {/*Ensuring the checkmark is small and only shows checks for selected genres*/}
                                                <img className={`check-pic ${selectedGenres.includes(getgenres.genre_id) ? '' : 'check-pic-hidden'}`} src={check} alt="Check" width="10" height="10"></img>
                                            </span>
                                            <span className="item-text">{getgenres.genre_name}</span>
                                        </li>
                                    )
                                    )
                                }
                            </ul>

                        </div>

                        <div className="actors-container">
                            <span className="question">What actors are you interested in?</span>
                            <span className="explanation">Search actor's names and select to save. To delete unselect the actor. </span>
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search Actors..."
                                value={searchInput}
                                onChange={handleSearchInputChange}
                            />
                            {/* Display filtered actors */}
                            {searchInput && (
                                <ul className="actor-list">
                                    {filteredActors.slice(0, 10).map((actor) => (
                                        <li
                                            key={actor.actor_id}
                                            className={`actor-item ${selectedActors.includes(actor.actor_id) ? 'selected' : ''}`}
                                            onClick={() => handleActorSelect(actor.actor_id)}
                                        >
                                            <span className={`check-pic ${selectedActors.includes(actor.actor_id) ? '' : 'check-pic-hidden'}`}>
                                                <img src={check} alt="Check" width="10" height="10" />
                                            </span>
                                            <span className="actor-item-text">{actor.actor_name}</span>
                                            
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        {/* Display selected actors */}
                        <div className="selected-actors">
                            <span>Selected actors:</span>
                            <ul className="selected-actors-list">
                                {selectedActors.map((actorId) => (
                                    <li key={actorId} className="selected-actor-item">
                                        {actors.find((actor) => actor.actor_id === actorId)?.actor_name}
                                    </li>
                                ))}
                            </ul>
                        </div>


                        {/*Movie preference for release date*/}
                        <div className="date-container"><span className="question">Do you have a preference for the release date of the movie?</span>
                            <button type="button" className="select-release-date-button" onClick={releaseDateDropDown.toggleList} >Select Release Date
                                <img className="down-pic" src={down} alt="Down"></img>
                            </button>
                            { /* only shows list if the button is clicked */}
                            <ul className="list-items" style={{ display: releaseDateDropDown.isOpen ? 'block' : 'none' }}>
                                {/* one item selected in list */}
                                <li className="item" onClick={() => handleItemSelect(releaseDateDropDown, "Released in the last 10 years")}>
                                    <span className="checkboxes">
                                        <img className={`check-pic ${releaseDateDropDown.selectedValue === "Released in the last 10 years" ? '' : 'check-pic-hidden'}`} src={check} alt="Check"></img>
                                    </span>
                                    <span className="item-text">Released in the last 10 years</span>
                                </li>
                                <li className="item" onClick={() => handleItemSelect(releaseDateDropDown, "Released in the last 20 years")}>
                                    <span className="checkboxes">
                                        <img className={`check-pic ${releaseDateDropDown.selectedValue === "Released in the last 20 years" ? '' : 'check-pic-hidden'}`} src={check} alt="Check"></img>
                                    </span>
                                    <span className="item-text">Released in the last 20 years</span>
                                </li>
                                <li className="item" onClick={() => handleItemSelect(releaseDateDropDown, "Any release date")}>
                                    <span className="checkboxes">
                                        <img className={`check-pic ${releaseDateDropDown.selectedValue === "Any release date" ? '' : 'check-pic-hidden'}`} src={check} alt="Check"></img>
                                    </span>
                                    <span className="item-text">Any release date</span>
                                </li>
                            </ul>
                        </div>
                        <div className="rating-container"><span className="question">Do you have a preferred movie rating?</span>
                            <button type="button" className="select-rating-button" onClick={ratingDropDown.toggleList}>Select Rating
                                <img className="down-pic" src={down} alt="Down"></img>
                            </button>
                            <ul className="list-items" style={{ display: ratingDropDown.isOpen ? 'block' : 'none' }}>
                                <li className="item" onClick={() => handleItemSelect(ratingDropDown, "High Ratings")}>
                                    <span className="checkboxes">
                                        <img className={`check-pic ${ratingDropDown.selectedValue === "High Ratings" ? '' : 'check-pic-hidden'}`} src={check} alt="Check"></img>
                                    </span>
                                    <span className="item-text">High Ratings</span>
                                </li>
                                <li className="item" onClick={() => handleItemSelect(ratingDropDown, "Low Ratings")}>
                                    <span className="checkboxes">
                                        <img className={`check-pic ${ratingDropDown.selectedValue === "Low Ratings" ? '' : 'check-pic-hidden'}`} src={check} alt="Check"></img>
                                    </span>
                                    <span className="item-text">Low Ratings</span>
                                </li>

                                <li className="item">
                                    <span className="checkboxes" onClick={() => handleItemSelect(ratingDropDown, "Any Ratings")}>
                                        <img className={`check-pic ${ratingDropDown.selectedValue === "Any Ratings" ? '' : 'check-pic-hidden'}`} src={check} alt="Check"></img>
                                    </span>
                                    <span className="item-text">Any Ratings</span>
                                </li>
                            </ul>
                        </div>
                        <button className="submit-button" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default Quiz