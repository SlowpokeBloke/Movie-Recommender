import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Quiz.css";
import "./Selection.css";
import film1 from '../icon_pics/film1.png';
import film from '../icon_pics/film.png';
import movie_poster from '../icon_pics/movie-poster.png'
import videography from '../icon_pics/videography.png';
import cinema from '../icon_pics/cinema-clapboard.png'

const Selection = () => {
     const [selectionData, setSelectionData] = useState([]);
     const { user_id } = useParams();
     const navigate = useNavigate();

     useEffect(() => {
          const fetchSelectionData = async () => {
               try {
                    const response = await axios.get(`http://localhost:8800/selection/${user_id}`);
                    setSelectionData(response.data);
               } catch (error) {
                    console.error("Error fetching selection data:", error);
               }
          };

          fetchSelectionData();
     }, [user_id]);

     const handleQuizAgainClick = () => {
          console.log(`Navigating to Quiz with user_id: ${user_id}`);
          navigate(`/Quiz/${user_id}`);
     };

     const handleGoToAccountClick = () => {
          navigate('/UserAccount');
     };

     const formatDate = (dateString) => {
          const date = new Date(dateString);
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          return date.toLocaleDateString('en-US', options);
     };

     return (
          <div className="container-wrapper2">
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
                    <div className="container">
                         <div className="title"><span className="font-header">Recommended For You</span></div>
                         {selectionData.map((selection, index) => (
                              <div key={index}>
                                   <div className="image-for-poster">
                                        <img
                                             className="default-poster"
                                             src={`https://image.tmdb.org/t/p/original${selection.poster}`}
                                             alt="movie_poster"
                                             onError={(e) => { e.target.onerror = null; e.target.src = movie_poster; }}
                                        ></img>
                                   </div>

                                   <div className="result-output-section">
                                        <div className="result-output-section1">Movie Title: {selection.title}</div>
                                        <div className="result-output-section1">Run Time: {selection.runtime} mins</div>
                                        <div className="result-output-section1">Release Date: {formatDate(selection.release_date)}</div>
                                   </div>
                                   
                                   <div className="result-output-section2">
                                        <div className="result-output-overview">Overview: {selection.overview}</div>
                                        {Array.isArray(selection.genres) ? (
                                             <div className="result-ouput-genre">Genres: {selection.genres.join(', ')}</div>
                                        ) : (
                                             <div className="result-ouput-genre">Genres: {selection.genres}</div>
                                        )}
                                        <div className="result-output-keywords">Keywords: {selection.keywords.join(', ')}</div>
                                        {Array.isArray(selection.languages) ? (
                                             <div className="result-ouput-language">Languages: {selection.languages.join(', ')}</div>
                                        ) : (
                                             <div className="result-ouput-language">Languages: {selection.languages}</div>
                                        )}
                                   </div>

                                   <div className="selection-buttons">
                                        <div><button className="quiz-again-button" onClick={handleQuizAgainClick} >Take Quiz Agian</button></div>
                                        <div><button className="go-to-acct-button" onClick={handleGoToAccountClick} >Account Page</button></div>
                                   </div>


                              </div>
                         ))}
                    </div>

               </div>
          </div>
     );
};

export default Selection;
