import Header from "@/components/Header";
import EmptyTasks from "@/components/TasksComponents/EmptyTasks";
import TaskCard from "@/components/TasksComponents/ListViewTaskCard";
import { Task } from "@/state/api";
import useTaskStore from "@/state/task.state";
import React from "react";
import { useShallow } from "zustand/shallow";

const ListView = () => {
  const { tasks, isError, isLoading, toggleModal } = useTaskStore(
    useShallow((state) => ({
      toggleModal: state.toggleModal,
      tasks: state.tasks,
      isError: state.isError,
      isLoading: state.isLoading,
    })),
  );

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={toggleModal}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <>
        {isLoading ? (
          <div className="loader flex items-center justify-center"></div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {tasks?.map((task: Task) => <TaskCard key={task.id} task={task} />)}
          </div>
        ) : (
          <EmptyTasks />
        )}
      </>
    </div>
  );
};

export default ListView;
