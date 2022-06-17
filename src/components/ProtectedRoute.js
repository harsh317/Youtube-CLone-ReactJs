import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/UserAuthContext";

const ProtectedRoute = (props) => {
  const navigate = useNavigate();
  const { isAuthenticated, CurrentUser } = useAuth();

  useEffect(() => {
    const tryAuth = async () => {
      if (!isAuthenticated) {
        navigate("/login", { state: { from: window.location.pathname } });
        return;
      } else if (
        isAuthenticated &&
        props.children.props.needVerification &&
        !CurrentUser.emailVerified
      ) {
        navigate("/verify-email", { replace: true });
      }
    };

    tryAuth();
  }, []);

  return <div>{props.children}</div>;
};

export default ProtectedRoute;
