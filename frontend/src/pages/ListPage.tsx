import { VideoCard } from "@/components/VideoCard";
import { useEffect, useState } from "react";
import axiosClient from "@/axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { SelectComponent } from "@/components/SingleSelect.tsx";
import * as api from "../components/api.tsx";
import { List } from 'lucide-react';
import { Image } from 'lucide-react';
import { LayoutGrid } from 'lucide-react';
import { LayoutList } from 'lucide-react';
import { SelectComponent2 } from "@/components/MultiSelect copy.tsx";




export default function ListPage() {
    const [loading, setLoading] = useState(true);
    const [videoData, setVideoData] = useState(null);
    const [videos, setVideos] = useState<JSX.Element[]>([]);


    const [influencers, setInfluencers] = useState<any[]>([]);
    const [videoTypes, setVideoTypes] = useState<any[]>([]);

    const [videoType, setVideoType] = useState<number | null>(null);

  
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/video`)
        .then(({data}) => {
          console.log(data);
          setVideoData(data);
        })
        .catch((error) => {
          setLoading(false);
          console.log("error");
        });
    }, []);

    useEffect(() => {
        api.fetchVideoParameters()
          .then((res) => {
            setInfluencers(res.influencers || []);
            setVideoTypes(res.videoTypes || []);
          })
          .catch((error) => {
            console.error("Error fetching video parameters:", error);
          });
      }, []);
  
    const navigate = useNavigate();

    
    const handleVideoSelect = (value: any) => {
        setVideoType(value.length > 0 ? value[0] : null);
    };
  
    const HandleRedirect = () => {
      navigate(`/cardform`);
    };
  
    useEffect(() => {
      // This useEffect will run whenever snippetData is updated
      if (videoData) {
        // Update snippetData state
        setVideoData(videoData);
  
        // Map over the new snippetData and update the snippets state
        setVideos(videoData.map((video) => (
          <VideoCard key={video.id} videoData={video} videoId={video.id}/>
        )));
      }
    }, [videoData]);

    const [filteredVideos, setFilteredVideos] = useState<JSX.Element[]>([]);

    useEffect(() => {
      if (videoData) {
        setFilteredVideos(
          videoData.map((video) => <VideoCard key={video.id} videoData={video} videoId={video.id} />)
        );
      }
    }, [videoData]);
  
    // Callback function to handle search term changes
    const handleSearch = (searchTerm: string) => {
      // If the search term is empty, show all videos
      if (searchTerm.trim() === "") {
        setFilteredVideos(
          videoData.map((video) => <VideoCard key={video.id} videoData={video} videoId={video.id} />)
        );
      } else {
        // Otherwise, filter videos based on the search term
        const filtered = videoData.filter((video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
  
        setFilteredVideos(
          filtered.map((video) => <VideoCard key={video.id} videoData={video} videoId={video.id} />)
        );
      }
    };


    // const handleSearch = (searchTerm: string) => {
    //   const filtered = videoData.filter((video) =>
    //     video.title.toLowerCase().includes(searchTerm.toLowerCase())
    //   );
  
    //   setFilteredVideos(
    //     filtered.map((video) => <VideoCard key={video.id} videoData={video} videoId={video.id} />)
    //   );
    // };

  return (
      <div>
        <div className="flex flex-row justify-between pb-8 content-center items-center place-content-center place-items-center">
            <div>
                <SelectComponent2 data={videoTypes} onSelect={handleVideoSelect} multi={false} />
            </div>
            <div><SearchBar onSearch={handleSearch}/></div>
            {/* <div className="flex flex-row gap-3">
                <button><Image /></button>
                <button><LayoutList /></button>
                <button><LayoutGrid /></button>
            </div> */}
        </div>

        <div className="grid grid-cols-4 gap-4">
            {/* {videos.length > 0 ? videos : <p>Loading...</p>} */}
            {filteredVideos.length > 0 ? filteredVideos : <p>Loading...</p>}
        </div>
        <Button className="mt-5" onClick={HandleRedirect}>Create Video</Button>
        </div>
      );
}
