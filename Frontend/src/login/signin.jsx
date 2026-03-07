import React,{useState} from "react"
import API from "../api";
import "./signin.css"
import axios from "axios"
import { useNavigate,Link } from "react-router-dom";

export default function SignUp(){
    const [showPassword,setPassword] = useState(false);
    const [user,setUser] = useState({
        fullname:"",
        email:"",
        password:"",
        confrimPassword:"",
    })

    const navigate = useNavigate()
    
    // const api = "http://localhost:5000/Auth"

    async function os(){
        if(!user.fullname || !user.email || !user.password || !user.confrimPassword){
            alert("fill out all the feilds")
            return 
        }

        if(user.password !== user.confrimPassword){
            alert("password dosen't match")
            return
        }

        try{
            const res = await axios.post(`${API}/Auth/signup`,user)
            navigate("/")
        }
        catch(error){
  if (error.response && error.response.status === 400) {
    alert(error.response.data.message);  // Show "already exists"
  } else {
    alert("Something went wrong, please try again later.");
  }
        }
    }
    
    return(
    <>
    <div className="container d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
        <div className="signCon col col-lg-4 col-md-6 col-sm-9 col-9 rounded-3 p-5" style={{border:"2px solid yellow"}}>
            <div className="row">
            <div className="d-flex justify-content-center align-items-center">
                <div style={{position:'relative'}} className="me-4">
                    <ion-icon name="tv" style={{color:"yellow",position:"relative",top:0,left:0,fontSize:"30px"}}></ion-icon>
                    <ion-icon name="tv" style={{position:"absolute",top:"-10px",left:"15px",color:'yellow',fontSize:"30px"}}></ion-icon>
                </div>
                <h4>TheaterApp</h4>
            </div>
            </div>

            <div className="row">
                <p className="text-nowrap text-center fw-bolder  ">Create Your Account</p> <br />
                <div className="text-nowrap text-center">join us to discover the world of theater</div>
            </div>

            <div className="row p-2 my-2 inputs">
                <label>Full Name</label> <br />
                <input type="text" placeholder="Enter your full name" className="form-control fw-bolder "  onChange={(e)=>(setUser(prev => ({...prev,fullname:e.target.value})))} value={user.fullname}/>

                <label>Email</label> <br />
                <input type="text" placeholder="Enter your email address" className="form-control fw-bolder"  onChange={(e)=>(setUser(prev => ({...prev,email:e.target.value})))} value={user.email}/>


                <label>Password</label> <br />
                <div  className="password d-flex justify-content-between rounded">
                    <input type={showPassword ? "text":"password"}  placeholder="Enter your password" className="form-control fw-bolder"  onChange={(e)=>(setUser(prev => ({...prev,password:e.target.value})))} value={user.password}/>
                     {
                        showPassword?<button className="eyeBtn" onClick={()=>setPassword(false)}> <ion-icon name="eye-off"></ion-icon></button> : <button className="eyeBtn" onClick={()=>setPassword(true)}><ion-icon name="eye"></ion-icon></button> 
                     }
                </div>


                <label>Confrim Password</label> <br />
                <input type="text" placeholder="Re-enter your password"  className="form-control fw-bolder"  onChange={(e)=>(setUser(prev => ({...prev,confrimPassword:e.target.value})))} value={user.confrimPassword}/>
            </div>

            <div className="row my-3">
                <button className="btn fw-bold login-btn " style={{color:"white",backgroundColor:'brown'}} onClick={os}>Sign Up</button>
            </div>

            <div className="d-flex">
                <p className="text-nowrap mx-auto">Already have an account? <span>  <Link to="/">Login</Link> </span></p>
            </div>
        </div>
    </div>

    <h1>{user.confrimPassword}</h1>
    <h1>{user.password}</h1>
    </>
    )
}