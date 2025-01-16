import { create } from "zustand";
import { Project, Team } from "./api";
import axios from "axios";
import useTaskStore from "./task.state";

interface ProjectStore {
  projectDetails: Partial<Project> | null;
  setProjectDetails: (formFieldData: Partial<Project>) => void;
  clearProjectDetails: () => void;
  isModalOpen: boolean;
  toggleModal: () => void;
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  currentProject?: Project | null;

  currentProjectTeams: Team[] | null;
  getCurrentProjectTeams: () => Promise<void>;
  getProject: (projectId: number) => Promise<void>;
  getProjects: () => Promise<void>;
  createProject: () => Promise<void>;
}

const useProjectStore = create<ProjectStore>((set) => ({
  // ! This is the initial state of the store
  //! 1. handle the form data for creating a new project
  projectDetails: null,
  setProjectDetails: (formFieldData) =>
    set((state) => ({
      projectDetails: { ...state.projectDetails, ...formFieldData },
    })),
  clearProjectDetails: () => set({ projectDetails: null }),
  // ! 2. handle the modal state
  isModalOpen: false,
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),

  // ! 3. handle the projects data
  projects: [],
  isLoading: false,
  error: null,
  currentProject: null,
  currentProjectTeams: null,
  getProject: async (projectId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}`,
        {
          withCredentials: true,
        },
      );
      set({
        currentProject: response.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  createProject: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/`,
        useProjectStore.getState().projectDetails,
        {
          withCredentials: true,
        },
      );
      set({
        projects: [
          response.data.project,
          ...useProjectStore.getState().projects,
        ],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      set({ error: (error as Error).message, isLoading: false });
    } finally {
      useProjectStore.getState().toggleModal();
      useProjectStore.getState().clearProjectDetails();
    }
  },
  getProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/`,
        { withCredentials: true },
      );
      if (!response.statusText.startsWith("OK")) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.data;
      set({ projects: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching projects:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  getCurrentProjectTeams() {
    return new Promise<void>((resolve, reject) => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/teams/project/${useProjectStore.getState().currentProject?.id}`,
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          if (!response.statusText.startsWith("OK")) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = response.data;
          set({ currentProjectTeams: data });
          resolve();
        })
        .catch((error) => {
          console.error("Error fetching teams:", error);
          reject(error);
        });
    });
  },
}));

export default useProjectStore;
