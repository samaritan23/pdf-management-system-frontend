import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddDocumentModal from "./AddDocumentModal";
import axios from "axios";
import "./Dashboard.css";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Logout from "@mui/icons-material/Logout";
import DocumentCard from "./DocumentCard";

const initialDocuments = [];

const Dashboard = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openEl = Boolean(anchorEl);

  const handleClickEl = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseEl = () => {
    setAnchorEl(null);
  };

  const handleAddDocument = async (formData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_DOMAIN}/documents/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem(
              "2023_token_fair_play"
            )}`,
          },
        }
      );

      const status = response.status;
      if (status === 200) {
        fetchDocs()
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("2023_token_fair_play");
    navigate("/login");
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchDocs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_DOMAIN}/documents/user-documents`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem(
              "2023_token_fair_play"
            )}`,
          },
        }
      );

      const json = await response.data;
      if (json.success) {
        setDocuments(json.data);
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login");
      }
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("2023_token_fair_play");
    if (token) {
      fetchDocs();
    } else {
      navigate("/login");
    }
  }, []);

  const handleDocumentArchived = (documentId) => {
    setDocuments(documents.filter(doc => doc._id !== documentId));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Documents</h1>
        <div className="dashboard-controls">
          <button
            className="add-document"
            onClick={() => setIsAddModalOpen(true)}
          >
            <span className="icon">+</span>
            Add Document
          </button>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClickEl}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={openEl ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openEl ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openEl}
            onClose={handleCloseEl}
            onClick={handleCloseEl}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className="dashboard-search-filter">
        <input
          type="text"
          className="search-bar"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {filteredDocuments.length > 0 && (
        <div className="document-cards">
          {filteredDocuments.map((doc, index) => (
            <DocumentCard doc={doc} key={index} onDocumentArchived={handleDocumentArchived} />
          ))}
        </div>
      )}
      <AddDocumentModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDocument}
      />
    </div>
  );
};

export default Dashboard;
