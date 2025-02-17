'use client';
import { IconButton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion"; // Fixed import for Framer Motion
import React from "react";

const AnimatedSwitchingButton = ({
  isEditable,
  handleEditToggle,
  FirstIcon,
  SecondIcon,
}: {
  isEditable: boolean;
  handleEditToggle: () => void;
  FirstIcon: any;
  SecondIcon: any;
}) => {
  return (
    <IconButton className="text-white" onClick={handleEditToggle}>
      <AnimatePresence mode="wait">
        {!isEditable ? (
          <motion.div
            key={"edit"}
            initial={{ scale: 0 ,rotate: 0}}
            animate={{ scale: 1 ,rotate: 180}}
            exit={{ scale: 0 ,rotate: 0}}
            transition={{ duration: 0.2 }}
          >
            {FirstIcon}
          </motion.div>
        ) : (
          <motion.div
            key={"close"}
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 ,rotate: 180}}
            transition={{ duration: 0.2 }}
          >
            {SecondIcon}
          </motion.div>
        )}
      </AnimatePresence>
    </IconButton>
  );
};

export default AnimatedSwitchingButton;
