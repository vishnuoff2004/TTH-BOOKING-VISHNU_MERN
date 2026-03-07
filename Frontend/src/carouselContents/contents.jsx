import "./contents.css"
import API from "../api";
import {useState,useEffect,useContext} from "react"
import axios from "axios"
export default function Contents({item}){
    return(
        <div className="container d-flex justify-content-center  contents-con">
        <div className=" container row vw-100 bg-danger" >
            <div className="col-6" style={{position:'absolute',bottom:"5px",left:'50px'}} >
                <h1>{item.title}</h1>
                <p style={{fontSize:'18px'}}>{item.action == true?"Action":""} , {item.crime == true?"Crime":""} ,{item.thriller == true?"Thriller":""} {item.comedy == true?", comedy":""}
                    <span className="ms-1 assign" ><ion-icon name="calendar-outline" className="gold mx-1" style={{fontSize:'20px'}}></ion-icon> <span>{item.date}</span></span> 
                    <span className="ms-1 assign"><ion-icon name="time-outline" className="gold mx-1" style={{fontSize:'20px'}}></ion-icon></span> <span>{item.duration}</span>
                </p>
                <div className="d-flex Star ">
                    <div className="mx-1">
                        <ion-icon name="star-outline" className="gold"></ion-icon>
                        <ion-icon name="star-outline" className="gold"></ion-icon>
                        <ion-icon name="star-outline" className="gold"></ion-icon>
                        <ion-icon name="star-outline" className="gold"></ion-icon>
                        <ion-icon name="star-outline" className="gold"></ion-icon>
                    </div>
                    <div className="ms-4">
                            <p className="rating px-2">{item.movieType}</p>
                    </div>
                </div>
                {/* <div>
                    <button style={{fontSize:'18px'}} className="button">Book Tickets</button>
                    <button style={{fontSize:'18px'}} className="button">Review</button>
                    <button style={{fontSize:'18px'}} className="button">More</button>
                </div> */}
            </div>

            <div className="col-6 text-end pt-5" style={{position:'absolute',bottom:"-30px",right:'10px'}}>
                <p style={{fontSize:'18px'}}>{item.director}: <span className="gold">Director</span></p>
                <p style={{fontSize:'18px'}}>{(item.stars.length)>120 ? `${item.stars.slice(0,120)}...` : item.stars  }: <span className="gold">Stars</span></p>
                <p style={{fontSize:'18px'}}>{(item.theme.length)>120 ? `${item.theme.slice(0,120)}...` : item.theme }</p>
            </div>

        </div>        
        </div>
    )
}

