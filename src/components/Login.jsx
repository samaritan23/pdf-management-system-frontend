import React, { useState } from 'react';
import './Login.css'
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/login', formData);
      console.log(response.data); // Handle success, maybe redirect or show a success message
    } catch (error) {
      console.error('Login Error:', error); // Handle error, maybe show an error message
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="emailOrUsername" placeholder="Email or Username" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;