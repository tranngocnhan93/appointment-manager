import { config } from "./config.js";

const currentDate = new Date();
let weekDays = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()]; // Sun - Sat
let weekDates = ""; // Day numbers
const weekDateContainer = document.querySelector(".daynumbers");
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

const calculateWeekNumber = () => {
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil((currentDate.getDay() + 1 + days) / 7);
    return weekNumber;
};

const generateEventBubbles = (appointmentRecord) => {

};

const isInWeek = (eventDate) => {
    let retval = false;
    for(let i = 0; i < 7; i++) {
        if((eventDate.getFullYear() == weekDays[i].getFullYear()) &&
           (eventDate.getMonth() == weekDays[i].getMonth()) &&
           (eventDate.getDay() == weekDays[i].getDay())) {
                retval = true;
        }
    }
    return retval;
};

const retrieveSchedule = () => {
    fetch('/getAppointments')
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        data.forEach(element => {
            if(element.customer == "Vacant") {
                console.log(element.technician);
                let event1 = document.createElement("div");
                event1.setAttribute("class", "event-timeslot");
                event1.appendChild(document.createTextNode(element.technician));
                document.getElementById("ev-container").appendChild(event1);

                let eventDate = new Date(element.date);
                if(isInWeek(eventDate) == true) {
                    let column = eventDate.getDay();
                    event1.style.gridColumn = column + 1; // 1 = offset
                }
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
    document.querySelector(".date h1").innerHTML = "Week "+weekNumber;
});




