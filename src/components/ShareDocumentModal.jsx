// ShareDocumentModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import axios from "axios";
import "./ShareDocumentModal.css";
import { Send } from "@mui/icons-material";

const ShareDocumentModal = ({ isOpen, onRequestClose, documentId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [link, setLink] = useState("");
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('2023_token_fair_play');

    const fetchAllUsers = async () => {
        await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/user/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        .then((response) => {
            console.log(response.data.data);
            setUsers(response.data.data);
        })
        .catch((error) => {
        console.error("Error fetching users:", error);
        });
    }

    if (isOpen) {
        fetchAllUsers();
    }
  }, [isOpen]);

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = (user) => {
    setSearchQuery(user.fullName);
    setSelectedUser(user);
  };

  const sendEmail = async (userId) => {
    console.log(documentId);
    const token = localStorage.getItem('2023_token_fair_play');

    const data = {
      userId
    };

    console.log(data);
    setLoading(true);

    await axios.post(`${process.env.REACT_APP_SERVER_DOMAIN}/documents/grant-access/${documentId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Access granted:", response.data);
        setAlert({ open: true, message: response.data.message, severity: "success" });
        setLoading(false);
        onRequestClose();
      })
      .catch((error) => {
        console.error("Error granting access:", error);
        setAlert({ open: true, message: error.response.data.message, severity: "error" });
        setLoading(false);
      });
  };

  const generateLink = async () => {
    const token = localStorage.getItem('2023_token_fair_play');
    setLoading(true);

    await axios.post(`${process.env.REACT_APP_SERVER_DOMAIN}/documents/shareable-link/${documentId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Link generated:", response.data);
        setLink(`${process.env.REACT_APP_PDF_LINK}?token=${response.data.data.shareLink}`);
        setLinkGenerated(true);
        setAlert({ open: true, message: response.data.message, severity: "success" });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error generating link:", error);
        setAlert({ open: true, message: error.response.data.message, severity: "error" });
        setLoading(false);
      });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      <Modal open={isOpen} onClose={onRequestClose}>
        <Box className="share-modal" sx={{ ...modalStyle }}>
          <div className="modal-header">
            <Typography variant="h6">Share With Others</Typography>
          </div>
          <div className="modal-content">
            <Typography variant="subtitle1">Invite People</Typography>
            <Box className='box-textfield' sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <TextField
                  variant="outlined"
                  placeholder="Add people by name"
                  value={searchQuery}
                  onChange={handleSearchChange}
              />
              {loading ? (
                <CircularProgress size={24} sx={{ marginLeft: 2 }} />
              ) : (
                <Button 
                  className="send-btn"
                  onClick={() => sendEmail(selectedUser.userId)}
                  endIcon={<Send />}
                >
                  Send
                </Button>
              )}
            </Box>
            {searchQuery && (
              <div className="dropdown">
                {filteredUsers.map((user) => (
                    <MenuItem
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                    >
                      <Typography variant="body1">{user.fullName}</Typography>
                    </MenuItem>
                  ))}
              </div>
            )}
            <div className="general-access">
              <Typography variant="subtitle1">General Access</Typography>
              <div className="link">
                <TextField
                  variant="outlined"
                  value={link}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <Button
                  className="copy-button"
                  variant="outlined"
                  startIcon={<LinkIcon />}
                  sx={{ textTransform: 'none' }}
                  onClick={linkGenerated ? () => navigator.clipboard.writeText(link) : generateLink}
                >
                  {linkGenerated ? "Copy" : "Generate Link"}
                </Button>
              </div>
            </div>
          </div>
          <div className="modal-footer">
              <Button sx={{ textTransform: 'none' }} onClick={onRequestClose} className="submit-button" >
                  Done
              </Button>
          </div>
        </Box>
      </Modal>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default ShareDocumentModal;
