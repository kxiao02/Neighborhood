import { useEffect, useState } from "react";
import { useAppContext } from "../components/AppProvider";
import { useApi } from "./useApi";

export const useHome = () => {
  const {} = useAppContext();
  const { postApi } = useApi();

  const [feedType, setFeedType] = useState("HOOD");
  const [newMsg, setNewMsg] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = () => {
    setLoading(true);
    return postApi("/threads", { type: feedType, newMsg })
      .then((data) => {
        setThreads(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    search();
  }, [feedType, newMsg]);

  return {
    feedType,
    setFeedType,
    newMsg,
    setNewMsg,
    threads,
    loading,
  };
};
