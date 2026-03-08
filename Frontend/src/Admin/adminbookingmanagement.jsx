import React from 'react'
import AdminNav from './AdminNav'
import { useEffect,useState } from 'react'
import axios from "axios"
import API from "../api";


const Adminbookingmanagement = () => {
    const [bookings,setBookings] = useState([])
    const [filtered,setFiltered] = useState([])
    const [search,setSearch] = useState('')
    const [currpage,setCurrPage] = useState(1);
    const [valPerPage,setValPerPage] = useState(4)

    const data = search ? filtered : bookings;

    const lastIndex = currpage * valPerPage;
    const firstIndex = lastIndex - valPerPage;

    const limitBookings = data.slice(firstIndex, lastIndex);
    const totPages = Math.ceil(data.length / valPerPage);


    useEffect(()=>{
        setFiltered(bookings.filter(i => {const movie = i.movie.movie_name.toLowerCase();return movie.includes(search.toLowerCase())}))
    },[search,bookings])
 

    useEffect(()=>{
        fetchBookings();
    },[])

    useEffect(() => {
    setCurrPage(1);
}, [search]);

    async function fetchBookings(){
        let res = await axios.get(`${API}/bill/adminBookings`)
        setBookings(res.data.adminBookings)
    }

    async function deleteFn(id){
        let res = await axios.delete(`${API}/bill/delteBookings/${id}`)
        console.log(res.data.msg)
        setFiltered(prev => (prev.filter(i => i._id != id)))
    }

function prevBtn() {
    if (currpage <= 1) {
        setCurrPage(1);
    }
    else{
        setCurrPage(curr => curr - 1 )
    }
}

function nextBtn() {
    if (currpage >= totPages) {
        setCurrPage(totPages)
    }
    else{
        setCurrPage(curr => curr + 1);
    }
}


  return (
    <div className=' row'>

    <div className='col col-lg-2'>
    <AdminNav></AdminNav>
    </div>

    <div className="container col col-lg-9 me-4">
        <div className='d-flex justify-content-between mt-5'>
            <h1>Manage Bookings</h1>
        <div>
          <div className="d-flex rounded-3" style={{position:'relative',backgroundColor:'black',maxWidth:'300px',border:'2px solid grey'}}>
            <input type="text" className="ps-5" placeholder="search Movie..." style={{border:'none',outline:'none',backgroundColor:'rgba(205, 91, 91, 0.3)',color:'white'}} onChange={(e)=>setSearch(e.target.value)} value={search}/>
            <ion-icon className="" name="search-outline" style={{position:'absolute',top:"5px",left:'15px',color:'white'}}></ion-icon>
          </div>
        </div>
        </div>
            <div className='table-con row mt-5 '>
                <table className="custom-table" >
                    <thead >
                    <tr>
                        <th>Booking Id</th>
                        <th>Customer Name</th>
                        <th>Show</th>
                        <th>Date</th>
                        <th>theater</th>
                        <th>screen</th>
                        <th>Seats</th>
                        <th>total price</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                       {
                        limitBookings.map((i,index)=>(
                            <tr key={index}>
                                <td>{i.user.email}</td>
                                <td>{i.user.fullname}</td>
                                <td>{i.movie.movie_name}</td>
                                <td>date</td>
                                {/* <td>{i.datenow}</td> */}
                                <td>{i.theater.theater_name}</td>


                                <td>{i.screen.screen_name}</td>
                                <td style={{ whiteSpace: "pre-line" }}>{i.seats.join("\n")}</td>
                                <td>{i.tot}</td>
                                <td>
                                    <button onClick={()=>deleteFn(i._id)} className='btn bg-danger' style={{color:'white'}}><ion-icon name="trash-outline"></ion-icon></button>
                                </td>

                            </tr>
                        ))
                       }
                    </tbody>
                    <tfoot className='tfoot-update'>
                        <tr>
                            <td colSpan={7} className='ps-5'>showing {currpage}-{totPages} </td>
                            <td colSpan={3} >
                                <button className='btn mx-5 ps-5  py-1' onClick={prevBtn}><ion-icon name="chevron-back-outline" className="pe-1" style={{fontSize:'20px',position:'absolute',top:'6px',left:"5px"}}></ion-icon> <span className=''>Previous</span> </button>
                                <button className='btn mx-3  pe-5 py-1' onClick={nextBtn}>Next <ion-icon name="chevron-forward-outline" style={{fontSize:'20px',position:'absolute',bottom:'6px', right:"5px"}}></ion-icon> </button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
    </div>

    </div>
  )
}

export default Adminbookingmanagement