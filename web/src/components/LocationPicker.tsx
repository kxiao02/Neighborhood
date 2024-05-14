import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

export const LocationPicker = ({ center, location, onPosition }) => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    setPosition(location);
  }, [location]);

  function SelecteLocation({}) {
    useMapEvent("click", (e) => {
      setPosition(e.latlng);
      onPosition(e.latlng);
    });
    return position ? <Marker position={position} /> : null;
  }

  return (
    <MapContainer
      style={{
        height: "200px",
        minHeight: "200px",
        width: "100%",
        minWidth: "200px",
        boxSizing: "border-box",
      }}
      center={center}
      attributionControl={false}
      zoomControl={false}
      zoom={13}
      key={center.toString()}
    >
      <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png" />
      <SelecteLocation />
    </MapContainer>
  );
};
