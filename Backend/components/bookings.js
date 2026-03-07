const express = require("express");
const BookingsRouter = express.Router();
const {Bookings,Theater,users,Movies,Screen} = require('../db/mongoose')


BookingsRouter.post("/bookings",async (req,res)=>
{
    try{
        const {theatername,price,location,user,seats,tot,movie,screen, bookedDate,bookedShows} = req.body;
        console.log(theatername,price,location,user,seats,tot,movie,screen, bookedDate,bookedShows,"jjjjjjjjjjjjjj")
        const theater = await Theater.findOne({theater_name:theatername})
        const User =  await users.findOne({fullname:user})
        const movies = await Movies.findOne({movie_name:movie});
        const screens = await Screen.findOne({_id:screen})


        if(!theater){
            return res.status(404).json({message:'theater not found'})
            console.log("found")
        }

        if(!User){
            return res.status(404).json({message:'user not found'})
            console.log("found")

        }

        if(!movies){
            return res.status(404).json({message:'movie not found'})
            console.log("found")
        } 

        if(!screens){
            return res.status(404).json({message:'screen not found'})
            console.log("found")

        }

        const userId = User._id;
        const theaterId = theater._id;
        const moviId = movies._id;
        const screenId = screens._id


        const bookings = await new Bookings({price,location,seats,tot,user:userId,theater:theaterId,movie:moviId,screen:screenId,bookedDate,bookedShows});
        await bookings.save();
        res.status(200).json({message:'booking successfull'})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}
)

BookingsRouter.get("/bookedSeats",async(req,res)=>{
    try{
        const {movie,theaterId,screen,bookedDate,bookedShows} = req.query; 
        const book = await Bookings.find({movie,screen,bookedDate,bookedShows})
        console.log(book)
        if(!book){
            return res.status(404).json({message:'not found'})
        }
        let allseats = []
        for(let i =0;i<book.length;i++){
            let seats = book[i].seats;
            for(let j =0 ;j<seats.length;j++){
                allseats.push(seats[j])
            }
        }
        res.status(200).json({message:'seats send',bookedSeats:allseats})
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
})

BookingsRouter.get("/adminBookings",async(req,res)=>{
    const adminBookings = await Bookings.find().populate('movie').populate('theater').populate('user').populate('screen')
    res.status(200).json({msg:'successfully fetch',adminBookings})
})

BookingsRouter.delete("/delteBookings/:id",async(req,res)=>{
    const {id} = req.params;
    const delteBookings  = await Bookings.findByIdAndDelete(id)
    res.status(200).json({msg:'delete successfully'})
})

BookingsRouter.get("/userDetail",async(req,res)=>{
    try{
    const {user} = req.query;
    const userDetails = await Bookings.find({user}).populate('theater').populate('movie').populate('screen').populate("user")
    res.status(200).json({msg:'fetched succesfully',userDetails})
    }
    catch(error){
        console.log(error);
        res.status(500).json({msg:'internal server error'})
    }

})

module.exports = BookingsRouter