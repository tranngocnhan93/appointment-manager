import React from "react"
import {nanoid} from "nanoid"
import TimeFrameColumnCSS from "./styles/TimeFrameColumn.module.css"

export default function TimeFrameColumn(props) {
    const timeArray = [];
    for(let i = props.openTime; i < props.closeTime; i = i + props.slotTime) {
        timeArray.push({timeValue: i, id: nanoid()})
    }

    return (
        <div className={TimeFrameColumnCSS.container}>
            {timeArray.map(item => <div className={TimeFrameColumnCSS.timeTile} key={item.id} >{Math.floor(item.timeValue)}:{item.timeValue%1*6}0</div>)}
        </div>
    )
    
}