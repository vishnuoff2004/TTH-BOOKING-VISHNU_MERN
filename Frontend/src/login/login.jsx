import {useState} from "react"
import "./login.css"
import API from "../api";
import axios from "axios"
import {Link,useNavigate} from "react-router-dom"



export default function Login(){

    const [showPassword,setPassword] = useState(false)
    const [user,setUser] = useState({
        email:"",
        password:"",
    })

    const navigate = useNavigate()

    // const api = "http://localhost:5000/Auth"

    async function os(){
        try{
            const res = await axios.post(`${API}/Auth/login`,user)
            alert(res.data.message)
            localStorage.setItem("tokennnnnnn",res.data.token)
            localStorage.setItem("id",res.data.id)
            localStorage.setItem("username",res.data.username)
            localStorage.setItem("email",res.data.email)
            navigate("/home")
        }
        catch(error){
            console.log(error)
        }
    }

    return(
        <>
        <div className="container d-flex justify-content-center " style={{flexDirection:"column",height:"100vh"}} >
            <div className="mb-2 pe-3 d-flex align-items-center pt-3" style={{flexDirection:"column"}}>
                <div style={{position:'relative'}} className="">
                    <ion-icon name="tv" style={{color:"yellow",position:"relative",top:0,left:0,fontSize:"30px"}}></ion-icon>
                    <ion-icon name="tv" style={{position:"absolute",top:"-10px",left:"15px",color:'yellow',fontSize:"30px"}}></ion-icon>
                </div>
                <h4 style={{fontFamily:"Montserrat",fontWeight:"bolder"}}>TheaterApp</h4>
            </div>
            <div className="container d-flex flex-column justify-content-center align-items-center" >
               <div style={{}} className="logInp p-5 rounded-4 ">
                <h1 style={{fontFamily:"Montserrat",fontWeight:"bolder"}}>Welcome Back</h1>
              
                <label className="" style={{fontFamily:"Montserrat",fontWeight:"lighter"}}>Email Address</label>
                <div>
                <input type="text" name='email' className="w-100 m-1"  onChange={(e)=>{setUser(prev =>({...prev,email:e.target.value}))}} value={user.email}/><br />
                <label htmlFor="password"  style={{fontFamily:"Montserrat",fontWeight:"lighter"}}>Password</label>
                </div>

                <div style={{backgroundColor:"white"}} className="d-flex justify-content-between">
                    <input type={showPassword ? "text":"password"} className=" m-1" onChange={(e)=>(setUser(prev => ({...prev,password:e.target.value})))} value={user.password}/>
                     {
                        showPassword?<button className="eyeBtn" onClick={()=>setPassword(false)}> <ion-icon name="eye-off"></ion-icon></button> : <button className="eyeBtn" onClick={()=>setPassword(true)}><ion-icon name="eye"></ion-icon></button> 
                     }
                </div>

                <div className="d-flex">
                <span className="ms-auto m-1"  style={{fontFamily:"Montserrat",fontWeight:"lighter"}}>ForgotPassword?</span>
                </div>

                <button className="w-100 m-1 btn login-btn"  style={{fontFamily:"Montserrat",fontWeight:"lighter",backgroundColor:'brown',color:"white"}} onClick={()=>{os()}}>Login</button>

                <div className="m-1"  style={{fontFamily:"Montserrat",fontWeight:"lighter"}}>Don't have an account? <Link to="/signup" style={{}}>Signup</Link>

                </div>
                </div> 
            </div>
        </div>
        </>
    )
}