import React from "react";
import Modal from "../Modal";
import { List, ListItem } from "@mui/material";

const TeamDetailsModal = ({
  isOpen,
  onClose,
  teamDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  teamDetails: {
    description: string;
    members: { userId: string; fullname: string }[];
  };
}) => {
  if (!isOpen || !teamDetails) return null;
  console.log(teamDetails);

  return (
    <Modal name="Team Details" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <p>
          <strong>Description:</strong> {teamDetails.description}
        </p>
        <p>
          <strong>Team Members:</strong>
        </p>
        <List>
          {teamDetails.members.map((member) => (
            <ListItem key={member.userId}>{member.fullname}</ListItem>
          ))}
        </List>
      </div>
    </Modal>
  );
};

export default TeamDetailsModal;
