import React, { useEffect, useState } from "react"
import axios from "axios"

const MovieList = () => {
    const [movies, setMovies] = useState([])

    useEffect (()=>{
        const fetchAllMovies = async ()=>{
            try{
                const res = await axios.get("http://localhost:8800/movie")
                setMovies(res.data);
            }catch(err){
                console.log(err)
            }
        }
        fetchAllMovies()
    },[])
    return (
        <div>
            <h1>Movies</h1>
            <div className="movies">
                {movies.map(movie=>(
                    <div className="movie" key={movie.movie_id}>
                        <h2>{movie.title}</h2>
                        <p>{movie.overview}</p>
                        <span>{movie.runtime}</span>
                        <span>{movie.release_date}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MovieList