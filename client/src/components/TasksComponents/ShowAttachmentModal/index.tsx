import { useState } from "react";
import Modal from "@/components/Modal";
import { Attachment } from "@/state/api";
import Image from "next/image";

const ViewAttachmentsModal = ({
  attachments,
  isOpen,
  onClose,
}: {
  attachments: Attachment[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [downloadProgress, setDownloadProgress] = useState<{
    [key: string]: number;
  }>({});

  // Function to check if the file is an image
  const isImage = (fileName: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
  };

  // Separate attachments into images and other files
  const imageAttachments = attachments.filter((att) =>
    isImage(att.fileName ?? ""),
  );
  const fileAttachments = attachments.filter(
    (att) => !isImage(att.fileName ?? ""),
  );

  // Function to download a file with progress tracking
  const downloadFile = async (attachment: Attachment) => {
    const url = attachment.fileURL;
    const fileName = attachment.fileName;

    try {
      const response = await fetch(url);
      const reader = response.body?.getReader();
      const contentLength = response.headers.get("Content-Length");

      if (!reader || !contentLength) throw new Error("Failed to download");

      const totalBytes = parseInt(contentLength, 10);
      let receivedBytes = 0;
      let chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedBytes += value.length;

        // Calculate and update progress percentage
        setDownloadProgress((prev) => ({
          ...prev,
          [fileName ?? ""]: Math.round((receivedBytes / totalBytes) * 100),
        }));
      }

      // Create a blob and trigger download
      const blob = new Blob(chunks);
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName ?? "";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <Modal name="Attachments" isOpen={isOpen} onClose={onClose}>
      <div className="min-h-96 space-y-4">
        {imageAttachments.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-semibold">Images</h3>
            <div className="relative w-full overflow-hidden">
              <div className="flex w-full snap-x snap-mandatory overflow-x-auto">
                {imageAttachments.map((attachment) => (
                  <div
                    key={attachment.fileName}
                    className="flex w-full flex-col  flex-shrink-0 snap-center items-center justify-center p-4"
                  >
                    <Image
                      width={400}
                      height={400}
                      src={attachment.fileURL}
                      alt={attachment.fileName ?? "image"}
                      className="h-64 w-64 rounded-lg border object-cover aspect-auto shadow-sm"
                    />
                    {attachment.description && (
                      <p className="mt-2 text-center text-sm bg-gray-200 p-2 rounded-md w-full">
                        {attachment.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Files Section */}
        {fileAttachments.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-semibold">Files</h3>
            <div className="space-y-2">
              {fileAttachments.map((attachment) => (
                <div
                  key={attachment.fileName}
                  className="flex items-center justify-between rounded-lg border p-2 shadow-sm"
                >
                  <span className="truncate">{attachment.fileName}</span>
                  <button
                    onClick={() => downloadFile(attachment)}
                    className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    {downloadProgress[attachment.fileName ?? ""]
                      ? `Downloading ${downloadProgress[attachment.fileName ?? ""]}%`
                      : "Download"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewAttachmentsModal;
