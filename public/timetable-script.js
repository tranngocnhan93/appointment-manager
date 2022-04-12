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
    document.querySelector(".date h1").innerHTML = "Week "+weekNumber;
    document.querySelector(".date p").innerHTML = currentDate.toDateString();
};

const calculateWeekNumber = () => {
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil((currentDate.getDay() + 1 + days) / 7);
    return weekNumber;
};

const generateEventBubbles = (appointmentRecord) => {

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




