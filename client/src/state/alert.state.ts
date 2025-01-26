import { create } from "zustand";
type DoRedirect = {
  doRedirect: boolean;
  URL: string;
};
type AlertType = "success" | "error" | null;
interface Alert {
  id?: string;
  alertType: AlertType;
  message: string;
  doRedirect?: DoRedirect;
}

interface AlertStore {
  queue: Alert[];
  currentAlert: Alert | null;
  showAlert: (alert: Alert) => void;
  dismissAlert: () => void;
}

const useAlertStore = create<AlertStore>((set, get) => ({
  queue: [],
  currentAlert: null,

  showAlert: (alert) => {
    const newAlert: Alert = {
      id: `${Date.now()}-${Math.random()}`, // Unique ID for the alert
      ...alert,
    };

    set((state) => ({
      queue: [...state.queue, newAlert], // Add the alert to the queue
    }));

    // Automatically process the queue if no alert is currently displayed
    if (!get().currentAlert) {
      get().dismissAlert();
    }
  },

  dismissAlert: () => {
    const { queue } = get();

    if (queue.length > 0) {
      // Display the next alert in the queue
      const [nextAlert, ...remainingQueue] = queue;

      set({
        currentAlert: nextAlert,
        queue: remainingQueue,
      });

      // Automatically dismiss the alert after 3 seconds
      setTimeout(() => {
        if (get().currentAlert?.doRedirect?.doRedirect) {
          const currentAlert = get().currentAlert;
          if (currentAlert && currentAlert.doRedirect && currentAlert.doRedirect.URL) {
            window.location.replace(currentAlert.doRedirect.URL);
          }
        }

        set({ currentAlert: null });

        get().dismissAlert(); // Process the next alert in the queue
      }, 2000);
    } else {
      // No alerts left in the queue
      set({ currentAlert: null });
    }
  },
}));

export default useAlertStore;
