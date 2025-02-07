import { create } from "zustand";
import { Status, Task } from "./api";
import axios from "axios";
import useAlertStore from "./alert.state";
interface TaskStore {
  currentUserTasks: Task[] | null;
  getCurrentUserTasks: () => Promise<void>;
  deleteTask: () => void;
  isDeleteTaskModalOpen: boolean;
  deleteTaskId: number | null;
  toggleDeleteTaskModal: (taskId: number | null) => void;
  clearTask(): void;
  toggleModal(): void;
  isModalNewTaskOpen: boolean;
  task: Task | null;
  setTask: (task: Partial<Task>) => void;
  setTasks: (tasks: Task[]) => void;
  createTask: () => void;
  tasks: Task[];
  getTasks: (projectId: number) => void;
  isLoading: boolean;
  isError: string | null;
  updateTaskStatus: (taskId: number, status: string) => void;
}

const useTaskStore = create<TaskStore>((set, get) => ({
  task: null,
  setTask: (taskData) => {
    set((state) => ({ task: { ...state.task, ...taskData } as Task }));
  },
  isModalNewTaskOpen: false,
  toggleModal: () => {
    set((state) => ({ isModalNewTaskOpen: !state.isModalNewTaskOpen }));
  },
  clearTask: () => set({ task: null }),

  setTasks: (tasks) => set({ tasks }),
  createTask: async () => {
    try {
      set({ isLoading: true, isError: null });
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks`,
        { data: useTaskStore.getState().task },
        {
          withCredentials: true,
        },
      );

      set({
        tasks: [...useTaskStore.getState().tasks, response.data.task],
        isLoading: false,
      });
      useAlertStore.getState().showAlert({
        message: "Task created successfully",
        alertType: "success",
      });
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      useTaskStore.getState().toggleModal();
      useTaskStore.getState().clearTask();
      set({ isLoading: false });
    }
  },
  tasks: [],
  getTasks: async (projectId) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/?query=${projectId}`,
        {
          withCredentials: true,
        },
      );

      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      set({ isError: (error as any).message, isLoading: false });
    }
  },
  isLoading: false,
  isError: null,
  updateTaskStatus(taskId, status) {
    try {
      axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${taskId}/status`,
        { status },
        {
          withCredentials: true,
        },
      );
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, status } : task,
        ),
      }));
    } catch (error) {
      useAlertStore
        .getState()
        .showAlert({ message: "Error updating task", alertType: "error" });
    }
  },
  deleteTask: async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${get().deleteTaskId}`,
        {
          withCredentials: true,
        },
      );

      set({
        tasks: get().tasks.filter((task) => task.id !== get().deleteTaskId),
        deleteTaskId: null,
      });

      useAlertStore.getState().showAlert({
        message: "Task deleted successfully",
        alertType: "success",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      set({ isError: (error as any).message, isLoading: false });
    } finally {
      useTaskStore.getState().toggleDeleteTaskModal(null);
    }
  },
  deleteTaskId: null,
  isDeleteTaskModalOpen: false,
  toggleDeleteTaskModal: (taskId) => {
    set((state) => ({
      isDeleteTaskModalOpen: !state.isDeleteTaskModalOpen,
      deleteTaskId: taskId,
    }));
  },

currentUserTasks: null,
  getCurrentUserTasks: async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/user`,
        {
          withCredentials: true,
        },
      );
      set({ currentUserTasks: response.data });
    } catch (error) {
      console.error("Error fetching current user tasks:", error);
    }
  },


}));
export default useTaskStore;
