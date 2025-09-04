import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import Signup from "../features/auth/Signup";


const SignupPage = () => {
  return (
    <AuthLayout >
      <Signup />
    </AuthLayout>
  );
};

export default SignupPage;
