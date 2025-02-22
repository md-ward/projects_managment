import React, { useEffect, useState } from "react";
import { Team, User } from "@/state/api";
import useProjectStore from "@/state/project.state";
import { useShallow } from "zustand/shallow";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import useTaskStore from "@/state/task.state";

const ProjectTeamsList: React.FC = () => {
  const { currentProjectTeams, getCurrentProjectTeams } = useProjectStore(
    useShallow((state) => ({
      currentProjectTeams: state.currentProjectTeams,
      getCurrentProjectTeams: state.getCurrentProjectTeams,
    })),
  );

  const [selectedTeam, setSelectedTeam] = useState<number | null>(null); // Selected team ID
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<User[]>([]); // Array of users
  const { setTask, task, isEditMode } = useTaskStore(
    useShallow((state) => ({
      setTask: state.setTask,
      task: state.task,
      isEditMode: state.isEditMode,
    })),
  );
  useEffect(() => {
    getCurrentProjectTeams();
  }, [getCurrentProjectTeams]);

  useEffect(() => {
    if (isEditMode) {
      setSelectedTeam(task?.teamId ?? null);
    }
    if (selectedTeam !== null) {
      const team = currentProjectTeams?.find(
        (t: Team) => t.id === selectedTeam,
      );
      const members =
        team?.teamMembers?.map((member: User) => member.user) ?? [];
      setSelectedTeamMembers(members);
    } else {
      setSelectedTeamMembers([]);
    }
  }, [selectedTeam, currentProjectTeams, isEditMode, task]);

  return (
    <Box sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Project Teams List
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Team Selector */}
        <FormControl fullWidth>
          <InputLabel id="team-select-label">Select a Team</InputLabel>
          <Select
            labelId="team-select-label"
            value={selectedTeam || ""}
            onChange={(e) => {
              setSelectedTeam(Number(e.target.value));
              setTask({ teamId: Number(e.target.value) });
            }}
            label="Select a Team"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {currentProjectTeams?.map((team: Team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.teamName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Team Members Selector */}
        <FormControl fullWidth disabled={!selectedTeam}>
          <InputLabel id="team-member-select-label">
            Select a Team Member
          </InputLabel>
          <Select
            labelId="team-member-select-label"
            value={task?.assignedUserId || ""}
            onChange={(e) => {
              setTask({ assignedUserId: Number(e.target.value) });
            }}
            label="Select a Team Member"
          >
            {selectedTeamMembers.map((member: User) => (
              <MenuItem key={member.userId} value={member.userId}>
                {member.fullname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default ProjectTeamsList;
