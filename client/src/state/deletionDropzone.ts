import { create } from "zustand";
interface DeletionDropzoneState {
    isDropzoneOpen: boolean;
    setDropzoneOpen: (isOpen: boolean) => void;
}

const useDeletionDropzone = create<DeletionDropzoneState>((set) => ({
  isDropzoneOpen: false,
  setDropzoneOpen: (isOpen: boolean) => set({ isDropzoneOpen: isOpen }),
}));

export default useDeletionDropzone;
