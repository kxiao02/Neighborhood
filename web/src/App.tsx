import { Layout } from "antd";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { PageHeader } from "./components/PageHeader";
import "./App.css";
import { LoginPage } from "./pages/Login";
import { useAppContext } from "./components/AppProvider";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Thread } from "./pages/Thread";
import { SearchPage } from "./pages/SearchPage";
import { CreateThreadPage } from "./pages/CreateThread";
import { FriendsPage } from "./pages/FriendsPage";
import { NeighborsPage } from "./pages/NeighborsPage";
import { BlocksPage } from "./pages/BlocksPage";
import { UserPage } from "./pages/UserPage";
const { Header, Content, Footer } = Layout;

function App() {
  const { loggedIn } = useAppContext();
  return (
    <Layout>
      {loggedIn && (
        <Header
          className="content"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            background: "white",
          }}
        >
          <PageHeader />
        </Header>
      )}
      <Content className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/thread/:id" element={<Thread />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/create" element={<CreateThreadPage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/neighbors" element={<NeighborsPage />} />
          <Route path="/blocks" element={<BlocksPage />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Neighborhood Interact ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

export default App;
