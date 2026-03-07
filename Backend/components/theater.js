const {Theater} = require("../db/mongoose")
const express = require("express")
const theaterRouter = express.Router();

theaterRouter.post("/theater",async(req,res)=>{
    try{
        const {theatername,location} = req.body;

        if(!theatername || !location){
            return res.status(400).json({message:'fill out all the feilds'})
        }

       const theater = new Theater({theater_name:theatername,location})
       await theater.save()
       res.status(200).json({message:"successfull"})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
})

theaterRouter.get("/theater",async(req,res)=>{
    try{
        const theater = await Theater.find();
        res.status(200).json({message:'theater end successfully',theater})
    }
    catch(error){
        console.log(error)
    }
})

module.exports = theaterRouter