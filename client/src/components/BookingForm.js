import React from "react";
import ReactDom from "react-dom"
import "./styles/BookingForm.css"
import TechnicianSelector from "./TechnicianSelector";

function handleSubmit() {
    console.log("submit")
}

export default function BookingForm(props) {
    if (!props.isOpen) {
        return null;
    }

    return ReactDom.createPortal(
        <>
            <div className="backdrop" onClick={props.closeForm}></div>
            <div className="booking--form--container">
                <form className="booking--form" onSubmit={handleSubmit}>
                    <button className="form--close" onClick={props.closeForm}>x</button>
                    <div id="technician--selector">
                        <TechnicianSelector isInBookingForm={true} technicians={["celeste", "gwen"]}/>
                    </div>
                    <input 
                        type="name" 
                        placeholder="Enter your name"
                        className="form--input"
                    />
                    <input 
                        type="phone" 
                        placeholder="Phone number"
                        className="form--input"
                    />

                    <button 
                        className="form--submit"
                    >
                        Confirm
                    </button>
                </form>
            </div>
        </>,
        document.getElementById("booking--form--portal")
    )
}