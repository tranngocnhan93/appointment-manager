import React, { useEffect, useState } from "react";
import "./styles/Booking.css"
import Day from "../components/Day"
import TimeFrameColumn from "../components/TimeFrameColumn"
import TechnicianSelector from "../components/TechnicianSelector";

export default function Booking() {
    const [records, setRecords] = useState([]);
    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:3000/getAppointments`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const recordResponse = await response.json();
            setRecords(recordResponse);
            console.log(records);
        }
        getRecords();
    }, [records.length]);
    return (
        <div>
            <div className="calendar-container">
                <div className="nav-week-container">
                    <h2>Week 35</h2>
                    <TechnicianSelector />
                </div>
                <div className="timetable-container">
                    <button className="prev-week-button">Prev Week</button>
                    <div className="time-frame-column">
                        <TimeFrameColumn openTime={8} closeTime={17} slotTime={0.5} />
                    </div>
                    <div className="day-container">
                        <Day day="Monday" openTime={8} closeTime={17} slotTime={0.5} />
                        <Day day="Tuesday" openTime={8} closeTime={17} slotTime={0.5} />
                        <Day day="Wednesday" openTime={8} closeTime={17} slotTime={0.5} />
                        <Day day="Thursday" openTime={8} closeTime={17} slotTime={0.5} />
                        <Day day="Friday" openTime={8} closeTime={17} slotTime={0.5} />
                        <Day day="Saturday" openTime={8} closeTime={17} slotTime={0.5} />
                        <Day day="Sunday" openTime={8} closeTime={17} slotTime={0.5} />
                    </div>
                    <button className="next-week-button">Next Week</button>
                </div>
            </div>
        </div>
    );
};


