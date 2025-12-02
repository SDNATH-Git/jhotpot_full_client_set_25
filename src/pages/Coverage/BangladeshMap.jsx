import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { motion } from "framer-motion";

// Center of Bangladesh
const position = [23.685, 90.3563];

// Default map icon
const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Highlighted marker icon
const activeIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconSize: [30, 50],
    iconAnchor: [15, 50],
    className: "drop-shadow-lg",
});

// Smooth map fly animation
function FlyToDistrict({ coords }) {
    const map = useMap();
    if (coords) map.flyTo(coords, 10, { duration: 1.5 });
    return null;
}

const BangladeshMap = ({ serviceCenters }) => {
    const [searchText, setSearchText] = useState("");
    const [activeCoords, setActiveCoords] = useState(null);
    const [activeDistrict, setActiveDistrict] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        const district = serviceCenters.find((d) =>
            d.district.toLowerCase().includes(searchText.toLowerCase())
        );
        if (district) {
            setActiveCoords([district.latitude, district.longitude]);
            setActiveDistrict(district.district);
        } else {
            setActiveCoords(null);
            setActiveDistrict(null);
            alert("District not found!");
        }
    };

    return (
        <section className="w-full h-[500px] md:h-[700px] flex flex-col items-center gap-6 py-8  ">
            {/* 🌫️ Glass Search Bar (outside map) */}
            <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md flex bg-white/30 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl overflow-hidden"
            >
                <input
                    type="text"
                    placeholder="🔍 Search district..."
                    className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-600 bg-transparent outline-none"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-[#0D5EA6] text-white px-5 font-semibold hover:bg-[#0D5EA6] transition-all"
                >
                    Go
                </button>
            </motion.form>

            {/* 🗺️ Map Container */}
            <div className="w-full z-0 h-[500px] rounded-xl overflow-hidden shadow-xl border-2 border-gray-300">
                <MapContainer
                    center={position}
                    zoom={7}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FlyToDistrict coords={activeCoords} />

                    {serviceCenters?.map((center, index) => (
                        <Marker
                            key={index}
                            position={[center.latitude, center.longitude]}
                            icon={
                                center.district === activeDistrict ? activeIcon : defaultIcon
                            }
                        >
                            <Popup autoOpen={center.district === activeDistrict}>
                                <strong>{center.district}</strong>
                                <br />
                                {center.covered_area.join(", ")}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* 🧾 Active District Info Card */}
            {activeDistrict && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/60 backdrop-blur-md rounded-xl shadow-lg border border-white/40 px-6 py-4 max-w-lg text-center"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        {activeDistrict}
                    </h2>
                    <p className="text-gray-700">
                        Covered Areas:{" "}
                        {serviceCenters
                            .find((d) => d.district === activeDistrict)
                            ?.covered_area.join(", ")}
                    </p>
                </motion.div>
            )}
        </section>
    );
};

export default BangladeshMap;

