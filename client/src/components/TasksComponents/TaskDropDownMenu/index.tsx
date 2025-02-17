import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MoreVerticalIcon } from "lucide-react";

interface DropdownMenuProps {
  menuItems: { label: string; onClick: (props: any) => void }[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ menuItems }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="flex flex-shrink-0 items-center justify-center dark:text-neutral-500"
      >
        <MoreVerticalIcon />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            onClick={(props) => {
              item.onClick(props);
              handleClose(); // Close menu after clicking
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default DropdownMenu;
