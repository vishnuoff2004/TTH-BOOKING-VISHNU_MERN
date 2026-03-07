const express = require("express");
const adminRouter = express.Router();
const { Admin } = require("../db/mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");   // ✅ ADD THIS

const SECRET_KEY = "mysecretkey";      // ✅ MOVE TO .env in production

adminRouter.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ message: "Fill all the fields" });
        }

        const existAdmin = await Admin.findOne({ name });

        if (!existAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, existAdmin.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Password doesn't match" });
        }

        // ✅ GENERATE TOKEN HERE
        const token = jwt.sign(
            {
                id: existAdmin._id,
                role: "admin"
            },
            SECRET_KEY,
            { expiresIn: "1d" }
        );

        // ✅ SEND TOKEN TO FRONTEND
        res.status(200).json({
            message: "Admin login successful",
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


adminRouter.get("/admindetails", async (req, res) => {
    try {
        const adminDetail = await Admin.find();
        res.status(200).json({ msg: 'Admin fetched successfully', adminDetail });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = adminRouter;
