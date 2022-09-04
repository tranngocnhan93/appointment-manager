import React from "react"
import "./styles/TechnicianSelector.css"


export default function TechnicianSelector() {
    const [isClicked, setIsClick] = React.useState(false)

    function handleClick() {
        setIsClick(prevClick => !prevClick)
    }

    return (
        <div className={isClicked ? "select--menu active" : "select--menu"}>
            <div className="select--button" onClick={handleClick}>
                <span className="select--button--text">Select technician</span>
                <i className={isClicked ? "select--button--arrow active" : "select--button--arrow"}></i>
            </div>

            <ul className="options">
                <li className="option">
                    <i className="bx"></i>
                    <span className="option--text">Nhan Tran</span>
                </li>
                <li className="option">
                    <i className="bx"></i>
                    <span className="option--text">An Pham</span>
                </li>
                <li className="option">
                    <i className="bx"></i>
                    <span className="option--text">Vu Nguyen</span>
                </li>
                <li className="option">
                    <i className="bx"></i>
                    <span className="option--text">Khang Nguyen</span>
                </li>
            </ul>
        </div>
    )
}