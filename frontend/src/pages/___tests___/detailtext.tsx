import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";
import { useParams } from "react-router-dom";
// import { useStateContext } from "@/contexts/ContextProvider.tsx";

export default function DetailForm() {
  //   const { userToken, currentUser } = useStateContext();
  const [inData, setInData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    axiosClient
      .get(`/influencer/${id}`)
      .then(({ data }) => {
        console.log(data.data);
        setInData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, setInData]);

  return (
    <>
      <h1 className="pt-16">Signup</h1>

      {inData.id}
    </>
  );
}
