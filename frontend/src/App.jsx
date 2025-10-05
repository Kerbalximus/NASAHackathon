import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Primary from "./Prain.jsx";
import "./App.css";
import "./Contacts.jsx"
import AboutUs from "./AboutUs";
import Contacts from "./Contacts.jsx";
function App() {
    const [planet, setPlanet] = useState("Mars");

    return (
        <Router>
            <Navbar planet={planet} setPlanet={setPlanet} />

            <div className="content">
                <Routes>
                    <Route path="/" element={<Primary planet={planet} />} />
                    <Route path="/about" element={<AboutUs   />} />
                    <Route path="/contact" element={<Contacts  />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
