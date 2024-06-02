import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  ListItemIcon,
  Avatar,
  Button,
  Divider,
  IconButton,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from '@mui/icons-material/Link';
import axios from "axios";
import "./ShareDocumentModal.css";
import { Send } from "@mui/icons-material";

const ShareDocumentModal = ({ isOpen, onRequestClose, documentId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [link, setLink] = useState("https://www.example.com");

  useEffect(() => {
    const token = localStorage.getItem('2023_token_fair_play')
    if (isOpen) {
        const fetchAllUsers = async () => {
            await axios.get("http://localhost:3000/users/all", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "2023_token_fair_play"
                    )}`
                },
            })
            .then((response) => {
            setUsers(response.data);
            })
            .catch((error) => {
            console.error("Error fetching users:", error);
            });
        }
    }
  }, [isOpen]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = (user) => {
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleUserRemove = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
  };

  const handleSubmit = () => {
    const data = {
      userId
    };
    axios
      .post(`{{url}}/grant-access/${documentId}`, data)
      .then((response) => {
        console.log("Access granted:", response.data);
        onRequestClose();
      })
      .catch((error) => {
        console.error("Error granting access:", error);
      });
  };

  return (
    <Modal open={isOpen} onClose={onRequestClose}>
      <Box className="share-modal" sx={{ ...modalStyle }}>
        <div className="modal-header">
          <Typography variant="h6">Share With Others</Typography>
        </div>
        <div className="modal-content">
          <Typography variant="subtitle1">Invite People</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add people, by name or email"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <div className="dropdown">
              {users
                .filter(
                  (user) =>
                    user.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                  <MenuItem
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                  >
                    <ListItemIcon>
                      <Avatar src={user.avatarUrl} />
                    </ListItemIcon>
                    <Typography variant="body1">{user.name}</Typography>
                  </MenuItem>
                ))}
            </div>
          )}
          <div className="selected-users">
            {selectedUsers.map((user) => (
              <Chip
                key={user.id}
                avatar={<Avatar src={user.avatarUrl} />}
                label={user.name}
                onDelete={() => handleUserRemove(user)}
              />
            ))}
          </div>
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
                onClick={() => navigator.clipboard.writeText(link)}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
        <div className="modal-footer">
            <Button sx={{ textTransform: 'none' }} onClick={handleSubmit} className="submit-button" endIcon={<Send />}>
                Send
            </Button>
            <Button sx={{ textTransform: 'none' }} onClick={onRequestClose} className="submit-button" >
                Done
            </Button>
        </div>
      </Box>
    </Modal>
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
