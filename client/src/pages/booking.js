import React, { useEffect, useReducer, useState } from "react";
import "./styles/Booking.css"
import Day from "../components/Day"
import TimeFrameColumn from "../components/TimeFrameColumn"
import TechnicianSelector from "../components/TechnicianSelector";

export default function Booking() {
    const today = new Date();
    const monDate = today.getDate() - today.getDay() + 1;
    const [records, setRecords] = useState([]);
    const initialTimetableDays = [{weekDay: "Mon", weekDate: new Date(today.setDate(monDate))},
                                  {weekDay: "Tue", weekDate: new Date(today.setDate(monDate + 1))},
                                  {weekDay: "Wed", weekDate: new Date(today.setDate(monDate + 2))},
                                  {weekDay: "Thu", weekDate: new Date(today.setDate(monDate + 3))},
                                  {weekDay: "Fri", weekDate: new Date(today.setDate(monDate + 4))},
                                  {weekDay: "Sat", weekDate: new Date(today.setDate(monDate + 5))},
                                  {weekDay: "Sun", weekDate: new Date(today.setDate(monDate + 6))},]
    
    function timetableDayReducer(state, action) {
        switch (action.type) {
            case "toNextWeek":
                return state.map(day => (
                    {
                        ...day,
                        weekDate: new Date(day.weekDate.setDate(day.weekDate.getDate() + 7))
                    }
                ))
            case "toPrevWeek":
                return state.map(day => (
                    {
                        ...day,
                        weekDate: new Date(day.weekDate.setDate(day.weekDate.getDate() - 7))
                    }
                ))
            default:
                throw new Error();
        }
    }

    const [timetableDays, dispatch] = useReducer(timetableDayReducer, initialTimetableDays);

    useEffect(() => {
        async function getRecords() {
            let startTime = new Date(timetableDays[0].weekDate);
            startTime.setUTCHours(0);
            startTime.setUTCMinutes(0);
            startTime.setUTCSeconds(0);
            startTime.setUTCMilliseconds(0);
            let endTime = new Date(timetableDays[6].weekDate);
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
    }, [timetableDays]);

    function calculateWeekNumber() {
        const currentDate = new Date(timetableDays[0].weekDate);
        const startDate = new Date(currentDate.getFullYear(), 0, 1);
        const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((currentDate.getDay() + 1 + days) / 7);
        return weekNumber;
    };

    const renderedDays = timetableDays.map(timetableDay => {
        // Passing appointments in a specific day as props to corresponding day element
        let tempArray = [];
        for(let i = 0; i < records.length; i++) {
            let tempDay = new Date(records[i].date).getDay();
            if( tempDay === timetableDay.weekDate.getDay()) {
                tempArray.push(records[i])
            }
        }
        return <Day day={`${timetableDay.weekDay} ${timetableDay.weekDate.getDate()}-${timetableDay.weekDate.getMonth()+1}`}
                    key={timetableDay.weekDay} openTime={8} closeTime={17} slotTime={0.5} appointments={tempArray}/>
        }
    )

    return (
        <div>
            <div className="calendar-container">
                <div className="nav-week-container">
                    <h2 className="nav-week-number">Week {calculateWeekNumber()} -&nbsp;</h2>
                    <h2 className="nav-week-year">{timetableDays[0].weekDate.getFullYear()}</h2>
                    <TechnicianSelector className="nav-week-technician-selector"/>
                </div>
                <div className="timetable-container">
                    <button className="prev-week-button" onClick={() => dispatch({type: "toPrevWeek"})}>Prev Week</button>
                    <div className="time-frame-column">
                        <TimeFrameColumn openTime={8} closeTime={17} slotTime={0.5} />
                    </div>
                    <div className="day-container">
                        {renderedDays}
                    </div>
                    <button className="next-week-button" onClick={() => dispatch({type: "toNextWeek"})}>Next Week</button>
                </div>
            </div>
        </div>
    );
};


