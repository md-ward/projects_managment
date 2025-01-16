import Modal from "@/components/Modal";
import { Priority, Status, TaskTags } from "@/state/api";
import useTaskStore from "@/state/task.state";
import useProjectStore from "@/state/project.state";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { usePathname } from "next/navigation";
import ProjectTeamsList from "@/components/ProjectTeamsList";

const ModalNewTask = () => {
  const {
    tasks,
    createTask,
    isLoading,
    isError,
    task,
    setTask,
    toggleModal,
    isModalNewTaskOpen,
  } = useTaskStore(
    useShallow((state) => ({
      tasks: state.tasks,
      toggleModal: state.toggleModal,
      isModalNewTaskOpen: state.isModalNewTaskOpen,
      task: state.task,
      setTask: state.setTask,
      createTask: state.createTask,
      isLoading: state.isLoading,
      isError: state.isError,
    })),
  );
  const pathname = usePathname();
  const currentProject = useProjectStore((state) => state.currentProject);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    
    setTask({
      projectId: Number(currentProject?.id) || Number(pathname.split("/")[2]),
    });
  }, [currentProject, pathname, setTask,tasks]);
  const handleSubmit = async () => {
    createTask();
  };
  useEffect(() => {
    const isValid = Boolean(
      task?.title &&
      task?.description &&
      task?.status &&
      task?.priority &&
      task?.startDate &&
      task?.dueDate &&
      (task?.tags?.length ?? 0) > 0
    );
    setIsFormValid(isValid);
  }, [task]);

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal
      isOpen={isModalNewTaskOpen}
      onClose={toggleModal}
      name="Create New Task"
    >
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          value={task?.title}
          onChange={(e) => setTask({ title: e.target.value })}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={task?.description}
          onChange={(e) => setTask({ description: e.target.value })}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={task?.status}
            onChange={(e) => {
              setTask({
                status: e.target.value as Status,
              });
              console.log(task?.status);
            }}
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={task?.priority}
            onChange={(e) =>
              setTask({
                priority: Priority[e.target.value as keyof typeof Priority],
              })
            }
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <label
            htmlFor="Tags"
            className="block text-sm font-medium text-gray-700"
          >
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(TaskTags).map((tag) => (
              <label key={tag} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-primary focus:ring-blue-500 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white"
                  value={tag}
                  checked={task?.tags?.includes(tag)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setTask({
                      tags: isChecked
                        ? [...(task?.tags || []), tag]
                        : task?.tags?.filter((t) => t !== tag),
                    });
                  }}
                />
                <span className="text-sm">{tag}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={task?.startDate}
            onChange={(e) => setTask({ startDate: e.target.value })}
          />
          <input
            type="date"
            className={inputStyles}
            value={task?.dueDate}
            onChange={(e) => setTask({ dueDate: e.target.value })}
          />
        </div>

        <ProjectTeamsList />

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
