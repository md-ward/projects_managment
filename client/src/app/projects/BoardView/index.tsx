import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Status, Task as TaskType } from "@/state/api";
import { Delete, EllipsisVertical, Plus, Trash } from "lucide-react";
import useTaskStore from "@/state/task.state";
import { reverseStatusMapping, statusColor, statusMapping } from "@/lib/utils";
import { useShallow } from "zustand/shallow";
import BoardViewTaskCard from "@/components/TasksComponents/BoardViewTaskCard";
import { motion, AnimatePresence } from "motion/react";
import useDeletionDropzone from "@/state/deletionDropzone";
import { useState, useLayoutEffect } from "react";

const BoardView = () => {
  const { tasks, updateTaskStatus } = useTaskStore(
    useShallow((state) => ({
      tasks: state.tasks,
      updateTaskStatus: state.updateTaskStatus,
    })),
  );

  const moveTask = (taskId: number, toStatus: Status) => {
    updateTaskStatus(taskId, reverseStatusMapping[toStatus]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DeletionDropZone />
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(statusMapping).map(([, value]) => (
          <TaskColumn
            key={value}
            status={value as Status}
            tasks={tasks || []}
            moveTask={moveTask}
          />
        ))}
      </div>
    </DndProvider>
  );
};
const DeletionDropZone = () => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => {
      useTaskStore.getState().toggleDeleteTaskModal(item.id);
    },
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const isDropzoneOpen = useDeletionDropzone((state) => state.isDropzoneOpen);
  return (
    <div
      className="mx-auto flex w-fit place-content-center p-2"
      ref={(instance) => {
        drop(instance);
      }}
    >
      <AnimatePresence>
        {isDropzoneOpen && (
          <motion.div
            className={`flex w-fit items-center justify-center  ${isOver ? "bg-red-500" : "bg-red-200"} rounded-full p-4`}
            key="deleteDropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Trash size={24} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type TaskColumnProps = {
  status: Status;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: Status) => void;
};

const TaskColumn = ({ status, tasks, moveTask }: TaskColumnProps) => {
  const toggleModal = useTaskStore((state) => state.toggleModal);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [height, setHeight] = useState("100dvh"); // Default initial height

  useLayoutEffect(() => {
    if (tasks.length > 0) {
      const tasksCount = tasks.filter(
        (task) => task.status && statusMapping[task.status] === status,
      ).length;
      console.log(tasksCount);

      setHeight(`calc(100dvh + ${tasksCount * 18}rem)`);
    }
  }, [tasks, status]); // Runs after tasks are updated

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`relative rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className="w-2 rounded-s-lg"
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {
                tasks.filter(
                  (task) =>
                    task.status && statusMapping[task.status] === status,
                ).length
              }
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={toggleModal}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
      <div style={{ height }} className="!overflow-scroll">
        {tasks
          .filter(
            (task) => task.status && statusMapping[task.status] === status,
          )
          .map((task) => (
            <BoardViewTaskCard key={task.id} task={task} />
          ))}
      </div>
    </div>
  );
};

export default BoardView;
