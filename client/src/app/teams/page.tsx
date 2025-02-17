"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import useModeStore from "@/state/mode.state";
import useTeamStore from "@/state/teams.state";
import ModalNewTeam from "@/components/ModalNewTeam";
import TeamDetailsModal from "@/components/TeamDetailsModal";
import { useShallow } from "zustand/shallow";
import useProjectStore from "@/state/project.state";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
  </GridToolbarContainer>
);

const Teams = () => {
  interface TeamDetails {
    projectName: string;
    description: string;
    members: { userId: string; fullname: string }[];
  }

  const { teams, getTeams } = useTeamStore(
    useShallow((state) => ({
      teams: state.teams,
      getTeams: state.getTeams,
    })),
  );
  const [selectedTeam, setSelectedTeam] = useState<TeamDetails | null>(null);
  const [teamDetailsModalOpen, setTeamDetailsModalOpen] =
    useState<boolean>(false);
  const projects = useProjectStore((state) => state.projects);
  const userProjectId = projects.map(
    (project: any) => project.projectManagerId,
  );

  useEffect(() => {
    getTeams();
  }, [getTeams]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isDarkMode = useModeStore((state) => state.isDarkMode);

  const handleViewDetails = (team: any) => {
    console.log({team});
    
    const teamDetails: TeamDetails = {
      projectName: team.projectName,
      description: team.description,
      members: team.teamMembers.map((member: any) => ({
        userId: member.user.userId,
        fullname: member.user.fullname,
      })),
    };
    setSelectedTeam(teamDetails);
    setTeamDetailsModalOpen(true);
  };

  const columns: GridColDef[] = [
    { field: "teamName", headerName: "Team Name", width: 200 },
    { field: "productOwnerUsername", headerName: "Product Owner", width: 200 },
    {
      field: "projectManagerUsername",
      headerName: "Project Manager",
      width: 200,
    },
    {
      field: "membersCount",
      headerName: "Team Members Count",
      width: 300,
      renderCell: (params) => (
        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
          {params.row.teamMembers.length} members
        </span>
      ),
    },
    {
      field: "Details",
      headerName: "Details",
      width: 150,
      renderCell: (params) => (
        <div className="flex h-16 w-full items-center justify-center justify-items-center">
          <button
            className="relative h-8 w-full rounded-md bg-blue-500 p-3 text-center text-white hover:bg-blue-600"
            onClick={() => handleViewDetails(params.row)}
          >
            <p className="absolute inset-0 flex items-center justify-center">
              {" "}
              View Details{" "}
            </p>
          </button>
        </div>
      ),
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="flex h-16 w-full items-center justify-center justify-items-center">
          {userProjectId.includes(params.row.projectManagerUserId) && (
            <button
              className="relative h-8 w-full rounded-md bg-blue-500 p-3 text-center text-white hover:bg-blue-600"
              onClick={() => handleViewDetails(params.row)}
            >
              <p className="absolute inset-0 flex items-center justify-center">
                {" "}
                Edit{" "}
              </p>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col p-8">
      <Header
        name="Teams"
        buttonComponent={
          <button
            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsOpen(true)}
          >
            New team
          </button>
        }
      />
      <ModalNewTeam
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      ></ModalNewTeam>

      {selectedTeam && (
        <TeamDetailsModal
          isOpen={teamDetailsModalOpen}
          onClose={() => setTeamDetailsModalOpen(false)}
          teamDetails={selectedTeam}
        />
      )}
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={teams || []}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode === "dark" ? true : false)}
        />
      </div>
    </div>
  );
};

export default Teams;
