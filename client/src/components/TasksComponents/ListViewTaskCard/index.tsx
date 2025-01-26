import { listStatusColor, statusColor, statusMapping } from "@/lib/utils";
import { Task } from "@/state/api";
import useModeStore from "@/state/mode.state";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import Image from "next/image";

const TaskCard = ({ task }: { task: Task }) => {
  const isDarkMode = useModeStore((state) => state.isDarkMode);
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: isDarkMode === "dark" ? "#1d1f21" : "background.paper",
        color: "text.primary",
        mb: 2,
      }}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName || "Attachment"}
          width={400}
          height={200}
          style={{ objectFit: "cover", width: "100%", maxHeight: 200 }}
        />
      )}

      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {task.title || "Untitled Task"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {task.description || "No description provided."}
        </Typography>
        <Typography
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          variant="body1"
          component="p"
        >
          <span>Status:</span>
          {task.status !== undefined && (
            <span
              style={{ backgroundColor: listStatusColor[task.status] }}
              className={`inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-white ring-2 dark:bg-gray-700 dark:text-gray-100`}
            >
              {statusMapping[task.status] || "Unknown"}
            </span>
          )}
          {task.status === undefined && <span>Unknown</span>}
        </Typography>

        <Typography
          className="flex flex-row gap-4 pt-4"
          variant="body1"
          component="p"
        >
          Priority:{" "}
          <p
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              task.priority === "Urgent"
                ? "bg-red-200 text-red-700"
                : task.priority === "High"
                  ? "bg-yellow-200 text-yellow-700"
                  : task.priority === "Medium"
                    ? "bg-green-200 text-green-700"
                    : task.priority === "Low"
                      ? "bg-blue-200 text-blue-700"
                      : "bg-gray-200 text-gray-700"
            }`}
          >
            {" "}
            {task.priority}
          </p>
        </Typography>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap" style={{ margin: "8px 0" }}>
            Tags:{" "}
            {task.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                color="primary"
                sx={{ mr: 0.5, mt: 0.5 }}
              />
            ))}
          </div>
        )}

        <Typography variant="body2" sx={{ mt: 1 }}>
          Start Date:{" "}
          {task.startDate ? format(new Date(task.startDate), "P") : "Not set"}
        </Typography>
        <Typography variant="body2">
          Due Date:{" "}
          {task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Author: {task.author ? task.author.username : "Unknown"}
        </Typography>
        <Typography variant="body2">
          Assignee: {task.assignee ? task.assignee.username : "Unassigned"}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button size="small" color="primary" variant="outlined">
          View Details
        </Button>
        <Button size="small" color="secondary" variant="contained">
          Edit Task
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
