import React from "react";
import Modal from "../Modal";
import { List, ListItem, Avatar, Typography } from "@mui/material";
import { BriefcaseBusinessIcon, CircleUserIcon } from "lucide-react";

const TeamDetailsModal = ({
  isOpen,
  onClose,
  teamDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  teamDetails: {
    projectName: string;
    description: string;
    members: { userId: string; fullname: string }[];
  };
}) => {
  if (!isOpen || !teamDetails) return null;

  return (
    <Modal name="Team Details" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 rounded-2xl bg-white p-6 shadow-lg dark:bg-dark-tertiary dark:text-white">
        {/* Project Name */}
        <div className="flex items-center space-x-2">
          <BriefcaseBusinessIcon className="text-gray-600 dark:text-white" />
          <Typography variant="h6" className="font-semibold">
            {teamDetails.projectName}
          </Typography>
        </div>

        {/* Description */}
        <div className="flex items-center space-x-2">
          <Typography
            variant="body1"
            className="text-gray-700 dark:text-gray-300"
          >
            {teamDetails.description}
          </Typography>
        </div>

        {/* Team Members */}
        <div>
          <div className="flex items-center space-x-2">
            <CircleUserIcon className="text-gray-600 dark:text-white" />
            <Typography variant="subtitle1" className="font-semibold">
              Team Members
            </Typography>
          </div>

          <List className="mt-2 space-y-2">
            {teamDetails.members.map((member) => (
              <ListItem
                key={member.userId}
                className="rounded-lg bg-gray-100 p-3 shadow-sm dark:bg-gray-400"
              >
                <Avatar className="mr-3 bg-blue-500">
                  {member.fullname.charAt(0)}
                </Avatar>
                <Typography
                  variant="body1"
                  className="text-gray-800 dark:text-white"
                >
                  {member.fullname}
                </Typography>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </Modal>
  );
};

export default TeamDetailsModal;
