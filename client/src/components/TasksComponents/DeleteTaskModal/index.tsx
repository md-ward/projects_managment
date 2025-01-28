import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import useTaskStore from "@/state/task.state";
import { useShallow } from "zustand/shallow";

const DeleteTaskModal = () => {
  const { toggleDeleteTaskModal, isDeleteTaskModalOpen, deleteTask } =
    useTaskStore(
      useShallow((state) => ({
        toggleDeleteTaskModal: state.toggleDeleteTaskModal,
        isDeleteTaskModalOpen: state.isDeleteTaskModalOpen,
        deleteTask: state.deleteTask,
      })),
    );

  return (
    <Modal open={isDeleteTaskModalOpen} aria-labelledby="delete-task-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          id="delete-task-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          Confirm Delete
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete this task?
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            onClick={() => {
              toggleDeleteTaskModal(null);
            }}
            variant="outlined"
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={deleteTask} variant="contained" color="error">
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteTaskModal;
