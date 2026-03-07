const express = require('express')
const Router = express.Router()
const {users} =  require("../db/mongoose")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

Router.use(express.json())


Router.post("/signup" ,async(req,res)=>{
    try{
        const {fullname,email,password} = req.body

        if(!fullname || !email || !password){
            return res.status(400).json({message:'fill all the blanks'})
        }

        const userExist = await users.findOne({email})
        if(userExist){
            return res.status(400).json({message:'already exists'})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const signup = new users({fullname,email,password:hashedPassword})
        await signup.save()
        res.status(200).json({signup})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
})

Router.post("/login",async (req,res)=>{
    try{
        const {email,password} = req.body;

        const user = await users.findOne({email})

        if(!(await bcrypt.compare(password,user.password))){
            return res.status(400).json({message:'invalid credentials'})
        }
     
        const token =  jwt.sign({id:user._id,role:user.role,email:user.email},"secretkey",{expiresIn:"1h"})

        res.status(200).json({id:user._id,token,username:user.fullname,email,message:'login successful'})
    }
    catch(error){
        res.status(500).json({error:'internal error'})
    }
})

module.exports = Router