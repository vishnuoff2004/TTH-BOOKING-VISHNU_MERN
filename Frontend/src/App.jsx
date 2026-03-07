import Login from "./login/login";
import "./App.css";
import SignUp from "./login/signin";
import Admin from "./Admin/Admin";
import SelectedMovie from "./selectedMovie/selectedMovie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./maincomponents/hompage";
import MovieProvider from "./contextApi/MovieProvider";
import AdminLogin from "./Admin/adminlogin";
import AdminDashboard from "./Admin/AdminMovieManagement";
import Adminbookingmanagement from "./Admin/adminbookingmanagement";
import Admin1 from "./Admin/Admin1";
import UpdateForm from "./Admin/adminUpdateform";
import ProtectedRoute from "./protectRoutes/protectedRoutes";
import Cant from "./Cant";

function App() {
  return (
    <MovieProvider>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/selected" element={<SelectedMovie />} />
          <Route path="/can't" element={<Cant />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/adminbooking" element={<Adminbookingmanagement />} />
            <Route path="/ticketForm" element={<Admin1 />} />
            <Route path="/adminUpdateForm" element={<UpdateForm />} />
          </Route>

        </Routes>
      </Router>
    </MovieProvider>
  );
}

export default App;
