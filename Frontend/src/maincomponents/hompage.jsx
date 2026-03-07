import "./home.css"
import Nav from "../navcomponents/nav"
import Contents from "../carouselContents/contents"
import { useEffect,useState,useContext } from "react"
import axios from "axios";
import API from "../api";
import Allmoives from "../allmoives/allmovies"

export default function Home(){

    const [display,setDisplay] = useState([])
    
      // const api = "http://localhost:5000/display"

      useEffect(() => {
          fetchData();
       }, [])

    
      async function fetchData(){
        const res = await axios.get(`${API}/display/dis`)
        setDisplay(res.data.carouItems)
      }



    return(
          <div className="container-fluid">
            <div id="theaterCarousel" className="carousel slide  vh-100 carousel-fade" data-bs-ride="carousel"  data-bs-interval="2000">

            <div className="nav-overlay " >
              <Nav />
            </div>

            <div className="carousel-indicators">
              {
                display.map((item,index)=>(
                    <button type="button" data-bs-target="#theaterCarousel" data-bs-slide-to = {index} className={index ===0 ? "active":''} key={index}></button>
                ))
              }
            </div>

            <div className="carousel-inner">
              {
                display.map((item,index)=>(
                    <div className={`carousel-item ${index === 0 ? "active":''}`} key={index}>
                        <img src={item.image} alt="" className="d-block w-100 vh-100 main-img"/>
                        <div className="contents-overlay">
                        <Contents item={item}></Contents>
                        </div>
                    </div>
                ))
              }
            </div> 

              <button className="carousel-control-prev" type="button" data-bs-target="#theaterCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon "></span>
                <span className="visually-hidden">Previous</span>
              </button>

              <button className="carousel-control-next" data-bs-target="#theaterCarousel"  type="button" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
                <span className="visually-hidden">Previous</span>
              </button>

            </div>

            <Allmoives></Allmoives>
          </div>
    )
}
