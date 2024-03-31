import { getData, getPages, getSearchPages } from "@/services/api";
import { useQuery, useQueries, useInfiniteQuery } from "@tanstack/react-query";

export function useGetQuery(endpoint: string, enabled = true) {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => getData(`/${endpoint}`),
    enabled: enabled,
  });
}

export function useItemQuery(
  endpoint: string,
  id: number | undefined,
  enabled = true,
) {
  if (id) {
    return useQuery({
      queryKey: [endpoint.slice(0, -1), { id }],
      queryFn: () => getData(`/${endpoint}/${id}`),
      enabled: enabled,
    });
  } else {
    return { data: null, isLoading: false, isError: false };
  }
}

export function useVideoSnippetsQuery(
  endpoint: string,
  id: number | undefined,
  enabled = true,
) {
  if (id) {
    return useQuery({
      queryKey: ["video", { id }, "snippets"],
      queryFn: () => getData(`/${endpoint}/${id}`),
      enabled: enabled,
    });
  } else {
    return { data: null, isLoading: false, isError: false };
  }
}

export function useGetQueries(
  ids: (number | undefined)[] | undefined,
  endpoint: string,
) {
  return useQueries({
    queries: (ids ?? []).map((id) => ({
      queryKey: [endpoint.slice(0, -1), id],
      queryFn: () => getData(`/${endpoint}/${id}`),
    })),
  });
}

// export function useGetQueries(data: Video[], endpoint: string) {
//   return useQueries({
//     queries: data.map((item) => ({
//       queryKey: [endpoint.slice(0, -1), item.id],
//       queryFn: () => getData(`/${endpoint}/${item.id}`),
//     })),
//   });
// }

// useInfiniteVideosQuery

export function useSearchQuery(
  endpoint: string,
  queries: string,
  enabled = true,
) {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => getData(`/${endpoint}?${queries}`),
    enabled: enabled,
  });
}

export function useSearchInfiniteQuery(endpoint: string, queries: string) {
  return useInfiniteQuery({
    queryKey: [endpoint],
    queryFn: ({ pageParam }) =>
      getSearchPages({ endpoint, queries, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.data.length < 1) {
        return undefined;
      } else {
        return lastPageParam + 1;
      }
    },
  });
}

export function useInfiniteVideosQuery() {
  return useInfiniteQuery({
    queryKey: ["videos-infinite"],
    queryFn: getPages,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.data.length < 1) {
        return undefined;
      } else {
        return lastPageParam + 1;
      }
    },
  });
}

// export function useInfiniteVideosQuery() {
//   return useInfiniteQuery({
//     queryKey: ["videos-infinite"],
//     queryFn: getPages,
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => lastPage.nextPage,
//   });
// }
