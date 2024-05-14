import { Card, Button, List } from "antd";
import { fmtTime } from "../utils";
import { useFriends } from "../hooks/useFriends";
import { useAppContext } from "../components/AppProvider";
import { useEffect } from "react";
import { useNeighbors } from "../hooks/useNeighbors";

export function NeighborsPage() {
  const { user } = useAppContext();
  const {
    loadUsers,
    users,
    loading,
    neighbors,
    loadNeighbors,
    requestNeighbor,
  } = useNeighbors();

  useEffect(() => {
    loadNeighbors();
    loadUsers();
  }, []);

  const alreadyNeighbors = neighbors.map((f) => {
    if (f.sender_uid == user?.id) {
      return { ...f, email: f.recipient_email };
    } else {
      return { ...f, email: f.sender_email };
    }
  });

  const others = users.filter(
    (u) =>
      u.uid != user?.id &&
      !alreadyNeighbors.find(
        (f) => f.sender_uid == u.uid || f.recipient_uid == u.uid
      )
  );

  return (
    <>
      <Card title="My Neighbors" style={{ marginTop: 16 }}>
        <List
          itemLayout="horizontal"
          dataSource={alreadyNeighbors}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.email}
                description={fmtTime(item.established_time)}
              ></List.Item.Meta>
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
                <Button onClick={() => requestNeighbor(item.uid)}>
                  Require as Neighbor
                </Button>
              </div>
            </List.Item>
          )}
        ></List>
      </Card>
    </>
  );
}
