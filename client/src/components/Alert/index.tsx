import useAlertStore from "@/state/alert.state";
import { IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

const AlertPopup = () => {
  const { isOpen, errorMessage, dismissAlert, alertType } = useAlertStore(
    useShallow((state) => ({
      alertType: state.alertType,
      isOpen: state.isAlertOpen,
      errorMessage: state.errorMessage,
      dismissAlert: state.dismissAlert,
    })),
  );

  useEffect(() => {
    let timeoutId: number | undefined;

    if (isOpen) {
      timeoutId = window.setTimeout(() => {
        dismissAlert();
      }, 2000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen, dismissAlert]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed right-0 top-20 z-50 flex min-w-56 items-center justify-center rounded-lg ${alertType === "success" ? "bg-green-500" : "bg-red-500"} p-4 text-white`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: -20 }}
          exit={{ opacity: 0, x: 100 }} // Define the exit animation here
          transition={{ duration: 0.3, ease: "easeInOut" }} // Optional: Add a duration for smooth transition
        >
          <IconButton
            onClick={dismissAlert}
            title="dismiss"
            type="button"
            className="absolute right-2 text-white"
          >
            <X></X>
          </IconButton>
          <h1>{errorMessage}</h1>
          <AnimatedLine />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertPopup;

const AnimatedLine = () => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="absolute inset-0 top-1 h-1 w-full rounded-l-lg rounded-r-lg bg-blue-500"
      layoutId="progress"
    />
  );
};
