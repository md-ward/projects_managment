import Header from "@/components/Header";
import PriorityTag from "@/lib/styledPriority";
import {
  dataGridClassNames,
  dataGridSxStyles,
  listStatusColor,
  statusColor,
  statusMapping,
} from "@/lib/utils";
import { Priority } from "@/state/api";
import useModeStore from "@/state/mode.state";
import useTaskStore from "@/state/task.state";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

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
    renderCell: (params) => {

      return params.value?.fullname || "Unassigned";
    },
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value?.fullname || "Unassigned",
  },
];

const TableView = () => {
  const isDarkMode = useModeStore((state) => state.isDarkMode);
  const { tasks, isError, isLoading, toggleModal } = useTaskStore();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !tasks)
    return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Table"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => toggleModal(false)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <DataGrid
        rows={tasks || []}
        columns={columns}
        className={dataGridClassNames}
        sx={
          (dataGridSxStyles(isDarkMode === "dark" ? true : false),
          {
            gap: 10,
          })
        }
      />
    </div>
  );
};

export default TableView;
