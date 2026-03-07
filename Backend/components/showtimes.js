const express = require("express");
const showTimesRouter = express.Router();
const {ShowTimes,Movies, Theater} = require("../db/mongoose")

showTimesRouter.post("/showTime",async (req,res)=>{
    try{
        const {movie,theater,screen,start_time,end_time,show_mood,ticket_price} = req.body

        if(!movie || !theater || !screen || !start_time || !ticket_price){
          return res.status(400).json({message:"fill out all the feilds"})
        }

        const showTimes =  new ShowTimes({movie,theater,screen,start_date:start_time,end_date:end_time,show_mood,ticket_price})
        await showTimes.save();

        res.status(200).json({message:'stored successfull'})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
    
})

showTimesRouter.get("/showTime", async(req,res)=>{
    try{
        const existValue = await ShowTimes.findOne()

        if(!existValue){
            return res.status(400).json({message:"items not exists"})
        }

        const showTime = await ShowTimes.find()
        .populate("movie")
        .populate({
            path:"theater",
        })
        .populate("screen")

        res.status(200).json({showTime})
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'internal server error'})
    }


})



showTimesRouter.get("/selectedMovie",async(req,res)=>{

    try{
    const {movie_name} =req.query
    
    const movie = await Movies.findOne({movie_name})
    if(!movie){
        return res.status(404).json({message:'not found'})
    }

    const movieId = movie._id;

    const showTime = await ShowTimes.find({movie:movieId})
    .populate("movie")
    .populate("theater")
    .populate("screen")

    res.status(200).json({message:'send successfully',showTime})
    console.log(showTime)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
})


showTimesRouter.get("/theaterScreen",async(req,res)=>{
    try{
        const {theater_name,movie_name} = req.query;
        const theater = await Theater.findOne({theater_name})
        const movie = await Movies.findOne({movie_name})

        const theaterId = theater._id
        const movieId = movie._id
        const showTime = await ShowTimes.find({theater:theaterId,movie:movieId})
        .populate("movie")
        .populate("theater")
        .populate("screen")

        res.status(200).json({message:'successfull',showTime})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
})



module.exports = showTimesRouter
