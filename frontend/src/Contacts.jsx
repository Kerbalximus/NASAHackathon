// Contacts.jsx
import React from "react";
import "./App.css"; // используем стили от About

export default function Contacts() {
    const contactsData = [
        {
            name: "Matvei Sotnikov",
            age: 17,
            school: "School Luís de Freitas Branco, Lisbon",
            telegram: "https://t.me/kerbalximus",
            telegramText: "@kerbalximus",
            email: "matsotnikov@gmail.com",
        },
        {
            name: "Yurii Yesypenko",
            age: 16,
            school: "School Luís de Freitas Branco, Lisbon",
            telegram: null,
            email: "yuriy.iesypenko@gmail.com",
        },
        {
            name: "Erik Brits",
            age: 17,
            school: "School Anselmo de Andrade School Group",
            telegram: "https://t.me/iamEri_k",
            telegramText: "@iamEri_k",
            email: "mario.britz2015@gmail.com",
        },
    ];

    return (
        <div className="about-page">
            <h1 className="about-title">Contacts</h1>

            <div className="about-content">
                {contactsData.map((contact, index) => (
                    <div className="about-panel" key={index}>
                        <h2>{contact.name}</h2>
                        <p>
                            {contact.age} y.o., {contact.school}
                            <br />
                            {contact.telegram && (
                                <>
                                    Telegram:{" "}
                                    <a href={contact.telegram} target="_blank" rel="noreferrer">
                                        {contact.telegramText}
                                    </a>
                                    <br />
                                </>
                            )}
                            Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
