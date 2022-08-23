import React, { useEffect, useState } from 'react';
import Axios from 'axios';

export default function Booking () {
    const [records, setRecords] = useState([]);
    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:3000/getAppointments`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const recordResponse = await response.json();
            setRecords(recordResponse);
            console.log(records);
        }
        getRecords();
    }, [records.length]);
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'Right',
                alignItems: 'Right',
                height: '100vh'
            }}
        >
            <h1>Welcome to Booking Calendar</h1>
        </div>
    );
};


