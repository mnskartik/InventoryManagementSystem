import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImg from "../../assets/loginimg.png";
import "../../styles/ResetPassword.css"; // ✅ new CSS file

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // comes from OTPComponent

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      setMessage("Please fill in both fields.");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        password,
      });

      setMessage(res.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="reset-container">
      {/* Left Form Section */}
      <div className="reset-form-section">
        <h2 className="reset-title">Create New Password</h2>
        <p className="reset-subtext">
          Today is a new day. It's your day. You shape it.
          <br />
          Sign in to start managing your projects.
        </p>

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="reset-input-group">
            <input
              type="password"
              placeholder="at least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="reset-input-group">
            <input
              type="password"
              placeholder="at least 8 characters"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {/* Reset Button */}
          <button type="submit" className="reset-button">
            Reset Password
          </button>
        </form>

        {message && (
          <p className={`reset-message ${message.includes("success") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>

      {/* Right Illustration Section */}
      <div className="reset-illustration">
        <img src={loginImg} alt="Illustration" />
      </div>
    </div>
  );
};

export default ResetPassword;
