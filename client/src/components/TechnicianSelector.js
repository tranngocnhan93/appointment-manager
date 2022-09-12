import React, {useState} from "react"
import "./styles/TechnicianSelector.css"


export default function TechnicianSelector(props) {
    const [isClicked, setIsClick] = useState(false)
    const [technician, setTechnician] = useState("Select technician")

    function handleMenuClick() {
        setIsClick(prevClick => !prevClick)
    }

    const renderTechinicans = props.technicians.map(technician => {
        return (
            <li className="option"
                onClick={(event) => {
                    props.handleClick(event.target.textContent)
                    setIsClick(prevClick => !prevClick);
                    setTechnician(event.target.textContent);}}
                key={technician}
            >
                <i className="bx"></i>
                <span className="option--text">{technician}</span>
            </li>
        )
    })

    return (
        <div className={isClicked ? "select--menu active" : "select--menu"}>
            <div className="select--button" onClick={handleMenuClick}>
                <span className="select--button--text">{technician}</span>
                <i className={isClicked ? "select--button--arrow active" : "select--button--arrow"}></i>
            </div>
            <ul className="options">
                {renderTechinicans}
            </ul>
            
        </div>
    )
}