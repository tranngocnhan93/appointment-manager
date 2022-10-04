import React from "react";
import ReactDom from "react-dom"
import "./styles/BookingForm.css"
import TechnicianSelector from "./TechnicianSelector";
import { useState, useEffect } from "react";


export default function BookingForm(props) {
    const [technician, setTechnician] = useState("");
    const [formData, setFormData] = useState({appointmentID: "", customer: "", phone: ""});
    const timeFormatOptions = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false
    };
    const bookingTime = new Date(props.data[0] && props.data[0].date);

    useEffect(() => {
        console.log("aaaa")
        if (props.data.length === 1) {
            setFormData(prev => {
                return {
                    ...prev,
                    appointmentID: props.data[0]._id
                }
            })
        }

    }, [props.data])

    useEffect(() => {
        if (props.data.length > 1) {
            console.log("bbbb")
            const temAppointment = props.data.find(item => item.technician === technician)
            if (temAppointment != null) {
                setFormData(prev => {
                    return {
                        ...prev,
                        appointmentID: temAppointment._id
                    }
                })
            }
        }
    }, [technician])

    function handleSubmit(event) {
        event.preventDefault();
        async function submitForm() {
            const payload = {
                method: "PUT",
                //mode: "cors",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            };
            console.log(payload.body)
            const response = await fetch(`http://localhost:3000/update/${formData.appointmentID}`, payload);
    
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
    
            const recordResponse = await response.json();
            console.log(recordResponse)
        }
        submitForm()

    }

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

    const renderAppointmentPlace = (
        props.data[0] != null ? 
        <div className="form--place">{props.data[0].place}</div> :
        <div>Appointment place not found</div>
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
                    {renderAppointmentPlace}
                    {renderBookingTime}
                    <input
                        type="customer"
                        name="customer"
                        placeholder="Enter your name"
                        className="form--input"
                        onChange={handleInput}
                        value={formData.customer}
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