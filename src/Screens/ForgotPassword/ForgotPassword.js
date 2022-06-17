import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationManager } from "react-notifications";

import { useAuth } from "../../Context/UserAuthContext";
import * as styles from "./ForgotPasswordStyles";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, seterror] = useState();
  const navigate = useNavigate();
  const { forgotPassword, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }
  });

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error", 10000);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      NotificationManager.success(
        "An Email has been successfully sent ! ",
        "success"
      );
    } catch (e) {
      seterror(e.message);
    }
  };

  return (
    <div style={styles.ForgotPasswordStyles.forgotPassword}>
      <h1 style={styles.ForgotPasswordStyles.h1}>Forgot Password?</h1>
      <h5 style={styles.ForgotPasswordStyles.h5}>
        Reset password in two quick steps
      </h5>
      <form onSubmit={handleSubmit} style={styles.ForgotPasswordStyles.form}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.ForgotPasswordStyles.input}
        />
        <button
          type="submit"
          size="lg"
          fontSize="md"
          style={styles.ForgotPasswordStyles.button}
        >
          Send Email
        </button>
      </form>
      <div
        style={styles.ForgotPasswordStyles.GoBack}
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </div>
    </div>
  );
};

export default ForgotPassword;
