import {
  Card,
  Button,
  Form,
  AutoComplete,
  List,
  Radio,
  InputNumber,
  Flex,
} from "antd";
import { Link } from "react-router-dom";
import { fmtTime } from "../utils";
import { useSearch } from "../hooks/useSearch";
import { useEffect } from "react";

export function SearchPage() {
  const {
    loading,
    searchType,
    setSearchType,
    keyword,
    setKeyword,
    feet,
    setFeet,
    searchResults,
    search,
    location,
    setLocation,
  } = useSearch();

  const [form] = Form.useForm();

  const handleOk = () => {
    return form.validateFields().then((values) => {
      search();
    });
  };

  useEffect(() => {
    form.setFieldsValue({ location });
  }, [location]);

  return (
    <>
      <Card style={{ marginTop: 16, marginBottom: 16 }}>
        <Form
          form={form}
          initialValues={{
            location,
            feet: 200,
          }}
          layout="inline"
          style={{ justifyContent: "center" }}
        >
          <Form.Item>
            <Radio.Group
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <Radio value="keyword">Keyword</Radio>
              <Radio value="feet">Feet</Radio>
            </Radio.Group>
          </Form.Item>
          {searchType == "keyword" && (
            <Form.Item
              name="keyword"
              rules={[{ required: true, message: "Please input keyword!" }]}
            >
              <AutoComplete
                options={[]}
                style={{ width: 200 }}
                placeholder="input search text"
                value={keyword}
                onChange={(value) => setKeyword(value)}
              />
            </Form.Item>
          )}
          {searchType == "feet" && (
            <Flex align="center" gap={8}>
              <label>Location:</label>
              <Form.Item
                name={["location", "lat"]}
                rules={[{ required: true, message: "Please input latitude!" }]}
              >
                <InputNumber
                  style={{ width: 200 }}
                  placeholder="input latitude"
                  value={location?.lat}
                  onChange={(v) => setLocation({ ...location, lat: v })}
                />
              </Form.Item>
              <Form.Item
                name={["location", "lng"]}
                rules={[{ required: true, message: "Please input longitude!" }]}
              >
                <InputNumber
                  style={{ width: 200 }}
                  placeholder="input longitude"
                  value={location?.lng}
                  onChange={(v) => setLocation({ ...location, lng: v })}
                />
              </Form.Item>
              <Form.Item
                name="feet"
                rules={[{ required: true, message: "Please input feet!" }]}
              >
                <InputNumber
                  style={{ width: 200 }}
                  placeholder="input feet"
                  value={feet}
                  onChange={setFeet}
                />
              </Form.Item>
            </Flex>
          )}
          <Form.Item>
            <Button type="primary" onClick={handleOk} loading={loading}>
              Search
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <List
        bordered
        style={{ backgroundColor: "white" }}
        itemLayout="horizontal"
        dataSource={searchResults}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<Link to={`/thread/${item.tid}`}>{item.title}</Link>}
              description={item.body}
            ></List.Item.Meta>
            <div>{fmtTime(item.post_time)}</div>
          </List.Item>
        )}
      ></List>
    </>
  );
}
