import { useState } from "react";
import { useAppContext } from "../components/AppProvider";
import { useApi } from "./useApi";
import { notification } from "antd";

export const useNeighbors = () => {
  const {} = useAppContext();
  const { getApi, postApi } = useApi();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [neighbors, setNeighbors] = useState([]);

  const loadUsers = () => {
    setLoading(true);
    return getApi("/users")
      .then((data) => {
        setUsers(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadNeighbors = () => {
    setLoading(true);
    return getApi("/neighbors")
      .then((data) => {
        setNeighbors(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const requestNeighbor = (neighborId) => {
    return postApi("/neighbors", { neighborId })
      .then(() => {
        loadNeighbors();
      })
      .catch((e) => {
        notification.error({ message: e.message });
      });
  };

  return {
    loadNeighbors,
    neighbors,
    loadUsers,
    users,
    loading,
    requestNeighbor,
  };
};
