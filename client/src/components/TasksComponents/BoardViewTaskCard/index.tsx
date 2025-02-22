import { useDrag } from "react-dnd";
import { Attachment, Priority, Task as TaskType } from "@/state/api";
import { Group, MessageSquareMore, Paperclip } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import DropdownMenu from "@/components/TasksComponents/TaskDropDownMenu";
import { Card, CardHeader, IconButton } from "@mui/material";
import { motion } from "motion/react";
import useDeletionDropzone from "@/state/deletionDropzone";
import { listStatusColor } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import imgUrlChecker from "@/lib/imgUrlChecker";
import useTaskStore from "@/state/task.state";
import { useShallow } from "zustand/shallow";
import ViewAttachmentsModal from "../ShowAttachmentModal";
import PriorityTag from "@/lib/styledPriority";
const BoardViewTaskCard = ({ task }: { task: TaskType }) => {
  const setDropzoneOpen = useDeletionDropzone((state) => state.setDropzoneOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isViewAttachmentModalOpen, setIsViewAttachmentModalOpen] =
    useState<boolean>(false);

  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(textRef.current.scrollHeight > 40);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [task.description]); // Recalculate if description changes

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    isDragging(monitor) {
      setDropzoneOpen(true);
      return true;
    },
    end: () => {
      setDropzoneOpen(false);
    },
    collect: (monitor: any) => {
      const isDragging = !!monitor.isDragging();
      return { isDragging };
    },
  }));

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  
  const { toggleDeleteTaskModal, toggleModal } = useTaskStore(
    useShallow((state) => ({
      toggleDeleteTaskModal: state.toggleDeleteTaskModal,
      toggleModal: state.toggleModal,
    })),
  );

  const menuItems = [
    {
      label: "Edit",
      onClick: () => {
        // Handle edit action, use task.id
        console.log("Editing task with ID:", task.id);
        toggleModal(true, task);
      },
    },
    {
      label: "Delete",
      onClick: () => {
        toggleDeleteTaskModal(task.id);
      },
    },
  ];
  return (
    <motion.div
      className="min-h-60"
      key={task.id}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.4, type: "tween", ease: "easeInOut" }}
    >
      <Card
        key={task.id}
        ref={(instance) => {
          drag(instance);
        }}
        sx={{
          boxShadow: `0 0 0 1px ${listStatusColor[task.status ?? "todo"]} !important`,
        }}
        className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        <CardHeader
          avatar={<PriorityTag priority={task.priority as Priority} />}
          title={task.title}
          subheader={
            formattedStartDate && formattedDueDate
              ? formattedStartDate + " - " + formattedDueDate
              : formattedStartDate || formattedDueDate
          }
          action={<DropdownMenu menuItems={menuItems} />}
        />

        <div className="flex flex-col gap-2 p-4 md:p-6">
          <div>
            <p
              ref={textRef}
              className={`overflow-hidden text-sm text-gray-600 transition-all dark:text-neutral-500 ${
                isExpanded ? "max-h-full" : "max-h-10"
              }`}
            >
              {task.description}
            </p>

            {isOverflowing && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-sm text-blue-500 hover:underline dark:text-blue-400"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="flex gap-2 flex-wrap w-full">
              {task.tags &&
                task.tags.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                  >
                    {tag}
                  </div>
                ))}
            </div>
          </div>

          <div className="flex h-fit items-center align-baseline text-gray-500 dark:text-neutral-500">
            <h3>Team :</h3>
            <span className="ml-1 text-sm dark:text-neutral-400">
              {task?.teamName}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex h-fit w-fit gap-2">
              {task?.author && task.author.profilePictureUrl && (
                <Image
                  title={"Author: " + task.author.username}
                  key={task.author.userId}
                  src={imgUrlChecker(task.author.profilePictureUrl)}
                  alt={"Author: " + task.author.username}
                  width={30}
                  height={30}
                  className="z-10 aspect-square size-12 rounded-full border-2 border-white object-cover ring-1 ring-blue-200 ring-offset-1 dark:border-dark-secondary"
                />
              )}
              {task?.assignee && task.assignee.profilePictureUrl && (
                <Image
                  title={"Assignee: " + task.assignee.username}
                  key={task.assignee.userId}
                  src={imgUrlChecker(task.assignee.profilePictureUrl)}
                  alt={task.assignee.username || "Assignee"}
                  width={30}
                  height={30}
                  className="z-10 aspect-square size-12 rounded-full border-2 border-white object-cover ring-1 ring-orange-200 ring-offset-1 dark:border-dark-secondary"
                />
              )}
            </div>
            {/* View Attachments */}
            <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-500">
              <IconButton
                onClick={() => {
                  setIsViewAttachmentModalOpen(true);
                }}
                className="hover:text-blue-400"
              >
                <Paperclip size={20} />
                <span className="ml-1 text-sm dark:text-neutral-400">
                  {task.attachments && task.attachments.length}
                </span>
              </IconButton>
              <ViewAttachmentsModal
                attachments={task.attachments as Attachment[]}
                isOpen={isViewAttachmentModalOpen}
                onClose={() => setIsViewAttachmentModalOpen(false)}
              />
              <div>
                <MessageSquareMore size={20} />
                <span className="ml-1 text-sm dark:text-neutral-400">
                  {numberOfComments}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BoardViewTaskCard;
