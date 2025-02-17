import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  children: React.ReactNode;
  children2?: React.ReactNode;
};

const Modal = ({ children, isOpen, onClose, name, children2 }: Props) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-50 flex h-full w-full flex-row items-center justify-center gap-4 overflow-y-auto bg-gray-600 bg-opacity-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary"
        >
          <Header
            name={name}
            buttonComponent={
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-primary text-white hover:bg-blue-600"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            }
            isSmallText
          />
          {children}
        </motion.div>
        {children2}
      </div>
    </AnimatePresence>,
    document.body,
  );
};

export default Modal;
