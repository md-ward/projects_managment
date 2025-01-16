import { create } from "zustand";
interface SidebarStore {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
  isSidebarCollapsed: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));

export default useSidebarStore;
