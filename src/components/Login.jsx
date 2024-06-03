import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import pdfImage from "../assets/pdf.png";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const location = useLocation()
  const verifiedMessage = location.state

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/user/login`,
        formData
      );
      localStorage.setItem(`2023_token_fair_play`, response.data.token);
      navigate("/dashboard");
    } catch (error) {
      // console.log(error.response.data.message)
      setErrorMessage(error.response.data.message);
      if (errorMessage === 'Your Email is not verified please verify') {
        navigate('/verify-email')
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("2023_token_fair_play");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-left">
          <div className="signup-left-content">
            <img
              src={pdfImage}
              alt="Exam Mastery Hub"
              className="signup-image"
            />
            <h1>PDF Management System</h1>
            <p>
              Your Ultimate Solution for Effortless PDF Management and Secure
              File Sharing
            </p>
          </div>
        </div>
        <div className="signup-right">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            <input
              type="text"
              name="emailOrUsername"
              className="input-field"
              placeholder="Username or email"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="Password"
              onChange={handleChange}
            />
            {verifiedMessage && (
              <div className="verified-message">{verifiedMessage}</div>
            )}
            {/* <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a> */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" className="signup-button">
              Sign In
            </button>
            <div className="create-account">
              Are you new? <a href="/">Create an Account</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
