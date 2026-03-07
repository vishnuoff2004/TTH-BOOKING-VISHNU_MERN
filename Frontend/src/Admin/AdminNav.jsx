import React, { useEffect,useState } from 'react'
import { NavLink,useNavigate } from "react-router-dom"
import axios from "axios";
import API from "../api";


const AdminNav = () => {

  const navigate = useNavigate()

  const ActiveStyle = {
    backgroundColor: "rgba(205, 91, 91, 0.3)",
    borderRadius: "5px",
    padding: "5px",
    color: "white",
    textDecoration:'none'
  }

  const [adminDetails,setAdminDetails] = useState('')
  
  useEffect(()=>{
    fetchAdmin()
  },[])

  async function fetchAdmin(){
    let res = await axios.get(`${API}/admin/admindetails`)
    setAdminDetails(res.data.adminDetail)
  }


  function AdminLogOut(){
      navigate("/home")
  }

  return (
    <div  style={{width:'300px',position:'fixed',top:'0',left:'20px'}}>
      <div className="container col-lg-12 col-md-12"  >

        <div className="d-flex pt-5 ">
          <div>
            <ion-icon className="m-1 px-0 me-2" name="people-circle-outline" style={{ fontSize: '50px' }}></ion-icon>
          </div>
          <div className='d-flex flex-column'>
            <span className='mt-1'>{adminDetails[0]?.name}</span>
            <span>tickect Booking</span>
          </div>
        </div>

        <div className='' >

          <div>

            <NavLink
              to="/admindashboard"
              style={({ isActive }) => (isActive ? ActiveStyle : { textDecoration: "none", color: "white" })}
              className="d-flex align-items-center my-2"
            >
              <ion-icon className="mx-3" name="grid-outline" style={{ fontSize: '25px' }}></ion-icon>
              Dashboard
            </NavLink>

            <NavLink
              to="/adminbooking"
              style={({ isActive }) => (isActive ? ActiveStyle : { textDecoration: "none", color: "white" })}
              className="d-flex align-items-center my-2"
            >
              <ion-icon className="mx-3" name="film-outline" style={{ fontSize: '25px' }}></ion-icon>
              Bookings
            </NavLink>

            <NavLink
              to="/ticketForm"
              style={({ isActive }) => (isActive ? ActiveStyle : { textDecoration: "none", color: "white" })}
              className="d-flex align-items-center my-2"
            >
              <ion-icon className="mx-3" name="document-text-outline" style={{ fontSize: '25px' }} ></ion-icon>
              set showTimes
            </NavLink>

            

          </div>

        <div style={{position:'fixed',bottom:'10px',left:'25px'}}>
          <div className="admin-logout-btn d-flex align-items-center" onClick={AdminLogOut}>
            <ion-icon className="mx-3" name="log-in-outline" style={{ fontSize: '25px' }}></ion-icon>
            Log Out
          </div>
        </div>

        </div>

      </div>
    </div>
  )
}

export default AdminNav
