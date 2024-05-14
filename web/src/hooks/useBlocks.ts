import { useState } from "react";
import { useAppContext } from "../components/AppProvider";
import { useApi } from "./useApi";
import { notification } from "antd";

export const useBlocks = () => {
  const { localities, getMe } = useAppContext();
  const { getApi, postApi } = useApi();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);

  const loadUsers = (lid) => {
    setLoading(true);
    postApi("/pending", { lid })
      .then((data) => {
        setUsers(data.pending.filter((x) => x.approved == null));
        setMembers(data.members);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onApprove = (rid, approvad) => {
    postApi("/approved", { rid, approvad })
      .then(() => {
        notification.success({ message: "Submited" });
        getMe();
      })
      .catch((e) => {
        notification.error({ message: e.message });
      });
  };

  const fellow = (lid) => {
    return postApi("/subscription", { lid, sub_type: "FOLLOWER" })
      .then(() => {
        notification.success({ message: "Fellowed" });
        getMe();
      })
      .catch((e) => {
        notification.error({ message: e.message });
      });
  };

  const join = (lid) => {
    return postApi("/join", { lid })
      .then(() => {
        notification.success({ message: "Joined" });
        getMe();
      })
      .catch((e) => {
        notification.error({ message: e.message });
      });
  };

  return {
    loading,
    fellow,
    join,members,

    loadUsers,
    users,
    onApprove,
  };
};
