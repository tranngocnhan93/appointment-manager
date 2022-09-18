import React from "react";
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
        for (let apmIndex = 0; apmIndex < props.apmTime.length; apmIndex++) {
            const appointmentDay = new Date(props.apmTime[apmIndex]);
            let apmHour = appointmentDay.getHours();
            let apmMinute = appointmentDay.getMinutes();
            apmHour = apmHour + apmMinute / 60;
            if (apmHour === slotIndex) {
                appointmentsArray.push(props.apmTime[apmIndex])
            }
        }
        timeSlotsArray.push({apmTimes: appointmentsArray, id: slotIndex})
        appointmentsArray = [];
    }

    return (
        <div className={DayCSS.container}>
            <div className={DayCSS.dayTile}>{props.day}</div>
            {timeSlotsArray.map((item,key) => (
                <div
                    className={item.apmTimes.length ? DayCSS.timeTileAppointment : DayCSS.timeTile}
                    onClick={event => handleClick(event, key)}
                    key={key}
                >
                        {item.apmTimes.length ? "Book" : "-"}
                </div>
            ))}
        </div>
    )
}