import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { MovieContext } from "../contextApi/MovieProvider";

export default function ProtectedRoute() {
  const { auth } = useContext(MovieContext);

  // Allow only admin
  if (auth && auth.role === "admin") {
    return <Outlet />;
  }

  // Otherwise redirect
  return <Navigate to="/adminlogin" />;
}
