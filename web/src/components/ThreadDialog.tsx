import { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { useAuth } from "../hooks/useAuth";
import { useAppContext } from "./AppProvider";

export const ThreadDialog = () => {
  const { loginVisible, setLoginVisible } = useAppContext();
  const { login } = useAuth();
  const [username, setUsername] = useState("kminchelle");
  const [password, setPassword] = useState("0lelplR");
  const [loading, setLoading] = useState(false); //  w state for loading

  const [form] = Form.useForm(); // Create a reference to the form instance

  const handleOk = () => {
    setLoading(true); // Start loading
    return form.validateFields().then(() => {
      return login(username, password)
        .then(() => {
          setLoginVisible(false);
        })
        .catch((err) => {
          console.log(err);
          message.error(
            "Login failed. Please check your username and password."
          ); // Show error message
        })
        .finally(() => {
          setLoading(false); // Stop loading
        });
    });
  };

  const handleCancel = () => {
    setLoginVisible(false);
  };

  return (
    <Modal
      title="Login"
      open={loginVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      <Form
        form={form}
        initialValues={{
          username,
          password,
        }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
