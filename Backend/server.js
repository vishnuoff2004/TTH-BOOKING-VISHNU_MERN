const express  = require('express')
require("dotenv").config();
const app = express();
const router = require("./users/signup")
const dis = require("./components/display")
const cors  = require("cors")
const port  = 5000;
const path = require("path");
const movieRouter = require('./components/movie');
const theaterRouter = require("./components/theater")
const screenRouter = require("./components/screen")
const showTimesRouter = require("./components/showtimes");
const adminRouter = require('./components/Admin');
const bcrypt = require('bcrypt')
const { Admin } = require("./db/mongoose");
const BookingsRouter = require('./components/bookings');
const AdminDashboardRouter = require("./components/AdminDashboard")
const updateFormRouter = require("./components/adminUpdateForm")
const adminVerify = require("./components/verifyToken")


app.use(express.json())
app.use(cors())
app.use("/Auth",router)
app.use("/display",dis)
app.use("/movies",movieRouter)
app.use("/theaters",theaterRouter)
app.use("/screens",screenRouter)
app.use("/showTimes",showTimesRouter)
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use("/movieImages",express.static(path.join(__dirname,"movieImages")))
app.use("/admin",adminRouter)
app.use("/bill",BookingsRouter)
app.use("/adminDashboard",adminVerify,AdminDashboardRouter)
app.use("/updateform",adminVerify,updateFormRouter)

async function createDefaultAdmin() {
  try {
    const adminname = "admin";
    const pass = "admin123";

    const existingAdmin = await Admin.findOne({ name: adminname });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(pass, 10);
      const admin = new Admin({ name: adminname, password: hashedPassword });
      await admin.save();
      console.log("✅ Default admin created:", adminname);
    } else {
      console.log("✅ Admin already exists:", existingAdmin.name);
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
}

createDefaultAdmin();

app.listen(port,()=>{
    console.log("listened")
})