import { create } from "zustand";
import { Attachment } from "./api";
interface AttachmentStore {
  attachments: Attachment[];
  attachment: Attachment | null;
  setAttachment: (attachment: Partial<Attachment> | null) => void;
  confirmAttachment: (confirmation: boolean) => void;
  clearAttachment: () => void;
  removeAttachment: (attachment: Attachment) => void;
}

const useAttachmentStore = create<AttachmentStore>((set, get) => ({
  attachments: [],
  attachment: null,
  clearAttachment() {
    set({ attachment: null, attachments: [] });
  },
  removeAttachment: (attachment) => {
    set((state) => ({
      attachments: state.attachments.filter((a) => a.file !== attachment.file),
    }));
  },
  setAttachment: (attachment) =>
    set((state) => ({ ...state, attachment: attachment as Attachment | null })),
  confirmAttachment: (confirmation) => {
    const attachment = get().attachment;
    if (confirmation) {
      set((state) => ({
        attachments: attachment
          ? [...state.attachments, attachment]
          : state.attachments,
        attachment: null,
      }));
    } else {
      set((state) => ({ attachment: null }));
    }
  },
}));
export default useAttachmentStore;
