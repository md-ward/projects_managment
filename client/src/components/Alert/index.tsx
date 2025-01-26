import useAlertStore from "@/state/alert.state";
import { IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const AlertPopup = () => {
  const { currentAlert, dismissAlert } = useAlertStore();

  if (!currentAlert) return null; // If no alert, render nothing

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentAlert.id} // Use the alert ID for proper animation handling
        className={`fixed right-0 top-20 z-50 flex min-w-56 items-center justify-center rounded-lg ${
          currentAlert.alertType === "success" ? "bg-green-500" : "bg-red-500"
        } p-4 text-white`}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: -20 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <IconButton
          onClick={dismissAlert}
          title="Dismiss"
          type="button"
          className="absolute right-2 text-white"
        >
          <X />
        </IconButton>
        <h1>{currentAlert.message}</h1>
        <AnimatedLine />
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertPopup;

const AnimatedLine = () => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 3, ease: "easeInOut" }}
      className="absolute bottom-0 h-1 w-full bg-blue-500"
    />
  );
};
