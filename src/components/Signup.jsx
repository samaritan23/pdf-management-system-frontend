import React, { useState } from 'react';
import './Signup.css';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    profilePic: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/user/create', formData);
      console.log(response.data); // Handle success, maybe redirect or show a success message
    } catch (error) {
      console.error('Signup Error:', error); // Handle error, maybe show an error message
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input type="text" name="profilePic" placeholder="Profile Picture URL" onChange={handleChange} />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;