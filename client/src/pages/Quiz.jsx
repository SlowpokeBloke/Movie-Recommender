import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./Quiz.css";
import "../components/UseDropDown"
import down from '../components/imgs/down.png';
import check from '../components/imgs/check.png';
import film1 from '../components/imgs/film1.png';
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
        if (checked){
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
    useEffect(()=>{
        const getGenre = async ()=>{
        try{
            const res= await fetch('http://localhost:8800/genre');
            if(!res.ok){
                throw new Error('Network error')
            }
            const getData= await res.json();
            setGenres(getData);
            console.log(getData);
        } catch(error){
            console.error("Couldn't fetch genre: ", error);
        }
        };
        const getActor = async ()=>{
            const res= await fetch('http://localhost:8800/actor');
        try{
            if(!res.ok){
                throw new Error('Network error')
            }
            const getData= await res.json();
            setActors(getData);
            console.log(getData);
        }catch(error){
            console.error("Couldn't fetch actor: ", error);
        }
        };

        
        getGenre();
        getActor();
    },[]);

    
    // selected genres which holds the array of values
    const [selectedGenres, setSelectedGenres] = useState([]);
    // multiple selected values 
    const handleGenreSelect = (genre_id) =>{
        setSelectedGenres((currSelectedGenres) => {
            if(currSelectedGenres.includes(genre_id)){
                {/* removes genre from selection once selected */}         
                return currSelectedGenres.filter(id => id !== genre_id);
            }else {
                return [...currSelectedGenres, genre_id];
            }
        });
    };

    // selected actors which holds the array of values
    const [selectedActors, setSelectedActors] = useState([]);
    // multiple selected values 
    const handleActorSelect = (actor_id) =>{
        setSelectedActors((currSelectedActors) => {
            if(currSelectedActors.includes(actor_id)){
                {/* removes actor from selection once selected */}         
                return currSelectedActors.filter(id => id !== actor_id);
            }else {
                return [...currSelectedActors, actor_id];
            }
        });
    };
    // details for form
    const selectedNightType = Object.keys(night_type).filter(key => night_type[key]);    
    const[formSubmitted, setFormSubmitted] = useState(false);
    //contains user_id
    const{ user_id } = useParams();
    //submitting form
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        
        //debugging
        console.log("handleSubmit called");
        if(formSubmitted) {
            console.log("Form already submitted. Preventing multiple submissions.");
            return;
        }
        console.log("Proceeding with form submission...");
        //flag set to prevent duplicates
        setFormSubmitted(true); 
        const dataToSubmit = {
            user_id: user_id,
            nightType: selectedNightType[0],
            genreType: selectedGenres,
            actorType: selectedActors,
            releaseDate: releaseDateDropDown.selectedValue,
            ratingChosen: ratingDropDown.selectedValue,
        };
    
        console.log("Data to submit:", dataToSubmit);
    
        try {
            const response = await axios.post('http://localhost:8800/submitQuiz', dataToSubmit);
            console.log('Success:', response.data);
            navigate("/Home");
        } catch (error) {
            console.error('Error Message:', error);
        }
    };
    
    return (
        <div className="container-wrapper">
            <form onSubmit ={handleSubmit}>
            <div className= "film-wrapper">
               <img className="film-wrap" src={film1} alt="film1"></img>

            <div className="container">
                
                <div className="title">Questionnaire</div> 
                <div className="night-container"><span className ="question">What type of movie night are you having?</span>
                    <p className="box"><input onChange={handleCheckbox} type='checkbox' name="night_type" value="Date_night" checked = {night_type.Date_night}></input>Date night</p>
                    <p className ="box"><input onChange={handleCheckbox} type='checkbox' name="night_type" value="Solo_night" checked = {night_type.Solo_night}></input>Solo night</p>
                    <p className ="box"><input onChange={handleCheckbox} type='checkbox' name="night_type" value="Friends_night" checked = {night_type.Friends_night}></input><span className ="friend">Friends night</span></p>
                    <p className ="box"><input onChange={handleCheckbox} type='checkbox' name="night_type" value="Family_night" checked = {night_type.Family_night}></input><span className= "family">Family night</span></p>
                </div>
    
                <div className="genre-container"><span className="question">What genre are you interested in?</span>
                    {/*Recognize that created buttons are of a button type and not confused with the submission button*/}                
                    <button type="button" className="select-genre-button" onClick={genreDropDown.toggleList}>Select Genres
                        <img className="down-pic" src={down} alt="Down"></img>
                    </button>
                    {/*Mapping genres ids to names */}
                    <ul className="list-items" style={{ display: genreDropDown.isOpen ? 'block' : 'none' }}>
                        {   
                            genres.map( (getgenres)=>(
                                <li  key= {getgenres.genre_id} className = "item" onClick={() => handleGenreSelect(getgenres.genre_id, getgenres.genre_name)}>
                                     <span className = "checkboxes">
                                        {/*Ensuring the checkmark is small and only shows checks for selected genres*/}
                                        <img className={`check-pic ${selectedGenres.includes(getgenres.genre_id) ?'' : 'check-pic-hidden'}`} src ={check}  alt="Check" width="10" height="10"></img>
                                    </span>
                                    <span className= "item-text">{getgenres.genre_name}</span>
                                </li>
                            )
                            )
                        }
                    </ul>  
                    
                </div>
                <div className="actors-container"><span className="question">What actors are you interested in?</span>
                    <button type="button" className="select-actor-name" onClick={actorDropDown.toggleList}>Select Actors
                        <img className="down-pic" src={down} alt="Down"></img>
                    </button>
                    <ul className="list-items" style={{ display: actorDropDown.isOpen ? 'block' : 'none' }}>
                        {   
                            actors.map( (getactors)=>(
                                <li  key= {getactors.actor_id} className = "item" onClick={() => handleActorSelect(getactors.actor_id, getactors.actor_name)}>
                                     <span className = "checkboxes">
                                        {/*Ensuring the checkmark is small and only shows checks for selected actors*/}
                                        <img className={`check-pic ${selectedActors.includes(getactors.actor_id) ?'' : 'check-pic-hidden'}`} src ={check}  alt="Check" width="10" height="10"></img>
                                    </span>
                                    <span className= "item-text">{getactors.actor_name}</span>
                                </li>
                            )
                            )
                        }
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
                        <li className = "item" onClick={() => handleItemSelect(releaseDateDropDown, "Released in the last 5 years")}>
                            <span className = "checkboxes">
                                {/* displays check if selected and if not then no check is shown */}
                                <img className={`check-pic ${ releaseDateDropDown.selectedValue=== "Released in the last 5 years" ? '' : 'check-pic-hidden'}`} src ={check} alt="Check"></img>
                            </span>
                            <span className= "item-text">Released in the last 5 years</span>
                        </li>
                        <li className = "item" onClick={() => handleItemSelect(releaseDateDropDown, "Released in the last 10 years")}>
                            <span className = "checkboxes">
                                <img className={`check-pic ${releaseDateDropDown.selectedValue === "Released in the last 10 years" ? '' : 'check-pic-hidden'}`} src ={check} alt="Check"></img>
                            </span>
                            <span className= "item-text">Released in the last 10 years</span>
                        </li>
                        <li className = "item" onClick={() => handleItemSelect(releaseDateDropDown, "Released in the last 20 years")}>
                            <span className = "checkboxes">
                                <img className={`check-pic ${releaseDateDropDown.selectedValue === "Released in the last 20 years" ? '' : 'check-pic-hidden'}`} src ={check} alt="Check"></img>
                            </span>
                            <span className= "item-text">Released in the last 20 years</span>
                        </li>
                        <li className = "item" onClick={() => handleItemSelect(releaseDateDropDown, "Any release date")}>
                            <span className = "checkboxes">
                                <img className={`check-pic ${releaseDateDropDown.selectedValue === "Any release date" ? '' : 'check-pic-hidden'}`} src ={check} alt="Check"></img>
                            </span>
                            <span className= "item-text">Any release date</span>
                        </li>
                    </ul>
                </div>
                <div className="rating-container"><span className="question">Do you have a preferred movie rating?</span>
                    <button type="button" className="select-rating-button" onClick={ratingDropDown.toggleList}>Select Rating
                        <img className="down-pic" src={down} alt="Down"></img>
                    </button>
                    <ul className="list-items" style={{ display: ratingDropDown.isOpen ? 'block' : 'none' }}>
                        <li className= "item" onClick={() => handleItemSelect(ratingDropDown, "High Ratings")}>
                            <span className = "checkboxes">
                                <img className={`check-pic ${ratingDropDown.selectedValue === "High Ratings" ? '' : 'check-pic-hidden'}`} src ={check} alt="Check"></img>
                            </span> 
                                <span className="item-text">High Ratings</span>
                        </li>          
                        <li className= "item" onClick={() => handleItemSelect(ratingDropDown, "Low Ratings")}>
                            <span className = "checkboxes">
                                <img className={`check-pic ${ratingDropDown.selectedValue === "Low Ratings" ? '' : 'check-pic-hidden'}`} src ={check}  alt="Check"></img>
                            </span> 
                                <span className="item-text">Low Ratings</span>
                        </li>
        
                        <li className= "item">
                            <span className = "checkboxes" onClick={() => handleItemSelect( ratingDropDown, "Any Ratings")}>
                                <img className={`check-pic ${ratingDropDown.selectedValue === "Any Ratings" ? '' : 'check-pic-hidden'}`} src ={check}  alt="Check"></img>
                            </span> 
                                <span className="item-text">Any Ratings</span>
                        </li>
                    </ul>
                </div>
               <button className="submit-button" onClick={(e) => handleSubmit(e)}>Submit</button>
            </div>
           
            </div>
            </form>
        </div>
    );
    }
export default Quiz