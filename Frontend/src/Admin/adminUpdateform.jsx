import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import API from "../api";
import { MovieContext } from "../contextApi/MovieProvider";
import { useNavigate } from "react-router-dom";

export default function UpdateForm() {
  const { movieform, setMovieForm} = useContext(MovieContext);

  const movieId = movieform.id;

  const [theaterList,setTheaterList] = useState([])

  const [theaterForm, setTheaterForm] = useState({
    id:'',
    theater_name: "",
    location: "",
  });

  const [screenList,setScreenList] = useState([])

  const [screenForm, setScreenForm] = useState({
    id:'',
    screen_name: "",
    rows: "",
    cols: "",
  });


const [theaterId,setTheaterId] = useState(null)
const navigatie = useNavigate()

useEffect(()=>{
  fetched();
},[])



useEffect(  ()=>{
  if(theaterForm.theater_name){
    const found = theaterList.find(i => i.theater_name == theaterForm.theater_name)
    setTheaterForm(prev => ({...prev,id:found._id,location:found.location}))
    setTheaterId(found._id)
  } 
  
},[theaterList,theaterForm.theater_name])

useEffect(()=>{
  if(theaterId){
   fetchDatas();
  }
},
[theaterId])


async function fetchDatas(){
  let res = await axios.get(`${API}/updateform/fetchScreen`,{params:{id:theaterId}})
  console.log(res.data.msg)
  setScreenList(res.data.screenList)
}

console.log(screenList)

async function fetched() {
  let res = await axios.get(`${API}/updateform/fetch`);
  setTheaterList(res.data.theaterList)
}

useEffect(()=>{
  if(screenList.length > 0){
 const selectedScreen =  screenList.find(i => i.screen_name == screenForm.screen_name)
 console.log(selectedScreen)
 if(selectedScreen){
 setScreenForm(prev=>({...prev,id:selectedScreen._id,cols:selectedScreen.cols,rows:selectedScreen.rows}))

 }
  }

},[screenList,screenForm.screen_name])

  function handleChange(e) {
    const { type, name, value, files, checked } = e.target;

    if (name === "genre") {
      if (checked) {
        setMovieForm((prev) => ({ ...prev, genre: [...prev.genre, value] }));
      } else {
        setMovieForm((prev) => ({
          ...prev,
          genre: prev.genre.filter((g) => g !== value),
        }));
      }
      return;
    }

    if (type === "file") {
      setMovieForm((prev) => ({ ...prev, image: files[0] }));
      return;
    }

    setMovieForm((prev) => ({ ...prev, [name]: value }));
  }

  async function updateMovie() {
    try {
      const formData = new FormData();
      Object.keys(movieform).forEach((key) => {
        formData.append(key, movieform[key]);
      });

      const res = await axios.put(
        `${API}/updateform/updateMovie/${movieId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function theaterUpdate(){
    try{
      let res = await axios.put(`${API}/updateform/updateTheater/${theaterId}`,theaterForm)
      console.log(res.data.msg)
    }
    catch(error){
      console.log(error);
      if(error.response || error.response.data){
        console.log(error.response.data.msg)
      }
    }
  }

  async function screenUpdate(){
    try{
      const screenId = screenForm.id
      let res = await axios.put(`${API}/updateform/updateScreen/${screenId}`,screenForm)
      console.log(res.data.msg,screenId)
    }
    catch(error){
      console.log(error);
      if(error.response || error.response.data){
        console.log(error.response.data.msg)
      }
    }  
  }

      console.log(screenForm.id)


  async function updateFns() {
    try {
      await updateMovie();
      await theaterUpdate();
      await screenUpdate();
      alert("Update Completed!");
    } catch (err) {
      alert("Update Failed");
    }
  }
  

  function backFn(){
    navigatie('/adminDashboard')
  }

  return (
    <div className="container fluid">
      <div className="d-flex justify-content-center mt-3">
        <ion-icon className="back-arrow" name="arrow-back-outline" onClick={backFn}></ion-icon>
        <h4>Movie & Theater Management</h4>
      </div>
      <div className="admin-up-form-Con container col-lg-8 mt-4 rounded-3 px-5 py-4" style={{backgroundColor:'rgba(205, 91, 91, 0.2)'}}>
          <h5>Movie &nbsp; <span>(update Movie name etc..)</span></h5>
          <hr />
          <div className="mt-2">
            <span>Movie Title</span> <br />
           <input type="text" name="movie_name" value={movieform.movie_name} onChange={handleChange} placeholder="Movie Name" />
          </div>


          <div className="mt-3">
            <span>Genre</span> <br />
            <div className="d-flex ">
        {["action", "comedy", "thriller"].map((g) => (
          <label key={g} className="d-flex justfiy-content-between  w-25">
            <input
              type="checkbox"
              name="genre"
              value={g}
              checked={movieform.genre.includes(g)}
              onChange={handleChange}
            />
            {g}
          </label>
        ))}   
        </div>       
          </div>


          <div className="d-flex justify-content-between mt-3">
            <div>
              <span>Language</span> <br />
              <div>
                  <input className="mt-2" type="text" name="language" value={movieform.language} onChange={handleChange} placeholder="Language" />
              </div>
            </div>

            <div >
                 <span>Duration</span> <br />
                <input className="mt-2" type="text" name="duration"  value={movieform.duration} onChange={handleChange} placeholder="Duration" />
            </div>

            <div>
              <span>Poster Image</span> <br />
               <input className="mt-2" type="file" name="image" onChange={handleChange} />
            </div>
          </div>

          <h5 className="mt-4">Theater &nbsp; <span>(Update Theater Location)</span></h5>
          <hr />
          <div className="d-flex justify-content-between mt-3">
            <div className="">
              <span>Select Theater</span><br />
                <select name="" id="" value={theaterForm.theater_name} onChange={(e)=>setTheaterForm(prev=> ({...prev,theater_name:e.target.value}))}>
                  <option value="">select theater</option>
                    {
                      theaterList.map((i,index)=>(
                      <option value={i.theater_name} key={index}>{i.theater_name}</option>
                       ))
                    }
                </select>
            </div>
            <div className="">
               <span>Location</span> <br />
               <input type="text" value={theaterForm.location} onChange={(e)=>setTheaterForm(prev => ({...prev,location:e.target.value}))}/>
            </div>
          </div>

           <h5 className="mt-4">Screen &nbsp; <span>(Update Rows & Cols)</span></h5>
            <hr />
            <div className="d-flex justify-content-between">
              <div>
                <span>Select Screen</span> <br />
                       <select name="" id="" value={screenForm.screen_name} onChange={(e)=>setScreenForm(prev => ({...prev,screen_name:e.target.value}))}>
                          <option value="">select screen</option>
                             {
                               screenList.map((i,index)=>(
                         <option value={i.screen_name} key={index}>{i.screen_name}</option>
                                    ))
                               }
                         </select>
              </div>
              <div>
                <span>Rows</span> <br />
                <input type="text" onChange={(e)=>setScreenForm(prev =>({...prev,rows:e.target.value}))} value={screenForm.rows}/>
              </div>
              <div>
                <span>Cols</span> <br />
                <input type="text" onChange={(e)=>setScreenForm(prev =>({...prev,cols:e.target.value}))} value={screenForm.cols}/>
              </div>
            </div>
          <div className="d-flex mt-3">
          <button className="btn btn-danger ms-auto" onClick={updateFns}>Update</button> 
          </div>
      </div>
    </div>
  );
}
