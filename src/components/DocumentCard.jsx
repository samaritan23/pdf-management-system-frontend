import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShareDocumentModal from "./ShareDocumentModal";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import { Delete, MoreVert, OpenInBrowser, Share } from "@mui/icons-material";
import './DocumentCard.css'
import axios from "axios";

const DocumentCard = ({ doc, onDocumentArchived }) => {
	const [isSharedModalOpen, setIsSharedModalOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const openEl = Boolean(anchorEl);
	const navigate = useNavigate();

	const handleCardClick = () => {
		navigate("/pdf", { state: { doc } });
	};

	const handleClickEl = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseEl = () => {
		setAnchorEl(null);
	};

	const handleShareClick = () => {
		setIsSharedModalOpen(true);
		handleCloseEl();
	};

	const handleDelete = async () => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_SERVER_DOMAIN}/documents/archive/${doc._id}`,
                {},
                {
                    headers: {
                        // "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("2023_token_fair_play")}`,
                    },
                }
            );
            onDocumentArchived(doc._id); 
        } catch (error) {
            console.error("Failed to archive the document:", error);
        } finally {
            handleCloseEl();
        }
    };

	const getFormattedDate = (date) => {
		let updatedAt = new Date(date * 1000);

		let year = updatedAt.getFullYear();
		let month = updatedAt.toLocaleDateString("default", { month: "long" });
		let day = updatedAt.getDate();

		let formattedUpdatedDate = `${month} ${day}, ${year}`;

		return formattedUpdatedDate;
	};

	useEffect(() => {
		console.log(doc);
	}, [doc]);

	return (
		<div className="document-card">
			<div className="document-card-header">
				<h2 onClick={handleCardClick}>{doc.title}</h2>
				<Tooltip title="Options">
					<IconButton
						onClick={handleClickEl}
						size="small"
						sx={{ ml: 2 }}
						aria-controls={openEl ? "doc-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={openEl ? "true" : undefined}
					>
						<MoreVert sx={{ width: 16, height: 16 }} />
					</IconButton>
				</Tooltip>
				<Menu
					anchorEl={anchorEl}
					id="doc-menu"
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
					<MenuItem onClick={handleCardClick}>
						<ListItemIcon>
							<OpenInBrowser fontSize="small" />
						</ListItemIcon>
						Open
					</MenuItem>
					<MenuItem onClick={handleShareClick}>
						<ListItemIcon>
							<Share fontSize="small" />
						</ListItemIcon>
						Share
					</MenuItem>
					<Divider />
					<MenuItem onClick={handleDelete}>
						<ListItemIcon>
							<Delete fontSize="small" />
						</ListItemIcon>
						Delete
					</MenuItem>
				</Menu>
			</div>
			<p className="last-update">
				Last Update: {getFormattedDate(doc.updatedAt)}
			</p>
			<div className="document-meta">
				<span className="category">{doc.category}</span>
			</div>
			<div
				className="document-meta"
				style={{ visibility: doc.isOwner ? "hidden" : "visible" }}
			>
				<span className="shared-tag">Shared</span>
			</div>
			<ShareDocumentModal
				isOpen={isSharedModalOpen}
				onRequestClose={() => setIsSharedModalOpen(false)}
				documentId={doc._id}
			/>
		</div>
	);
};

export default DocumentCard;
