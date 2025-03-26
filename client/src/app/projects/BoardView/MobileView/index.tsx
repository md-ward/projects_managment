import BoardViewTaskCard from "@/components/TasksComponents/BoardViewTaskCard";
// import TaskCard from "@/components/TasksComponents/ListViewTaskCard";
import { statusMapping } from "@/lib/utils";
import { Status, Task } from "@/state/api";
import { useState } from "react";

const MobileView = ({ status, tasks }: { status: Status; tasks: Task[] }) => {
  const [activeStatus, setActiveStatus] = useState<Status>(Status.ToDo);
  const currentTasks = tasks.filter((task) => task.status === activeStatus);

  return (
    <div className="block h-full w-full flex-col bg-slate-100 p-4 xl:hidden">
      {/* Status Dropdown */}
      <select
        className="w-full rounded-lg bg-white p-3 text-lg font-semibold text-gray-900 shadow-md dark:bg-gray-800 dark:text-white"
        onChange={(e) => setActiveStatus(e.target.value as Status)}
        value={activeStatus}
      >
        {Object.entries(statusMapping).map(([key, value]) => (
          <option value={key} key={key}>
            {value}
          </option>
        ))}
      </select>

      {/* Scrollable Task List */}
      <div className="mt-4 grid max-h-[60vh] gap-2  overflow-y-auto p-8 md:grid-cols-2">
        {currentTasks.length > 0 ? (
          currentTasks.map((task) => (
            <BoardViewTaskCard key={task.id} task={task} />
          ))
        ) : (
          <p className="text-center text-gray-500">No tasks available</p>
        )}
      </div>
    </div>
  );
};

export default MobileView;
