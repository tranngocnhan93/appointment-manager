import React from "react";
import ReactDom from "react-dom"
import "./styles/BookingForm.css"
import TechnicianSelector from "./TechnicianSelector";


export default function BookingForm(props) {
    function handleSubmit() {
        console.log("submit")
    }

    const timeFormatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false
    };

    const bookingTime = new Date(props.data[0] && props.data[0].date);

    if (!props.isOpen) {
        return null;
    }

    const technicians = props.data.map(item => {
        return item.technician
    })

    const renderTechnicians = (
        technicians.length > 1 ? 
            <div id="technician--selector">
                <TechnicianSelector isInBookingForm={true} technicians={technicians} />
            </div> : 
            technicians.length === 1 ?
                <div className="technician--textbox">{technicians[0]}</div> :
                <div className="technician--textbox">Technician not found</div>
    )

    const renderBookingTime = (
        props.data[0] != null ? 
        <div className="form--time">{bookingTime.toLocaleString("en-GB", timeFormatOptions)}</div> :
        <div>Booking time not found</div>
    )

    return ReactDom.createPortal(
        <>
            <div className="backdrop" onClick={props.closeForm}></div>
            <div className="booking--form--container">
                <form className="booking--form" onSubmit={handleSubmit}>
                    <button className="form--close" onClick={props.closeForm}>x</button>
                    {renderTechnicians}
                    {renderBookingTime}
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