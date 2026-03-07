const mongoose = require("mongoose");
const express = require("express")
const app = express() 
const bcrypt =  require("bcrypt")


mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const signUpSchema = new mongoose.Schema({
    role:{type:String,default:'user'},
    fullname:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true}
})

const carouselSchema = new mongoose.Schema({
        title:{type:String,required:true,unique:true},
        action:{type:Boolean},
        crime:{type:Boolean},
        thriller:{type:Boolean},
        comedy:{type:Boolean},
        date:{type:Number,required:true},
        duration:{type:String,required:true},
        movieType:{type:String,required:true},
        director:{type:String,required:true},
        stars:{type:String,required:true},
        theme:{type:String,required:true},
        image:{type:String,required:true},
})

const showtimeSchema  =  new mongoose.Schema({
    movie:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"movie"
        },
    theater:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"theater"
    },
    screen:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"screen"
    },
    start_date:{
        type:Date
    },
    end_date:{
        type:Date
    },
    show_mood:[{type:'String'}]
    ,
    ticket_price:{
        type:"Number"
    }
})

const moviesSchema = new mongoose.Schema({
    movie_name:{type:String},
    genre:[{type:String}],
    language:{type:String},
    releaseDate:{type:Number},
    duration:{type:String},
    ratings:{type:Number,default:0},
    like:{type:Number,default:0},
    image:{type:String},
    ratingCount:{type:String,default:0},
    totRating:{type:String,default:0},
})

const theaterSchema = new mongoose.Schema({
    theater_name:{type:String},
    location:{type:String},
})

const screenSchema = new mongoose.Schema({
    screen_name:{type:String},
    capacity:{type:Number},
    theater:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"theater"
    },
    rows:{type:Number},
    cols:{type:Number},
    seats:[{type:String}],
})

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    theater:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"theater"
    },
    location:{
        type:String
    },
    price:{
        type:Number
    },
    seats:[{type:String}],
    tot:{
        type:Number
    },
    movie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'movie'
    },
    screen:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'screen'
    },
    bookedDate:[{type:'String'}],
    bookedShows:{type:String},
    createdAt:{
        type:"date",
        default:Date.now()
    }
})

const adminLoginSchema = new mongoose.Schema({
    name:{type:String,required:true},
    password:{type:String,required:true}
})

const users = mongoose.model("user",signUpSchema)
const carouselItems = mongoose.model("carouselItem",carouselSchema)
const Movies = mongoose.model("movie",moviesSchema)
const Theater = mongoose.model("theater",theaterSchema)
const Screen = mongoose.model("screen",screenSchema)
const ShowTimes = mongoose.model("showTime",showtimeSchema)
const Bookings = mongoose.model("bookings",bookingSchema)
const Admin = mongoose.model("admin",adminLoginSchema)

module.exports = {users,carouselItems,Movies,Theater,Screen,ShowTimes,Bookings,Admin}