import axiosClient from "@/axios";
import { useState, useEffect } from "react";

export default function TagList() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(`/tag`)
            .then(({data}) => {
            console.log(data.data);
            })
            .catch((error) => {
            setLoading(false);
            console.log(error);
            });
      }, []);

    return (
        <div>

        </div>
    );
}