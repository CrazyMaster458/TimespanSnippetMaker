import axios from "axios";
import { useEffect, useRef, useState } from "react";

const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const model = "whisper-1";

export default function Test() {
  const inputRef = useRef();
  const [file, setFile] = useState();
  const [response, setResponse] = useState(null);

  const onChangeFile = () => {
    setFile(inputRef.current.files[0]);
  };

  useEffect(() => {
    const fetchAudioFile = async () => {
        if(!file){
            return;
        }

        const formData = new FormData();
        formData.append("model", model);
        formData.append("file", file);

        axios
        .post("https://api.openai.com/v1/audio/transcriptions", formData, {
            headers: {
                "Content-Type" : "multipart/form-data",
                Authorization: `Bearer ${VITE_OPENAI_API_KEY}`,
            },
        })
        .then((res) => {
            console.log(res.data);
            setResponse(res.data);
        })
        .catch((err) => {
            console.log(err);
        })
    };
    fetchAudioFile();
  }, [file])

  return (
    <>
        <input type="file" ref={inputRef} accept=".mp3" onChange={onChangeFile} />
        {response && <div>{JSON.stringify(response, null,2)}</div>}
    </>
  );
}
