import { Typography } from "@mui/material";
import { File } from "lucide-react";

const EmptyTasks = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center gap-4">
      <Typography variant="h6" gutterBottom>
        No tasks found.
      </Typography>
      <Typography variant="body2">Create a new task to get started.</Typography>
      <File />
    </div>
  );
};

export default EmptyTasks;
