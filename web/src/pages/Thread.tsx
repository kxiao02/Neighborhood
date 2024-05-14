import {
  Card,
  Button,
  Form,
  Typography,
  Empty,
  Flex,
  Input,
  Space,
  Avatar,
} from "antd";
import { useEffect } from "react";
import { useThread } from "../hooks/useThread";
import { fmtTime } from "../utils";
import { MessageDialog } from "../components/MessageDialog";
import { Link } from "react-router-dom";
import { useAppContext } from "../components/AppProvider";
const { Title, Paragraph } = Typography;

export function Thread({}) {
  const {
    refresh,
    thread,
    messages,
    showReply,
    replyText,
    setReplyText,
    showReplyDlg,
    sendReply,
    setShowReply,
    sendMessage,
    messageBody,
    setMessageBody,
    sendingMessage,
  } = useThread();

  const { user } = useAppContext();

  useEffect(() => {
    refresh();
  }, []);

  return (
    <>
      <Card style={{ marginTop: 16 }}>
        <Title level={3}>{thread.title}</Title>
        <Paragraph>{thread.body}</Paragraph>
        <div>{thread.post_time}</div>
      </Card>

      {messages.length == 0 && (
        <Empty
          style={{ marginTop: 80, marginBottom: 80 }}
          description="No Message Available"
        ></Empty>
      )}

      {messages.map((message) => (
        <Card key={message.mid} style={{ marginTop: 16 }} title={message.title}>
          <Paragraph>{message.body}</Paragraph>
          <Flex align="center" justify="space-between">
            <Space size="large">
              <Link
                to={
                  message.uid == user.id ? `/profile` : `/user/${message.uid}`
                }
              >
                <Avatar icon="U" size="small" /> {message.email}
              </Link>
              {fmtTime(message.post_time)}
            </Space>
            <Button onClick={() => showReplyDlg(message.mid)}>Reply</Button>
          </Flex>
        </Card>
      ))}

      <MessageDialog
        open={showReply}
        setOpen={setShowReply}
        replyText={replyText}
        setReplyText={setReplyText}
        sendReply={sendReply}
      />
      <Card style={{ marginTop: 16 }} title="Reply your message">
        <Form>
          <Form.Item>
            <Input.TextArea
              style={{ width: "100%" }}
              placeholder="Reply"
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={sendingMessage}
              onClick={sendMessage}
              disabled={!!!messageBody.trim()}
            >
              Send
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
