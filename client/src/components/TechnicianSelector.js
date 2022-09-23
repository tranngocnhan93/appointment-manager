import React, { useState } from "react"
import "./styles/TechnicianSelector.css"


export default function TechnicianSelector(props) {
    const [isClicked, setIsClick] = useState(false)
    const [technician, setTechnician] = useState("Select technician")
    const {isInBookingForm, technicians} = props;

    function handleMenuClick() {
        setIsClick(prevClick => !prevClick)
    }

    const renderTechnicians = technicians.map(technician => {
        return (
            <li className={`option ${isInBookingForm ? "in--booking--form" : ""} ${isClicked ? "" : "hide"}`}
                onClick={(event) => {
                    props.handleClick(event.target.textContent)
                    setIsClick(prevClick => !prevClick);
                    setTechnician(event.target.textContent);
                }}
                key={technician}
            >
                <i className="bx"></i>
                <span className={`option--text ${isInBookingForm ? "in--booking--form" : ""}`}>{technician}</span>
            </li>
        )
    })

    const allTechnicianOption = (
        <li className={isClicked ? "option" : "option hide"}
            onClick={(event) => {
                props.handleClick(event.target.textContent)
                setIsClick(prevClick => !prevClick);
                setTechnician(event.target.textContent);
            }}
            key={"all"}
        >
            <i className="bx"></i>
            <span className="option--text">All technicians</span>
        </li>
    )

    return (
        <div className={`container ${isInBookingForm ? "in--booking--form" : ""} ${isClicked ? "active" : ""}`}>
            <div className={`select--button ${isInBookingForm ? "in--booking--form" : ""}`}
                 onClick={handleMenuClick}
            >
                <span className={`button--text ${isInBookingForm ? "in--booking--form" : ""}`}>
                    {renderTechnicians.length ? technician : "Not available"}
                </span>
                <i className={`button--arrow ${isInBookingForm ? "in--booking--form" : ""} ${isClicked ? "active" : ""}`}></i>
            </div>
            <ul className={`options ${isInBookingForm ? "in--booking--form" : ""} ${isClicked ? "" : "hide"}`}>
                {(renderTechnicians.length > 0) && !isInBookingForm && allTechnicianOption}
                {renderTechnicians}
            </ul>

        </div>
    )
}