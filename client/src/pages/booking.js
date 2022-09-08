import React, { useEffect, useState } from "react";
import "./styles/Booking.css"
import Day from "../components/Day"
import TimeFrameColumn from "../components/TimeFrameColumn"
import TechnicianSelector from "../components/TechnicianSelector";

export default function Booking() {
    const today = new Date();
    const monDate = today.getDate() - today.getDay() + 1;
    const [records, setRecords] = useState([]);
    const [weekDays, setWeekDays] = useState([{weekDay: "Mon", weekDate: new Date(today.setDate(monDate))},
                                              {weekDay: "Tue", weekDate: new Date(today.setDate(monDate + 1))},
                                              {weekDay: "Wed", weekDate: new Date(today.setDate(monDate + 2))},
                                              {weekDay: "Thu", weekDate: new Date(today.setDate(monDate + 3))},
                                              {weekDay: "Fri", weekDate: new Date(today.setDate(monDate + 4))},
                                              {weekDay: "Sat", weekDate: new Date(today.setDate(monDate + 5))},
                                              {weekDay: "Sun", weekDate: new Date(today.setDate(monDate + 6))},
                                            ]);
    
    useEffect(() => {
        async function getRecords() {
            let startTime = weekDays[0].weekDate;
            startTime.setUTCHours(0);
            startTime.setUTCMinutes(0);
            startTime.setUTCSeconds(0);
            startTime.setUTCMilliseconds(0);
            let endTime = weekDays[6].weekDate;
            endTime.setUTCHours(23);
            endTime.setUTCMinutes(59);
            endTime.setUTCSeconds(59);
            endTime.setUTCMilliseconds(0);
            const response = await fetch(`http://localhost:3000/getAppointments?start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const recordResponse = await response.json();
            setRecords(recordResponse);
        }
        getRecords();
    }, [records.length]);

    function toPrevWeek() {
        setWeekDays(prevDays => prevDays.map(day => {
            return {
                ...day,
                weekDate: new Date(day.weekDate.setDate(day.weekDate.getDate() - 7))
            }
        })
        )
    }

    function toNextWeek() {
        setWeekDays(prevDays => prevDays.map(day => {
            return {
                ...day,
                weekDate: new Date(day.weekDate.setDate(day.weekDate.getDate() + 7))
            }
        })
        )
    }
    function calculateWeekNumber() {
        const currentDate = weekDays[0].weekDate
        const startDate = new Date(currentDate.getFullYear(), 0, 1);
        const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((currentDate.getDay() + 1 + days) / 7);
        return weekNumber;
    };

    const populatedDays = weekDays.map(item => <Day day={`${item.weekDay} ${item.weekDate.getDate()}-${item.weekDate.getMonth()+1}`}
                                                    key={item.weekDay} openTime={8} closeTime={17} slotTime={0.5}/>)

    return (
        <div>
            <div className="calendar-container">
                <div className="nav-week-container">
                    <h2 className="nav-week-number">Week {calculateWeekNumber()} -&nbsp;</h2>
                    <h2 className="nav-week-year">{weekDays[0].weekDate.getFullYear()}</h2>
                    <TechnicianSelector className="nav-week-technician-selector"/>
                </div>
                <div className="timetable-container">
                    <button className="prev-week-button" onClick={toPrevWeek}>Prev Week</button>
                    <div className="time-frame-column">
                        <TimeFrameColumn openTime={8} closeTime={17} slotTime={0.5} />
                    </div>
                    <div className="day-container">
                        {populatedDays}
                    </div>
                    <button className="next-week-button" onClick={toNextWeek}>Next Week</button>
                </div>
            </div>
        </div>
    );
};


