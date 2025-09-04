import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../features/auth/Login";
import loginIllustration from "../assets/loginimg.png"; // save your SVGs here

const LoginPage = () => {
  return (
    <AuthLayout  >
      <Login />
    </AuthLayout>
  );
};

export default LoginPage;
