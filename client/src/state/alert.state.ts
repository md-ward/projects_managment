import { create } from "zustand";

interface AlertStore {
  alertType: "success" | "error" | null;
  errorMessage: string;
  isAlertOpen: boolean;
  showAlert: (message: string, type: "success" | "error" | null) => void;
  dismissAlert: () => void;
}

const useAlertStore = create<AlertStore>((set) => ({
  alertType: null,
  errorMessage: "",
  isAlertOpen: false,
  showAlert: (message, type) =>
    set({ errorMessage: message, isAlertOpen: true, alertType: type }),
  dismissAlert: () =>
    set({ isAlertOpen: false, errorMessage: "", alertType: null }),
}));
export default useAlertStore;
