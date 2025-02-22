import FileTypes from "@/lib/filesTypes";
import { Attachment } from "@/state/api";
import useAttachmentStore from "@/state/attachments.state";
import { Card } from "@mui/material";
import { File, X } from "lucide-react";
import Image from "next/image";
import { useShallow } from "zustand/shallow";

const AttachmentCard = ({ attachment }: { attachment: Attachment }) => {
  const removeAttachment = useAttachmentStore(
    useShallow((state) => state.removeAttachment),
  );
  console.log(`${attachment.file.name.split(".").pop()}`);
  return (
    <Card
      key={attachment.fileName}
      className="group relative flex w-full flex-col p-2"
    >
      <button
        className="absolute right-2 top-2 hidden rounded-full bg-red-500 p-1 text-white group-hover:block"
        onClick={() => removeAttachment(attachment)}
      >
        <X size={16} />
      </button>
      {attachment.file.type.startsWith("image/") ? (
        <Image
          src={URL.createObjectURL(attachment.file)}
          alt={attachment.file.name}
          width={200}
          height={200}
          className="place-self-center object-scale-down"
        />
      ) : (
        <div
          className="flex items-center gap-2"
          style={{
            color:
              FileTypes[`.${attachment.file.name.split(".").pop()?.trim()}`],
          }}
        >
          <File size={24} />
          <span className="max-w-full truncate">{attachment.file.name}</span>
        </div>
      )}
      {attachment.description && (
        <div className="mt-1 w-full max-w-full overflow-x-auto whitespace-nowrap rounded-md bg-gray-200 p-1 text-sm">
          {attachment.description}
        </div>
      )}
    </Card>
  );
};
export default AttachmentCard;
