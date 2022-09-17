import React from "react";
import { nanoid } from "nanoid"
import DayCSS from "./styles/Day.module.css"

export default function Day(props) {
    const timeSlotsArray = [];
    let appointmentsArray = [];

    function handleClick(event, key) {
        if (event.target.textContent === "Book") {
            console.log(timeSlotsArray[key])
        }
    }

    for (let slotIndex = props.openTime; slotIndex < props.closeTime; slotIndex = slotIndex + props.slotTime) {
        for (let apmtIndex = 0; apmtIndex < props.appointments.length; apmtIndex++) {
            const appointmentDay = new Date(props.appointments[apmtIndex].date);
            let apmtHour = appointmentDay.getHours();
            let apmtMinute = appointmentDay.getMinutes();
            apmtHour = apmtHour + apmtMinute / 60;
            if (apmtHour === slotIndex) {
                appointmentsArray.push(props.appointments[apmtIndex])
            }
        }
        timeSlotsArray.push({ slotTime: slotIndex, appointments: appointmentsArray, id: nanoid() })
        appointmentsArray = [];
    }

    return (
        <div className={DayCSS.container}>
            <div className={DayCSS.dayTile}>{props.day}</div>
            {timeSlotsArray.map((item,key) => (
                <div 
                    className={item.appointments.length ? DayCSS.timeTileAppointment : DayCSS.timeTile}
                    onClick={event => handleClick(event, key)}
                    key={key}
                >
                        {item.appointments.length ? "Book" : "-"}
                </div>
            ))}
        </div>
    )
}