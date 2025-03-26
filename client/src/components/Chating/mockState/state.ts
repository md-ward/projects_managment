import { create } from "zustand";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
}

interface User {
  id: string;
  name: string;
}

interface ChatStore {
  openChats: Chat[];
  connectedUsers: User[];
  addChat: (chat: Chat) => void;
  closeChat: (id: string) => void;
  setConnectedUsers: (users: User[]) => void;
  loadMockData: () => void; // Function to load temporary data
  isChatModalOpen: boolean;
  closeChatModal: () => void;
  openChatModal: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isChatModalOpen: false,
  closeChatModal: () => set(() => ({ isChatModalOpen: false })),
  openChatModal: () => set(() => ({ isChatModalOpen: true })),
  openChats: [],
  connectedUsers: [],

  addChat: (chat) =>
    set((state) => ({
      openChats: [...state.openChats, chat],
    })),

  closeChat: (id) =>
    set((state) => ({
      openChats: state.openChats.filter((chat) => chat.id !== id),
    })),

  setConnectedUsers: (users) =>
    set(() => ({
      connectedUsers: users,
    })),

  loadMockData: () =>
    set(() => ({
      connectedUsers: [
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
        { id: "3", name: "Charlie" },
      ],
      openChats: [
        { id: "101", name: "Alice", lastMessage: "Hey, how are you?" },
        { id: "102", name: "Bob", lastMessage: "Let's meet tomorrow!" },
      ],
    })),
}));
