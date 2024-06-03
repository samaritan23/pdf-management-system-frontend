import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import './Pdf.css'

const Pdf = () => {
    const [comments, setComments] = useState([]);
    const [currentComment, setCurrentComment] = useState("");
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const zoomPluginInstance = zoomPlugin();
    const pdfjsVersion = '3.4.120'
    const location = useLocation()
    const navigate = useNavigate()
    const [doc, setDoc] = useState(location.state ? location.state.doc : {})

    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

    const fetchComments = async (docId) => {
        await axios
            .get(`${process.env.REACT_APP_SERVER_DOMAIN}/documents/get-comments/${docId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("2023_token_fair_play")}`
                }
            })
            .then((response) => {
                setComments(response.data.data.comments);
            })
            .catch((error) => {
                console.error("Error fetching comments:", error);
            });
    };

    const verifyEmail = async (token, jwt_auth_token) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/documents/open-link?token=${token}`, {
                headers: {
                    Authorization: `Bearer ${jwt_auth_token}`,
                },
            })

            const data = await response.data
            if (data.success) {
                setDoc(data.data)
                setAlert({ open: true, message: data.message, severity: "success" });
            } else {
                setAlert({ open: true, message: data.message, severity: "error" });
            }
        } catch (error) {
            setAlert({ open: true, message: error.response.data.message, severity: "error" });
        }
    }

    useEffect(() => {
        const jwt_auth_token = localStorage.getItem("2023_token_fair_play");
        const token = new URLSearchParams(location.search).get('token');

        if (!jwt_auth_token) {
            navigate('/login')
        }
        else if (token) {
            verifyEmail(token, jwt_auth_token)
        }
    }, [location.search, navigate]);

    useEffect(() => {
        fetchComments(doc._id)
    }, [doc._id])

    const addComment = () => {
        const newComment = {
            comment: currentComment,
        };

        // Send new comment to the backend
        axios.post(`${process.env.REACT_APP_SERVER_DOMAIN}/documents/add-comment/${doc._id}`, newComment, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("2023_token_fair_play")}`
            }
        })
            .then((response) => {
                setCurrentComment("");
                fetchComments(doc._id);
            })
            .catch((error) => {
                console.error("Error adding comment:", error);
            });
    };

    const handleReplyChange = (e, commentId) => {
        const updatedComments = comments.map((comment) => {
            if (comment._id === commentId) {
                return { ...comment, replyContent: e.target.value };
            }
            return comment;
        });
        setComments(updatedComments);
    };

    const addReply = (commentId) => {
        const commentToUpdate = comments.find((comment) => comment._id === commentId);
        const newReply = {
            comment: commentToUpdate.replyContent,
            parentCommentId: commentId,
        };
        axios.post(`${process.env.REACT_APP_SERVER_DOMAIN}/documents/add-comment/${doc._id}`, newReply, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("2023_token_fair_play")}`
            }
        })
            .then(() => {
                fetchComments(doc._id);
            })
            .catch((error) => {
                console.error("Error adding reply:", error);
            });
    };
    
    const renderReplyBox = (commentId) => (
        <div className="reply-box">
            <textarea
                className="reply-input"
                placeholder="Write your reply..."
                value={comments.find(comment => comment._id === commentId)?.replyContent || ''}
                onChange={(e) => handleReplyChange(e, commentId)}
            />
            <div className="reply-actions">
                <button className="reply-button" onClick={() => addReply(commentId)}>Reply</button>
            </div>
        </div>
    );

    // const handleViewMoreReplies = (commentId) => {
    //     // Find the comment with the specified commentId
    //     const updatedComments = comments.map((comment) => {
    //         if (comment._id === commentId) {
    //             // Return a new comment object with all replies
    //             return {
    //                 ...comment,
    //                 allRepliesVisible: true // Add a flag to indicate that all replies are visible
    //             };
    //         }
    //         return comment;
    //     });
    //     // Update the comments state to reflect the changes
    //     setComments(updatedComments);
    // };

    // const renderViewMoreRepliesButton = (commentId) => {
    //     const comment = comments.find(comment => comment._id === commentId);
    //     if (comment && comment.replies.length > 2) {
    //         return (
    //             <button className="view-more-replies-button" onClick={() => handleViewMoreReplies(commentId)}>View more replies</button>
    //         );
    //     }
    //     return null;
    // };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ flex: 1, marginRight: '20px' }}>
                    <div style={{ height: '100vh' }}>
                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
                            <Viewer
                                fileUrl={`${process.env.REACT_APP_S3_DOMAIN}${doc.file}`}
                                plugins={[defaultLayoutPluginInstance, zoomPluginInstance]}
                                defaultScale={SpecialZoomLevel.PageFit}
                            />
                        </Worker>
                    </div>
                </div>
                <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column', height: '100vh' }}>
                    <div style={{ flex: 1, overflowY: 'auto', marginTop: '10px' }}>
                        <h2 className="comment-heading">Comments</h2>
                        {/* Display existing comments */}
                        {comments.map((comment) => (
                            <div key={comment._id} className="comment-container">
                                {/* Display comment */}
                                <div className="comment">
                                    <p className="user">{comment.user.username}</p>
                                    <p className="content">{comment.comment}</p>
                                </div>
                                {/* Display replies */}
                                <div className="replies">
                                    {comment.replies.map((reply) => (
                                        <div key={reply._id} className="reply">
                                            <p className="user">{reply.user.username}: </p>
                                            <p className="content">{reply.comment}</p>
                                        </div>
                                    ))}
                                </div>
                                {/* Reply box */}
                                {renderReplyBox(comment._id)}
                            </div>
                        ))}
                    </div>
                    <div>
                        <textarea
                            className="comment-input"
                            placeholder="Add a comment..."
                            value={currentComment}
                            onChange={(e) => setCurrentComment(e.target.value)}
                        />
                        <button onClick={addComment} className="comment-button">Add Comment</button>
                    </div>
                </div>
            </div>
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

export default Pdf;
