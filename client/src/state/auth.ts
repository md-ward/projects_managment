import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { deleteCookie, setCookie } from "@/lib/cookieSet";
import { User } from "./api";
import useAlertStore from "./alert.state";

interface AuthState {
  currentUser: User | null;
  user: User | null;
  error: string | null;
  loading: boolean;
  updateUser: (user: User) => void;
  reset: () => void;
  getCurrentUserDetails: () => Promise<void>;
  setFormData: (formData: any) => void;
  signUp: () => Promise<void>;
  login: () => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
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
      console.log("Current user details:", response.data);
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
      } as User,
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
  updateUser: async (user: User) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/user`,
        user,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            "Cache-Control": "max-age=3600",
          },
        },
      );
      useAlertStore.getState().showAlert({
        message: "User updated successfully",
        alertType: "success",
      });

      set({ currentUser: res.data.updatedUser });
    } catch (error) {
      useAlertStore
        .getState()
        .showAlert({ message: "Error updating user", alertType: "error" });
    }
  },
}));
