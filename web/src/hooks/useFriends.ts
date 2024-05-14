import { useState } from "react";
import { useAppContext } from "../components/AppProvider";
import { useApi } from "./useApi";

export const useFriends = () => {
  const {} = useAppContext();
  const { getApi, postApi } = useApi();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);

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

  const loadFriends = () => {
    setLoading(true);
    return getApi("/friends")
      .then((data) => {
        setFriends(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const requestFriend = (friendId) => {
    return postApi("/friends", { friendId }).then(() => {
      loadFriends();
    });
  };

  const approveFriend = (friendId) => {
    return postApi(`/friends/approve`, { friendId }).then(() => {
      loadFriends();
    });
  };

  const rejectFriend = (friendId) => {
    return postApi(`/friends/reject`, { friendId }).then(() => {
      loadFriends();
    });
  };

  return {
    loadFriends,
    friends,
    loadUsers,
    users,
    loading,
    rejectFriend,
    requestFriend,
    approveFriend,
  };
};
