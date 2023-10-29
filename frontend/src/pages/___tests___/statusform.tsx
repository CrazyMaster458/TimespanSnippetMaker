import { useState } from "react";
import axiosClient from "../../axios.tsx";
// import { useStateContext } from "@/contexts/ContextProvider.tsx";

export default function StatusForm() {
  //   const { userToken, currentUser } = useStateContext();
  const [name, setName] = useState("");
  const [error, setError] = useState({ __html: "" });

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError({ __html: "" });
    type ErrorArray = string[];

    axiosClient
      .post("/status", {
        video_id: 1,
      })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => {
        if (error.response) {
          const finalErrors = (
            Object.values(error.response.data.errors) as ErrorArray
          ).reduce<string[]>((accum, next) => [...accum, ...next], []);
          setError({ __html: finalErrors.join("<br />") });
        }
        console.log(error);
      });
  };

  return (
    <>
      <h1>Signup</h1>

      {error.__html && (
        <div
          className="bg-red-500 rounded py-2 px-3 text-white"
          dangerouslySetInnerHTML={error}
        ></div>
      )}

      <form onSubmit={onSubmit} className="pt-16">
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Sign up</button>
      </form>
    </>
  );
}
