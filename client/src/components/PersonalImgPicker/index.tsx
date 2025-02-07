"use client";
import { useAuthStore } from "@/state/auth";
import { Divider } from "@aws-amplify/ui-react";
import {
  Card,
  TextField,
  Box,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Camera, Edit2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "@/state/api";
import { useShallow } from "zustand/shallow";
import imgUrlChecker from "@/lib/imgUrlChecker";

const SettingsForm = () => {
  const { currentUser, updateUser,  } = useAuthStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      updateUser: state.updateUser,
    })),
  );
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    image: File | null;
    username: string;
  }>({
    fullName: currentUser?.fullname || "",
    email: currentUser?.email || "",
    image: null,
    username: currentUser?.username || "",
  });
  const [previewImage, setPreviewImage] = useState(
    currentUser?.profilePictureUrl,
  );
  const [isEditable, setIsEditable] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData({ ...formData, image: file });

      console.log("Uploading Image:", imageUrl);
    }
  };

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Handle image upload logic (e.g., send to server or S3 bucket)

    console.log("Uploading Image:", formData.image);
    updateUser({
      ...formData,
      user: currentUser?.user || "",
    } as User);

    updateUser({
      ...formData,
      user: currentUser?.user || "",
    });
  };
  return (
    <Card className="flex w-full max-w-2xl flex-col items-center space-y-6 place-self-center p-6">
      <form
        className="relative flex flex-col items-center gap-2"
        onSubmit={handleSubmit}
      >
        {/* Profile Picture Picker */}
        <span className="absolute right-0 top-0 z-30 size-11 rounded-md bg-blue-400">
          <IconButton className="text-white" onClick={handleEditToggle}>
            <AnimatePresence mode="wait">
              {!isEditable ? (
                <motion.div
                  key={"edit"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Edit2 />
                </motion.div>
              ) : (
                <motion.div
                  key={"close"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X />
                </motion.div>
              )}
            </AnimatePresence>
          </IconButton>
        </span>
        <div
          title="Change profile picture"
          className="group relative size-40 overflow-hidden rounded-full"
        >
          <Image
            src={
              imgUrlChecker(previewImage as string)  ||
              imgUrlChecker(currentUser?.profilePictureUrl as string) ||
              "/default-profile.png"
            }
            alt="profile picture"
            width={160}
            height={160}
            loading="lazy"
            className="aspect-square h-full rounded-full object-fill"
          />
          {isEditable && (
            <label
              htmlFor="profile-img-upload"
              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-opacity-50 text-white"
            >
              <Camera />
              <input
                id="profile-img-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        <Divider />

        {/* Form Fields */}
        <Box
          sx={{
            color: "black",
            zIndex: 10,
            display: "flex",
            justifyContent: "start",
            flexWrap: "wrap",
            gap: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              flexBasis: "50%",
              width: "100%",
            }}
          >
            <Typography sx={{ flex: 0.5 }} variant="h6">
              Name
            </Typography>
            <TextField
              name="fullName"
              value={formData.fullName || currentUser?.fullname}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              disabled={!isEditable}
              sx={{ flex: 0.5 }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              flexBasis: "50%",
              width: "100%",
            }}
          >
            <Typography sx={{ flex: 0.5 }} variant="h6">
              User Name
            </Typography>
            <TextField
              name="username"
              value={formData.username || currentUser?.username}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              disabled={!isEditable}
              sx={{ flex: 0.5 }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              flexBasis: "100%",
              width: "100%",
            }}
          >
            <Typography sx={{ flex: 0.5 }} variant="h6">
              Email
            </Typography>
            <TextField
              name="email"
              value={formData.email || currentUser?.email}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
              disabled={!isEditable}
              sx={{ flex: 0.5 }}
            />
          </Box>
        </Box>
        <Divider />

        {/* Save Button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            width: "100%",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isEditable}
          >
            Save Changes
          </Button>
        </Box>
      </form>
    </Card>
  );
};

export default SettingsForm;
