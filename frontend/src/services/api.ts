// import axios from "@/api/axios";
import axiosClient from "@/services/axios";
import { validateData } from "@/lib/validations";
import { AxiosProgressEvent } from "axios";
import { toast } from "sonner";
import { Schema } from "zod";
import { Option } from "@/lib/types";

// type AddNewItemParams = {
//   endpoint: string;
//   inputValue: string;
// };

type AddNewItemParams = {
  endpoint: string;
  data: object;
  schema: Schema;
};

export const getData = async (endpoint: string) => {
  // return (await axiosClient.get(endpoint)).data.data;

  const response = await axiosClient.get(endpoint);

  console.log("response", response);
  return response.data.data;

  // try {
  //   const response = await axiosClient.get(endpoint);
  //   return response.data.data;
  // } catch (error) {
  //   if (error && error.response && error.response.data) {
  //     toast(error.response.data.message);
  //     throw new Error(error.response.data.message);
  //   }
  //   console.error("Error fetching data:", error);
  // }
};

export const getItemData = async (endpoint: string) => {
  return (await axiosClient.get(endpoint)).data;
  // try {
  //   const response = await axiosClient.get(endpoint);
  //   return response.data;
  // } catch (error) {
  //   if (error && error.response && error.response.data) {
  //     toast(error.response.data.message);
  //     throw new Error(error.response.data.message);
  //   }
  //   console.error("Error fetching data:", error);
  //   // throw new Error("Error fetching data");
  // }
};

export const deleteData = async (endpoint: string) => {
  try {
    console.log("endpoint deleting", endpoint);
    const response = await axiosClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw new Error("Error deleting data");
  }
};

export const validateNulls = (data: Option[][]) => {
  let errors = false;
  Object.values(data).forEach((item) => {
    if (item.length === 0) {
      errors = true;
    }
  });

  if (errors) {
    toast.error("Please select a host and video type");
  }

  return errors;
};

export const putData = async (
  endpoint: string,
  data: object,
  schema: Schema,
) => {
  const { result, errors } = validateData(data, schema);

  if (errors) {
    console.log("errors", errors);
    return { errors: errors };
  } else if (result) {
    try {
      const response = await axiosClient.put(endpoint, result.data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error.response.data.message);
    }
  }
};

export const getQueryData = async (
  queryClient: any,
  queryName: string[],
  objectKey: string,
) => {
  try {
    const queryData = queryClient.getQueryData(queryName);
    return queryData[objectKey];
  } catch (error) {
    console.error("Error fetching query data:", error);
    throw new Error("Error fetching query data");
  }
};

export const postData = async (
  endpoint: string,
  data: object,
  schema: Schema,
) => {
  const { result, errors } = validateData(data, schema);

  if (errors) {
    Object.values(errors).forEach((errorMessage) => {
      toast.error(errorMessage);
    });

    // Throw an error with all error messages concatenated
    const errorMessages = Object.values(errors).join("\n");
    throw new Error(errorMessages);
    // return { errors: errors };
  } else if (result) {
    const response = await axiosClient.post(endpoint, result.data);
    return response.data;
  }
};

export const addNewItem = async ({
  endpoint,
  data,
  schema,
}: AddNewItemParams) => {
  const { result, errors } = validateData(data, schema);

  if (errors) {
    Object.values(errors).forEach((errorMessage) => {
      toast.error(errorMessage);
    });

    // Throw an error with all error messages concatenated
    const errorMessages = Object.values(errors).join("\n");
    throw new Error(errorMessages);
  } else if (result) {
    const response = await axiosClient.post(endpoint, result.data);
    return response.data.data;
  }
};

export const createNewItem = async (endpoint: string, data: object) => {
  try {
    const response = await axiosClient.post(endpoint, data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating new item:", error);
    throw new Error("Error creating new item");
  }
};

export const createNewVideo = async (endpoint: string) => {
  try {
    const response = await axiosClient.post(endpoint);
    return response.data.data;
  } catch (error) {
    console.error("Error creating new item:", error);
    throw new Error("Error creating new item");
  }
};

export const uploadFile = async (
  endpoint: string,
  file: File,
  type: string,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append(type, file);

    const response = await axiosClient.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });

    return response.data;
  } catch (error) {
    toast.error(`Error uploading file`);
    console.error(`Error uploading file to ${endpoint}:`, error);
    throw error;
  }
};

// export const addNewItem = async ({
//   endpoint,
//   inputValue,
// }: AddNewItemParams) => {
//   const response = await axiosClient.post(endpoint, {
//     name: inputValue,
//   });
//   return response.data.data;
// };

type QuerySuccessParams = {
  queryClient: any;
  queryName: string[];
  newItem: any;
};

export const handleSuccess = ({
  queryClient,
  queryName,
  newItem,
}: QuerySuccessParams) => {
  queryClient.setQueryData(queryName, (prevData) => [newItem, ...prevData]);
};

export const getPages = async ({ pageParam }: { pageParam: number }) => {
  const response = await axiosClient.get(`/videos?page=${pageParam + 1}`);
  return response.data;
};

export const getSearchPages = async ({
  endpoint,
  queries,
  pageParam,
}: {
  endpoint: string;
  queries: string;
  pageParam: number;
}) => {
  let fullEndpoint = `/${endpoint}?page=${pageParam + 1}`;

  if (queries) {
    fullEndpoint = fullEndpoint + `&${queries}`;
  }
  const response = await axiosClient.get(fullEndpoint);
  return response.data;
};
