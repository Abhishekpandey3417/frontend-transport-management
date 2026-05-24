import { useEffect, useState } from "react";

export default function useTableQuery(apiCall, params) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await apiCall(params);

      console.log("API RESPONSE:", res.data);

      setData(Array.isArray(res.data?.data) ? res.data.data : []);

      setPagination(
        res.data?.pagination || {
          page: 1,
          totalPages: 1,
        }
      );
    } catch (err) {
      console.log("Table Query Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.page, params.search, params.status]);

  return {
    data,
    loading,
    pagination,
    setPagination,
    refetch: fetchData,
  };
}