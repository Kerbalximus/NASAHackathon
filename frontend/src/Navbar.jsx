import React from "react";
import { Link } from "react-router-dom";

function Navbar({ planet, setPlanet }) {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li className="nav-li"><Link to="/">Main</Link></li>
                <li className="nav-li"><Link to="/about">About Us</Link></li>
                <li className="nav-li"><Link to="/contact">Contact</Link></li>
                <li className="nav-li"><Link to="https://github.com/Kerbalximus/NASAHackathon/blob/main/Nasa%20hackathon%202025.pdf">Tech paper</Link></li>
            </ul>

            <select
                value={planet}
                onChange={(e) => setPlanet(e.target.value)}
                style={{
                    marginLeft: "2rem",
                    padding: "0.3rem 0.5rem",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(0,0,0,0.3)",
                    color: "#fff"
                }}
            >
                <option value="Mars">Mars</option>
                <option value="Moon">Moon</option>
                <option value="Vesta">Vesta</option>
            </select>
        </nav>
    );
}

export default Navbar;
