// AboutUs.jsx
import React from "react";

export default function AboutUs() {
    return (
        <div className="about-page">
            <h1 className="about-title">About Us</h1>

            <div className="about-content">
                <div className="about-panel">
                    <h2>Project</h2>
                    <p>
                        <strong>Computer Vision & Features Of Celestial Bodies' Landscapes</strong><br />
                        Authors: Matvei Sotnikov, Yurii Yesypenko, Erik Brits<br />
                        In October 2025, we participated in NASA's Space Apps Challenge hackathon in Lisbon.
                        Over two days, we developed a neural network (ResNet-50) to classify landscape elements
                        of Mars and the Moon using NASA datasets.
                    </p>
                </div>

                <div className="about-panel">
                    <h2>Abstract</h2>
                    <p>
                        Neural model trained on 80,000+ labeled images predicts Martian and lunar landscape features
                        with over 98% accuracy. Website <strong>Planets-Map.select</strong> allows users to
                        select map areas and receive predictions about terrain type.
                    </p>
                </div>

                <div className="about-panel">
                    <h2>Practical Application</h2>
                    <p>
                        Dockerized Python service (FastAPI + PyTorch). Frontend renders NASA basemaps of Moon, Mars, Vesta.
                        Users draw regions of interest and get immediate predictions for planetary landscapes.
                    </p>
                </div>
            </div>
        </div>
    );
}
