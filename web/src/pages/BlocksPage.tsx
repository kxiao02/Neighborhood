import {
  Card,
  Button,
  List,
  Tag,
  Flex,
  Avatar,
  Popover,
  Descriptions,
} from "antd";
import { useAppContext } from "../components/AppProvider";
import { useEffect, useState } from "react";
import { useBlocks } from "../hooks/useBlocks";
import { UserOutlined } from "@ant-design/icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Rectangle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const blackOptions = { color: "black" };

export const BlocksPage = () => {
  const { localities } = useAppContext();
  const [hoods, setHoods] = useState([]);
  const [center, setCenter] = useState([45.65, -123.4]);

  const { join, fellow, loadUsers, users, onApprove, members } = useBlocks();

  useEffect(() => {
    const items = localities.filter((l) => l.ltype == "HOOD");
    setHoods(items);

    const blocks = localities.filter(
      (l) => l.ltype == "BLOCK" && l.sub_type == "MEMBER"
    );
    if (blocks.length > 0) {
      loadUsers(blocks[0].lid);
    }
  }, [localities]);

  return (
    <>
      <div style={{ width: "100%", height: 400, overflow: "hidden" }}>
        <MapContainer
          style={{
            height: "calc(100vh - 40em)",
            minHeight: "400px",
            width: "100%",
            minWidth: "200px",
            boxSizing: "border-box",
          }}
          center={center}
          attributionControl={false}
          zoomControl={false}
          zoom={13}
          key={center.toString()}
        >
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png" />

          {members.map((thread) => (
            <Marker
              key={thread.uid}
              position={[thread.latitude, thread.longitude]}
            >
              <Popup>{thread.email}</Popup>
            </Marker>
          ))}

          {/* {hoods.map((hood) => (
            <Rectangle
              key={hood.lid}
              bounds={[
                [hood.northeast_lat, hood.northeast_long],
                [hood.southwest_lat, hood.southwest_long],
              ]}
              pathOptions={blackOptions}
            />
          ))} */}
          {localities.map((hood) => (
            <Rectangle
              key={hood.lid}
              bounds={[
                [hood.northeast_lat, hood.northeast_long],
                [hood.southwest_lat, hood.southwest_long],
              ]}
              pathOptions={blackOptions}
            />
          ))}
        </MapContainer>
      </div>

      {hoods.map((hood) => (
        <Card style={{ marginTop: 16 }} key={hood.lid + "x"} title={hood.name}>
          <div>{hood.description}</div>
          <List
            itemLayout="horizontal"
            dataSource={localities.filter((x) => x.hood_id == hood.lid)}
            renderItem={(item) => (
              <List.Item
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setCenter([item.northeast_lat, item.northeast_long])
                }
              >
                <List.Item.Meta
                  title={<div>{item.name}</div>}
                  description={item.description}
                ></List.Item.Meta>
                <Flex vertical gap={16}>
                  <div>
                    {!item.sub_type && (
                      <Button onClick={() => fellow(item.lid)}>Fellow</Button>
                    )}
                    {item.decision_status ? (
                      <Tag color="processing">{item.decision_status}</Tag>
                    ) : (
                      <Button onClick={() => join(item.lid)}>Join</Button>
                    )}

                    {item.sub_type && <Tag>{item.sub_type}</Tag>}
                  </div>
                  {item.decision_status == "APPROVED" && users.length > 0 && (
                    <div>
                      <div>pending members:</div>
                      <Flex>
                        {users.map((u) => (
                          <Flex key={u.uid} align="center" gap={12}>
                            {u.email}
                            <Button
                              size="small"
                              onClick={() => onApprove(u.rid, true)}
                            >
                              Approved
                            </Button>
                            <Button
                              danger
                              size="small"
                              onClick={() => onApprove(u.rid, false)}
                            >
                              Reject
                            </Button>
                          </Flex>
                        ))}
                      </Flex>
                    </div>
                  )}
                  {item.sub_type == "MEMBER" && members.length > 0 && (
                    <div>
                      <div>new members:</div>
                      <Flex gap={8}>
                        {members.map((u) => (
                          <Popover
                            key={u.uid}
                            title={u.email}
                            content={
                              <Descriptions style={{ width: 400 }} column={2}>
                                <Descriptions.Item label="First name">
                                  {u.first_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="Last name">
                                  {u.last_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="Username">
                                  {u.user_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="Gender">
                                  {u.gender}
                                </Descriptions.Item>
                                <Descriptions.Item label="Description">
                                  {u.description}
                                </Descriptions.Item>
                              </Descriptions>
                            }
                          >
                            <Avatar icon={<UserOutlined />}></Avatar>
                          </Popover>
                        ))}
                      </Flex>
                    </div>
                  )}
                </Flex>
              </List.Item>
            )}
          ></List>
        </Card>
      ))}
    </>
  );
};
