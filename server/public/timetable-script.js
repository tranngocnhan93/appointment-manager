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
        weekDates += `<div>${months[weekDays[i].getMonth()] + " " + weekDays[i].getDate()}</div>`;
        weekDateContainer.innerHTML = weekDates;
    }
    for (let i = config.timetable.open_hour; i <= config.timetable.close_hour; i++) {
        let hourSlot = document.createElement("li");
        hourSlot.appendChild(document.createTextNode(i + ":00"));
        document.getElementById("timeslots-id").appendChild(hourSlot);
    }
    document.querySelector(".date h1").innerHTML = "Week " + weekNumber;
    document.querySelector(".date p").innerHTML = currentDate.toDateString();
};

const isInWeek = (bookingDate) => {
    let retval = false;
    for (let i = 0; i < 7; i++) {
        if ((bookingDate.getFullYear() == weekDays[i].getFullYear()) &&
            (bookingDate.getMonth() == weekDays[i].getMonth()) &&
            (bookingDate.getDate() == weekDays[i].getDate())) {
            retval = true;
        }
    }
    return retval;
};

const handleBubbleClick = (bubble, appointmentRecord) => {
    return (event) => {
        let bookingForm = document.getElementById("booking-form-container-id");
        const dateFormInput = new Date(appointmentRecord.date);
        document.getElementById("bookingID").value = appointmentRecord._id;
        document.getElementById("form-date").innerHTML = "Date: " + dateFormInput.toLocaleDateString();
        document.getElementById("form-time").innerHTML = "Time: " + dateFormInput.toLocaleTimeString();
        document.getElementById("form-place").innerHTML = "Place: " + appointmentRecord.place;
        document.getElementById("form-technician").innerHTML = "Technician: " + appointmentRecord.technician;


        if (bookingForm.style.display != "block") {
            bookingForm.style.display = "block";
            bubble.setAttribute("class", "booking-bubble-clicked");
            event.stopPropagation();    // So that the form is not hidden again by other bubbles' click outside
        }
        else if (bookingForm.style.display == "block") {
            bookingForm.style.display = "none";
            bubble.setAttribute("class", "booking-bubble");
        }
    }
};

const generateBookingBubble = (appointmentRecord) => {
    const bubbleDate = new Date(appointmentRecord.date);
    const bubbleHour = bubbleDate.getHours();
    if (isInWeek(bubbleDate) == true) {
        if ((bubbleHour >= config.timetable.open_hour) && (bubbleHour <= config.timetable.close_hour)) {
            // Create a bubble on the timetable
            let bubble = document.createElement("div");
            bubble.setAttribute("class", "booking-bubble");
            bubble.addEventListener("click", handleBubbleClick(bubble, appointmentRecord));
            bubble.appendChild(document.createTextNode(bubbleDate.getHours() + ":" + (bubbleDate.getMinutes() == 0 ? "00" : "30")));
            bubble.appendChild(document.createElement("br"));
            bubble.appendChild(document.createTextNode(appointmentRecord.technician));
            document.getElementById("bb-container").appendChild(bubble);

            // Place the bubble according to date, time
            const bubbleColumn = bubbleDate.getDay();
            bubble.style.gridColumn = bubbleColumn + 1; // 1 = offset

            // Map the bubble time to timetable's row: Ex: 12:30 => (12 - 8) x 2 + 1 + 1    
            const bubbleRow = ((bubbleHour - config.timetable.open_hour) * 2) + 1 + (bubbleDate.getMinutes() == 30 ? 1 : 0);
            bubble.style.gridRow = bubbleRow;
        }
        else
            console.log("Error: invalid technician's vacant time data: " + appointmentRecord.technician + " at " + bubbleDate);
    }
};

const clearBookingBubbles = () => {
    let bubbles = document.querySelectorAll('[class="booking-bubble"]');
    bubbles.forEach(bubble => {
        bubble.remove();
    });
};

const retrieveSchedule = () => {
    fetch('/getAppointments')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            data.forEach(element => {
                if (element.customer == "Vacant") {
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

window.addEventListener("load", function () {
    function sendBookingForm() {
        const XHR = new XMLHttpRequest();
        const FD = new FormData(bookingForm);

        XHR.addEventListener("load", function (event) {
            alert(event.target.responseText);
        });
        XHR.addEventListener("error", function (event) {
            alert('Oops! Something went wrong.');
        });

        XHR.open("PUT", "/update/" + FD.get('bookingID'));
        XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        let url = "customer=" + FD.get('customer') + "&phone=" + FD.get('phone');
        XHR.send(url);
    }


    const bookingForm = document.getElementById("booking-form-id");
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();
        sendBookingForm();
    });
});

document.addEventListener("click", function (event) {
    let bookingForm = document.getElementById("booking-form-container-id");
    let isClickedInsideForm = bookingForm.contains(event.target);
    if (!isClickedInsideForm) {
        if (bookingForm.style.display === "block") {
            bookingForm.style.display = "none";
        }
    }

    let bubbles = document.querySelectorAll('[class="booking-bubble-clicked"]');
    let isClickedInside;
    bubbles.forEach(bubble => {
        isClickedInside = bubble.contains(event.target);
        if (!isClickedInside && !isClickedInsideForm) {
            bubble.setAttribute("class", "booking-bubble");
        }
    });
});
document.querySelector(".prev").addEventListener("click", () => {
    weekNumber -= 1;
    if (weekNumber <= 0)
        weekNumber = 52;
    let weekDates = "";
    for (let i = 0; i < 7; i++) {
        weekDays[i].setDate(weekDays[i].getDate() - 7);
        weekDates += `<div>${months[weekDays[i].getMonth()] + " " + weekDays[i].getDate()}</div>`;
        weekDateContainer.innerHTML = weekDates;
    }
    clearBookingBubbles();
    retrieveSchedule();
    document.querySelector(".date h1").innerHTML = "Week " + weekNumber;
});
document.querySelector(".next").addEventListener("click", () => {
    weekNumber += 1;
    if (weekNumber >= 53)
        weekNumber = 1;
    let weekDates = "";
    for (let i = 0; i < 7; i++) {
        weekDays[i].setDate(weekDays[i].getDate() + 7);
        weekDates += `<div>${months[weekDays[i].getMonth()] + " " + weekDays[i].getDate()}</div>`;
        weekDateContainer.innerHTML = weekDates;
    }
    clearBookingBubbles();
    retrieveSchedule();
    document.querySelector(".date h1").innerHTML = "Week " + weekNumber;
});




