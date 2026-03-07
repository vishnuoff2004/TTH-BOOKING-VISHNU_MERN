const express = require("express");
const AdminDashboardRouter = express.Router();
const {ShowTimes,Theater} = require("../db/mongoose")

AdminDashboardRouter.get("/movies",async(req,res)=>{
    try{
        const moviesCollection = await ShowTimes.find()
        .populate('movie')
        .populate('theater')
        .populate('screen');

        res.status(200).json({msg:'movies loaded',moviesCollection})  
    }
    catch(error){
        console.log(error);
        res.status(500).json({msg:'internal server error'})
    }
})
AdminDashboardRouter.delete("/deleteMovies/:id",async(req,res)=>{
    try{
        const {id} = req.params;
        let deletedMovie = await ShowTimes.findByIdAndDelete(id);
        res.status(200).json({msg:'successfully deleted',deletedMovie})
    }
    catch(error){
        console.log(error);
        res.status(500).json({msg:"internal server error"})
    }
})

AdminDashboardRouter.get("/theaters", async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.status(200).json(theaters);
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({message:"server error"});
  }
});

module.exports = AdminDashboardRouter
