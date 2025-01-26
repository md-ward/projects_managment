import { create } from "zustand";
import { User } from "./api";
import axios from "axios";
interface UserStore {
  data: User[];
  isLoading: boolean;
  isError: boolean | null;
  getUsers: () => Promise<void>;
}
const useUserStore = create<UserStore>((set) => ({
  data: [],
  isLoading: false,
  isError: null,
  getUsers: async () => {
    try {
      set({ isLoading: true, isError: null });
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
      );
      set({ data: response.data, isLoading: false });
      console.log(response.data);
      
    } catch (error: any) {
      set({
        isError: error.message || "Could not fetch users",
        isLoading: false,
      });
    }
  },
}));
export default useUserStore;
