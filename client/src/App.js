import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Booking from "./pages/Booking";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Home/>} />
        <Route path='/booking' element={<Booking/>} />
        <Route path='/about' element={<About/>} />
      </Routes>
    </Router>
  );
}

