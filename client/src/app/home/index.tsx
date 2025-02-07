"use client";

import React, { useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import useModeStore from "@/state/mode.state";
import { Priority, Project, Task } from "@/state/api";
import useProjectStore from "@/state/project.state";
import useTaskStore from "@/state/task.state";
import { useShallow } from "zustand/shallow";

const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "priority", headerName: "Priority", width: 150 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];

const COLORS = {
  toDo: "#0088FE",
  workInProgress: "#00C49F",
  Backlog: "#FFBB28",
  Completed: "#FF8042",
};

const HomePage = () => {
  const { currentUserTasks, getCurrentUserTasks } = useTaskStore(
    useShallow((state) => ({
      currentUserTasks: state.currentUserTasks,
      getCurrentUserTasks: state.getCurrentUserTasks,
    })),
  );
  const { projects, isLoading: isProjectsLoading } = useProjectStore(
    useShallow((state) => ({
      projects: state.projects,
      isLoading: state.isLoading,
    })),
  );

  const isDarkMode = useModeStore((state) => state.isDarkMode);
  useEffect(() => {
    getCurrentUserTasks();
  }, [getCurrentUserTasks]);

  const priorityCount = (currentUserTasks ?? []).reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const now = new Date(); // Current date for comparison
      const endDate = project.endDate ? new Date(project.endDate) : null;

      let status: string;

      if (endDate && endDate < now) {
        status = "Completed"; // Projects with endDate in the past
      } else {
        status = "Active"; // Projects without an endDate or ongoing
      }

      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );
  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Project Management Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="count">
                {taskDistribution.map((entry, index) => {
                  const priorityColorMap: Record<string, string> = {
                    backlog: "#FF0000",
                    urgent: "#FF4500",
                    high: "#FF8C00",
                    medium: "#FFD700",
                    low: "#32CD32",
                  };
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        priorityColorMap[entry.name.toLowerCase()] || "#8884d8"
                      }
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
                {projectStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors.pieFill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Your Tasks
          </h3>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={currentUserTasks || []}
              columns={taskColumns}
              checkboxSelection
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode == "dark")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
