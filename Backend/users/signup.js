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
        res.status(200).json({msg:"sign up successfull",signup})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
})

Router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "fill all the blanks" });
    }

    const user = await users.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    if (!user.password) {
      return res.status(500).json({ message: "password not found in database" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role || "user",
      },
      "secretkey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      id: user._id,
      token,
      username: user.fullname,
      email: user.email,
      message: "login successful",
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
});

module.exports = Router