import { create } from "zustand";
import { Team } from "./api";
import axios from "axios";
import useAlertStore from "./alert.state";

interface TeamStore {
  teams: Team[];
  isLoading: boolean;
  isError: boolean | null;
  getTeams: () => Promise<void>;
  newTeam: (team: Team) => void;
}

const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  isLoading: false,
  isError: null,
  newTeam: async (team) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/teams/`,
        team,
        {
          withCredentials: true,
        },
      );
      set({ newTeam: response.data, isLoading: false });
      useAlertStore.getState().showAlert({
        message: `Team ${team.teamName} has been created successfully`,
        alertType: "success",
      });
    } catch (error) {
      console.error("Error creating team:", error);
      set({ isError: true, isLoading: false });
    }
  },

  getTeams: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/teams/`,
        {
          credentials: "include",
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const teams = await response.json();
      console.log("teams", teams);

      set({ teams, isLoading: false });
    } catch (error) {
      console.error("Error fetching teams:", error);
      set({ isError: true, isLoading: false });
    }
  },
}));

export default useTeamStore;
