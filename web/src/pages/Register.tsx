import { useState } from "react";
import { Button, Form, Input, Radio, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { LocationPicker } from "../components/LocationPicker";

export const Register = () => {
  const navigate = useNavigate();
  const { postApi } = useApi();
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState([45.65, -123.4]);
  const [position, setPosition] = useState(null);
  const [form] = Form.useForm();

  const handleOk = () => {
    return form.validateFields().then((values) => {
      setLoading(true);
      postApi(`/reg`, values)
        .then(() => {
          message.success("Register success. Please login.");
          navigate("/login");
        })
        .catch((err) => {
          console.log(err);
          message.error(
            err.message ||
              "Register failed. Please check your email and password."
          );
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };
  const onPosition = (latLng) => {
    setPosition(latLng);
    form.setFieldsValue({
      address: {
        latitude: latLng.lat,
        longitude: latLng.lng,
      },
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh", // This makes the div take up the full height of the viewport
      }}
    >
      <Form form={form} style={{ width: 360 }}>
        <h1 style={{ textAlign: "center" }}>Register</h1>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input your Email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name={["profile", "gender"]}
          label="Gender"
          rules={[{ required: true, message: "Please select your Gender!" }]}
        >
          <Radio.Group>
            <Radio value="MALE">Male</Radio>
            <Radio value="FEMALE">Female</Radio>
            <Radio value="NON-BINARY">Non-Binary</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={["profile", "first_name"]}
          label="First Name"
          rules={[{ required: true, message: "Please input your First Name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["profile", "last_name"]}
          label="Last Name"
          rules={[{ required: true, message: "Please input your Last Name!" }]}
        >
          <Input />
        </Form.Item>

        <LocationPicker
          center={center}
          location={position}
          onPosition={onPosition}
        />
        <Form.Item
          style={{ marginTop: 16 }}
          name={["address", "longitude"]}
          label="Longitude"
          rules={[{ required: true, message: "Please input your Longitude!" }]}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name={["address", "latitude"]}
          label="Latitude"
          rules={[{ required: true, message: "Please input your Latitude!" }]}
        >
          <Input readOnly />
        </Form.Item>

        <Form.Item style={{ marginTop: 16 }}>
          <Button
            block
            type="primary"
            htmlType="submit"
            onClick={handleOk}
            loading={loading}
          >
            Register
          </Button>
        </Form.Item>

        <div style={{ textAlign: "center" }}>
          <span>Already have an account? </span>
          <Link to="/login">Login </Link> here.
        </div>
      </Form>
    </div>
  );
};
