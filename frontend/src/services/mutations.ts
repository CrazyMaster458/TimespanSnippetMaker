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
import { toast } from "sonner";

export function useDeleteItemMutation(endpoint: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteData(`/${endpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [endpoint],
      });
    },
    onError: () => {
      toast.error("Something went wrong, please try again later");
    },
  });
}

export function useDownloadVideo(endpoint: string) {
  return useMutation({
    mutationFn: (id: number) => getDownload(`/${endpoint}/${id}`),
    onSuccess: () => {},
    onError: () => {
      toast.error("Something went wrong, please try again later");
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
    onSuccess: (_, data) => {
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
    onError: (error: any) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Something went wrong, please try again later");
    },
  });
}

export function useCutVideoMutation(endpoint: string, videoId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cutVideo(`/${endpoint}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["video", videoId, "snippets"],
      });
      toast.success("Snippet has been successfuly exported");
    },
    onError: (error: any) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Something went wrong, please try again later");
    },
  });
}

export function useDuplicateMutation(endpoint: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cutVideo(`/${endpoint}/${id}/duplicate`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["videos"],
      });
      toast.success("Video has been successfuly duplicated");
    },
    onError: (error: any) => {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Something went wrong, please try again later");
    },
  });
}

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
    onError: () => {
      toast.error("Something went wrong, please try again later");
    },
  });
}

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
    onError: () => {
      toast.error("Something went wrong, please try again later");
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
    onError: () => {
      toast.error("Something went wrong, please try again later");
    },
  });
}
