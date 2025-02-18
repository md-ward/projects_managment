import Header from "@/components/Header";
import useAttachmentStore from "@/state/attachments.state";
import { TextField, Button, Box, Card } from "@mui/material";
import { Check,  Plus, X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import AttachmentCard from "../AttachmentsCard";

const AttachmentModal = () => {
  const {
    attachment,
    attachments,
    setAttachment,
    confirmAttachment,
    
  } = useAttachmentStore();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAddAttachment(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileURL = URL.createObjectURL(file);
      setAttachment({ file, fileURL, fileName: file.name });
    }
  }

  return (
    <motion.div
      className="flex h-full w-1/4 flex-col rounded-md bg-white p-4 align-top shadow-md"
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0, scaleX: 0 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
    >
      <Header
        name="Add Attachment"
        buttonComponent={
          <button onClick={() => inputRef.current?.click()}>
            <Plus />
          </button>
        }
      />

      <input
        ref={inputRef}
        type="file"
        name="attachment"
        className="hidden"
        onChange={handleAddAttachment}
      />

      <div className="mt-4 flex flex-col gap-2 overflow-hidden">
        <label htmlFor="attachment">Attachments</label>

        {attachment && (
          <>
            <div className="place-self-center">
              {attachment.file.type.startsWith("image/") ? (
                <Image
                  src={attachment.fileURL}
                  alt={attachment.file.name}
                  width={100}
                  height={100}
                />
              ) : (
                <a
                  href={attachment.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {attachment.file.name}
                </a>
              )}
            </div>
            <TextField
              label="Description (Optional)"
              variant="outlined"
              fullWidth
              value={attachment.description || ""}
              onChange={(e) =>
                setAttachment({ ...attachment, description: e.target.value })
              }
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => confirmAttachment(false)}
              >
                <X />
              </Button>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  confirmAttachment(true);
                  // TODO: Add description to attachment
                }}
              >
                <Check />
              </Button>
            </Box>
          </>
        )}
        <div className="flex   flex-wrap gap-2 overflow-y-auto p-2">
          {attachments.map((attachment, index) => (
            <AttachmentCard key={index} attachment={attachment} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AttachmentModal;
