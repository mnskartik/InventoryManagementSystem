import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import OTPComponent from "../features/auth/OTPComponent";
import loginIllustration from "../assets/loginimg.png"; // save your SVGs here

const LoginPage = () => {
  return (
    <AuthLayout  >
      <OTPComponent />
    </AuthLayout>
  );
};

export default LoginPage;
