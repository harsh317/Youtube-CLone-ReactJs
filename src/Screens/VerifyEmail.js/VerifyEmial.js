import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../Contexts/Context";

const VeryifyEmail = () => {
  const { SendEmailVerification } = useAuth();

  useEffect(() => {
    SendEmailVerification()
      .then(() => {
        alert("An email has been sent");
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return <div>You are not verified</div>;
};

export default VeryifyEmail;
