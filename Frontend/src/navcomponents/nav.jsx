
import "./nav.css"
import UserBooking from "../maincomponents/userBookings"
import { NavLink, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { MovieContext } from "../contextApi/MovieProvider"

export default function Nav(){

    const ActiveStyle = {
        backgroundColor:'gold',
        textDecoration:'none',
        color:"black",
        padding:'3px 5px',
        borderRadius:'5px'
    }
    const navigate = useNavigate()

    const { setSearchQuery } = useContext(MovieContext); // ⭐ Use context


    return(
        <div className="container ">
            <nav>
                <ul>
                    <div>
                        <li className="logo-con">
                            <img src="../public/logo.png" alt="" style={{height:"30px"}}/>
                            <p>Cinemagic</p>
                        </li>
                    </div>

                    <div>
                        <li>
                            <div
                                style={{
                                    position:'relative',
                                    backgroundColor:"#DCDCDC",
                                    width:'300px',
                                }}
                                className="rounded-pill"
                            >
                                <input 
                                    type="text" 
                                    className="ms-3 text-dark"
                                    style={{outline:'none',border:"none",backgroundColor:'transparent'}}
                                    placeholder=" search ..."
                                    onChange={(e)=> setSearchQuery(e.target.value)} // ⭐ Updates search query
                                />
                                <ion-icon name="search-outline" className="search"
                                    style={{position:'absolute',top:'3px',right:'10px', color:"black"}}
                                ></ion-icon>
                            </div>
                        </li>
{/* style={({ isActive }) => (isActive ? ActiveStyle : { textDecoration: "none", color: "white" })} */}
                        <li><NavLink to="/home"  className='homeNav-Comp' style={({isActive})=>(isActive ?  ActiveStyle:{color:'white',textDecoration:'none'})}>home</NavLink></li>
                        <li><UserBooking /></li>
                        <li><NavLink    to="/adminlogin" className='homeNav-Comp' style={{color:'white',textDecoration:'none'}}>Admin</NavLink></li>
                    </div>
                </ul>
            </nav>
        </div>
    )
}
