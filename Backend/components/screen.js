const {Screen} = require("../db/mongoose")
const {Theater} = require("../db/mongoose")
const express = require("express");
const screenRouter = express.Router();

screenRouter.post("/screen",async(req,res)=>{
   try{
    const {screenname,theatername,seats,cols,rows} = req.body

    if(!screenname || !theatername ||!seats){
        return res.status(400).json({message:"fill out all the feilds"})
    }

    const findTheater = await Theater.findOne({theater_name:theatername}) 
    const findScreen = await Screen.findOne({screen_name:screenname,theater:findTheater._id})

    if(!findTheater){
        return res.status(404).json({message:'theater not found'})
    }

    if(findScreen){
        return res.status(400).json({message:'already exists'})
    }

    const screen = new Screen({screen_name:screenname,capacity:seats,theater:findTheater._id,rows,cols})
    await screen.save();
    
    res.status(200).json({message:'successfull'})

   }
   catch(error){
    console.log(error)
    res.status(500).json({error:'internal server error'})
   }
})


screenRouter.get('/screen',async (req,res)=>{
    const screen = await Screen.find();
    res.status(200).json({message:'screen send successfully',screen })
})

module.exports = screenRouter     