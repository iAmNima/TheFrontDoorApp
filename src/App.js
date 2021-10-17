import "./App.css";
import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import profile_pic from "./assets/default_profile.png";
import axios from "axios";

const refreshReservation = new EventSource('http://localhost:5001/reservations/refresh');

const App = () => {
  //Hooks:
  const [day, setDay] = useState("");
  const [reservations, setReservation] = useState([]);

  useEffect(() => {
    let time = new Date();
    setDay(time.toLocaleDateString());
    // --> getting data from database when the component renders:
    axios
      .get("http://localhost:5001/reservations/")
      .then((Response) => {
        setReservation(formatAvailabilities(setAvailabilities(Response.data)));
        //setReservation(setAvailabilities(Response.data));
        //setReservation(Response.data);
        console.log("hi");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [day]);

  function setAvailabilities(reservations) {
    let temp = [];
    reservations.forEach((reservation) => {
      if (reservation.day === day && reservation.roomNr === 1) {
        temp.push(reservation);
      }
    });
    return temp;
  }

  console.log(reservations);

  // The MAGIC!
  function formatAvailabilities(availabilities) {
    availabilities.forEach((reservation) => {
      availabilities.forEach((r2) => {
        if (r2 !== reservation) {
          if (reservation.name === r2.name) {
            let index_r2 = availabilities.indexOf(r2);
            reservation.timeSlot += " | " + r2.timeSlot;
            availabilities.splice(index_r2, 1);
          }
        }
      });
    });
    return availabilities;
  }

  useEffect(() => {
    refreshReservation.onmessage = (event) => {
      setReservation(formatAvailabilities(setAvailabilities([JSON.parse(event.data), ...reservations])));
    };
  }, [reservations]);

  return (
    <div className="mt-5">
      {reservations.map((reservation) => {
        // noReservation = false;
        return (
          <motion.div
            key={reservation._id}
            className="reservation-card p-3 mx-auto shadow"
            initial={{ x: "100vw" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <div className="d-flex m-2">
              <img className="default_profile_pic" src={profile_pic} />
              <h3 className="my-auto ml-2">{reservation.name}</h3>
            </div>
            <div className="d-flex m-2">
              <h4 className="mr-auto">{reservation.timeSlot}</h4>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default App;
