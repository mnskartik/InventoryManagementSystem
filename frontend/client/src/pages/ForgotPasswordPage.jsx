import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import ForgotPassword from "../features/auth/ForgotPassword";
import forgotIllustration from "../assets/loginimg.png";

const ForgotPasswordPage = () => {
  return (
    <AuthLayout >
      <ForgotPassword />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
