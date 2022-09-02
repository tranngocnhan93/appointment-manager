import React from "react"
import TimeFrameColumnCSS from "./styles/TimeFrameColumn.module.css"

export default function TimeFrameColumn(props) {
    const timeArray = [];
    for(let i = props.openTime; i < props.closeTime; i = i + props.slotTime) {
        timeArray.push(i)
    }

    return (
        <div className={TimeFrameColumnCSS.container}>
            {timeArray.map(item => <div className={TimeFrameColumnCSS.timeTile}>{Math.floor(item)}:{item%1*6}0</div>)}
        </div>
    )
    
}