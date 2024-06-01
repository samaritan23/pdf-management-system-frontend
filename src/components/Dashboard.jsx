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
import { Delete, MoreVert, OpenInBrowser, Share } from "@mui/icons-material";

const initialDocuments = [];

const Dashboard = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const openEl1 = Boolean(anchorEl1);
  const openEl2 = Boolean(anchorEl2);
  

  const handleClickEl1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClickEl2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleCloseEl1 = () => {
    setAnchorEl1(null);
  };

  const handleCloseEl2 = () => {
    setAnchorEl2(null);
  };

  const handleCardClick = (document) => {
    navigate("/pdf", { state: { document } });
  };

  const handleAddDocument = async (newDocument, formData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/documents/upload",
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
        setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
      }
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("2023_token_fair_play");
    navigate("/login");
  };

  // const filteredDocuments = documents.filter((doc) =>
  //   doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const getFormattedDate = (date) => {
    let updatedAt = new Date(date);

    let year = updatedAt.getFullYear();
    let month = updatedAt.toLocaleDateString("default", { month: "long" });
    let day = updatedAt.getDate();

    let formattedUpdatedDate = `${month} ${day}, ${year}`;

    return formattedUpdatedDate;
  }

  const fetchDocs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/documents/user-documents",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem(
              "2023_token_fair_play"
            )}`,
          },
        }
      );
      
      const json = await response.data
      if (json.success) {
        setDocuments(json.data);
      }
    } catch (error) {
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

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Documents</h1>
        <div className="dashboard-controls">
          <div className="dashboard-tabs">
            <button className="tab active">Documents</button>
            <button className="tab">Archived</button>
          </div>
          <button className="add-document" onClick={() => setIsModalOpen(true)}>
            <span className="icon">+</span>
            Add Document
          </button>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClickEl1}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={openEl1 ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openEl1 ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl1}
            id="account-menu"
            open={openEl1}
            onClose={handleCloseEl1}
            onClick={handleCloseEl1}
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
            <MenuItem onClick={handleCloseEl1}>
              <Avatar sx={{ width: 32, height: 32 }} /> Profile         
            </MenuItem>
            <Divider />
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
      {documents.length > 0 && (
        <div className="document-cards">
          {documents.map((doc, index) => (
            <div
              className="document-card"
              key={index}
            >
              <div className="document-card-header">
                <h2>{doc.title || "Sample"}</h2>
                <Tooltip title="Options">
                  <IconButton
                    onClick={handleClickEl2}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={openEl2 ? "doc-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openEl2 ? "true" : undefined}
                  >
                    <MoreVert sx={{ width: 16, height: 16 }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl2}
                  id="doc-menu"
                  open={openEl2}
                  onClose={handleCloseEl2}
                  onClick={handleCloseEl2}
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
                        fontSize: 10,
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
                  <MenuItem onClick={() => handleCardClick(doc)}>
                    <ListItemIcon>
                      <OpenInBrowser fontSize="small" />
                    </ListItemIcon>
                    Open
                  </MenuItem>
                  <MenuItem onClick={handleCloseEl2}>
                    <ListItemIcon>
                      <Share fontSize="small" />
                    </ListItemIcon>
                      Share
                    </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleCloseEl2}>
                    <ListItemIcon>
                      <Delete fontSize="small" />
                    </ListItemIcon>
                    Delete
                  </MenuItem>
                  
                </Menu>
              </div>
              <p className="last-update">Last Update: {getFormattedDate(doc.updatedAt)}</p>
              <div className="document-meta">
                <span className="category">{doc.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <AddDocumentModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDocument}
      />
    </div>
  );
};

export default Dashboard;
