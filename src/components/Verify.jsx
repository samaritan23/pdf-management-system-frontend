import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import pdfImage from "../assets/pdf.png";
import axios from "axios";

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState("A verification link has been sent to your email....");

  useEffect(() => {
    const jwt_auth_token = localStorage.getItem("2023_token_fair_play");
    const token = new URLSearchParams(location.search).get('token');

    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/user/verify-email?token=${token}`)
    
        const data = await response.data
        if (data.success) {
          navigate("/login", { state: data.message });
        } else {
          setMessage('Please refresh and try again.')
        }
      } catch (error) {
        setMessage('Please refresh and try again.')
      }
    }

    if (jwt_auth_token) {
      navigate("/dashboard");
    } else if (token) {
			verifyEmail()
    }
  }, [location.search, navigate]);

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
          <div className={`message ${message === 'Please refresh and try again.' ? 'error-message' : 'success-message'}`}>
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;