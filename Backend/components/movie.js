const { Movies } = require("../db/mongoose");
const express = require("express");
const movieRouter = express.Router();
const jwt = require("jsonwebtoken");
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

function verification(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}

movieRouter.post("/movie", upload.single("image"), async (req, res) => {
  try {
    const { movie_name, genre, language, duration } = req.body;

    let imageUrl = "";

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer);
      imageUrl = result.secure_url;
    }

    if (!movie_name || !genre || !language || !duration || !imageUrl) {
      return res.status(400).json({ message: "Fill all the fields" });
    }

    const movie = new Movies({
      movie_name,
      genre,
      language,
      duration,
      image: imageUrl,
    });

    await movie.save();

    res.status(200).json({ message: "successful", movie });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

movieRouter.get("/movie", async (req, res) => {
  try {
    const movie = await Movies.find();
    res.status(200).json({ message: "movies end successfully", movie });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

movieRouter.get("/fetch", async (req, res) => {
  try {
    const movie = await Movies.find();
    res.status(200).json({
      message: "movies end successfully",
      movie,
      decoded: { userId: req.userId, role: req.role },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

movieRouter.put("/movie/:id", async (req, res) => {
  try {
    const { like } = req.body;
    const { id } = req.params;

    const newLike = like + 1;

    const updateMovie = await Movies.findByIdAndUpdate(
      id,
      { like: newLike },
      { new: true }
    );

    res.status(200).json({ message: "liked successFull", updateMovie });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

movieRouter.put("/rating/:id", async (req, res) => {
  try {
    const { inpRating } = req.body;
    const { id } = req.params;

    const movieRating = await Movies.findById(id);

    const ratingCount = Number(movieRating.ratingCount) + 1;
    const totalPointRating =
      Number(movieRating.totRating) + Number(inpRating);

    const updatedRating = (totalPointRating / ratingCount).toFixed(1);

    const updatedMovie = await Movies.findByIdAndUpdate(
      id,
      {
        ratings: updatedRating,
        totRating: totalPointRating,
        ratingCount: ratingCount,
      },
      { new: true }
    );

    res.status(200).json({ message: "rated value", updatedMovie });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

module.exports = movieRouter;