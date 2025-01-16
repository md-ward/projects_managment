import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { deleteCookie, setCookie } from "@/lib/cookieSet";
import { User } from "./api";

interface AuthState {
  currentUser: User | null;
  user: User | null;
  error: string | null;
  loading: boolean;

  reset: () => void;
  getCurrentUserDetails: () => Promise<void>;
  setFormData: (formData: any) => void;
  signUp: () => Promise<void>;
  login: () => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      error: null,
      loading: false,
      user: null,

      // Fetch current user details
      getCurrentUserDetails: async () => {
        try {
          set({ loading: true, error: null });
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/user`,
            { withCredentials: true },
          );
          set({ currentUser: response.data, loading: false });
        } catch (error) {
          const errorMsg =
            (error as any)?.response?.data?.message ||
            "Failed to fetch user details.";
          console.error("Error fetching user details:", errorMsg);
          set({ error: errorMsg, loading: false });
        }
      },

      // Reset store state
      reset: () =>
        set({ user: null, error: null, loading: false, currentUser: null }),

      // Set form data
      setFormData: (formData: FormData) => {
        set({
          user: {
            fullname: formData.get("fullname") as string,
            username: formData.get("username") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          },
        });
      },

      // Sign-up action
      signUp: async () => {
        try {
          set({ loading: true, error: null });

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/signup`,
            {
              user: useAuthStore.getState().user,
            },
          );

          setCookie("authToken", response.data.token);
          window.location.replace("/");
        } catch (error) {
          const errorMsg =
            (error as any)?.response?.data?.message ||
            "Error during signup. Please try again.";
          console.error("Error signing up:", errorMsg);
          set({ error: errorMsg, loading: false });
        } finally {
          useAuthStore.getState().reset();
        }
      },

      // Login action
      login: async () => {
        try {
          set({ loading: true, error: null });
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
            {
              user: useAuthStore.getState().user,
            },
          );
          const { token, user } = response.data as typeof response.data & {
            token: string;
            user: User;
          };

          setCookie("authToken", token);
          // set({ currentUser: user });
          // alert("Login successful");

          if (user.projects === 0) {
            window.location.replace("/projects/new");
          } else {
            window.location.replace("/");
          }
        } catch (error) {
          const errorMsg =
            (error as any)?.response?.data?.message ||
            "Invalid credentials. Please try again.";
          console.error("Error logging in:", errorMsg);
          set({ error: errorMsg, loading: false });
        } finally {
          set({ loading: false });
        }
      },

      // Logout action
      signOut: () => {
        useAuthStore.getState().reset();
        deleteCookie("authToken");
        window.location.replace("/");
      },
    }),
    {
      name: "auth", // Storage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      partialize: (state) => ({ currentUser: state.currentUser }),
    },
  ),
);
