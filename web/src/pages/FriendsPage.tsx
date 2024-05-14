import { Card, Button, List } from "antd";
import { fmtTime } from "../utils";
import { useFriends } from "../hooks/useFriends";
import { useAppContext } from "../components/AppProvider";
import { useEffect } from "react";

export function FriendsPage() {
  const { user } = useAppContext();
  const {
    loadFriends,
    friends,
    loadUsers,
    users,
    loading,
    rejectFriend,
    requestFriend,
    approveFriend,
  } = useFriends();

  useEffect(() => {
    loadFriends();
    loadUsers();
  }, []);

  const alreadyFriends = friends
    .filter((f) => f.visibility_status)
    .map((f) => {
      if (f.sender_uid == user?.id) {
        return { ...f, email: f.recipient_email };
      } else {
        return { ...f, email: f.sender_email };
      }
    });

  const pendingFriends = friends
    .filter((f) => f.visibility_status == false && f.recipient_uid == user?.id)
    .map((f) => {
      return { ...f, email: f.sender_email };
    });

  const requestFriends = friends
    .filter((f) => f.visibility_status == false && f.sender_uid == user?.id)
    .map((f) => f.recipient_uid);

  const others = users.filter(
    (u) =>
      u.uid != user?.id &&
      !alreadyFriends.find(
        (f) => f.sender_uid == u.uid || f.recipient_uid == u.uid
      ) &&
      !pendingFriends.find((f) => f.sender_uid == u.uid)
  );

  return (
    <>
      <Card title="My Friends" style={{ marginTop: 16 }}>
        <List
          itemLayout="horizontal"
          dataSource={alreadyFriends}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.email}
                description={fmtTime(item.request_time)}
              ></List.Item.Meta>
            </List.Item>
          )}
        ></List>
      </Card>

      <Card title="Request as My Friends" style={{ marginTop: 16 }}>
        <List
          itemLayout="horizontal"
          dataSource={pendingFriends}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.email}
                description={fmtTime(item.request_time)}
              ></List.Item.Meta>
              <div>
                <Button onClick={() => rejectFriend(item.sender_uid)}>
                  Reject
                </Button>
                <Button onClick={() => approveFriend(item.sender_uid)}>
                  Approve
                </Button>
              </div>
            </List.Item>
          )}
        ></List>
      </Card>
      <Card title="Others" style={{ marginTop: 16 }}>
        <List
          itemLayout="horizontal"
          dataSource={others}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta title={item.email}></List.Item.Meta>
              <div>
                {requestFriends.includes(item.uid) ? (
                  <Button disabled>Requested</Button>
                ) : (
                  <Button onClick={() => requestFriend(item.uid)}>
                    Require as Friend
                  </Button>
                )}
              </div>
            </List.Item>
          )}
        ></List>
      </Card>
    </>
  );
}
