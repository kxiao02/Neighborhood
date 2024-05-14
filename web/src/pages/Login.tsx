import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); //  w state for loading

  const [form] = Form.useForm(); // Create a reference to the form instance

  const handleOk = () => {
    return form.validateFields().then(() => {
      setLoading(true);
      return login(email, password)
        .then((user) => {
          console.log(user);
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          message.error("Login failed. Please check your email and password."); // Show error message
        })
        .finally(() => {
          setLoading(false);
        });
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
      <Form
        form={form}
        initialValues={{
          email,
          password,
        }}
      >
        <h1 style={{ textAlign: "center" }}>Login</h1>

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
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
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

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            onClick={handleOk}
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>
        <div style={{ textAlign: "center" }}>
          <span>Don't have an account? </span>
          <Link to="/register">Register </Link> here.
        </div>
      </Form>
    </div>
  );
};
