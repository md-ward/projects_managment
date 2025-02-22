"use client";

import Header from "@/components/Header";
import BoardViewTaskCard from "@/components/TasksComponents/BoardViewTaskCard";
import ModalNewTask from "@/components/TasksComponents/ModalNewTask";
import PriorityTag from "@/lib/styledPriority";
import {
  dataGridClassNames,
  dataGridSxStyles,
  listStatusColor,
  statusMapping,
} from "@/lib/utils";
import { Priority, Task } from "@/state/api";
import useModeStore from "@/state/mode.state";
import useTaskStore from "@/state/task.state";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type Props = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span
        style={{ color: listStatusColor[params.value] }}
        className="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
      >
        {statusMapping[params.value]}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
    resizable: false,
    renderCell: (params) => (
      <PriorityTag
        priority={params.value as Priority}
        ContainerShape="square"
      />
    ),
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value.fullname || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value.fullname || "Unassigned",
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState("list");

  const isDarkMode = useModeStore((state) => state.isDarkMode);
  const { getTasksViaPriority } = useTaskStore((state) => state);
  const [tasks, setTasks] = useState<Task[] | undefined>([]);
  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await getTasksViaPriority(priority);
      setTasks(tasks);
    };
    fetchTasks();
  }, [getTasksViaPriority, priority]);

  return (
    <div className="m-5 p-4">
      <ModalNewTask />
      <Header
        name="Priority Page"
        buttonComponent={
          <button className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Add Task
          </button>
        }
      />
      <div className="mb-4 flex justify-start">
        <button
          className={`px-4 py-2 ${
            view === "list" ? "bg-gray-300" : "bg-white"
          } rounded-l`}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={`px-4 py-2 ${
            view === "table" ? "bg-gray-300" : "bg-white"
          } rounded-l`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>
      {view === "list" ? (
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-2 gap-4">
            {tasks?.map((task: Task) => (
              <BoardViewTaskCard key={task.id} task={task} />
            ))}
          </div>
        </DndProvider>
      ) : (
        view === "table" && (
          <div className="z-0 w-full">
            <DataGrid
              rows={tasks || []}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              className={dataGridClassNames}
              sx={
                (dataGridSxStyles(isDarkMode === "dark" ? true : false),
                {
                  gap: 10,
                })
              }
            />
          </div>
        )
      )}
    </div>
  );
};

export default ReusablePriorityPage;
