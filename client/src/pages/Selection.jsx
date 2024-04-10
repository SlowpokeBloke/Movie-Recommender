import React from "react";
import "./Quiz.css";
import "./Selection.css"
import "../components/UseDropDown"
import film1 from '../icon_pics/film1.png';
import film from '../icon_pics/film.png';
import movie_poster from '../icon_pics/movie-poster.png'
import videography from '../icon_pics/videography.png';
import cinema from '../icon_pics/cinema-clapboard.png'
import { useNavigate, useParams } from "react-router-dom";
const Selection = () => {
     
     // navigation
     const navigate = useNavigate();
     const{ user_id } = useParams();
     console.log(useParams());
     console.log("user_id from useParams:", user_id);
     
     // Handler for navigating to the Quiz page
  const handleQuizAgainClick = () => {
     console.log(`Navigating to Quiz with user_id: ${user_id}`);
     navigate(`/Quiz/${user_id}`);
   };
 
   // Handler for navigating to the Account page
   const handleGoToAccountClick = () => {
     navigate('/UserAccount'); 
   };
   
    return (
        <div className="container-wrapper2">
           
            <div className="pics-above-container">
                <img className="icons-above" src={film} alt="film"></img>
                <img className="icons-above2" src={videography} alt="videog"></img>
                <img className="icons-above" src={cinema} alt="cinema"></img>
            </div>
            <div className="parent-container-film">
            <div className= "film-wrapper-left">
               <img className="film-wrap" src={film1} alt="film1"></img>
            </div>
            <div className= "film-wrapper-left2">
                <img className="film-wrap" src={film1} alt="film1"></img>
            </div>
            <div className= "film-wrapper-left3">
                <img className="film-wrap" src={film1} alt="film1"></img>
            </div>
            <div className= "film-wrapper-left4">
                 <img className="film-wrap" src={film1} alt="film1"></img>
            </div>
            <div className= "film-wrapper-left5">
                 <img className="film-wrap" src={film1} alt="film1"></img>
            </div>
            <div className= "film-wrapper-left6">
                 <img className="film-wrap" src={film1} alt="film1"></img>
            </div>
            
            <div className= "film-wrapper-right">
                <img className="film-wrap" src={film1} alt="film2"></img>
            </div>
            <div className= "film-wrapper-right2">
                <img className="film-wrap" src={film1} alt="film2"></img>
            </div>
            <div className= "film-wrapper-right3">
                <img className="film-wrap" src={film1} alt="film2"></img>
            </div>
            <div className= "film-wrapper-right4">
                 <img className="film-wrap" src={film1} alt="film2"></img>
            </div>
            <div className= "film-wrapper-right5">
                 <img className="film-wrap" src={film1} alt="film2"></img>
            </div>
            <div className= "film-wrapper-right6">
                 <img className="film-wrap" src={film1} alt="film2"></img>
            </div>
          
            
            <div className="container">
                
                <div className="title"><span className="font-header">Recommended For You</span></div> 
                
                   
                    <div className= "image-for-poster">
                         <img className="default-poster" src={movie_poster} alt="movie_poster"></img>
                    </div>
                    <div className = "result-output-section">
                         <div className= "result-output-section1">Movie Title: </div>
                         <div className= "result-output-section1">Run Time: </div>
                         <div className= "result-output-section1">Release Date: </div>
                    </div>
                    <div className = "result-output-section2">
                         <div className= "result-output-overview">Overview:</div>
                         <div className= "result-output-keywords">Keywords:</div>
                         <div className= "result-output-language">Language:</div>
                    </div>
            
        
               <div className="selection-buttons">
                    <div><button className="quiz-again-button"  onClick={handleQuizAgainClick} >Take Quiz Agian</button></div>
                    <div><button className="go-to-acct-button"  onClick={handleGoToAccountClick} >Account Page</button></div>
                    </div>
               
            
               </div>
      </div>
      </div>
    );
    }
export default Selection