const host = "http://localhost:3000";

export const useApi = () => {

  const getApi = (path: string) => {
    const token = localStorage.getItem("token");
    return fetch(`${host}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
    });
  };

  const postApi = (path: string, data: any) => {
    const token = localStorage.getItem("token");
    return fetch(`${host}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        console.log("res", data);
        throw new Error(data.message);
      }
    });
  };

  return { getApi, postApi };
};
