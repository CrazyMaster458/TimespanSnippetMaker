// src/components/AudioInput.js
import { useState } from "react";
import axiosClient from "../api/axios.tsx";

const Whisper = () => {
  const [audioFile, setAudioFile] = useState(null);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleTranscribe = () => {
    if (audioFile) {
      const formData = new FormData();
      formData.append("file", audioFile);

      axiosClient
        .get("/transcribe")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Please select an audio file.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleTranscribe}>Transcribe</button>
    </div>
  );
};

export default Whisper;
