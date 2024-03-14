import axiosClient from "@/axios";
import { useEffect, useState } from "react";

export function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        axiosClient
          .get(url)
          .then(({data}) => {
            setData(data);
            setIsPending(false);
          })
          .catch((error) => {
            setError(error);
            setIsPending(false);
          });
        // const fetchData = async () => {
        //     try {
        //         const { data } = await axiosClient.get(url);
        //         // console.log(data);
        //         setData(data);
        //     } catch (err) {
        //         setError(err.message);
        //     } finally {
        //         setIsPending(false);
        //     }
        // };
        // fetchData();
    }, [url]);

    return {data, isPending, error};
}

