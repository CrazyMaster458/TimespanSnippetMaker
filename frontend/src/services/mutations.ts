import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewItem, createNewVideo, handleSuccess } from "./api";

export function useCreateVideoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewVideo,
    onMutate: () => {},
    onSuccess: () => {},
    onError: (error) => {
      console.error("Error creating video:", error);
    },
    onSettled: async (data, error, variables) => {},
  });
}

export function useCreateSnippetMutation(id: number | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: object) => createNewItem("/snippets", data),
    onMutate: () => {},
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["video", { id }, "snippets"],
      });
    },
    onError: (error) => {
      console.error("Error creating video:", error);
    },
    onSettled: async () => {},
  });
}

// const {
//   mutateAsync: createNewVideo2,
//   isPending,
//   isSuccess,
//   data,
// } = useMutation({
//   mutationFn: createNewVideo,
//   onSuccess: (newItem) => {
//     const queryName = ["videos"];
//     queryClient.setQueryData(["videos", newItem.id], newItem);
//     handleSuccess({ queryClient, queryName, newItem });
//   },
//   onError: (error) => {
//     console.log(error);
//   },
// });

// useCreateMuation
// useUpdateMutation
// useDeleteMutation
// useAddMutation
// useUploadMutation
