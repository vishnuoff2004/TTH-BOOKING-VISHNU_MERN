import React,{useState} from 'react';
import axios from  "axios"
import API from "../api";
import "./Admin.css"
import Admin2 from './Admin2';
import AdminNav from './AdminNav';

const Admin1 = () => {

  const [movie,setMovies] = useState({
    movie_name:"",
    genre:[],
    language:"",
    duration:"",
    ratings:0,
    like:0,
    image:'',
    ratingCount:0,
    totRating:0
  })
  const [theater,setTheater] = useState({
    theatername:"",
    location:""
  })

  const [screen,setScreen] = useState({
    screenname:"",
    seats:0,
    theatername:'',
    rows:0,
    cols:0,
  })

  console.log(movie.image)


  function oc(e){
    const {name,value,checked,type,files} = e.target

    setMovies(prev=>{

    if(type === "checkbox" && checked){
      return{...prev,genre:[...prev.genre,value]}
    }
    else if(type === "checkbox" && !checked)
    {
      return {...prev,genre:prev.genre.filter(g => g !== value)}
    }
    else if(type === "file"){
      return {...prev,image:files[0]}
    }
    else{
       return {...prev,[name]:value}
    }
  })
  }

  function oc2(e){
    const {name,value} = e.target;
    setTheater(prev => ({...prev,[name]:value}))
  }

 async function os(e){
      const {name,files} = e.target;

      if(name === 'movie'){
        try{
          const formData = new FormData();
          for(let key in movie){
             formData.append(key,movie[key])
          }
          const res = await axios.post(`${API}/movies/movie`,formData,{
            headers:{
              "Content-Type":"multipart/form-data"
            }
          })
          console.log(res.data.message)
        }
        catch(error){
          console.log("error movie")
          if(error.response.data){
            console.log(error.response.data.message)
          }
        }
      }
      else if(name === "theater"){
        try{
          const res = await axios.post(`${API}/theaters/theater`,theater)
          console.log(res.data.message)
        }
        catch(error){
          console.log("error theater")
          console.log(res.data.message)
        }
      }
      else{
        try{
          const res = await axios.post(`${API}/screens/screen`,screen)
          console.log(res.data.message)
        }
        catch(error){
          if(error.response.data){
            console.log(error.response.data.message)
          }
        }
      }
 }


 function oc3(e){
  const {name,value} = e.target;
  setScreen(prev =>({...prev,[name]:value}))
 }

  return (
    <div className="container-fluid row ">
      <div className='col col-lg-3'>
       <AdminNav></AdminNav>
      </div>
      <div className='col col-lg-9 mt-5'>
      <div className="row">
        <h3 className='fw-bold'>Theater Management Dashboard</h3>
        <div>Manage movies,Theaters,Screens,and ShowTimes</div>
      </div>

<div className="row movie-section" style={{backgroundColor:'#DCDCDC'}}>

      <div className="row">
        <div className='d-flex'>
                <span><ion-icon name="videocam-outline" className="movie-logo mx-2"></ion-icon></span>
                <h4>Add New Movie</h4>
        </div>
      </div>

<div className="row">
        <div className='col col-lg-6'>
            <span>Movie Title</span>  <br />
            <input type="text" onChange={oc} value={movie.movie_name} name="movie_name"/>
        </div>

        <div className='col col-lg-6'>
           <span>Duration </span> <br />
           <input type="text" onChange={oc} name="duration"/>
        </div>
</div>


<div className='row'>
          <span>Genre(s)</span> <br />
          <div className='d-flex'>
          action:<input type="checkbox" onChange={oc} value="action" checked={movie.genre.includes("action")} name="genre"/>
          comedy:<input type="checkbox" onChange={oc} value="comedy" checked={movie.genre.includes("comedy")} name="genre"/>
          adventure:<input type="checkbox" onChange={oc} value="adventure" checked={movie.genre.includes("adventure")} name="genre"/>
          thriller:<input type="checkbox" onChange={oc} value="thriller" checked={movie.genre.includes("thriller")} name="genre"/>
          </div>
</div>

<div className='row'>
        <div className='col col-lg-6'>
          <span>language:</span> <br />
          <select name="language" id="" onChange={oc} value={movie.language} >
            <option value="">Select Language</option>
            <option value="english">english</option>
            <option value="tamil">tamil</option>
            <option value="tamil-dubbed">tamil-dubbed</option>
          </select>
        </div>

        
        <div className='col col-lg-6'>
          <span>Movie File</span> <br />
          <input type="file" name="image" onChange={oc}/>
        </div>
</div>
<button className=' btn-danger  btn rounded-2 text-light add-movie-btn mt-2' onClick={os} name="movie"> + Add Movie</button>
</div>

<div className='d-flex justify-content-between '>
<div className="col col-lg-5 theater-con  rounded-2" style={{backgroundColor:'#DCDCDC'}}>
  <div className='d-flex'>
      <span><ion-icon name="film-outline" className="theater-logo me-2"></ion-icon></span>
      <h4>Theater</h4>
  </div>



        <div className='col'>
          <span>Theater Name</span> <br />
           <input className='w-100' type="text" name="theatername" onChange={oc2} value={theater.theatername}/>
        </div>

        <div className='col'>
          <span>Location</span> <br />
          <input type="text" name="location"  onChange={oc2} value={theater.location}/>
        </div>


        

    <button onClick={os} name="theater" className=' btn-danger  btn text-light add-theater-btn rounded-2 mt-3'>+ Add Theater</button>

</div>
    
<div className="col col-lg-6 ">
<div className="row rounded-2 mt-3 screen-sec" style={{backgroundColor:'#DCDCDC'}}>
  <div className="d-flex">
    <span><ion-icon name="tv-outline" className="screen-logo me-3"></ion-icon></span>
    <h4>Screen</h4>
  </div>

<div className="row">
  <div className="col col-lg-6">
            <span>screename</span> <br />
            <input type="text" name="screenname" onChange={oc3}  value={screen.screenname}/>
  </div>
  <div className="col col-lg-6">
            <span>total no.of.seats:</span> <br />
            <input type="Number" name="seats" onChange={oc3} value={screen.seats}/>
  </div>
  <div className="col col-lg-4">
            <span>theater name:</span> <br />
            <input type="text" name="theatername" onChange={oc3} value={screen.theatername}/>
  </div>
  <div className="col col-lg-4">
            <span>rows in theater:</span> <br />
            <input type="Number" name="rows" onChange={oc3} value={screen.rows}/>
  </div>
  <div className="col col-lg-4">
            <span>cols in theater:</span> <br />
            <input type="Number" name="cols" onChange={oc3} value={screen.cols}/>
  </div>
</div>

<button onClick={os} name="screen" className='add-screen-btn btn-danger  btn rounded-2 text-light mt-3 ms-2' >+ Add Screen</button>

</div>
</div>
</div>

<Admin2></Admin2>
           
    </div>

</div>

  )
}

export default Admin1