import "./App.css";
import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import profile_pic from "./assets/default_profile.png";
import Bell_pic from "./assets/GreenBell.png";
import axios from "axios";

const refreshReservation = new EventSource(
    "http://localhost:5001/reservations/refresh"
);

const App = () => {
    //Hooks:
    const [day, setDay] = useState("");
    const [reservations, setReservation] = useState([]);
    const [disable, setDisable] = React.useState(false);

    useEffect(() => {
        let time = new Date();
        setDay(time.toLocaleDateString());
        // --> getting data from database when the component renders:
        axios
            .get("http://localhost:5001/reservations/")
            .then((Response) => {
                setReservation(formatAvailabilities(setAvailabilities(Response.data)));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [day]);

    // returns only the availabilities from all reservations.
    function setAvailabilities(reservations) {
        return reservations.filter(
            (reservation) => reservation.day === day && reservation.roomNr === 1
        );
    }

    function notify(email) {
        setDisable(true);
        let mailTo = {
            to: email,
        };
        console.log(mailTo);
        axios
            .post("http://localhost:5001/emails/send-email", mailTo)
            .then((res) => {
                console.log(res);
                console.log("Message Sent");
                setTimeout(() => setDisable(false), 60000);
                alert("Message Sent");
            })
            .catch(() => {
                console.log("Email could not be sent");
                alert("Email could not be sent");
            });
    }

    console.log(reservations);

    // Formats the availabilities so that it only shows one card per person.
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
        availabilities = combineTimeSlots(availabilities);
        return availabilities;
    }

    // function that combines timeslots if there is overlappings:
    function combineTimeSlots(availabilities) {
        availabilities.forEach((aval) => {
            console.log(aval.timeSlot);
            let timeSlots = aval.timeSlot.split(" | ");
            timeSlots.sort(function (a, b) {
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });
            console.log(timeSlots);
            for (let i = 0; i < timeSlots.length; i++) {
                let timeSlot = timeSlots[i];
                timeSlots.forEach((nextTimeSlot, idx) => {
                    console.log("idx: ", idx, " timeSlot:", nextTimeSlot);
                    if (idx == i + 1) {
                        // checking if the next time slot overlaps with the previous one or not.
                        let secondStartingTime = nextTimeSlot.split(" - ")[0];
                        let secondEndingTime = nextTimeSlot.split(" - ")[1];
                        let firstEndingTime = timeSlot.split(" - ")[1];
                        let firstStartingTime = timeSlot.split(" - ")[0];
                        if (secondStartingTime <= firstEndingTime) {
                            // meaning there is overlapping: (there are two types of overlapping)
                            if (secondEndingTime > firstEndingTime) {
                                // second time slot is deleted and the first time slot is updated.
                                timeSlots[i] = firstStartingTime + " - " + secondEndingTime;
                                timeSlots.splice(idx, 1);
                                i--;
                                console.log("if happend");
                            } else {
                                console.log("else happend.");
                                // only the second time slot is deleted.
                                timeSlots.splice(idx, 1);
                                i--;
                            }
                        }
                        console.log(timeSlots);
                    }
                });
            }
            console.log(timeSlots.join(" | "));
            aval.timeSlot = timeSlots.join(" | ");
        });
        return availabilities;
    }

    useEffect(() => {
        refreshReservation.onmessage = (event) => {
            setReservation(
                formatAvailabilities(
                    setAvailabilities([JSON.parse(event.data), ...reservations])
                )
            );
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
                        initial={{x: "100vw"}}
                        animate={{x: 0}}
                        transition={{type: "spring", stiffness: 50}}
                    >
                        <div className="d-flex flex-row">
                            <div className="p-2 flex-grow-1">
                                <div className="d-flex m-2">
                                    <img className="default_profile_pic" src={profile_pic}/>
                                    <h3 className="my-auto ml-2">{reservation.name}</h3>
                                </div>
                                <div className="d-flex m-2">
                                    <h4 className="mr-auto">{reservation.timeSlot}</h4>
                                </div>
                            </div>
                            <div className="p-1">
                                <div className="d-flex m-2">
                                    <abbr title="Click to notify">
                                        <button
                                            disabled={disable}
                                            onClick={() => notify(reservation.email)}
                                        >
                                            <img src={Bell_pic} alt="Green Bell" width="90" height="120"/>
                                        </button>
                                    </abbr>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default App;
