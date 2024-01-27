import axiosClient, { AxiosProgressEvent } from "@/axios";


export interface VideoParameters {
  influencers: any[];
  videoTypes: any[];
}

export const fetchVideoParameters = async (): Promise<VideoParameters> => {
  try {
    const response = await axiosClient.get("/video_parameters");
    return response.data;
  } catch (error) {
    console.error("Error fetching video parameters:", error);
    throw error;
  }
};

export const createVideo = async (): Promise<number> => {
  try {
    const response = await axiosClient.post("/video");
    return response.data.data.id;
  } catch (error) {
    console.error("Error creating video:", error);
    throw error;
  }
};

export const uploadFile = async (
  url: string,
  file: File,
  type: string,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append(type, file);

    const response = await axiosClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

    return response.data;
  } catch (error) {
    console.error(`Error uploading file to ${url}:`, error);
    throw error;
  }
};

export const updateVideo = async (
    videoId: number,
    data: {
      title: string;
      host_id: number | null;
      guests: string[];
      video_type_id: number | null;
    }
  ): Promise<any> => {
    try {
      const response = await axiosClient.put(`/video/${videoId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating video:", error);
      throw error;
    }
};
  
