import React from "react";
import {nanoid} from "nanoid"
import DayCSS from "./styles/Day.module.css"

export default function Day(props) {
    const timeArray = [];
    for(let i = props.openTime; i < props.closeTime; i = i + props.slotTime) {
        timeArray.push({timeValue: i, id: nanoid()})
    }
    
    return (
        <div className={DayCSS.container}>
            <div className={DayCSS.dayTile}>{props.day}</div>
            {timeArray.map(item => <div className={DayCSS.timeTile} key={item.id} >{item.timeValue}</div>)}
        </div>
    )
}