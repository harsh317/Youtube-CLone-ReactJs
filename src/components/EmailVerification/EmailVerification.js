import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/UserAuthContext";

const EmailVerification = ({ actionCode, continueUrl }) => {
  const navigate = useNavigate();
  const [error, seterror] = useState();
  const { VerifyEmailLink } = useAuth();

  useEffect(() => {
    VerifyEmailLink(actionCode)
      .then((resp) => {
        alert("Your emial has been verified !");
        navigate(continueUrl);
      })
      .catch((error) => {
        console.log(error);
        seterror(error);
        alert(
          "Code is invalid or expired. Ask the user to verify their email address"
        );
      });
  }, []);

  return <div>TADA!!!!!!!!!!!!!!!!!!!!!!!!!! </div>;
};

export default EmailVerification;
