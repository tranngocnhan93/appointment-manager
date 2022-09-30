import React from "react";
import ReactDom from "react-dom"
import "./styles/BookingForm.css"
import TechnicianSelector from "./TechnicianSelector";
import { useState } from "react";


export default function BookingForm(props) {
    const [technician, setTechnician] = useState("");
    const [formData, setFormData] = useState({technician: "", time: "", name: "", phone: ""});
    const timeFormatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false
    };
    const bookingTime = new Date(props.data[0] && props.data[0].date);

    function handleSubmit(event) {
        event.preventDefault();
        let tempTechnician
        let tempTime

        if (props.data.length === 1) {
            tempTechnician = technicians[0];
            tempTime = props.data[0].date;
        }
        else if (props.data.length > 1) {
            tempTechnician = technician;
            tempTime = props.data[0].date;
        }

        setFormData(prev => {
            return {
                ...prev,
                technician: tempTechnician,
                time: tempTime
            }
        })

        if (tempTechnician === "" || tempTime === "") {
            console.log("Select a technician first")
        }
        
        //Clear all data
        //setTechnician("")
        //setFormData({technician: "", time: "", name: "", phone: ""})
    }
    
    console.log(formData)
    function handleInput(event) {
        const {name, value} = event.target;
        setFormData(prev => {
            return {
                ...prev,
                [name] : value
            }
        })
    }

    function filterTechnician(paramTechnician) {
        setTechnician(paramTechnician);
    }


    if (!props.isOpen) {
        return null;
    }

    const technicians = props.data.map(item => {
        return item.technician
    })

    const renderTechnicians = (
        technicians.length > 1 ? 
            <div id="technician--selector">
                <TechnicianSelector isInBookingForm={true} handleClick={filterTechnician} technicians={technicians} />
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
                        name="name"
                        placeholder="Enter your name"
                        className="form--input"
                        onChange={handleInput}
                        value={formData.name}
                    />
                    <input
                        type="phone"
                        name="phone"
                        placeholder="Phone number"
                        className="form--input"
                        onChange={handleInput}
                        value={formData.phone}
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