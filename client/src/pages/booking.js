import React, { useEffect, useReducer, useState } from "react";
import "./styles/Booking.css"
import Day from "../components/Day"
import TimeFrameColumn from "../components/TimeFrameColumn"
import TechnicianSelector from "../components/TechnicianSelector";
import BookingForm from "../components/BookingForm";

export default function Booking() {
    const today = new Date();
    const monDate = today.getDate() - today.getDay() + 1;
    const [records, setRecords] = useState([]);
    const [technician, setTechnician] = useState("");
    const [bookingFormData, setBookingFormData] = useState({isOpen: false, data: []});
    const initialTimetableDays = [{weekDay: "Mon", weekDate: new Date(today.setDate(monDate))},
                                  {weekDay: "Tue", weekDate: new Date(today.setDate(today.getDate() + 1))},
                                  {weekDay: "Wed", weekDate: new Date(today.setDate(today.getDate() + 1))},
                                  {weekDay: "Thu", weekDate: new Date(today.setDate(today.getDate() + 1))},
                                  {weekDay: "Fri", weekDate: new Date(today.setDate(today.getDate() + 1))},
                                  {weekDay: "Sat", weekDate: new Date(today.setDate(today.getDate() + 1))},
                                  {weekDay: "Sun", weekDate: new Date(today.setDate(today.getDate() + 1))},]
    const [timetableDays, dispatch] = useReducer(timetableDayReducer, initialTimetableDays);
    
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


    useEffect(() => {
        async function getRecords() {
            let startTime = new Date(timetableDays[0].weekDate);
            startTime.setHours(0);
            startTime.setMinutes(0);
            startTime.setSeconds(0);
            startTime.setMilliseconds(0);
            let endTime = new Date(timetableDays[6].weekDate);
            endTime.setHours(23);
            endTime.setMinutes(59);
            endTime.setSeconds(59);
            endTime.setMilliseconds(0);
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

    function filterTechnician(paramTechnician) {
        setTechnician(paramTechnician);
    }

    function getTechnicianList() {
        let technicianList = [];
        for (let i = 0; i < records.length; i++) {
            if (!technicianList.includes(records[i].technician)) {
                technicianList.push(records[i].technician);
            }
        }
        return technicianList;
    }

    function showBookingForm(paramTime) {
        let formData = {isOpen: true, data: []};
        for (let i = 0; i < records.length; i++) {
            if ((records[i].date === paramTime) && ((records[i].technician === technician) || (technician === "All technicians"))) {
                if (!formData.data.some(item => (item.technician === records[i].technician && item.date === records[i].date))) {
                    formData.data.push({technician: records[i].technician, date: records[i].date});
                }
            }
        }
        console.log(formData.data)
        setBookingFormData(formData);
    }

    function hideBookingForm() {
        setBookingFormData(prev => {
            return {
                ...prev,
                isOpen: false
            }
        })
    }
    
    const renderedDays = timetableDays.map(timetableDay => {
        // Passing appointments in a specific day as props to corresponding day element
        let tempArray = [];
        for (let i = 0; i < records.length; i++) {
            let tempDay = new Date(records[i].date).getDay();
            if (tempDay === timetableDay.weekDate.getDay() && (records[i].technician === technician || technician === "All technicians")) {
                tempArray.push(records[i].date)
            }
        }
        return <Day day={`${timetableDay.weekDay} ${timetableDay.weekDate.getDate()}-${timetableDay.weekDate.getMonth()+1}`}
                    key={timetableDay.weekDay}
                    openTime={8}
                    closeTime={17}
                    slotTime={0.5}
                    apmTimes={tempArray}
                    handleClick={showBookingForm}/>
        }
    )

    return (
        <div>
            <div className="calendar-container">
                <div className="nav-week-container">
                    <h2 className="nav-week-number">Week {calculateWeekNumber()} -&nbsp;</h2>
                    <h2 className="nav-week-year">{timetableDays[0].weekDate.getFullYear()}</h2>
                    <TechnicianSelector isInBookingForm={false} handleClick={filterTechnician} technicians={getTechnicianList()}/>
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
                    <BookingForm isOpen={bookingFormData.isOpen} closeForm={() => hideBookingForm()} data={bookingFormData.data}/>
                </div>
            </div>
        </div>
    );
};


