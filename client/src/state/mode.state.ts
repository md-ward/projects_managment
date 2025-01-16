import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ModeStore {
  isDarkMode: "light" | "dark";
  setIsDarkMode: () => void;
}

const useModeStore = create<ModeStore>()(
  persist(
    (set) => ({
      isDarkMode: "light",
      setIsDarkMode: () =>
        set((state) => ({
          isDarkMode: state.isDarkMode === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "mode-storage", // Key to store in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);

export default useModeStore;
 