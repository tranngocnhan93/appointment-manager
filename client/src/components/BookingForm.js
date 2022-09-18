import React from "react";
import "./styles/BookingForm.css"

function handleSubmit() {
    console.log("submit")
}

export default function BookingForm() {
    return (
        <div className="container">
            <form className="booking--form" onSubmit={handleSubmit}>
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
    )
}