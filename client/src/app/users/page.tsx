"use client";
import React, { useEffect } from "react";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Image from "next/image";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import useModeStore from "@/state/mode.state";
import useUserStore from "@/state/user.state";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 100 },
  { field: "username", headerName: "Username", width: 150 },
  {
    field: "profilePictureUrl",
    headerName: "Profile Picture",
    width: 100,
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-9 w-9">
          {params.row.profilePictureUrl ? (
            <Image
              src={("/" + params.row.profilePictureUrl) as string}
              alt={params.row.username}
              title={params.row.username}
              width={100}
              height={50}
              className="h-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="flex size-9 justify-center rounded-full bg-orange-500 text-center">
                <p className="text-2xl text-white">
                  {params.row.username?.charAt(0).toUpperCase()}
                </p>{" "}
              </span>
            </div>
          )}
        </div>
      </div>
    ),
  },
];

const Users = () => {
  const { data: users, isLoading, isError, getUsers } = useUserStore();
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const isDarkMode = useModeStore((state) => state.isDarkMode);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !users) return <div>Error fetching users</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          getRowId={(row) => row.userId}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode == "dark" ? true : false)}
        />
      </div>
    </div>
  );
};

export default Users;
