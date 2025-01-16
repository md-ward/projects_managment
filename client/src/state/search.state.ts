import { create } from "zustand";
import { User } from "./api";
import axios from "axios";

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  results: User[];
  setResults: (results: User[]) => void;
  searchUsers: (query: string) => void;
}

const useSearchStore = create<SearchState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
  results: [],
  setResults: (results) => set({ results }),
  searchUsers: async (query) => {
    try {
      set({ results: [] });
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/search/users?query=${query}`,
        {
          withCredentials: true,
        },
      );
      console.log("Search results:", response.data);

      set({ results: response.data });
    } catch (error) {
      console.error("Error searching users:", error);
    }
  },
}));

export default useSearchStore;
