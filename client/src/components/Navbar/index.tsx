import {
  LucidePlusCircle,
  Menu,
  MessageCircleIcon,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import Link from "next/link";

import useModeStore from "@/state/mode.state";
import useSidebarStore from "@/state/sidebar.state";
import { useAuthStore } from "@/state/auth";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import ModalNewProject from "@/components/ProjectComponents/ModalNewProject";
import useProjectStore from "@/state/project.state";
import imgUrlChecker from "@/lib/imgUrlChecker";
import AnimatedSwitchingButton from "../AnimatedSwitchingButton";
import { IconButton } from "@mui/material";
import { useChatStore } from "../Chating/mockState/state";

const Navbar = () => {
  const { isDarkMode, setIsDarkMode } = useModeStore((state) => state);
  const { isSidebarCollapsed, toggleSidebar } = useSidebarStore();
  const { toggleModal } = useProjectStore(
    useShallow((state) => ({
      toggleModal: state.toggleModal,
    })),
  );
  const { signOut, user } = useAuthStore(
    useShallow((state) => ({
      signOut: state.signOut,
      user: state.currentUser,
    })),
  );
  const handleSignOut = async () => {
    try {
      signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  const { openChatModal } = useChatStore(
    useShallow((state) => ({ openChatModal: state.openChatModal })),
  );

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 dark:bg-dark-secondary">
      {/* Search Bar */}
      <div className="flex items-center gap-8">
        {!isSidebarCollapsed ? null : (
          <button onClick={() => toggleSidebar()}>
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}
        <div className="relative flex h-min w-[200px]">
          <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
          <input
            className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
            type="search"
            placeholder="Search..."
          />
        </div>

        <div
          onClick={() => toggleModal()}
          title="new project"
          className="animate-pulse cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 hover:animate-none dark:text-white"
        >
          <LucidePlusCircle></LucidePlusCircle>
        </div>
        <ModalNewProject />
      </div>

      {/* Icons */}
      <div className="flex items-center">
        <IconButton onClick={() => openChatModal()}>
          <MessageCircleIcon></MessageCircleIcon>
        </IconButton>

        {/* animated button to toggle mode dark | light   */}
        <AnimatedSwitchingButton
          isEditable={Boolean(isDarkMode === "dark")}
          handleEditToggle={setIsDarkMode}
          FirstIcon={
            <Sun className="h-6 w-6 cursor-pointer text-black dark:text-white" />
          }
          SecondIcon={
            <Moon className="h-6 w-6 cursor-pointer text-black dark:text-white" />
          }
        />

        <Link
          href="/settings"
          className={
            isDarkMode
              ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
              : `h-min w-min rounded p-2 hover:bg-gray-100`
          }
        >
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
        </Link>
        <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
        <div
          title={user?.username}
          className="hidden items-center justify-between md:flex"
        >
          <div className="align-center flex h-9 w-9 justify-center">
            {user?.profilePictureUrl ? (
              <Image
                src={imgUrlChecker(user?.profilePictureUrl)}
                alt={user?.username || "User Profile Picture"}
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
            )}
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {user?.username}
          </span>
          <button
            className="hidden rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
