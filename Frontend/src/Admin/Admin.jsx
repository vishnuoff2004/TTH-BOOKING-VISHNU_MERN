import { useState } from "react";
import axios from "axios";
import API from "../api";

export default function Admin({ refreshCarousel, closeModal }) {
  const initialState = {
    title: "",
    action: false,
    crime: false,
    thriller: false,
    comedy: false,
    date: "",
    duration: "",
    movieType: "pg",
    director: "",
    stars: "",
    theme: "",
    image: null,
  };

  const [carouselDetails, setCarouselDetails] = useState(initialState);

  function oc(e) {
    const { name, value, type, files, checked } = e.target;

    setCarouselDetails((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  }

  async function os(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      for (const key in carouselDetails) {
        formData.append(key, carouselDetails[key]);
      }

      const res = await axios.post(`${API}/display/dis`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);

      if (refreshCarousel) {
        await refreshCarousel();
      }

      setCarouselDetails(initialState);

      if (closeModal) {
        closeModal();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      className="text-light col-lg-10 col-md-10 mx-auto"
      style={{ backgroundColor: "rgba(205, 91, 91, 0.3)" }}
    >
      <form
        className="carousel-inp-con px-4 py-2 rounded-3"
        style={{ boxShadow: "2px 2px 10px black" }}
        onSubmit={os}
      >
        <h5 className="text-center">Carousel Item</h5>

        <label className="mb-2 w-100">
          movie title :
          <input
            type="text"
            name="title"
            onChange={oc}
            value={carouselDetails.title}
            className="form-control mt-1"
            required
          />
        </label>

        <label className="mb-2 me-3">
          action:
          <input
            type="checkbox"
            name="action"
            onChange={oc}
            checked={carouselDetails.action}
            className="ms-2"
          />
        </label>

        <label className="mb-2 me-3">
          crime:
          <input
            type="checkbox"
            name="crime"
            onChange={oc}
            checked={carouselDetails.crime}
            className="ms-2"
          />
        </label>

        <label className="mb-2 me-3">
          thriller:
          <input
            type="checkbox"
            name="thriller"
            onChange={oc}
            checked={carouselDetails.thriller}
            className="ms-2"
          />
        </label>

        <label className="mb-2 me-3">
          comedy:
          <input
            type="checkbox"
            name="comedy"
            onChange={oc}
            checked={carouselDetails.comedy}
            className="ms-2"
          />
        </label>

        <label className="mb-2 w-100">
          date:
          <input
            type="number"
            name="date"
            onChange={oc}
            value={carouselDetails.date}
            className="form-control mt-1"
          />
        </label>

        <label className="mb-2 w-100">
          duration:
          <input
            type="text"
            name="duration"
            onChange={oc}
            value={carouselDetails.duration}
            className="form-control mt-1"
          />
        </label>

        <label className="mb-2 w-100">
          movie type:
          <select
            name="movieType"
            onChange={oc}
            value={carouselDetails.movieType}
            className="form-select mt-1"
          >
            <option value="pg">pg</option>
            <option value="pg-13">pg-13</option>
          </select>
        </label>

        <label className="mb-2 w-100">
          director:
          <input
            type="text"
            name="director"
            onChange={oc}
            value={carouselDetails.director}
            className="form-control mt-1"
          />
        </label>

        <label className="mb-2 w-100">
          stars:
          <input
            type="text"
            name="stars"
            onChange={oc}
            value={carouselDetails.stars}
            className="form-control mt-1"
          />
        </label>

        <label className="mb-2 w-100">
          theme:
          <input
            type="text"
            name="theme"
            onChange={oc}
            value={carouselDetails.theme}
            className="form-control mt-1"
          />
        </label>

        <label className="mb-2 w-100">
          bgimage:
          <input
            type="file"
            name="image"
            onChange={oc}
            className="form-control mt-1"
            required
          />
        </label>

        <div className="d-flex">
          <button className="btn btn-danger px-4 py-1 mt-4 ms-auto" type="submit">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}