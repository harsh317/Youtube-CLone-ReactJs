import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../Context/UserAuthContext";
import "./_sidebarRow.scss";

function SidebarRow({ title, Icon, handleToggleSidebar }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [error, seterror] = useState();
  const handlelogout = async () => {
    seterror(null);
    try {
      await logout();
      navigate("/login");
    } catch (e) {
      seterror(e);
    }
  };
  return (
    <div
      className="SidebarRow"
      onClick={() => {
        handleToggleSidebar(false);
        switch (title) {
          case "Logout":
            handlelogout();
        }
      }}
    >
      <Icon size={23} />
      <span>{title}</span>
    </div>
  );
}

export default SidebarRow;
