import "./selectedMovie.css";
import Nav from "../navcomponents/nav";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import API from "../api";
import { MovieContext } from "../contextApi/MovieProvider";

const SelectedMovie = () => {
  const [currPage, setCurrPage] = useState(1);
  const [movie, setMovie] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [screen, setScreen] = useState([]);
  const [uniquetheater, setUniquetheater] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [colorArr, setColorArr] = useState([]);
  const { selectedMovie } = useContext(MovieContext);

  const [bill, setBill] = useState({
    theatername: "",
    screenname: "",
    tot: "",
    user: "",
    price: "",
    seats: [],
    movie: "",
    screen: "",
    disScreenName: "",
    bookedDate: [],
    bookedShows: "",
  });

  useEffect(() => {
    if (selectedMovie && selectedMovie.length > 0) {
      fetchMovie();
    }
  }, [selectedMovie]);

  useEffect(() => {
    BookedSeat();
  }, [selectedScreen, bill.bookedDate, bill.bookedShows]);

  useEffect(() => {
    if (movie[0]?.ticket_price) {
      setBill((prev) => ({
        ...prev,
        price: movie[0].ticket_price,
        tot: selectedSeats.length * movie[0].ticket_price || 0,
      }));
    }
  }, [selectedSeats, movie]);

  async function BookedSeat() {
    try {
      if (
        !selectedScreen ||
        !selectedScreen.movie ||
        !selectedScreen.theater ||
        !selectedScreen.screen?._id ||
        bill.bookedDate.length === 0 ||
        !bill.bookedShows
      ) {
        return;
      }

      const movieId = selectedScreen.movie._id;
      const theaterId = selectedScreen.theater._id;
      const screenId = selectedScreen.screen._id;

      const res = await axios.get(`${API}/bill/bookedSeats`, {
        params: {
          movie: movieId,
          theaterId,
          screen: screenId,
          bookedDate: bill.bookedDate[0],
          bookedShows: bill.bookedShows,
        },
      });

      setBookedSeats(res.data.bookedSeats || []);
      setSelectedSeats([]);
      setBill((prev) => ({ ...prev, seats: [] }));
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  }

  async function fetchMovie() {
    try {
      if (!selectedMovie || selectedMovie.length === 0) return;

      const movieName =
        selectedMovie[0]?.movie?.movie_name || selectedMovie[0]?.movie_name || "";

      const res = await axios.get(`${API}/showTimes/selectedMovie`, {
        params: { movie_name: movieName },
      });

      setMovie(res.data.showTime);

      const uniqueTheaters = res.data.showTime.reduce((acc, item) => {
        if (!acc.some((t) => t.theater.theater_name === item.theater.theater_name)) {
          acc.push(item);
        }
        return acc;
      }, []);

      setUniquetheater(uniqueTheaters);

      const getUser = localStorage.getItem("username");
      const fetchedMovie = res.data.showTime[0]?.movie?.movie_name || "";

      setBill((prev) => ({
        ...prev,
        user: getUser,
        movie: fetchedMovie,
      }));
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  }

  function toggleSeat(seatId) {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );

    setBill((prev) => ({
      ...prev,
      seats: prev.seats.includes(seatId)
        ? prev.seats.filter((seat) => seat !== seatId)
        : [...prev.seats, seatId],
    }));
  }

  async function oc(e) {
    const { name, value } = e.target;

    setBill((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "theatername") {
      try {
        const movieName = movie[0]?.movie?.movie_name;
        const res = await axios.get(`${API}/showTimes/theaterScreen`, {
          params: { theater_name: value, movie_name: movieName },
        });

        setScreen(res.data.showTime || []);
        setRows([]);
        setCols([]);
        setSelectedScreen(null);
        setBookedSeats([]);
        setSelectedSeats([]);
        setBill((prev) => ({
          ...prev,
          screenname: "",
          screen: "",
          disScreenName: "",
          seats: [],
          theatername: value,
        }));
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    }

    if (name === "screenname") {
      const found = screen.find((i) => i.screen._id === value);

      if (!found) return;

      const row = [];
      const col = [];

      for (let i = 0; i < parseInt(found.screen.rows); i++) {
        row.push(i);
      }

      for (let i = 0; i < parseInt(found.screen.cols); i++) {
        col.push(i);
      }

      setRows(row);
      setCols(col);

      setBill((prev) => ({
        ...prev,
        screenname: value,
        screen: found.screen._id,
        disScreenName: found.screen.screen_name,
        seats: [],
      }));

      setSelectedSeats([]);
      setSelectedScreen(found);
    }
  }

  async function handlePay() {
    if (
      !bill.theatername ||
      !bill.screen ||
      !bill.bookedShows ||
      bill.bookedDate.length === 0 ||
      selectedSeats.length === 0
    ) {
      alert("Please select theater, screen, date, show, and seats");
      return;
    }

    try {
      await axios.post(`${API}/bill/bookings`, bill);
      alert("booking successful");

      const updatedSeats = [...new Set([...bookedSeats, ...selectedSeats])];
      setBookedSeats(updatedSeats);
      setSelectedSeats([]);
      setBill((prev) => ({
        ...prev,
        seats: [],
        tot: 0,
      }));
    } catch (error) {
      console.log(error);
      console.log(error.response?.data?.msg || error.response?.data?.message);
      alert(error.response?.data?.msg || error.response?.data?.message || "Booking failed");
    }
  }

  if (!selectedMovie || selectedMovie.length === 0) {
    return <div>No Show Time for this Movie</div>;
  }

  const shows = ["midnight", "morning", "evening", "afternoon"];
  const SD = selectedScreen?.start_date;
  const ED = selectedScreen?.end_date;

  const Dates = [];
  const curDate = new Date(SD);
  const endDate = new Date(ED);

  if (SD && ED && !isNaN(curDate) && !isNaN(endDate)) {
    const diff = Math.ceil((endDate - curDate) / 86400000) + 1;

    for (let i = 0; i < diff; i++) {
      const temp = new Date(curDate);
      const newDate = temp.getDate();
      const newDay = temp.getDay();
      const newMonth = temp.getMonth();
      const newYear = temp.getFullYear();

      const arr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const tempStart = new Date(temp);
      tempStart.setHours(0, 0, 0, 0);

      const isPast = tempStart < todayStart;

      Dates.push({
        newDate,
        newDay: arr[newDay],
        newMonth: month[newMonth],
        newYear,
        isPast,
      });

      curDate.setDate(curDate.getDate() + 1);
    }
  }

  const valPerPage = 3;
  const LI = valPerPage * currPage;
  const FI = LI - valPerPage;
  const TotPages = Math.ceil(Dates.length / valPerPage);
  const slicedDate = Dates.slice(FI, LI);

  function prevFn() {
    if (currPage > 1) {
      setCurrPage((prev) => prev - 1);
    }
  }

  function nxtFn() {
    if (currPage < TotPages) {
      setCurrPage((prev) => prev + 1);
    }
  }

  const alpha = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  ];

  function colorFn(id) {
    const fullDate = `${id.newDate}-${id.newMonth}-${id.newYear}`;
    setColorArr([id]);
    setBill((prev) => ({ ...prev, bookedDate: [fullDate] }));
  }

  return (
    <div
      className="container-fluid p-0 m-0"
      style={{
        backgroundImage: `url(${API}/movieImages/${selectedMovie[0]?.movie?.image || ""})`,
        height: "100vh",
        width: "100vw",
        position: "absolute",
        top: "0",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Nav />

      <div className="container">
        <div className="row">
          <div className="col col-lg-2" style={{ height: "85vh" }}>
            <div className="d-flex justify-content-center mb-4 mt-2">
              <select name="theatername" className="select-tag me-1" onChange={oc} value={bill.theatername}>
                <option value="">select theater</option>
                {uniquetheater.map((item, index) => (
                  <option key={index} value={item.theater.theater_name}>
                    {item.theater.theater_name}
                  </option>
                ))}
              </select>

              <select name="screenname" className="select-tag" onChange={oc} value={bill.screenname}>
                <option value="">select screen</option>
                {screen.map((item, index) => (
                  <option value={item.screen._id} key={index}>
                    {item.screen.screen_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex justify-content-center mb-4 me-3">
              <div onClick={prevFn} className="slideBtn d-flex align-items-center">
                <ion-icon name="caret-back-outline" style={{ fontSize: "30px" }}></ion-icon>
              </div>

              {slicedDate.map((i, index) => {
                const id = {
                  newDate: i.newDate,
                  newDay: i.newDay,
                  newMonth: i.newMonth,
                  newYear: i.newYear,
                };

                return (
                  <div
                    key={index}
                    className="d-flex flex-column px-3 py-2 mx-2 rounded-3"
                    onClick={() => !i.isPast && colorFn(id)}
                    style={{
                      backgroundColor: i.isPast
                        ? "black"
                        : colorArr[0]?.newDate === id.newDate &&
                          colorArr[0]?.newMonth === id.newMonth &&
                          colorArr[0]?.newYear === id.newYear
                        ? "yellow"
                        : "",
                      color: i.isPast
                        ? "white"
                        : colorArr[0]?.newDate === id.newDate &&
                          colorArr[0]?.newMonth === id.newMonth &&
                          colorArr[0]?.newYear === id.newYear
                        ? "black"
                        : "",
                      cursor: i.isPast ? "not-allowed" : "pointer",
                      opacity: i.isPast ? 0.5 : 1,
                    }}
                  >
                    <span className="text-center m-0 p-0 fw-bold">{i.newDate}</span>
                    <span className="text-center m-0 p-0 fw-bold">{i.newDay}</span>
                  </div>
                );
              })}

              <div onClick={nxtFn} className="slideBtn d-flex align-items-center">
                <ion-icon name="caret-forward-outline" style={{ fontSize: "30px" }}></ion-icon>
              </div>
            </div>

            <div className="mb-4">
              {shows.map((i, index) => (
                <div
                  key={index}
                  className="d-inline-block px-1 py-1 fw-bold rounded-2 me-1"
                  onClick={() => setBill((prev) => ({ ...prev, bookedShows: i }))}
                  style={{
                    backgroundColor: bill.bookedShows === i ? "yellow" : "",
                    color: bill.bookedShows === i ? "black" : "",
                    cursor: "pointer",
                  }}
                >
                  {i}
                </div>
              ))}
            </div>

            <h5 className="fw-bold">{movie[0]?.movie?.movie_name}</h5>

            <div className="text-center w-100 mb-2">
              <img
                src={selectedMovie[0]?.movie?.image}
                alt=""
                className="text-center"
                style={{ height: "220px", objectFit: "cover", width: "190px" }}
              />
            </div>

            <div className="d-flex justify-content-between mb-2">
              <div>{movie[0]?.movie?.genre?.join(", ")}</div>
              <div>{movie[0]?.movie?.duration}</div>
            </div>

            <div className="d-flex gap-5">
              <div className="d-flex gap-1">
                <ion-icon name="star" className="gold-m"></ion-icon>
                <ion-icon name="star" className="gold-m"></ion-icon>
                <ion-icon name="star" className="gold-m"></ion-icon>
                <ion-icon name="star" className="gold-m"></ion-icon>
                <ion-icon name="star" className="gold-m"></ion-icon>
              </div>
              <div>pg-13</div>
            </div>
          </div>

          <div className="col col-lg-8 p-5">
            <div className="row mt-2 mb-5">
              <div className="screen"></div>
              <h5 className="text-center">screen</h5>
            </div>

            <div className="row">
              <div className="col col-lg-6">
                {rows.map((row, index) => (
                  <div className="row" key={row}>
                    {cols.map((col) => {
                      const seatId = `${alpha[index]}-${col}-1`;
                      const isSelected = selectedSeats.includes(seatId);
                      const isBooked = bookedSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={isBooked}
                          onClick={() => toggleSeat(seatId)}
                          style={{
                            border: "none",
                            background: "transparent",
                            padding: 0,
                            width: "fit-content",
                          }}
                        >
                          <img
                            src="../armchair.png"
                            alt=""
                            className="m-1 p-0"
                            style={{
                              backgroundColor: isBooked ? "red" : isSelected ? "green" : "white",
                              width: "30px",
                              height: "30px",
                              cursor: isBooked ? "not-allowed" : "pointer",
                              borderRadius: "4px",
                              transform: "rotate(180deg)",
                              opacity: isBooked ? 0.6 : 1,
                              pointerEvents: "none",
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="col">
                {rows.map((row) => (
                  <div className="row" key={row}>
                    {cols.map((col) => {
                      const seatId = `${alpha[row]}-${col}-2`;
                      const isSelected = selectedSeats.includes(seatId);
                      const isBooked = bookedSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          type="button"
                          disabled={isBooked}
                          onClick={() => toggleSeat(seatId)}
                          style={{
                            border: "none",
                            background: "transparent",
                            padding: 0,
                            width: "fit-content",
                          }}
                        >
                          <img
                            src="../armchair.png"
                            alt=""
                            className="m-1 p-0"
                            style={{
                              backgroundColor: isBooked ? "red" : isSelected ? "green" : "white",
                              width: "30px",
                              height: "30px",
                              cursor: isBooked ? "not-allowed" : "pointer",
                              borderRadius: "4px",
                              transform: "rotate(180deg)",
                              opacity: isBooked ? 0.6 : 1,
                              pointerEvents: "none",
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex justify-content-center mt-5 w-100">
              <div className="row">
                <div className="col d-flex">
                  <img
                    src="../armchair.png"
                    alt=""
                    style={{
                      backgroundColor: "white",
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      transform: "rotate(180deg)",
                    }}
                  />
                  <span>Available</span>
                </div>

                <div className="col d-flex">
                  <img
                    src="../armchair.png"
                    alt=""
                    style={{
                      backgroundColor: "green",
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      transform: "rotate(180deg)",
                    }}
                  />
                  <span>Selected</span>
                </div>

                <div className="col d-flex">
                  <img
                    src="../armchair.png"
                    alt=""
                    style={{
                      backgroundColor: "red",
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      transform: "rotate(180deg)",
                    }}
                  />
                  <span>Sold</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col col-lg-2">
            <div className="d-flex align-items-center h-100">
              <div className="container-fluid bg-dark bill w-100">
                <div className="border-doted py-2 mt-2">
                  <h3 className="text-center">TICKETS</h3>
                </div>

                <div className="d-flex justify-content-between py-2">
                  <div>{bill.theatername || "not yet"}</div>
                  <div>{bill.disScreenName || "not yet"}</div>
                </div>

                <div className="d-flex justify-content-between py-2">
                  <div>
                    <div>{colorArr[0]?.newDay}</div>
                    <div>{bill.bookedShows || "not yet"}</div>
                  </div>

                  <div>
                    {colorArr[0]?.newDate} {colorArr[0]?.newMonth} {colorArr[0]?.newYear || "not yet"}
                  </div>
                </div>

                <div className="border-doted py-2">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Row</th>
                        <th>col</th>
                        <th>Price</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedSeats.map((item, index) => (
                        <tr key={index}>
                          <td>{item.slice(0, 1)}</td>
                          <td>{item.slice(2, item.length)}</td>
                          <td>{movie[0]?.ticket_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mb-2 py-3">
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn hover-color"
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop"
                      style={{ backgroundColor: "yellow", color: "black" }}
                    >
                      to pay
                    </button>

                    <div
                      className="modal fade mt-5"
                      id="staticBackdrop"
                      data-bs-backdrop="static"
                      data-bs-keyboard="false"
                      tabIndex="-1"
                      aria-labelledby="staticBackdropLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content" style={{ backgroundColor: "yellow" }}>
                          <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">
                              Confirm Bookings
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>

                          <div className="modal-body mx-auto col-lg-6 col-md-6" style={{ backgroundColor: "yellow" }}>
                            <div className="d-flex align-items-center text-light h-100">
                              <div className="container-fluid bg-dark bill w-100">
                                <div className="border-doted py-2 mt-2">
                                  <h3 className="text-center">TICKETS</h3>
                                </div>

                                <div className="d-flex justify-content-between py-2">
                                  <div>{bill.theatername || "not yet"}</div>
                                  <div>{bill.disScreenName || "not yet"}</div>
                                </div>

                                <div className="d-flex justify-content-between py-2">
                                  <div>
                                    <div>{colorArr[0]?.newDay}</div>
                                    <div>{bill.bookedShows || "not yet"}</div>
                                  </div>

                                  <div>
                                    {colorArr[0]?.newDate} {colorArr[0]?.newMonth} {colorArr[0]?.newYear || "not yet"}
                                  </div>
                                </div>

                                <div className="border-doted py-2">
                                  <table className="w-100 text-center">
                                    <thead>
                                      <tr>
                                        <th>Row</th>
                                        <th>col</th>
                                        <th>Price</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {selectedSeats.map((item, index) => (
                                        <tr key={index}>
                                          <td>{item.slice(0, 1)}</td>
                                          <td>{item.slice(2, item.length)}</td>
                                          <td>{movie[0]?.ticket_price}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="mb-2 py-3">
                                  <div className="row">
                                    <div className="col col-lg-8 col-md-8">TOTAL</div>
                                    <div className="col">rs {bill.tot}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                              Close
                            </button>
                            <button type="button" className="btn btn-success" onClick={handlePay}>
                              Confirm Bookings
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button className="rounded-2" style={{ backgroundColor: "yellow" }}>
                      rs {bill.tot}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SelectedMovie;