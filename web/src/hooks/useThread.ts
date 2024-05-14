import { useState } from "react";
import { useApi } from "./useApi";
import { useParams } from "react-router-dom";

export const useThread = () => {
  const { postApi, getApi } = useApi();
  const { id } = useParams();

  const [thread, setThread] = useState({});
  const [messages, setMessages] = useState([]);

  const [showReply, setShowReply] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [messageBody, setMessageBody] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const refresh = () => {
    return getApi(`/thread/${id}`).then((data) => {
      setThread(data.thread);
      setMessages(data.messages);
    });
  };

  const showReplyDlg = (mid: any) => {
    setReplyTo(mid);
    setReplyText("");
    setShowReply(true);
  };

  const sendReply = () => {
    return postApi(`/message`, {
      body: replyText,
      reply_to_mid: replyTo,
      tid: id,
    }).then((data) => {
      refresh();
      setShowReply(false);
    });
  };

  const sendMessage = () => {
    if (!messageBody.trim()) return;
    setSendingMessage(true);
    return postApi(`/message`, {
      body: messageBody,
      reply_to_mid: null,
      tid: id,
    })
      .then((data) => {
        refresh();
        setMessageBody("");
      })
      .finally(() => {
        setSendingMessage(false);
      });
  };

  return {
    thread,
    messages,
    showReply,
    replyText,
    setReplyText,
    refresh,
    showReplyDlg,
    setShowReply,
    sendReply,
    sendMessage,
    messageBody,
    setMessageBody,
    sendingMessage,
  };
};
