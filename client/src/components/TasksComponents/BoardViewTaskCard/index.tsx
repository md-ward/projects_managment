import { useDrag } from "react-dnd";
import { Task as TaskType } from "@/state/api";
import { MessageSquareMore } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import DropdownMenu from "@/components/TasksComponents/TaskDropDownMenu";
import { Card, CardHeader } from "@mui/material";
import { motion } from "motion/react";

const BoardViewTaskCard = ({ task }: { task: TaskType }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
    <div
      title={"Priority: " + priority}
      className={`flex aspect-square items-center rounded-full px-2 py-1 text-xs font-semibold ${
        priority === "Urgent"
          ? "bg-red-200 text-red-700"
          : priority === "High"
            ? "bg-yellow-200 text-yellow-700"
            : priority === "Medium"
              ? "bg-green-200 text-green-700"
              : priority === "Low"
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  );

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.4, type: "tween", ease: "easeInOut" }}
    >
      <Card
        ref={(instance) => {
          drag(instance);
        }}
        className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        <CardHeader
          avatar={<PriorityTag priority={task.priority} />}
          title={task.title}
          subheader={
            formattedStartDate && formattedDueDate
              ? formattedStartDate + " - " + formattedDueDate
              : formattedStartDate || formattedDueDate
          }
          action={<DropdownMenu taskId={task.id} />}
        />

        {task.attachments && task.attachments.length > 0 && (
          <Image
            src={"/" + (task.attachments[0]?.fileURL ?? "")}
            alt={task.attachments[0]?.fileName ?? ""}
            width={400}
            height={200}
            className="h-auto w-full rounded-t-md"
          />
        )}
        <div className="p-4 md:p-6">
          {/* Description */}

          <p className="text-sm text-gray-600 dark:text-neutral-500">
            {task.description}
          </p>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="flex gap-2">
              {task.tags &&
                task.tags.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                  >
                    {" "}
                    {tag}
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

          {/* Users */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-2 bg-red-200 p-2">
              {task?.author && task.author.profilePictureUrl && (
                <Image
                  title={"Author: " + task.author.username}
                  key={task.author.userId}
                  src={task.author.profilePictureUrl}
                  alt={"Author: " + task.author.username}
                  width={30}
                  height={30}
                  className="z-10 aspect-square overflow-hidden rounded-full border-2 border-white object-cover ring-1 ring-blue-200 ring-offset-1 dark:border-dark-secondary"
                />
              )}
              {task?.assignee && task.assignee.profilePictureUrl && (
                <Image
                  title={"Assignee: " + task.assignee.username}
                  key={task.assignee.userId}
                  src={"/" + task.assignee.profilePictureUrl}
                  alt={task.assignee.username || "Assignee"}
                  width={30}
                  height={30}
                  className="aspect-square rounded-full border-2 border-white object-cover ring-1 ring-orange-200 ring-offset-1 dark:border-dark-secondary"
                />
              )}
            </div>

            <div className="flex items-center text-gray-500 dark:text-neutral-500">
              <MessageSquareMore size={20} />
              <span className="ml-1 text-sm dark:text-neutral-400">
                {numberOfComments}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BoardViewTaskCard;
