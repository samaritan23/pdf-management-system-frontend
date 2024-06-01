import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Signup.css';
import pdfImage from '../assets/pdf.png';
import axios from 'axios';

const Signup = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      const response = await axios.post('http://localhost:3000/user/create', formData);
      console.log(response.data); // Handle success, maybe redirect or show a success message
      navigate('/verify-email')
    } catch (error) {
      console.error('Signup Error:', error.message); // Handle error, maybe show an error message
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
          <img src={pdfImage} alt="Exam Mastery Hub" className="signup-image" />
            <h1>PDF Management System</h1>
            <p>Your Ultimate Solution for Effortless PDF Management and Secure File Sharing</p>
          </div>
        </div>
        <div className="signup-right">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <input type="text" name='username' className='input-field' placeholder="Username" onChange={handleChange} />
            <input type="email" name='email' className='input-field' placeholder="Email" onChange={handleChange} />
            <input type="text" name='firstName' className='input-field' placeholder="First Name" onChange={handleChange} />
            <input type="text" name='lastName' className='input-field' placeholder="Last Name" onChange={handleChange} />
            <input type="password" name='password' className='input-field' placeholder="Password" onChange={handleChange} />
            <button type="submit" className="signup-button">Sign Up</button>
            <div className="create-account">
              Existing user? <a href="/login">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
