import { useEffect, useState } from "react";
import { Modal, Form, Input, message } from "antd";

export function MessageDialog({
  open,
  setOpen,
  replyText,
  setReplyText,
  sendReply,
}) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleOk = () => {
    setLoading(true);
    return form.validateFields().then(() => {
      return sendReply()
        .then(() => {
          setOpen(false);
        })
        .catch((err) => {
          console.log(err);
          message.error("Reply failed. Please check your message.");
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    form.setFieldsValue({ replyText: "" });
  }, [open]);

  return (
    <Modal
      title="Reply to Message"
      open={open}
      onOk={handleOk}
      onCancel={() => setOpen(false)}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          replyText,
        }}
      >
        <Form.Item
          label="Reply message"
          name="replyText"
          rules={[
            { required: true, message: "Please input your reply message!" },
          ]}
        >
          <Input.TextArea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
