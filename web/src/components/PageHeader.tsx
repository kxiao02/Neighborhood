import { Avatar, Button, Flex, Space, Dropdown, MenuProps } from "antd";
import { useAppContext } from "./AppProvider";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export const PageHeader = () => {
  const { setLoginVisible, loggedIn, user } = useAppContext();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "profile") {
      navigate("/profile");
    } else if (key === "logout") {
      logout();
      navigate("/login");
    }
  };

  const items: MenuProps["items"] = [
    {
      label: "Profile",
      key: "profile",
      icon: <UserOutlined />,
    },
    {
      label: "Logout",
      key: "logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Flex justify="space-between" style={{ width: "100%" }}>
      <Link to="/" style={{ display: "flex", alignItems: "center" }}>
        <img src={"/vite.svg"} alt="logo" style={{ width: "40px" }} />
        <div
          className="online-shop"
          style={{ fontSize: 18, color: "black", marginLeft: 12 }}
        >
          Neighborhood Interact
        </div>
      </Link>

      <Space size="large">
        <Link to="/">Home</Link>
        <Link to="/blocks">Blocks</Link>
        <Link to="/friends">Friends</Link>
        <Link to="/neighbors">Neighbors</Link>
      </Space>

      {loggedIn ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Dropdown menu={{ items, onClick }}>
            <a
              onClick={(e) => e.preventDefault()}
              style={{ display: "block", marginLeft: 32 }}
            >
              <Space style={{ height: 28 }}>
                <Avatar icon={<UserOutlined />}></Avatar>
                <label>{user?.email}</label>
              </Space>
            </a>
          </Dropdown>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button type="primary" onClick={() => setLoginVisible(true)}>
            Login
          </Button>
        </div>
      )}
    </Flex>
  );
};
