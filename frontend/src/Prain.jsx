import React, { useState, useCallback, useEffect, useRef } from "react";
import Mapp from "./map";

const labelDescriptions = {
    0: "Undefined/Other: unrecognized or other object",
    1: "Crater: a crater on the surface",
    2: "Dark Dune: a dark sand dune",
    3: "Slope Streak: a streak on a slope",
    4: "Bright Dune: a bright sand dune",
    5: "Impact Ejecta: material ejected from an impact",
    6: "Swiss Cheese: 'Swiss cheese', erosional features",
    7: "Spider: 'spiders', radial fractures",
};

function Main({ planet }) {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    };

    const handleDragOver = (e) => e.preventDefault();

    const handlePaste = useCallback((e) => {
        if (e.clipboardData.files && e.clipboardData.files[0]) setFile(e.clipboardData.files[0]);
    }, []);

    useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [handlePaste]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setResult({ error: "Please choose, paste, or capture an image!" });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                "https://api.planets-map.select/api/v1/classify/image",
                { method: "POST", body: formData }
            );
            const data = await response.json();

            setResult({
                id: data.class_id,
                label: data.label,
                confidence: data.confidence,
                description: labelDescriptions[data.class_id],
            });

            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Upload error:", error);
            setResult({ error: "Error while sending request!" });
        }
    };

    return (
        <div className="main-page">
            <div className="main-content">
                <Mapp planet={planet} onImageCaptured={(capturedFile) => setFile(capturedFile)} />
            </div>

            <form className="upload-form" onSubmit={handleSubmit}>
                <label className="upload-area" onDrop={handleDrop} onDragOver={handleDragOver}>
                    {file ? (
                        <span className="file-name">{file.name}</span>
                    ) : (
                        <span>Drag & drop, paste, capture from map, or click to select an image</span>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="upload-input"
                        ref={fileInputRef}
                    />
                </label>
                <button type="submit" className="upload-button">
                    Upload & Classify
                </button>
            </form>

            {result && (
                <div
                    className="modal-overlay"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setResult(null)}
                >
                    <div
                        className="modal-content"
                        style={{
                            background: "rgba(0,0,0,0.25)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            padding: "1.5rem",
                            borderRadius: "15px",
                            minWidth: "300px",
                            maxWidth: "400px",
                            color: "#ffffff",
                            position: "relative",
                            boxShadow: "0 6px 25px rgba(0,0,0,0.3)",
                            transition: "all 0.3s ease",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "transparent",
                                border: "none",
                                color: "#fff",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                                transition: "color 0.3s ease",
                            }}
                            onClick={() => setResult(null)}
                            onMouseEnter={(e) => (e.target.style.color = "#f39c12")}
                            onMouseLeave={(e) => (e.target.style.color = "#fff")}
                        >
                            ×
                        </button>

                        {result.error ? (
                            <p>{result.error}</p>
                        ) : (
                            <>
                                <h3 style={{ margin: "0 0 0.5rem 0" }}>{result.label}</h3>
                                <p style={{ fontSize: "0.85rem", color: "#ccc" }}>
                                    Class ID: {result.id} | Confidence: {(result.confidence * 100).toFixed(2)}%
                                </p>
                                <p style={{ fontSize: "0.8rem", marginTop: "0.5rem", color: "#aaa" }}>
                                    {result.description}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Main;
