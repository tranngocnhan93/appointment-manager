const config = {
    app: {
        port: 3000, 
        name: 'apointment manager app'
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'appointments_db',
        collection: 'appointments'
    },
    timetable: {
        open_hour: 9,
        close_hour: 17,
    }
};

export { config };