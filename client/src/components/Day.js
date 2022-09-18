import React from "react";
import DayCSS from "./styles/Day.module.css"

export default function Day(props) {
    const timeSlotsArray = [];
    let appointmentTime;

    function handleClick(event, key) {
        if (event.target.textContent === "Book") {
            props.handleClick(timeSlotsArray[key].apmTime)
        }
    }

    for (let slotIndex = props.openTime; slotIndex < props.closeTime; slotIndex = slotIndex + props.slotTime) {
        for (let apmIndex = 0; apmIndex < props.apmTimes.length; apmIndex++) {
            const appointmentDay = new Date(props.apmTimes[apmIndex]);
            let apmHour = appointmentDay.getHours();
            let apmMinute = appointmentDay.getMinutes();
            apmHour = apmHour + apmMinute / 60;
            if (apmHour === slotIndex) {
                appointmentTime = props.apmTimes[apmIndex]
            }
        }
        timeSlotsArray.push({apmTime: appointmentTime, id: slotIndex})
        appointmentTime = undefined;
    }

    return (
        <div className={DayCSS.container}>
            <div className={DayCSS.dayTile}>{props.day}</div>
            {timeSlotsArray.map((item,key) => (
                <div
                    className={item.apmTime != undefined ? DayCSS.timeTileAppointment : DayCSS.timeTile}
                    onClick={event => handleClick(event, key)}
                    key={key}
                >
                    {item.apmTime != undefined ? "Book" : "-"}
                </div>
            ))}
        </div>
    )
}