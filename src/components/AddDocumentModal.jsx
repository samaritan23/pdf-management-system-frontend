import React, { useState } from 'react';
import Modal from 'react-modal';
import './AddDocumentModal.css';

Modal.setAppElement('#root');

const AddDocumentModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [document, setDocument] = useState({
    title: '',
    category: 'General',
    version: '1.0.0',
    file: null,
    isOwner: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument((prevDocument) => ({
      ...prevDocument,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setDocument((prevDocument) => ({
      ...prevDocument,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', document.file);
    formData.append('title', document.title);
    formData.append('category', document.category);
    onSubmit(formData);
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Add Document">
      <button className="close-button" onClick={onRequestClose}>&times;</button>
      <h2>Add Document</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={document.title} onChange={handleChange} required />
        </label>
        <label>
          Category:
          <input type="text" name="category" value={document.category} onChange={handleChange} required />
        </label>
        <label>
          File:
          <input type="file" name="file" onChange={handleFileChange} required />
        </label>
        <div className="button-container">
          <button type="submit">Submit</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDocumentModal;
