import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import { Zoom } from "ol/control";
import { Draw } from "ol/interaction";
import { createBox } from "ol/interaction/Draw";
import { Style, Stroke, Fill } from "ol/style";

function Mapp({ planet, onImageCaptured }) {
    const mapRef = useRef(null);
    const layerRef = useRef(null);
    const vectorSourceRef = useRef(null);
    const drawInteractionRef = useRef(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [copyStatus, setCopyStatus] = useState("");

    const planetTiles = {
        Mars: "https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
        Moon: "https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
        Vesta: "https://trek.nasa.gov/tiles/Vesta/EQ/VestaHAMOLAMOBlend.eq/1.0.0/default/default028mm/{z}/{y}/{x}.png"
    };

    const copyAreaToClipboard = async (extent) => {
        const map = mapRef.current;
        if (!map) return;

        try {
            setCopyStatus("Capturing...");

            const topLeft = map.getPixelFromCoordinate([extent[0], extent[3]]);
            const bottomRight = map.getPixelFromCoordinate([extent[2], extent[1]]);

            map.once("rendercomplete", async function () {
                const mapCanvas = document.createElement("canvas");
                const size = map.getSize();
                mapCanvas.width = size[0];
                mapCanvas.height = size[1];
                const mapContext = mapCanvas.getContext("2d");

                Array.prototype.forEach.call(
                    map.getViewport().querySelectorAll(".ol-layer canvas, canvas.ol-layer"),
                    function (canvas) {
                        if (canvas.width > 0) {
                            const opacity = canvas.parentNode.style.opacity || canvas.style.opacity;
                            mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);

                            const transform = canvas.style.transform;
                            const matrix = transform
                                .match(/^matrix\(([^\(]*)\)$/)[1]
                                .split(",")
                                .map(Number);

                            CanvasRenderingContext2D.prototype.setTransform.apply(
                                mapContext,
                                matrix
                            );
                            mapContext.drawImage(canvas, 0, 0);
                        }
                    }
                );

                mapContext.globalAlpha = 1;
                mapContext.setTransform(1, 0, 0, 1, 0, 0);

                const croppedCanvas = document.createElement("canvas");
                const croppedContext = croppedCanvas.getContext("2d");

                const width = bottomRight[0] - topLeft[0];
                const height = bottomRight[1] - topLeft[1];

                croppedCanvas.width = width;
                croppedCanvas.height = height;

                croppedContext.drawImage(
                    mapCanvas,
                    topLeft[0], topLeft[1], width, height,
                    0, 0, width, height
                );

                try {
                    croppedCanvas.toBlob(async (blob) => {
                        if (blob) {
                            if (onImageCaptured) {
                                const file = new File(
                                    [blob],
                                    `map-screenshot-${planet}-${Date.now()}.png`,
                                    { type: "image/png" }
                                );
                                onImageCaptured(file);
                            }

                            try {
                                await navigator.clipboard.write([
                                    new ClipboardItem({ "image/png": blob })
                                ]);
                                setCopyStatus("✓ Copied to clipboard!");
                                setTimeout(() => setCopyStatus(""), 3000);
                            } catch {
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `map-screenshot-${planet}-${Date.now()}.png`;
                                a.click();
                                URL.revokeObjectURL(url);
                                setCopyStatus("✓ Downloaded (clipboard unavailable)");
                                setTimeout(() => setCopyStatus(""), 3000);
                            }
                        }
                    }, "image/png");
                } catch (error) {
                    console.error("Error creating image:", error);
                    setCopyStatus("❌ Error");
                    setTimeout(() => setCopyStatus(""), 3000);
                }
            });

            map.renderSync();
        } catch (error) {
            console.error("Error:", error);
            setCopyStatus("❌ Error");
            setTimeout(() => setCopyStatus(""), 3000);
        }
    };

    useEffect(() => {
        if (!mapRef.current) {
            const initialLayer = new TileLayer({
                source: new XYZ({
                    url: planetTiles[planet],
                    maxZoom: 10,
                    crossOrigin: "anonymous"
                }),
            });
            layerRef.current = initialLayer;

            const vectorSource = new VectorSource();
            vectorSourceRef.current = vectorSource;

            const vectorLayer = new VectorLayer({
                source: vectorSource,
                style: new Style({
                    stroke: new Stroke({
                        color: "rgba(0, 123, 255, 1)",
                        width: 3, // увеличена толщина линии
                        lineDash: [5, 5],
                    }),
                    fill: new Fill({
                        color: "rgba(0, 123, 255, 0.15)",
                    }),
                }),
            });

            const map = new Map({
                target: "map",
                layers: [initialLayer, vectorLayer],
                view: new View({
                    center: [0, 0],
                    zoom: 3,
                    projection: "EPSG:3857",
                    minZoom: 0,
                    maxZoom: 10,
                }),
                controls: [],
            });
            mapRef.current = map;

            map.addControl(new Zoom({ className: "ol-zoom ol-custom-zoom" }));

            const draw = new Draw({
                source: vectorSource,
                type: "Circle",
                geometryFunction: createBox(),
                condition: (e) => e.originalEvent.button === 2,
            });

            drawInteractionRef.current = draw;

            draw.on("drawend", (event) => {
                const geometry = event.feature.getGeometry();
                const extent = geometry.getExtent();

                setTimeout(() => {
                    copyAreaToClipboard(extent);
                    setTimeout(() => {
                        vectorSource.clear();
                    }, 500);
                }, 100);
            });

            const mapElement = document.getElementById("map");
            mapElement.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                return false;
            });
        } else {
            const newSource = new XYZ({
                url: planetTiles[planet],
                maxZoom: 10,
                crossOrigin: "anonymous",
            });
            layerRef.current.setSource(newSource);
            newSource.refresh();
        }
    }, [planet]);

    const toggleSelectionMode = () => {
        const map = mapRef.current;
        const draw = drawInteractionRef.current;

        if (!map || !draw) return;

        const currentZoom = map.getView().getZoom();
        const minZoomForSelection = 6;

        if (!isSelecting && currentZoom < minZoomForSelection) {
            alert(`Zoom more! (min: ${minZoomForSelection})`);
            return;
        }

        if (isSelecting) {
            map.removeInteraction(draw);
        } else {
            map.addInteraction(draw);
        }
        setIsSelecting(!isSelecting);
    };

    return (
        <div className="map-container">
            <div id="map" className="map-background" />

            <div className="selection-panel">
                <button
                    onClick={toggleSelectionMode}
                    className={`selection-button ${isSelecting ? "disable" : "enable"}`}
                >
                    {isSelecting ? "Disable Selection" : "Enable Selection"}
                </button>

                <div className="info-text">
                    {isSelecting
                        ? "Right-click and drag to select an area"
                        : "Click to activate selection"}
                </div>

                {copyStatus && (
                    <div
                        className={`status-text ${
                            copyStatus.includes("✓")
                                ? "success"
                                : copyStatus.includes("❌")
                                    ? "error"
                                    : "warning"
                        }`}
                    >
                        {copyStatus}
                    </div>
                )}

                <hr className="panel-divider" />

                <div className="info-text small-text">
                    💡 Selected area will be copied and sent to upload field
                </div>
            </div>
        </div>
    );
}

export default Mapp;
