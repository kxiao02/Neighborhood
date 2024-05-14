import { Form, Input, Button, Row, Col, Radio, notification } from "antd";
import { useApi } from "../hooks/useApi";
import { useEffect, useState } from "react";
import { LocationPicker } from "../components/LocationPicker";
import { useAppContext } from "../components/AppProvider";

export const Profile = () => {
  const { getApi, postApi } = useApi();
  const [data, setData] = useState({ profile: {}, address: {} });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [center, setCenter] = useState([45.65, -123.4]);
  const [position, setPosition] = useState(null);
  const { getMe } = useAppContext();

  useEffect(() => {
    getApi(`/profile`).then((data) => {
      setData(data);
      if (data.address.latitude && data.address.longitude) {
        setCenter([data.address.latitude, data.address.longitude]);
        setPosition([data.address.latitude, data.address.longitude]);
      }
      form.setFieldsValue(data);
    });
  }, []);

  const onPosition = (latLng) => {
    setPosition(latLng);
    form.setFieldsValue({
      address: {
        latitude: latLng.lat,
        longitude: latLng.lng,
      },
    });
  };

  const onFinish = (values) => {
    setLoading(true);
    postApi(`/profile`, values)
      .then(() => {
        notification.success({
          message: "Profile updated successfully",
          description: "Your profile has been updated successfully",
        });
        getMe();
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h1>Profile</h1>
      <Form
        onFinish={onFinish}
        form={form}
        initialValues={data}
        layout="vertical"
      >
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              name={["profile", "user_name"]}
              label="Username"
              rules={[{ max: 255 }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["profile", "gender"]}
              label="Gender"
              rules={[
                { required: true, message: "Please select your Gender!" },
              ]}
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
              rules={[
                { required: true, message: "Please input your First Name!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["profile", "last_name"]}
              label="Last Name"
              rules={[
                { required: true, message: "Please input your Last Name!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item name={["profile", "apt"]} label="APT">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={["profile", "description"]} label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={["profile", "aid"]} hidden></Form.Item>
          </Col>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={["address", "longitude"]}
                  label="Longitude"
                  rules={[
                    { required: true, message: "Please input your Longitude!" },
                  ]}
                >
                  <Input readOnly />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={["address", "latitude"]}
                  label="Latitude"
                  rules={[
                    { required: true, message: "Please input your Latitude!" },
                  ]}
                >
                  <Input readOnly />
                </Form.Item>
              </Col>
            </Row>

            <LocationPicker
              center={center}
              location={position}
              onPosition={onPosition}
            />

            <Form.Item
              style={{ marginTop: 16 }}
              name={["address", "street_address"]}
              label="Street Address"
            >
              <Input />
            </Form.Item>
            <Form.Item name={["address", "city"]} label="City">
              <Input />
            </Form.Item>
            <Form.Item name={["address", "state"]} label="State">
              <Input />
            </Form.Item>
            <Form.Item
              name={["address", "postal_code"]}
              label="Postal Code"
              rules={[{ max: 10 }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name={["address", "country"]} label="Country">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
