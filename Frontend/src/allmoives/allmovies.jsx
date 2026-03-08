// import React, { useEffect, useState, useContext } from 'react'
// import "./allmovies.css"
// import API from "../api";
// import { MovieContext } from "../contextApi/MovieProvider"
// import { useNavigate } from "react-router-dom"

// export default function Allmovies(){

//     const [allMovies, setAllMovies] = useState([]);
//     console.log(allMovies)

//     const { movies, searchQuery,setAuth } = useContext(MovieContext); 
//     const navigate = useNavigate();


//     useEffect(() => { getData()}, []);

//     async function getData(){
//         try{
//              await fetch(`${API}/movies/fetch`,
//                 {
//                 method:'GET',
//                 headers:{
//                     "Content-Type":'application/json',
//                     "authorization":`Bearer ${localStorage.getItem("tokennnnnnn")}`
//                 }
//             }
//             ).then(res =>res.json()).then(data => (setAuth(data.decoded), setAllMovies(data.movie),console.log(data.movie))).catch(err => console.log(err))
           
//         } catch(error){
//             console.log(error.response?.data?.message);
//         }
//     }

//     // ⭐ Filter Movies
//     const filteredMovies = allMovies.filter(item =>
//         item.movie_name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     function choosedMovie(item){
//         movies(item);
//         navigate("/selected");
//     }

//     return (
//         <div className="container-fluid mt-5">
//             <div className="container">
//                 <h3>Our Movies Collection</h3>

//                 <div className="row">
//                     {filteredMovies.map((item, index) => (
//                         <div
//                             className="col col-lg-2 col-md-3 col-sm-4 my-2"
//                             key={index}
//                             onClick={() => choosedMovie(item)}
//                         >
//                             <div className="card bg-dark theater-card">
//                                 <img 
//                                     src={item.image} 
//                                     className='card-img-top theater-card-img'
//                                 />
//                                 <div className="card-body text-light fw-bold">
//                                     <h5>{item.movie_name}</h5>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}

//                     {filteredMovies.length === 0 && (
//                         <p className="text-center text-light mt-3">Login for view movies </p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }
import React, { useEffect, useState, useContext } from "react";
import "./allmovies.css";
import API from "../api";
import { MovieContext } from "../contextApi/MovieProvider";
import { useNavigate } from "react-router-dom";

export default function Allmovies() {
  const [allMovies, setAllMovies] = useState([]);

  const { movies, searchQuery, setAuth } = useContext(MovieContext);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const res = await fetch(`${API}/movies/fetch`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("tokennnnnnn")}`,
        },
      });

      const data = await res.json();
      setAuth(data.decoded);
      setAllMovies(data.movie || []);
    } catch (error) {
      console.log(error.message);
    }
  }

  const filteredMovies = allMovies.filter((item) =>
    item.movie_name.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  function choosedMovie(item) {
    movies(item);
    navigate("/selected");
  }

  return (
    <div className="container-fluid mt-5">
      <div className="container">
        <h3>Our Movies Collection</h3>

        <div className="row">
          {filteredMovies.map((item, index) => (
            <div
              className="col col-lg-2 col-md-3 col-sm-4 my-2"
              key={item._id || index}
              onClick={() => choosedMovie(item)}
              style={{ cursor: "pointer" }}
            >
              <div className="card bg-dark theater-card">
                <img
                  src={item.image}
                  alt={item.movie_name}
                  className="card-img-top theater-card-img"
                />
                <div className="card-body text-light fw-bold">
                  <h5>{item.movie_name}</h5>
                </div>
              </div>
            </div>
          ))}

          {filteredMovies.length === 0 && (
            <p className="text-center text-light mt-3">Login for view movies</p>
          )}
        </div>
      </div>
    </div>
  );
}

