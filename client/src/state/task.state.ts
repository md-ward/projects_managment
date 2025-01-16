import { create } from "zustand";
import { Status, Task } from "./api";
import axios from "axios";
import useAlertStore from "./alert.state";
interface TaskStore {
  deleteTask: () => void;
  isDeleteTaskModalOpen: boolean;
  deleteTaskId: number | null;
  toggleDeleteTaskModal: (taskId: number | null) => void;
  clearTask(): void;
  toggleModal(): void;
  isModalNewTaskOpen: boolean;
  task: Task | null;
  setTask: (task: Partial<Task>) => void;
  createTask: () => void;
  tasks: Task[];
  getTasks: (projectId: number) => void;
  isLoading: boolean;
  isError: string | null;
  updateTaskStatus: (taskId: number, status: Status) => void;
}

const useTaskStore = create<TaskStore>((set) => ({
  task: null,
  setTask: (taskData) => {
    set((state) => ({ task: { ...state.task, ...taskData } as Task }));
  },
  isModalNewTaskOpen: false,
  toggleModal: () => {
    set((state) => ({ isModalNewTaskOpen: !state.isModalNewTaskOpen }));
  },
  clearTask: () => set({ task: null }),

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
      useAlertStore
        .getState()
        .showAlert("Task created successfully", "success");
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
      console.log("Tasks:", response.data);

      set({ tasks: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      set({ isError: (error as any).message, isLoading: false });
    }
  },
  isLoading: false,
  isError: null,
  updateTaskStatus(taskId: number, status: Status) {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    }));
  },
  deleteTask: async () => {
    try {
      // set({ isLoading: true, isError: null });
      const id = useTaskStore.getState().deleteTaskId;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${id}`,
        {
          withCredentials: true,
        },
      );
      set({
        tasks: useTaskStore.getState().tasks.filter((task) => task.id !== id),
        // isLoading: false,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      set({ isError: (error as any).message, isLoading: false });
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
}));
export default useTaskStore;
