import React from "react";
import { GoogleLogin } from "react-google-login";

const LoginButton = () => {
  // const CLIENT_ID =
  //   "1038266043641-2fvvhnqhfg1dr6hbfa0bdvb8r41ik8b3.apps.googleusercontent.com";

  // vjti
  const CLIENT_ID =
    "175944090009-nq8233t83oulbdi2ruplq5jm2el8fsod.apps.googleusercontent.com";

  const onSuccess = (res) => {
    console.log("LOGIN SUCCESS! Current user: ", res.profileObj);
  };

  const onFailure = (res) => {
    console.log("LOGIN FAILED! res: ", res);
  };

  return (
    <div>
      <GoogleLogin
        clientId={CLIENT_ID}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
      />
    </div>
  );
};

export default LoginButton;
