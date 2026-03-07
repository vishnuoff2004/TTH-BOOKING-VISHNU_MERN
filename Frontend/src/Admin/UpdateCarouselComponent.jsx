import React, { useState } from "react";
import axios from "axios"

export default function UpdateCarouselComponent({ updateCarousel }) {
  const [updateform, setUpdateForm] = useState({
    title: updateCarousel.title,
    date: updateCarousel.date,
    duration: updateCarousel.duration,
    movieType: updateCarousel.movieType,
    director: updateCarousel.director,
    stars: updateCarousel.stars,
    theme: updateCarousel.theme,
    image: null,
  });


  function handleChange(e) {
    const { name, value, files } = e.target;
    setUpdateForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  async function updateFn(id){
     try{
        const form = new FormData();
        for(let key in updateform){
            form.append(key,updateform[key])
        }
        let res = await axios.put(`${API}/display/updateCarousel/${id}`,form,{headers:{"Content-Type":"multipart/form-data"}})
         console.log(res.data.msg)
     }
     catch(error){

     }
  }

  return (
    <div className="d-flex justify-content-center mt-4">
      <div
        className="card shadow p-3"
        style={{ width: "320px", borderRadius: "12px" }}
      >
        <h5 className="text-center mb-3">Edit Carousel</h5>

        {/* Title */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">Title</label>
          <input
            type="text"
            className="form-control form-control-sm"
            name="title"
            value={updateform.title}
            onChange={handleChange}
          />
        </div>

        {/* Date */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">Date</label>
          <input
            type="text"
            className="form-control form-control-sm"
            name="date"
            value={updateform.date}
            onChange={handleChange}
          />
        </div>

        {/* Duration */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">Duration</label>
          <input
            type="text"
            className="form-control form-control-sm"
            name="duration"
            value={updateform.duration}
            onChange={handleChange}
          />
        </div>

        {/* Movie Type */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">Movie Type</label>
          <input
            type="text"
            className="form-control form-control-sm"
            name="movieType"
            value={updateform.movieType}
            onChange={handleChange}
          />
        </div>

        {/* Director */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">Director</label>
          <input
            type="text"
            className="form-control form-control-sm"
            name="director"
            value={updateform.director}
            onChange={handleChange}
          />
        </div>

        {/* Stars */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">Stars</label>
          <input
            type="text"
            className="form-control form-control-sm"
            name="stars"
            value={updateform.stars}
            onChange={handleChange}
          />
        </div>

        {/* Theme */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">Theme</label>
          <input
            type="text"
            className="form-control form-control-sm"
            name="theme"
            value={updateform.theme}
            onChange={handleChange}
          />
        </div>

        {/* Image */}
        <div className="mb-2">
          <label className="form-label small fw-semibold">Image</label>
          <input
            type="file"
            className="form-control form-control-sm"
            name="image"
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary w-100 btn-sm mt-2" onClick={()=>updateFn(updateCarousel._id)}>Update</button>
      </div>
    </div>
  );
}
