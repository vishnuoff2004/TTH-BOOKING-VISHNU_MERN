import React,{useEffect,useState} from 'react'
import axios from "axios"
import API from "../api";

import "./Admin.css"


const Admin2 = () => {

    // const api = "http://localhost:5000"

    const [movie,setMovie] = useState([])
    const [theater,setTheater] = useState([])
    const [screen,setScreen] = useState([])
    const [selectedTheater,setSelectedTheater] = useState("")

    const [showtimes,setShowtimes] = useState({
      movie:'',
      theater:'',
      screen:'',
      start_time:'',
      end_time:'',
      show_mood:[],
      ticket_price:''
    })


    useEffect( ()=>{
        fetchMovies()
        fetchTheaters()
        fetchScreen()
    },[])

  async function fetchMovies(){
       let res = await axios.get(`${API}/movies/movie`);
       setMovie(res.data.movie)
    }

  async function fetchTheaters(){
       let res = await axios.get(`${API}/theaters/theater`);
       setTheater(res.data.theater)
    }

  async function fetchScreen(){
       let res = await axios.get(`${API}/screens/screen`);
       setScreen(res.data.screen)

    }


    function oc(e){
      const {name,value} = e.target;

      setShowtimes(prev =>({
        ...prev,
        [name]:value
      }))

    if(name === "theater"){
      setSelectedTheater(e.target.value)
    }   
    }


    async function os(){
      try{

        const {movie,theater,screen,start_time,ticket_price} = showtimes
        
        if(!movie || !theater || !screen || !start_time || !ticket_price){
              alert("Please fill all fields");
          return 
        }
      const res = await axios.post(`${API}/showTimes/showTime`,showtimes)
        alert(res.data.message)

      }
      catch(error){
        if(error.response.data){
           alert(error.response.data.message)
        }
        else{
            alert("Something went wrong while adding showtime");
        }
        
      }
    }

    const showMood = ["midnight","morning","evening","afternoon"];

    function toogleChexbox(e){
      const {value,checked} = e.target;

      setShowtimes(prev => ({...prev,show_mood: checked ? [...prev.show_mood,value] : prev.show_mood.filter(i => i != value )}))
    }

    console.log(showtimes)

  return (
    <>

<div className="row   rounded-2 mt-3 upload-sec" style={{backgroundColor:'#DCDCDC'}}>
    <div className='d-flex'>
      <span><ion-icon name="timer-outline" className="upload-logo me-2"></ion-icon></span>
      <h4>Upload Movies</h4>
    </div>

    <div className="row">
      <div className="col col-lg-2">
            <span>Selected Movie</span> <br />
            <select name="movie" id="" onChange={oc} value={showtimes.movie}>
              <option value="">select movie</option>
                {
                  movie.map((item,index)=>(
                    <option value={item._id} key={index} >{item.movie_name}</option>
                  ))
                }
            </select>
      </div>
      <div className="col col-lg-2">
            <span>Selected Theater</span> <br />
            <select name="theater" id=""  onChange={oc} value={showtimes.theater}>
              <option value="">select theater</option>
              {
                theater.map((item,index)=>(
                  <option key={index} value ={item._id}>{item.theater_name}</option>
                ))
              }
            </select>
      </div>
      <div className="col col-lg-2">
                <span>Selected Screen</span> <br />
                <select name="screen" id="" onChange={oc} value={showtimes.screen}>
                  <option value="">select screen</option>
                  {
                    screen.filter(g => g.theater === selectedTheater).map((item,index)=>(
                      <option value={item._id} key={index}>{item.screen_name}</option>
                    ))
                  }
                </select>
      </div>

      <div className="col col-lg-2">
              <span>start_Time</span> <br />
              <input type="datetime-local" onChange={oc} name="start_time" value={showtimes.start_time}/>
      </div>
      <div className="col col-lg-2">
              <span>end_Time</span> <br />
              <input type="datetime-local" onChange={oc} name="end_time" value={showtimes.end_time}/>
      </div>

      <div className="col col-lg-2">
                <span>ticket_price</span>
                <input type="Number" name="ticket_price" onChange={oc} value={showtimes.ticket_price}  />
      </div>

            <div className="col col-lg-2 d-flex mt-3 flex-row  w-auto">
              <span>show_Mod</span> <br />
              {
                showMood.map((i,index)=>{
                    return <div key={index} > <input type="checkbox" onChange={toogleChexbox} name={i} value={i} checked = {showtimes.show_mood.includes(i)}/>{i}</div>
                })
              }
      </div>

      <div className="col col-lg-2  d-flex align-items-center ms-auto">
              <button onClick={os} className=' btn-danger  btn text-light rounded-3 px-5 py-0  '>+ Add</button>
      </div>
    </div>
</div>
    </>
    )
}

export default Admin2