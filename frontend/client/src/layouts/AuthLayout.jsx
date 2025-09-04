import React from "react";
import "./../styles/auth.css";

const AuthLayout = ({ title, children, logo, illustration }) => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white text-gray-900">
        <div className="max-w-md w-full px-8 py-10">
          {/* Logo + Title (optional) */}
          {logo && (
            <div className="flex items-center space-x-3 mb-8">
              <img src={logo} alt="Logo" className="w-10 h-10" />
              <h1 className="text-2xl font-bold">IMS</h1>
            </div>
          )}

          {title && <h2 className="text-xl font-semibold mb-6">{title}</h2>}

          {/* Form content (Login/Signup/etc.) */}
          {children}
        </div>
      </div>

      {/* Right Section - Illustration (optional) */}
      {illustration && (
        <div className="hidden md:flex w-1/2 items-center justify-center p-10">
          <img
            src={illustration}
            alt="Illustration"
            className="max-w-lg w-full"
          />
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
