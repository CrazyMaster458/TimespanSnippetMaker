import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNewItem,
  createNewVideo,
  deleteData,
  putData,
  cutVideo,
  getDownload,
} from "./api";
import { Schema } from "zod";

export function useDeleteItemMutation(endpoint: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteData(`/${endpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [endpoint],
      });
    },
    onError: (error) => {
      console.error("Error deleting:", error);
    },
  });
}

export function useDownloadVideo(endpoint: string) {
  return useMutation({
    mutationFn: (id: number) => getDownload(`/${endpoint}/${id}`),
    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {
      console.error("Error deleting:", error);
    },
  });
}

export function useUpdateMutation(
  endpoint: string,
  schema: Schema,
  parent = "",
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => putData(`/${endpoint}/${data.id}`, data, schema),
    onSuccess: (data) => {
      if (parent) {
        queryClient.invalidateQueries({
          queryKey: [parent, data.video_id, endpoint],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [endpoint, data.id],
        });
      }
    },
    onError: (error) => {
      console.error("Error updating snippet:", error);
    },
  });
}

export function useCutVideoMutation(endpoint: string) {
  return useMutation({
    mutationFn: (id: number) => cutVideo(`/${endpoint}/${id}`),
    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {
      console.error("Error deleting:", error);
    },
  });
}

export function useDuplicateMutation(endpoint: string) {
  return useMutation({
    mutationFn: (id: number) => cutVideo(`/${endpoint}/${id}/duplicate`),
    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {
      console.error("Error deleting:", error);
    },
  });
}

// VIDEO MUTATIONS

export function useCreateVideoMutation(endpoint: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createNewVideo(endpoint),
    onSuccess: (newItem) => {
      queryClient.setQueryData([endpoint], (prevData: any) => [
        newItem,
        ...prevData,
      ]);
    },
    onError: (error) => {
      console.log(error);
    },
  });
}

// SNIPPET MUTATIONS

export function useCreateSnippetMutation(id: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: object) => createNewItem("/snippets", data),
    onMutate: () => {},
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["video", id, "snippets"],
      });
    },
    onError: (error) => {
      console.error("Error creating video:", error);
    },
    onSettled: async () => {},
  });
}

export function useDeleteSnippetMutation(snippetId: number, parent = "") {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteData(`/snippets/${id}`),
    onSuccess: () => {
      if (parent) {
        queryClient.invalidateQueries({
          queryKey: [parent, snippetId, "snippets"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["snippets"],
        });
      }
    },
    onError: (error) => {
      console.error("Error updating snippet:", error);
    },
  });
}
