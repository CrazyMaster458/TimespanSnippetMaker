import { Snippet, Tag } from "@/types/types";
import { create } from "zustand";

type TagsData = {
  tagsData: Tag[];
  setTagsData: (data: TagsData["tagsData"]) => void;
  addTag: (newTag: Tag) => void; // New setter for adding a tag
};

type SnippetsData = {
  snippetsData: Snippet[];
  setSnippetsData: (data: SnippetsData["snippetsData"]) => void;
  addSnippet: (newSnippet: Snippet) => void;
  updateSnippet: (newSnippetData: Snippet) => void;
};

export const useTagsDataStore = create<TagsData>((set) => ({
  tagsData: [],
  setTagsData: (data) => {
    set({ tagsData: data });
  },
  addTag: (newTag) =>
    set((state) => ({ tagsData: [...state.tagsData, newTag] })), // Implementation for adding a tag
}));

export const useSnippetsDataStore = create<SnippetsData>((set) => ({
  snippetsData: [],
  setSnippetsData: (data) => set({ snippetsData: data }),
  addSnippet: (newSnippet) =>
    set((state) => ({ snippetsData: [...state.snippetsData, newSnippet] })),
  updateSnippet: (newSnippetData) =>
    set((state) => ({
      snippetsData: state.snippetsData.map((snippet) =>
        snippet.id === newSnippetData.id
          ? { ...snippet, ...newSnippetData }
          : snippet,
      ),
    })),
}));
