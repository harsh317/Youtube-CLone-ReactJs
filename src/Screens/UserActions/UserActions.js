import React from "react";
import { useLocation } from "react-router-dom";

import ResetPassword from "../../components/ResetPassword/ResetPassword";
import EmailVerification from "../../components/EmailVerification/EmailVerification";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const UserActions = () => {
  const query = useQuery();

  const mode = query.get("mode");
  const actionCode = query.get("oobCode");
  const continueUrl = new URL(query.get("continueUrl")).pathname;
  const lang = query.get("lang") || "en";

  const renderSwitch = () => {
    switch (mode) {
      case "resetPassword":
        return (
          <ResetPassword actionCode={actionCode} continueUrl={continueUrl} />
        );
      case "signIn":
        return (
          <EmailVerification
            actionCode={actionCode}
            continueUrl={continueUrl}
          />
        );
    }
  };

  return <div>{renderSwitch()}</div>;
};

export default UserActions;
