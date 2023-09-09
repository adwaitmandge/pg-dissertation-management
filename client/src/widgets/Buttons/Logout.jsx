import React from "react";
import { GoogleLogout } from "react-google-login";

// const CLIENT_ID =
//   "1038266043641-2fvvhnqhfg1dr6hbfa0bdvb8r41ik8b3.apps.googleusercontent.com";

// vjti
const CLIENT_ID =
  "175944090009-nq8233t83oulbdi2ruplq5jm2el8fsod.apps.googleusercontent.com";

const LogoutButton = () => {
  const onSuccess = (res) => {
    console.log("LOG OUT SUCCESS! Current user: ");
  };

  return (
    <GoogleLogout
      clientId={CLIENT_ID}
      buttonText="Logout"
      onLogoutSuccess={onSuccess}
    />
  );
};

export default LogoutButton;
