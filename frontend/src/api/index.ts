import axiosClient from "@/axios";
import { signUpSchema } from "@/types/types";
import { toast } from "sonner";

type AddNewItemParams = {
  endpoint: string;
  inputValue: string;
};

export const fetchData = async (endpoint: string) => {
  try {
    const response = await axiosClient.get(endpoint);
    return response.data.data;
  } catch (error) {
    // console.error("Error fetching data:", error);
    toast("Event has been created.");
    throw new Error("Error fetching data");
  }
};

export const postData = async (endpoint: string, data: object) => {
  const response = await axiosClient.post(endpoint, data);

  const result = signUpSchema.safeParse(data);

  console.log("response", response);
  console.log("result", result);

  let zodErrors = {};
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });

    return { errors: zodErrors };
  }

  return response.data;
};

export const fetchPost = async (endpoint: string, page: number) => {
  const response = await axiosClient.get(endpoint);
  return response.data.data.slice((page - 1) * 2, page * 2);
};

export const addNewItem = async ({
  endpoint,
  inputValue,
}: AddNewItemParams) => {
  const response = await axiosClient.post(endpoint, {
    name: inputValue,
  });
  return response.data.data;
};

type HandleSuccessParams = {
  queryClient: any;
  endpoint: string;
  newItem: any;
};

export const handleSuccess = ({
  queryClient,
  endpoint,
  newItem,
}: HandleSuccessParams) => {
  queryClient.setQueryData([endpoint], (prevData) => [...prevData, newItem]);
};
