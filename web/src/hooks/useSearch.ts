import { useEffect, useState } from "react";
import { useAppContext } from "../components/AppProvider";
import { useApi } from "./useApi";

export const useSearch = () => {
  const { address } = useAppContext();
  const { postApi } = useApi();

  const [searchType, setSearchType] = useState("keyword");
  const [keyword, setKeyword] = useState("");
  const [feet, setFeet] = useState(200);
  const [location, setLocation] = useState({
    lat: address?.latitude,
    lng: address?.longitude,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocation({
      lat: address?.latitude,
      lng: address?.longitude,
    });
  }, [address]);

  const search = () => {
    setLoading(true);
    return postApi("/search", { type: searchType, keyword, feet, location })
      .then((data) => {
        setSearchResults(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    searchType,
    setSearchType,
    keyword,
    setKeyword,
    feet,
    setFeet,
    location,
    setLocation,
    searchResults,
    setSearchResults,
    loading,
    setLoading,
    search,
  };
};
