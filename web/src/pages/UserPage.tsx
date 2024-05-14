import { Descriptions } from "antd";
import { useApi } from "../hooks/useApi";
import { useEffect, useState } from "react";
import { LocationPicker } from "../components/LocationPicker";
import { useParams } from "react-router-dom";

export const UserPage = () => {
  const { getApi } = useApi();
  const [data, setData] = useState({ email: "", profile: {}, address: {} });
  const [center, setCenter] = useState([45.65, -123.4]);
  const [position, setPosition] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getApi(`/profile/${id}`).then((data) => {
      setData(data);
      if (data.address.latitude && data.address.longitude) {
        setCenter([data.address.latitude, data.address.longitude]);
        setPosition([data.address.latitude, data.address.longitude]);
      }
    });
  }, []);

  const onPosition = () => {};

  return (
    <div style={{ maxWidth: 800, margin: " 10px auto" }}>
      <h1>{data.email}</h1>

      <Descriptions column={1}>
        <Descriptions.Item label="FirstName">
          {data.profile.first_name}
        </Descriptions.Item>
        <Descriptions.Item label="LastName">
          {data.profile.last_name}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          {data.profile.gender}
        </Descriptions.Item>
        <Descriptions.Item label="APT">{data.profile.apt}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {data.profile.description}
        </Descriptions.Item>
        <Descriptions.Item label="Address">
          {data.address.street_address}, {data.address.city},{" "}
          {data.address.state}, {data.address.postal_code},{" "}
          {data.address.country}
        </Descriptions.Item>
        <Descriptions.Item label="Location">
          {data.address.latitude}, {data.address.longitude}
        </Descriptions.Item>
      </Descriptions>

      <LocationPicker
        center={center}
        location={position}
        onPosition={onPosition}
      />
    </div>
  );
};
