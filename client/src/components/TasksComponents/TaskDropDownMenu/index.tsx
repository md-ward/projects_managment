import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { EllipsisVertical, MoreVerticalIcon } from "lucide-react";
import useTaskStore from "@/state/task.state";

const DropdownMenu = ({ taskId }: { taskId: number }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const toggleDeleteTaskModal = useTaskStore(
    (state) => state.toggleDeleteTaskModal,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget); // Set the clicked button as the anchor
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleEdit = () => {
    // Handle edit action
    console.log(`Edit task with ID: ${taskId}`);
    handleClose();
  };
  const open = Boolean(anchorEl);

  return (
    <div>
      <button
        onClick={handleClick}
        className="flex flex-shrink-0 items-center justify-center dark:text-neutral-500"
      >
<MoreVerticalIcon />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleEdit}>Edit Task</MenuItem>
        <MenuItem
          onClick={() => {
            toggleDeleteTaskModal(taskId), handleClose();
          }}
        >
          Delete Task
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DropdownMenu;
