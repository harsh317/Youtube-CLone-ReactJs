import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";

import * as styles from "./ResetPassStyles";
import { useAuth } from "../../Context/UserAuthContext";

const ResetPassword = ({ actionCode, continueUrl }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, seterror] = useState();
  const { ResetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await ResetPassword(actionCode, password)
      .then((res) => {
        NotificationManager.success(
          "An Email has been successfully sent ! ",
          "success",
          10000,
          () => {
            navigate(continueUrl, { replace: true });
          }
        );
      })
      .catch((e) => {
        console.log(error);
        seterror(e.message);
      });
  };

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error", 10000);
    }
  }, [error]);

  return (
    <div style={styles.ForgotPasswordStyles.forgotPassword}>
      <h1 style={styles.ForgotPasswordStyles.h1}>Forgot Password?</h1>
      <h5 style={styles.ForgotPasswordStyles.h5}>
        Reset password in two quick steps
      </h5>
      <form onSubmit={handleSubmit} style={styles.ForgotPasswordStyles.form}>
        <input
          type="password"
          autoComplete="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.ForgotPasswordStyles.input}
        />
        <button
          type="submit"
          size="lg"
          fontSize="md"
          style={styles.ForgotPasswordStyles.button}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
