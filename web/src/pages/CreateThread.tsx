import { useState } from "react";
import { Button, Form, Input, Radio, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useCreateThread } from "../hooks/useCreateThread";
import { useAppContext } from "../components/AppProvider";

export const CreateThreadPage = () => {
  const navigate = useNavigate();
  const { localities } = useAppContext();
  const { data, setData, loading, createThread } = useCreateThread();
  const [feedType, setFeedType] = useState("NEIGHBOR");

  const [form] = Form.useForm();

  const handleOk = () => {
    return form.validateFields().then((values) => {
      createThread(values)
        .then(() => {
          message.success("Post success.");
          navigate("/");
        })
        .catch((err) => {
          message.error(err.message || "Submit failed.");
        });
    });
  };

  return (
    <div
      style={{
        width: "60%",
        margin: "0 auto",
      }}
    >
      <Form form={form} layout="vertical" initialValues={data}>
        <h1 style={{ textAlign: "center" }}>Post New Message</h1>

        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Please input your title!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Message"
          name="body"
          rules={[{ required: true, message: "Please input your message!" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="feed_type"
          label="Type"
          rules={[{ required: true, message: "Please select your feed type!" }]}
        >
          <Radio.Group
            onChange={(e) => {
              setFeedType(e.target.value);
              form.setFieldsValue({ target_lid: undefined });
            }}
          >
            <Radio value="FRIEND">Friend</Radio>
            <Radio value="NEIGHBOR">Neighbor</Radio>
            <Radio value="BLOCK">Block</Radio>
            <Radio value="HOOD">Hood</Radio>
          </Radio.Group>
        </Form.Item>

        {["BLOCK", "HOOD"].includes(feedType) && (
          <Form.Item
            name="target_lid"
            label="Locality"
            rules={[
              { required: true, message: "Please select your locality!" },
            ]}
          >
            <Radio.Group>
              {localities
                .filter((x) => x.ltype == feedType)
                .map((locality) => (
                  <Radio key={locality.lid} value={locality.lid}>
                    {locality.name}
                  </Radio>
                ))}
            </Radio.Group>
          </Form.Item>
        )}

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            onClick={handleOk}
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
