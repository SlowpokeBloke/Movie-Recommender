CREATE DATABASE IF NOT EXISTS movie_recommender;
CREATE TABLE person(
	user_id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(40),
    password VARCHAR(80),
    age TINYINT UNSIGNED,
    full_name VARCHAR(50),
    PRIMARY KEY (user_id)
    );
    
-- one to many: a user can make multiple responses but each response must come from at most one user
CREATE TABLE responses(
	response_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    release_date VARCHAR(50),
    movie_night VARCHAR(20),
    ratings VARCHAR(15),
    PRIMARY KEY(response_id),
    FOREIGN KEY(user_id) REFERENCES person(user_id) ON DELETE CASCADE
);

CREATE TABLE movie(
	movie_id INT NOT NULL,
    title VARCHAR(50),
    runtime FLOAT,
    release_date DATE,
    overview VARCHAR(255),
    PRIMARY KEY(movie_id)
);

CREATE TABLE genre(
	genre_id INT NOT NULL,
    genre_name VARCHAR(20),
    PRIMARY KEY(genre_id)
);
-- many to many: each movie can have many genres and many genres can be in each movie
CREATE TABLE movie_genre(
	movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY(movie_id, genre_id),
    FOREIGN KEY(movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY(genre_id) REFERENCES genre(genre_id)
);

CREATE TABLE languages(
	language_id INT NOT NULL,
    abbrev VARCHAR(2),
    full_name VARCHAR(20),
    PRIMARY KEY(language_id)
);
-- many to many: each language can be in many movies and each movie can have many languages 
CREATE TABLE languages_movie(
	movie_id INT NOT NULL,
    language_id INT NOT NULL,
    PRIMARY KEY(movie_id, language_id),
    FOREIGN KEY(movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY(language_id) REFERENCES languages(language_id)
);

CREATE TABLE actor(
	actor_id INT NOT NULL,
    character_name VARCHAR(30),
    actor_name VARCHAR(50),
    PRIMARY KEY (actor_id)
);
-- many to many: each actor can be in many movies and each movie can have many actors
CREATE TABLE actor_movie(
	movie_id INT NOT NULL,
    actor_id INT NOT NULL,
    PRIMARY KEY(movie_id, actor_id),
    FOREIGN KEY(movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY(actor_id) REFERENCES actor(actor_id)
);

CREATE TABLE keyword(
	keyword_id INT NOT NULL,
    keyword_name VARCHAR(50),
    PRIMARY KEY(keyword_id)
);
-- many to many: each movie can have many keywords and each keyword is in many movies
CREATE TABLE keyword_movie(
	movie_id INT NOT NULL,
    keyword_id INT NOT NULL,
    PRIMARY KEY(movie_id, keyword_id),
    FOREIGN KEY(movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY(keyword_id) REFERENCES keyword(keyword_id)
);
-- many to many: each user user gives many ratings and each rating is given by many users
CREATE TABLE ratings(
	user_id INT NOT NULL,
    movie_id INT NOT NULL,
    rating_score FLOAT,
    PRIMARY KEY(user_id, movie_id),
    FOREIGN KEY(user_id) REFERENCES person(user_id),
    FOREIGN KEY(movie_id) REFERENCES movie(movie_id)    
);

-- one to one: each movie has at most one total vote and each total vote is for one movie 
CREATE TABLE total_votes(
	vote_id INT NOT NULL AUTO_INCREMENT,
    movie_id INT NOT NULL UNIQUE, 
    vote_avg FLOAT,
    vote_count INT,
    PRIMARY KEY(vote_id),
    FOREIGN KEY(movie_id) REFERENCES movie(movie_id)
);

-- one to one: each image is for at most one movie and each movie has at most one image 
CREATE TABLE images(
	image_id BIGINT NOT NULL,
    movie_id INT NOT NULL UNIQUE,
    poster_path VARCHAR(80),
    backdrop_path VARCHAR(80),
    PRIMARY KEY(image_id),
    FOREIGN KEY(movie_id) REFERENCES movie(movie_id)
);

-- many to many: each response can contain many genres and each genre is in many responses
CREATE TABLE response_genre(
	response_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY(response_id, genre_id),
    FOREIGN KEY(response_id) REFERENCES responses(response_id) ON DELETE CASCADE,
    FOREIGN KEY(genre_id) REFERENCES genre(genre_id)
);

-- many to many: each response can contain many actors and each actor is in many responses
CREATE TABLE response_actor(
	response_id INT NOT NULL,
    actor_id INT NOT NULL,
    PRIMARY KEY(response_id, actor_id),
    FOREIGN KEY(response_id) REFERENCES responses(response_id) ON DELETE CASCADE,
    FOREIGN KEY(actor_id) REFERENCES actor(actor_id)
);
-- many to many: each user has a watch list that contains many movies and each movie can be in many users watch list 
CREATE TABLE watch_list(
	watch_list_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    PRIMARY KEY(watch_list_id),
    UNIQUE KEY(user_id, movie_id),
    FOREIGN KEY(user_id) REFERENCES person(user_id) ON DELETE CASCADE,
    FOREIGN KEY(movie_id) REFERENCES movie(movie_id)
);
-- many to many:  each user has a list of movies they watched and each movie can be can be in many users watched list
CREATE TABLE watched_list(
	watched_list_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    PRIMARY KEY(watched_list_id),
    UNIQUE KEY(user_id, movie_id),
    FOREIGN KEY(user_id) REFERENCES person(user_id) ON DELETE CASCADE,
    FOREIGN KEY(movie_id) REFERENCES movie(movie_id)
);

-- many to many: each user has many favorite genres and each genre can be in many users list
CREATE TABLE user_favorite_genre(
	user_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY(user_id, genre_id),
	FOREIGN KEY (user_id) REFERENCES person(user_id) ON DELETE CASCADE,
    FOREIGN KEY(genre_id) REFERENCES genre(genre_id)
);

-- many to many: each user has many favorite actors and each actor can be in many users list 
CREATE TABLE user_favorite_actor(
	user_id INT NOT NULL,
    actor_id INT NOT NULL,
    PRIMARY KEY(user_id, actor_id),
	FOREIGN KEY (user_id) REFERENCES person(user_id) ON DELETE CASCADE,
    FOREIGN KEY(actor_id) REFERENCES actor(actor_id)
);

--  one to many/one to one/many to movie: each user can make one selection/each selection corresponds to one response/each movie can be in many responses
CREATE TABLE selection(
	selection_id INT NOT NULL, 
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    response_id INT NOT NULL UNIQUE,
    PRIMARY KEY(selection_id),
    FOREIGN KEY (user_id) REFERENCES person(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movie(movie_id),
    FOREIGN KEY (response_id) REFERENCES responses(response_id) ON DELETE CASCADE
);
