import { useEffect, useState } from "react";
import axiosClient from "../../axios.tsx";

export default function UploadImg() {
    const [imageData, setImageData] = useState('');
    const [videoURL, setVideoURL] = useState({
        videoUrl: ""
    });

    useEffect(() => {
        axiosClient
        .get("/img")
        .then(({ data }) => {
        //   console.log(data);
          setVideoURL(data);
        //   console.log(data);
          return data;
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
    }, [])

    const handleChange = (e) => {
        setImageData(e.target.files[0]);
    }

    const submitData = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const fData = new FormData();

        // fData.append('image', imageData);
        fData.append('video', imageData);


        console.log([...fData]);

        axiosClient
            .post("/upload", fData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(({ data }) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }


    return <>
        <form className="pt-16">
            {/* <label htmlFor="image">Upload Image</label>
            <input name="image" id="image" type="file" onChange={handleChange}/>
            <button type="submit" onClick={submitData}>Upload Image</button> */}
            <label htmlFor="video">Upload Image</label>
            <input name="video" id="video" type="file" onChange={handleChange}/>
            <button type="submit" onClick={submitData}>Upload Image</button>
        </form>

        {/* {videoURL ? <video src={videoURL.videoUrl}></video> : <p>Loading</p>} */}

        
    </>
}
