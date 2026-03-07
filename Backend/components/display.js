// const express = require('express');
// const Display = express.Router();
// const {carouselItems} = require("../db/mongoose")



// Display.post("/dis",upload.single("image"),async(req,res)=>{
// try{
//     const {title,action,crime,thriller,comedy,date,duration,movieType,director,stars,theme} = req.body
//     const image = req.file ? req.file.filename : '';
//     const carouItem = new carouselItems({title,action,crime,thriller,comedy,date,duration,movieType,director,stars,theme,image})
//     await carouItem.save();
//     res.status(201).json({message:'successful',carouItem})
// }
// catch(error){
//     res.status(200).json({message:"internal server error"})
// }
// })

// Display.get("/dis",async (req,res)=>{
//     const carouItems = await carouselItems.find()
//     res.status(200).json({carouItems})
// })

// Display.delete("/dis/:id",async(req,res)=>{
//     const {id} = req.params;

//     const deleteCarouselItems =  await carouselItems.findByIdAndDelete(id)
//     res.status(200).json({msg:'deleted successfully'})
// })

// Display.put("/updateCarousel/:id",upload.single("image"),async(req,res)=>{
//     try{
//         const imagefound = req.file
//         if(!imagefound){
//             return res.status(404).json({msg:'image file not found'})
//         }
//         const image = req.file.filename
//         const {id} = req.params
//         const {title,date,duration,movieType,director,stars, theme} = req.body

//         const updateCarousel =  await carouselItems.findByIdAndUpdate(id,{title,date,duration,movieType,director,stars, theme,image},{new:true})
//         res.status(200).json({msg:'update successfully',updateCarousel})
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({msg:'internal server error'})
//     }
// })


// module.exports = Display

const express = require("express");
const Display = express.Router();
const { carouselItems } = require("../db/mongoose");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "carousel" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

Display.post("/dis", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      action,
      crime,
      thriller,
      comedy,
      date,
      duration,
      movieType,
      director,
      stars,
      theme,
    } = req.body;

    let image = "";

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      image = result.secure_url;
    }

    const carouItem = new carouselItems({
      title,
      action,
      crime,
      thriller,
      comedy,
      date,
      duration,
      movieType,
      director,
      stars,
      theme,
      image,
    });

    await carouItem.save();
    res.status(201).json({ message: "successful", carouItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

Display.get("/dis", async (req, res) => {
  try {
    const carouItems = await carouselItems.find();
    res.status(200).json({ carouItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

Display.delete("/dis/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await carouselItems.findByIdAndDelete(id);
    res.status(200).json({ msg: "deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
});

Display.put("/updateCarousel/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, duration, movieType, director, stars, theme } = req.body;

    const foundCarousel = await carouselItems.findById(id);

    if (!foundCarousel) {
      return res.status(404).json({ msg: "carousel item not found" });
    }

    let image = foundCarousel.image;

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      image = result.secure_url;
    }

    const updateCarousel = await carouselItems.findByIdAndUpdate(
      id,
      { title, date, duration, movieType, director, stars, theme, image },
      { new: true }
    );

    res.status(200).json({ msg: "update successfully", updateCarousel });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
});

module.exports = Display;