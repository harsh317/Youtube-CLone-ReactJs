import React from "react";
import UserAuthbox from "../../components/UserAuthBox/UserAuthbox";
import "./_login.scss";

function Login({ handleContainerLogin, containerAuth }) {
  return (
    <div className="LoginContainer">
      <UserAuthbox
        containerAuth={containerAuth}
        handleContainerLogin={handleContainerLogin}
      />
    </div>
  );
}

export default Login;
