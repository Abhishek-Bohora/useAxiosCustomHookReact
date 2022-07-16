// useAxios custom hook
import { useState, useEffect } from "react";

const useAxios = (configObj) => {
  const {
    axiosInstance, //this will allow us to use more than one instance of axios
    method,
    url,
    requestConfig = {},
  } = configObj;

  const [response, setResponse] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  const refetch = () => setReload((prev) => prev + 1); //triggering the render again

  useEffect(() => {
    const controller = new AbortController(); //this will let use cancel the request and prevent from memeory leak
    const fetchData = async () => {
      try {
        const res = await axiosInstance[method.toLowerCase()](url, {
          ...requestConfig,
          signal: controller.signal, //attach signal to the request we can cancel if we need
        });
        console.log(res);
        setResponse(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // useEffect cleanup function
    return () => {
      controller.abort();
    };

    // eslint-disable-next-line
  }, [reload]);

  return [response, error, loading, refetch];
};

export default useAxios;
