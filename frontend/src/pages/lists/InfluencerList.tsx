import axiosClient from "@/api/axios";
import { useState, useEffect } from "react";

export default function InfluencertList() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/influencer`)
      .then(({ data }) => {
        console.log(data.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  return <div></div>;
}
