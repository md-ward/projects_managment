import { create } from "zustand";
import { Attachment, Task } from "./api";
import axios from "axios";
import useAlertStore from "./alert.state";
import useAttachmentStore from "./attachments.state";
interface TaskStore {
  currentUserTasks: Task[] | null;
  isDeleteTaskModalOpen: boolean;
  deleteTaskId: number | null;
  isEditMode: boolean;
  isModalNewTaskOpen: boolean;
  task: Task | null;
  tasks: Task[];
  isLoading: boolean;
  isError: string | null;
  updateTask: () => void;
  getCurrentUserTasks: () => Promise<void>;
  deleteTask: () => void;
  toggleDeleteTaskModal: (taskId: number | null) => void;
  clearTask(): void;
  toggleModal: (isEditMode: boolean, task?: Task | null) => void;
  setTask: (task: Partial<Task>) => void;
  setTasks: (tasks: Task[]) => void;
  createTask: () => void;
  getTasks: (projectId: number) => void;
  getTasksViaPriority: (priority: string) => Promise<Task[]>;
  updateTaskStatus: (taskId: number, status: string) => void;
  uploadedAttachmentsPercentage: number | null;
}

const useTaskStore = create<TaskStore>((set, get) => ({
  uploadedAttachmentsPercentage: null,
  task: null,
  isLoading: false,
  isError: null,
  isModalNewTaskOpen: false,
  isEditMode: false,
  tasks: [],
  deleteTaskId: null,
  isDeleteTaskModalOpen: false,
  currentUserTasks: null,

  setTask: (taskData) => {
    set((state: TaskStore) => ({
      task: { ...state.task, ...taskData } as Task,
    }));
  },

  getTasksViaPriority: async (priority) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/priority/${priority}`,
        {
          withCredentials: true,
        },
      );

      return response.data as Task[];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      set({ isError: (error as any).message, isLoading: false });
      return [];
    }
  },
  toggleModal: (isEditMode, task) => {
    if (isEditMode) set({ task, isEditMode });
    if (!isEditMode) set({ task: null, isEditMode });

    set((state: TaskStore) => ({
      isModalNewTaskOpen: !state.isModalNewTaskOpen,
    }));
    useAttachmentStore.getState().clearAttachment();
  },
  clearTask: () => set({ task: null }),

  setTasks: (tasks: Task[]) => set({ tasks }),
  createTask: async () => {
    try {
      const currentTask = useTaskStore.getState().task;
      if (currentTask) {
        set({
          task: {
            ...currentTask,

            attachments: useAttachmentStore.getState()
              .attachments as Attachment[],
          },
        });
      }

      set({ isLoading: true, isError: null });
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks`,
        { data: useTaskStore.getState().task },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            "Cache-Control": "max-age=3600",
          },
          onUploadProgress: (progressEvent) => {
            progressEvent.total &&
              set({
                uploadedAttachmentsPercentage: Math.floor(
                  (progressEvent.loaded / progressEvent.total) * 100,
                ),
              });
          },
        },
      );

      set({
        tasks: [...useTaskStore.getState().tasks, response.data.task],
        isLoading: false,
        uploadedAttachmentsPercentage: null,
      });
      useAlertStore.getState().showAlert({
        message: "Task created successfully",
        alertType: "success",
      });
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      useTaskStore.getState().toggleModal(false);
      useTaskStore.getState().clearTask();
      set({ isLoading: false });
    }
  },
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

  toggleDeleteTaskModal: (taskId) => {
    set((state) => ({
      isDeleteTaskModalOpen: !state.isDeleteTaskModalOpen,
      deleteTaskId: taskId,
    }));
  },

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

  updateTask() {
    try {
      const task = {
        title: get().task?.title,
        description: get().task?.description,
        status: get().task?.status,
        dueDate: get().task?.dueDate,
        startDate: get().task?.startDate,
        priority: get().task?.priority,
        tags: get().task?.tags,
        assignedUserId: get().task?.assignedUserId,
      } as Task;
      axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${useTaskStore.getState().task?.id ?? ""}`,
        { task },
        {
          withCredentials: true,
        },
      );
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === useTaskStore.getState().task?.id
            ? { ...task, ...useTaskStore.getState().task }
            : task,
        ),
        isModalNewTaskOpen: false,
      }));
      useAlertStore.getState().showAlert({
        message: "Task updated successfully",
        alertType: "success",
      });
    } catch (error) {
      useAlertStore
        .getState()
        .showAlert({ message: "Error updating task", alertType: "error" });
    }
  },
}));
export default useTaskStore;
