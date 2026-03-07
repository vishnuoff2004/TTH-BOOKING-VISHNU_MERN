import {Link, useNavigate} from "react-router-dom"
import React,{useEffect,useState} from "react"
import axios from "axios"
import API from "../api";
 
export default function UserBooking(){

        const [userMovie,setUserMovie] = useState([])
        const navigate = useNavigate()

        useEffect(()=>{
            getUserDetail();
        },[removeFn])

        async function getUserDetail(){
            const getUser = localStorage.getItem("id")
            let res = await axios.get(`${API}/bill/userDetail`,{params:{user:getUser}})
            setUserMovie(res.data.userDetails)
        }

        async function removeFn(id) {
            let res = await axios.delete(`${API}/bill/delteBookings/${id}`)
            console.log(res.data.msg)
        }

        function handleLogOut(){
            localStorage.removeItem('tokennnnnnn')
            navigate('/')
        }

    return(
        <div className="container " >
            <div className="userDetail-con" data-bs-toggle='offcanvas' data-bs-target="#userOffcanvas">users</div>

            <div className="offcanvas offcanvas-end bg-dark text-light"  id="userOffcanvas" data-bs-scroll="true" data-bs-backdrop="true" >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-tittle fw-bold">USER BOOKINGS</h5>
                    <button type="button" className="btn-close  bg-light" data-bs-dismiss="offcanvas"></button>
                </div>

            <div className="offcanvas-body">
                {
                    userMovie.map((i,index)=>(
                <div className="offcanvas-body" key={index}>
                  <div className="d-flex flex-column justify-content-between ">
                    <div className="container d-flex justify-content-around booking-con">
                        <div>
                            <img src={i.movie.image} alt="" style={{height:'80px',width:'120px',objectFit:'center'}}/>
                        </div>
                        <div className="ms-3">
                            <h5 className="fw-bold">{i.movie.movie_name}</h5>
                            <span>Today,7:30 PM</span> <br />
                            <span style={{whiteSpace:"pre-line"}}>Seat: {i.seats.join("\n")}</span>
                            <div className="btnbooking mt-1" onClick={()=>removeFn(i._id)}>Cancel Booking</div>
                        </div>
                    </div>
                    

                    </div>
                </div>
                    ))
                }
                    <div className="container user-footer d-flex justify-content-around userAbout " style={{position:'absolute',bottom:'-1px',left:'0'}}>
                        <div>
                            <ion-icon name="people-circle-outline" style={{fontSize:"50px"}}></ion-icon>
                        </div>
                        <div className="d-flex">
                            <div className="me-3">
                            <div>Name: {userMovie[0]?.user.fullname}</div>
                            <div>email:{userMovie[0]?.user.email}</div>
                            </div>
                            <div className="my-auto">
                               <div onClick={handleLogOut}><span><ion-icon className="logout-Btn"  style={{fontSize:'25px',color:"white"}} name="log-out-outline"></ion-icon></span></div>
                            </div>
                        </div>
                    </div>
            </div>
            </div>
        </div>
    )
}