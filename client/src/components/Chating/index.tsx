import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useChatStore } from "./mockState/state";
import { X } from "lucide-react";
import { useEffect } from "react";

const AnchorPoints = {
  TopRight: "top-2 right-2",
  TopLeft: "top-2 left-2",
  BottomRight: "bottom-2 right-2",
  BottomLeft: "bottom-2 left-2",
};

interface ChattingElementProps {
  AnchorEl: keyof typeof AnchorPoints;
  withAnimation?: boolean;
  isChatModalOpen: boolean;
  closeChatModal: () => void;
}

const ChattingElement = ({
  AnchorEl,
  withAnimation = true,
  isChatModalOpen,
  closeChatModal,
}: ChattingElementProps) => {
  const { openChats, connectedUsers, closeChat, loadMockData } = useChatStore();
  useEffect(() => {
    loadMockData();
  }, [loadMockData]);

  return (
    <AnimatePresence mode="wait">
      {isChatModalOpen == true ? (
        <motion.div
          initial={withAnimation ? { opacity: 0, scale: 0.9 } : {}}
          animate={{ opacity: 1, scale: 1 }}
          exit={withAnimation ? { opacity: 0, scale: 0.9 } : {}}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`fixed ${AnchorPoints[AnchorEl]} z-50`}
        >
          <Card className="w-80 overflow-hidden rounded-lg shadow-lg">
            <CardHeader
              title="Chatting"
              avatar={<Avatar>💬</Avatar>}
              action={
                <IconButton onClick={closeChatModal}>
                  <X />
                </IconButton>
              }
            />
            <CardContent>
              {/* Connected Users */}
              <Typography variant="subtitle1" className="mb-2">
                Online Users ({connectedUsers.length})
              </Typography>
              <List>
                {connectedUsers.map((user: any) => (
                  <ListItem key={user.id}>
                    <ListItemAvatar>
                      <Badge color="success" variant="dot" overlap="circular">
                        <Avatar>{user.name[0]}</Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} />
                  </ListItem>
                ))}
              </List>

              {/* Open Chats */}
              {openChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b p-2"
                >
                  <Typography variant="body1">{chat.name}</Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {chat.lastMessage}
                  </Typography>
                  <IconButton onClick={() => closeChat(chat.id)} size="small">
                    <X fontSize="small" />
                  </IconButton>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ChattingElement;
