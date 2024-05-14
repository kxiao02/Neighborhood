import { useState } from "react";
import { useAppContext } from "../components/AppProvider";
import { useApi } from "./useApi";

export const useCreateThread = () => {
  const { setUser, setLoggedIn } = useAppContext();
  const { postApi } = useApi();

  const [data, setData] = useState({
    title: "",
    body: "",
    feed_type: "NEIGHBOR",
    target_lid: null,
  });
  const [loading, setLoading] = useState(false);

  const createThread = (data) => {
    setLoading(true);
    return postApi("/thread", data)
      .finally(() => {
        setLoading(false);
      });
  };
  return { data, setData, loading, setLoading, createThread };
};
