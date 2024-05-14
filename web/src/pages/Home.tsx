import {
  Card,
  Button,
  Tag,
  Flex,
  Input,
  List,
  Row,
  Col,
  Divider,
  Radio,
  Checkbox,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { fmtTime } from "../utils";
import { useHome } from "../hooks/useHome";

export function Home({}) {
  const navigate = useNavigate();
  const { feedType, setFeedType, newMsg, setNewMsg, threads, loading } =
    useHome();

  return (
    <Row gutter={24} style={{ marginTop: 32 }}>
      <Col span={18}>
        <Flex align="center" justify="space-between">
          <Radio.Group
            size="large"
            value={feedType}
            onChange={(e) => setFeedType(e.target.value)}
          >
            <Radio.Button value="HOOD">Hood</Radio.Button>
            <Radio.Button value="BLOCK">Block</Radio.Button>
            <Radio.Button value="FRIEND">Friend</Radio.Button>
            <Radio.Button value="NEIGHBOR">Neighbor</Radio.Button>
          </Radio.Group>

          <Checkbox checked={newMsg} onChange={(e) => setNewMsg(e.target.checked)}>
            Just New Messages
          </Checkbox>
        </Flex>

        <List
          loading={loading}
          bordered
          style={{ backgroundColor: "white", marginTop: 16 }}
          itemLayout="horizontal"
          dataSource={threads}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Link to={`/thread/${item.tid}`}>{item.title}</Link>}
                // description={fmtTime(item.start_time)}
              ></List.Item.Meta>
              <Tag>{fmtTime(item.start_time)}</Tag>
            </List.Item>
          )}
        ></List>
      </Col>
      <Col span={6}>
        <Button
          type="primary"
          block
          onClick={() => navigate("/create")}
          size="large"
        >
          Post New Message
        </Button>
        <Card style={{ margin: "16px 0" }}>
          <Link to="/blocks">Blocks</Link>
          <Divider />
          <Link to="/neighbors">My Neighbors</Link>
          <Divider />
          <Link to="/friends">My Friends</Link>
        </Card>

        <Input.Search
          size="large"
          style={{ cursor: "pointer" }}
          readOnly
          onSearch={() => navigate("/search")}
          onClick={() => navigate("/search")}
          placeholder="search messages"
        />
      </Col>
    </Row>
  );
}
