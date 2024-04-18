import express from "express";
import mysql from "mysql2";
import cors from "cors";


async function insertMovieToList(user_id, movie_id){
    console.log("Add List Entry, Parameters: ", [user_id, movie_id]);
    const insertToList = `
        INSERT INTO watch_list (user_id, movie_id)
        VALUES (?, ?)
    `;
    try{
        db.query(insertToList, [user_id, movie_id]);
        console.log("New entry added to Watch List");
    }catch(error){
        console.error("Failed to insert entry into Watch List");
    }
}

async function deleteMovieFromList(user_id, movie_id){
    console.log("Del List Entry, Parameters: ", [user_id, movie_id]);
    const deleteFromList =`
        DELETE FROM watch_list WHERE user_id=? AND movie_id=?
    `;
    try{
        db.query(deleteMovieFromList, [user_id, movie_id]);
        console.log("New entry added to Watch List");
    }catch(error){
        console.error("Failed to insert entry into Watch List");
    }
}