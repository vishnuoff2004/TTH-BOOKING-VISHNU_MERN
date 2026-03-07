const express = require("express");
const updateFormRouter = express.Router();
const {Movies,Theater,Screen,ShowTimes} = require("../db/mongoose")
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "movies" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

updateFormRouter.get("/fetch",async(req,res)=>{
    try{
        const theaterList = await Theater.find();
        res.status(200).json({msg:'theater fetch successfully',theaterList})
    }
    catch(error){
        console.log(error)
        res.status(500).json({msg:'internal server error'})   
    }
})

updateFormRouter.get("/fetchScreen/",async(req,res)=>{
  try{
    const {id} = req.query
    const foundScreen = await Screen.findOne({theater:id})
    console.log(id,foundScreen)
    if(!foundScreen){
        return res.status(404).json({msg:'screen not found'})
    }
    const screenList = await Screen.find({theater:id})
    res.status(200).json({msg:'fetch screens',screenList})
  }
  catch(error){
        console.log(error)
        res.status(500).json({msg:'internal server error'})     
  }
})

updateFormRouter.put("/updateMovie/:movieId", upload.single("image"), async(req,res)=>{
    if(!req.file){
        return res.status(404).json({msg:'image file not found'})
    }
    const image = req.file.filename
    try{
    const {movieId} = req.params;
    const foundMovie = await Movies.findOne({_id:movieId})

    if(!foundMovie){
       return  res.status(404).json({msg:'movie not found'})
    }
    const {movie_name,genre,language,duration} = req.body

    const updatedMovie = await Movies.findByIdAndUpdate(movieId,{movie_name,genre,language,duration,image},{new:true})
    res.status(200).json({msg:'update successfully',updatedMovie})

    }
    catch(error){
        console.log(error);
        res.status(500).json({msg:'internal server error'})
    }
})



updateFormRouter.put('/updateTheater/:theaterId',async(req,res)=>{
    try{
        const {theaterId} = req.params
        const foundTheater = await Theater.findOne({_id:theaterId})
        if(!foundTheater){
            res.status(404).json({msg:"theater not found"})
        }
        const {theater_name,location} = req.body

        const theaterFinding = await Theater.findOne({theater_name}) 
        if(!theaterFinding){
            return res.status(404).json({msg:'theater not exists'})
        }

        const updateTheater = await Theater.findByIdAndUpdate(theaterId,{theater_name,location},{new:true})
        res.status(200).json({msg:'theater update successfully',updateTheater})

        
    }
    catch(error){
        console.log(error);
        res.status(500).json({msg:'internal server error'})
    }
})


updateFormRouter.get("/screens/:theaterId", async (req, res) => {
  try {
    const screens = await Screen.find({ theater: req.params.theaterId });
    res.json(screens);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


updateFormRouter.put("/updateScreen/:screenId", async (req, res) => {
    try {
        const { screenId } = req.params;
        console.log(screenId)
        const { screen_name, rows, cols } = req.body;

        const updated = await Screen.findByIdAndUpdate(
            screenId,
            { screen_name, rows, cols },
            { new: true }
        );

        res.status(200).json({ msg: "screen updated", updated });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ msg: "internal server error" });
    }
});


module.exports = updateFormRouter


