
// import { createContext, useState } from "react";
// import axios from "axios";
// import API from "../api";

// export const MovieContext = createContext();

// export default function MovieProvider({children}){

//     const [selectedMovie, setSelectedMovie] = useState(null);
//     const [searchQuery, setSearchQuery] = useState(""); 
//     const [showtimesTheaterId,setShowTimesTheaterId] = useState('')  
//     const [updateShowId,setUpdateShowId] = useState('') 
//     const [auth,setAuth] = useState({
//         role:'',
//         userId:''
//     })


//   const [movieform,setMovieForm] = useState({
//     id:'',
//     movie_name:'',
//     genre:'',
//     language:'',
//     duration:'',
//     image:null,
//   })

//   const [theaterForm,setTheaterForm] = useState({
//     theater_name:'',
//     location:'',
//   })

//   const [screenForm,setScreenForm] = useState({
//     screen_name:'',
//     rows:'',
//     cols:'',
//   })

//     // const api = "http://localhost:5000";

//     async function movies(item){
//         try{
//             let res = await axios.get(`${API}/showtimes/selectedMovie`, {
//                 params: { movie_name: item.movie_name }
//             });
//             setSelectedMovie(res.data.showTime);
//         } catch(error){
//             if(error.response?.data){
//                 console.log(error.response.data.message);
//             }
//         }
//     }

//     console.log(auth)
//     return(
//         <MovieContext.Provider value={{
//             setAuth,
//             auth,
//             showtimesTheaterId,
//             updateShowId,
//             setUpdateShowId,
//             setShowTimesTheaterId,
//             movieform,
//             theaterForm,
//             screenForm,
//             setScreenForm,
//             setTheaterForm,
//             setMovieForm,
//             movies,
//             selectedMovie,
//             searchQuery,
//             setSearchQuery    
//         }}>
//             {children}
//         </MovieContext.Provider>
//     )
// }
import { createContext, useState } from "react";

export const MovieContext = createContext();

export default function MovieProvider({ children }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showtimesTheaterId, setShowTimesTheaterId] = useState("");
  const [updateShowId, setUpdateShowId] = useState("");
  const [auth, setAuth] = useState({
    role: "",
    userId: "",
  });

  const [movieform, setMovieForm] = useState({
    id: "",
    movie_name: "",
    genre: "",
    language: "",
    duration: "",
    image: null,
  });

  const [theaterForm, setTheaterForm] = useState({
    theater_name: "",
    location: "",
  });

  const [screenForm, setScreenForm] = useState({
    screen_name: "",
    rows: "",
    cols: "",
  });

  function movies(item) {
    setSelectedMovie(item);
  }

  return (
    <MovieContext.Provider
      value={{
        setAuth,
        auth,
        showtimesTheaterId,
        updateShowId,
        setUpdateShowId,
        setShowTimesTheaterId,
        movieform,
        theaterForm,
        screenForm,
        setScreenForm,
        setTheaterForm,
        setMovieForm,
        movies,
        selectedMovie,
        setSelectedMovie,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}
