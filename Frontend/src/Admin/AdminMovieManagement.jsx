import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Admin.css";
import API from "../api";
import Admin from "./Admin";
import AdminNav from "./AdminNav";
import UpdateCarouselComponent from "./UpdateCarouselComponent";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../contextApi/MovieProvider";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [filteredMovie, setFilteredMovie] = useState([]);
  const [search, setSearch] = useState("");
  const [addCarousel, setAddCarousel] = useState(false);
  const [updateCarousel, setUpdateCarousel] = useState(null);
  const [carouselItems, setCarouselItems] = useState([]);

  const {
    setMovieForm,
    setTheaterForm,
    setScreenForm,
    setShowTimesTheaterId,
    setUpdateShowId,
  } = useContext(MovieContext);

  useEffect(() => {
    const searchItem = search.toLowerCase();

    setFilteredMovie(
      movies.filter((i) => {
        const lowercase = i.movie.movie_name.toLowerCase();
        return lowercase.includes(searchItem);
      })
    );
  }, [search, movies]);

  useEffect(() => {
    fetchMovies();
    getCarousel();
  }, []);

  async function fetchMovies() {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/adminlogin");
        return;
      }

      const res = await axios.get(`${API}/adminDashboard/movies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMovies(res.data.moviesCollection);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/adminlogin");
      }
      console.log(error);
    }
  }

  async function getCarousel() {
    try {
      const res = await axios.get(`${API}/display/dis`);
      setCarouselItems(res.data.carouItems);
    } catch (err) {
      console.log(err);
    }
  }

  async function Del(id) {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.delete(`${API}/adminDashboard/deleteMovies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(res.data.msg);
      setMovies((prev) => prev.filter((i) => i._id !== id));
    } catch (error) {
      console.log(error.response?.data?.msg);
    }
  }

  function updateFn(item) {
    setMovieForm({
      id: item.movie._id,
      movie_name: item.movie.movie_name,
      genre: item.movie.genre,
      language: item.movie.language,
      duration: item.movie.duration,
      image: null,
    });

    setTheaterForm({
      theater_name: item.theater.theater_name,
      location: item.theater.location,
    });

    setScreenForm({
      screen_name: item.screen.screen_name,
      rows: item.screen.rows,
      cols: item.screen.cols,
    });

    setShowTimesTheaterId(item.theater._id);
    setUpdateShowId(item._id);

    navigate("/adminUpdateForm");
  }

  async function deleteFn4Carou(id) {
    try {
      const res = await axios.delete(`${API}/display/dis/${id}`);
      setCarouselItems((prev) => prev.filter((i) => i._id !== id));
      alert(res.data.msg)
    } catch (err) {
      console.log(err);
    }
  }

  function childPropPassing(value) {
    setAddCarousel(value);
  }

  return (
    <div className="row">
      <div className="col col-lg-3 col-md-3">
        <AdminNav />
      </div>

      <div className="col col-lg-8 col-mg-8">
        <div className="row mt-5">
          <h3>Dashboard</h3>
          <div>Manage your movie collection and carousel content</div>
        </div>

        <div className="row mt-5">
          <div>
            <div
              className="d-flex rounded-3"
              style={{
                position: "relative",
                backgroundColor: "black",
                maxWidth: "300px",
                border: "2px solid grey",
              }}
            >
              <input
                type="text"
                className="mx-auto"
                placeholder="search..."
                style={{
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  color: "white",
                }}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
              <ion-icon
                name="search-outline"
                style={{
                  position: "absolute",
                  top: "5px",
                  left: "15px",
                  color: "white",
                }}
              ></ion-icon>
            </div>
          </div>

          <div className="d-flex Admin_overflow">
            {filteredMovie.map((i, index) => (
              <div key={index}>
                <div
                  className="card"
                  style={{
                    height: "280px",
                    width: "200px",
                    backgroundColor: "rgba(205, 91, 91, 0.3)",
                  }}
                >
                  <img
                    src={i.movie.image}
                    alt=""
                    className="card-img-top"
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body my-0 py-0 pt-1">
                    <div className="card-title fw-bold text-light p-0 my-0">
                      {i.movie.movie_name.length > 15
                        ? i.movie.movie_name.slice(0, 15) + "..."
                        : i.movie.movie_name}
                    </div>

                    <p className="card-text text-secondary">
                      {i.movie.genre.join(", ")}
                    </p>

                    <div className="d-flex justify-content-between">
                      <button
                        className="btn bg-danger"
                        style={{ color: "pink" }}
                        onClick={() => updateFn(i)}
                      >
                        update
                      </button>

                      <button
                        className="btn bg-secondary"
                        style={{ color: "white" }}
                        onClick={() => Del(i._id)}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <h5 className="fw-bold">Carousel Management</h5>

          <button
            type="button"
            className="btn bg-danger text-light fw-bold"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            onClick={() => setAddCarousel(true)}
          >
            + Add New Slide
          </button>
        </div>

        <div
          className="row rounded-3 mt-3 px-3 mb-3"
          style={{ backgroundColor: "rgba(205, 91, 91, 0.3)" }}
        >
          {carouselItems.map((i, index) => (
            <div className="row my-3" key={index}>
              <div className="container col-lg-10">
                <div className="d-flex">
                  <div className="d-flex justify-content-center align-items-center">
                    <ion-icon
                      className="m-0 p-0"
                      name="ellipsis-vertical-outline"
                    ></ion-icon>
                    <ion-icon
                      className="m-0 p-0"
                      name="ellipsis-vertical-outline"
                    ></ion-icon>
                  </div>

                  <div>
                    <img
                      src={i.image}
                      alt=""
                      className="mx-3"
                      style={{
                        width: "150px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        overflow: "hidden",
                        backgroundPosition: "center",
                      }}
                    />
                  </div>

                  <div className="d-flex align-items-center">
                    <div>
                      <h6>{i.title}</h6>
                      <p>{i.theme}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col col-lg-2">
                <div className="d-flex justify-content-around align-items-center h-100">
                  <ion-icon
                    name="trash-bin-outline"
                    onClick={() => deleteFn4Carou(i._id)}
                  ></ion-icon>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-dark">
              <div className="modal-header">
                <h1
                  className="modal-title fs-5 text-light"
                  id="staticBackdropLabel"
                >
                  Add Carousel
                </h1>
                <button
                  type="button"
                  className="btn-close bg-light"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                {addCarousel && (
                  <Admin
                    sendToparent={childPropPassing}
                    refreshCarousel={getCarousel}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {updateCarousel && (
        <UpdateCarouselComponent updateCarousel={updateCarousel} />
      )}
    </div>
  );
}