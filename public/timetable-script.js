import { config } from "./config.js";

const currentDate = new Date();
let weekDays = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()]; // Sun - Sat
let weekDates = ""; // Day numbers
const weekDateContainer = document.querySelector(".weekdaynumbers");
let month = currentDate.getMonth();
let weekNumber = undefined;
const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const calculateWeekNumber = () => {
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((currentDate.getDay() + 1 + days) / 7);
    return weekNumber;
};

const renderCalendar = () => {
    weekNumber = calculateWeekNumber();
    for (let i = 0; i < 7; i++) {
        weekDays[i].setDate(weekDays[i].getDate() - weekDays[i].getDay() + i);
        weekDates += `<div>${months[weekDays[i].getMonth()]+" "+weekDays[i].getDate()}</div>`;
        weekDateContainer.innerHTML = weekDates;
    }
    for (let i = config.timetable.open_hour; i <= config.timetable.close_hour; i++ ) {
        let hourSlot = document.createElement("li");
        hourSlot.appendChild(document.createTextNode(i + ":00"));
        document.getElementById("timeslots-id").appendChild(hourSlot);
    }
    document.querySelector(".date h1").innerHTML = "Week "+weekNumber;
    document.querySelector(".date p").innerHTML = currentDate.toDateString();
};

const isInWeek = (bookingDate) => {
    let retval = false;
    for(let i = 0; i < 7; i++) {
        if((bookingDate.getFullYear() == weekDays[i].getFullYear()) &&
           (bookingDate.getMonth() == weekDays[i].getMonth()) &&
           (bookingDate.getDate() == weekDays[i].getDate())) {
                retval = true;
        }
    }
    return retval;
};

const makeBooking = () => {
    console.log("Booking made");
};

const addBookingButton = (bubble) => {
    return (event) => {
        console.log(event);
        bubble.setAttribute("class", "booking-bubble-clicked");
        
        // Add booking button
        if(!bubble.classList.contains("booking-button")) {
            let bookingButton = document.createElement("button");
            bookingButton.setAttribute("class", "booking-button");
            bookingButton.innerHTML = "Book";
            bookingButton.addEventListener("click", makeBooking);
            bubble.appendChild(bookingButton);
        }
        else
            console.log("Debuggg do nothing");
    }
};

const generateBookingBubble = (appointmentRecord) => {
    const bubbleDate = new Date(appointmentRecord.date);
    const bubbleHour = bubbleDate.getHours();
    if(isInWeek(bubbleDate) == true) {
        if((bubbleHour >= config.timetable.open_hour) && (bubbleHour <= config.timetable.close_hour)) {
            // Create a bubble on the timetable
            let bubble = document.createElement("div");
            bubble.setAttribute("class", "booking-bubble");
            bubble.addEventListener("click", addBookingButton(bubble));
            bubble.appendChild(document.createTextNode(bubbleDate.getHours() + ":" + (bubbleDate.getMinutes() == 0?"00":"30")));
            bubble.appendChild(document.createElement("br"));
            bubble.appendChild(document.createTextNode(appointmentRecord.technician));
            document.getElementById("bb-container").appendChild(bubble);

            // Place the bubble according to date, time
            const bubbleColumn = bubbleDate.getDay();
            bubble.style.gridColumn = bubbleColumn + 1; // 1 = offset

            // Map the bubble time to timetable's row: Ex: 12:30 => (12 - 8) x 2 + 1 + 1    
            const bubbleRow = ((bubbleHour - config.timetable.open_hour) * 2) + 1 + (bubbleDate.getMinutes() == 30 ? 1:0);
            bubble.style.gridRow = bubbleRow;
        }
        else
            console.log("Error: invalid technician's vacant time data: " + appointmentRecord.technician + " at " + bubbleDate);
    }
};

const clearBookingBubbles = () => {
    const bubbleContainer = document.getElementById("bb-container");
    while(bubbleContainer.lastChild) {
        bubbleContainer.removeChild(bubbleContainer.lastChild);
    }
};

const retrieveSchedule = () => {
    fetch('/getAppointments')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        data.forEach(element => {
            if(element.customer == "Vacant") {
                generateBookingBubble(element);
            }
        });

    })
    .catch((err) => {
        console.log('Error: ' + err);
    });
};

renderCalendar();
retrieveSchedule();


document.querySelector(".prev").addEventListener("click", () => {
    weekNumber -= 1;
    if(weekNumber <= 0)
        weekNumber = 52;
    let weekDates = "";
    for (let i = 0; i < 7; i++) {
        weekDays[i].setDate(weekDays[i].getDate() - 7);
        weekDates += `<div>${months[weekDays[i].getMonth()]+" "+weekDays[i].getDate()}</div>`;
        weekDateContainer.innerHTML = weekDates;
    }
    clearBookingBubbles();
    retrieveSchedule();
    document.querySelector(".date h1").innerHTML = "Week "+weekNumber;
});
document.querySelector(".next").addEventListener("click", () => {
    weekNumber += 1;
    if(weekNumber >= 53)
        weekNumber = 1;
    let weekDates = "";
    for (let i = 0; i < 7; i++) {
        weekDays[i].setDate(weekDays[i].getDate() + 7);
        weekDates += `<div>${months[weekDays[i].getMonth()]+" "+weekDays[i].getDate()}</div>`;
        weekDateContainer.innerHTML = weekDates;
    }
    clearBookingBubbles();
    retrieveSchedule();
    document.querySelector(".date h1").innerHTML = "Week "+weekNumber;
});




