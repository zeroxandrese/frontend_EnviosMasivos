import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import toastError from "../../errors/toastError";
import api from "../../services/api";

import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Button, Divider, makeStyles, Box, Card, CardContent } from "@material-ui/core";

import { AuthContext } from "../../context/Auth/AuthContext";

import { isNil } from 'lodash';
import ShowTicketOpen from '../ShowTicketOpenModal';

// Icons
import ChatIcon from "@material-ui/icons/Chat";
import PersonIcon from "@material-ui/icons/Person";

const useStyles = makeStyles(theme => ({
    // Container Principal
    vcardContainer: {
        minWidth: "280px",
        maxWidth: "320px",
        padding: theme.spacing(1),
    },
    
    // Card Principal
    vcardCard: {
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
        },
    },
    
    // Header com Avatar
    vcardHeader: {
        background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
        padding: theme.spacing(2),
        position: "relative",
        "&:before": {
            content: '""',
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "60px",
            height: "60px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
        },
    },
    
    // Avatar Estilizado
    vcardAvatar: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        border: "3px solid white",
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease",
        backgroundColor: "#e2e8f0",
        fontSize: "24px",
        color: "#64748b",
        "&:hover": {
            transform: "scale(1.05)",
        },
    },
    
    // Content Area
    vcardContent: {
        padding: theme.spacing(2, 2, 1, 2),
    },
    
    // Nome do Contato
    contactName: {
        color: "#1e293b",
        fontWeight: 700,
        fontSize: "16px",
        lineHeight: 1.3,
        marginBottom: theme.spacing(0.5),
        textAlign: "center",
        wordBreak: "break-word",
        display: "-webkit-box",
        "-webkit-line-clamp": 2,
        "-webkit-box-orient": "vertical",
        overflow: "hidden",
    },
    
    // Número do Contato
    contactNumber: {
        color: "#64748b",
        fontSize: "12px",
        fontWeight: 500,
        textAlign: "center",
        marginBottom: theme.spacing(1.5),
        fontFamily: "monospace",
    },
    
    // Divider Estilizado
    modernDivider: {
        background: "linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%)",
        height: "1px",
        border: "none",
        margin: theme.spacing(1.5, 0),
    },
    
    // Botão de Conversar
    chatButton: {
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        borderRadius: "12px",
        padding: theme.spacing(1.2, 2),
        fontSize: "14px",
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            transform: "translateY(-1px)",
            boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
        },
        "&:disabled": {
            background: "#cbd5e1",
            color: "#9ca3af",
            boxShadow: "none",
            transform: "none",
        },
    },
    
    // Loading State
    loadingState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(3),
        color: "#64748b",
    },
    
    loadingAvatar: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        backgroundColor: "#f1f5f9",
        marginBottom: theme.spacing(1),
        animation: "$pulse 1.5s infinite",
    },
    
    loadingText: {
        width: "60%",
        height: "16px",
        backgroundColor: "#f1f5f9",
        borderRadius: "4px",
        animation: "$pulse 1.5s infinite",
        marginBottom: theme.spacing(0.5),
    },
    
    // Animations
    "@keyframes pulse": {
        "0%": {
            opacity: 1,
        },
        "50%": {
            opacity: 0.5,
        },
        "100%": {
            opacity: 1,
        },
    },
    
    // Status Indicator
    statusIndicator: {
        position: "absolute",
        bottom: theme.spacing(0.5),
        right: theme.spacing(0.5),
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: "#10b981",
        border: "2px solid white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    
    // Avatar Container
    avatarContainer: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        marginBottom: theme.spacing(1),
    },
}));

const VcardPreview = ({ contact, numbers, queueId, whatsappId }) => {
    const classes = useStyles();
    const history = useHistory();
    const { user } = useContext(AuthContext);

    const companyId = user.companyId;

    const [openAlert, setOpenAlert] = useState(false);
    const [userTicketOpen, setUserTicketOpen] = useState("");
    const [queueTicketOpen, setQueueTicketOpen] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [selectedContact, setContact] = useState({
        id: 0,
        name: "",
        number: 0,
        profilePicUrl: ""
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const fetchContacts = async () => {
                try {
                    setIsLoading(true);
                    if (isNil(numbers)) {
                        setIsLoading(false);
                        return;
                    }
                    const number = numbers.replace(/\D/g, "");
                    const getData = await api.get(`/contacts/profile/${number}`);

                    if (getData.data.contactId && getData.data.contactId !== 0) {
                        let obj = {
                            id: getData.data.contactId,
                            name: contact,
                            number: numbers,
                            profilePicUrl: getData.data.urlPicture
                        }

                        setContact(obj);
                    } else {
                        let contactObj = {
                            name: contact,
                            number: number,
                            email: "",
                            companyId: companyId
                        }

                        const { data } = await api.post("/contacts", contactObj);
                        setContact(data);
                    }
                    setIsLoading(false);

                } catch (err) {
                    console.log(err);
                    toastError(err);
                    setIsLoading(false);
                }
            };
            fetchContacts();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [contact, numbers, companyId]);

    const handleCloseAlert = () => {
        setOpenAlert(false);
        setUserTicketOpen("");
        setQueueTicketOpen("");
    };

    const handleNewChat = async () => {
        try {
            const { data: ticket } = await api.post("/tickets", {
                contactId: selectedContact.id,
                userId: user.id,
                status: "open",
                queueId,
                companyId: companyId,
                whatsappId
            });
            history.push(`/tickets/${ticket.uuid}`);
        } catch (err) {
            const ticket = JSON.parse(err.response.data.error);

            if (ticket.userId !== user?.id) {
                setOpenAlert(true);
                setUserTicketOpen(ticket.user.name);
                setQueueTicketOpen(ticket.queue.name);
            } else {
                setOpenAlert(false);
                setUserTicketOpen("");
                setQueueTicketOpen("");
                history.push(`/tickets/${ticket.uuid}`);
            }
        }
    }

    const formatPhoneNumber = (number) => {
        if (!number) return "";
        const cleaned = number.replace(/\D/g, "");
        if (cleaned.length === 13) {
            return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
        }
        return number;
    };

    if (isLoading) {
        return (
            <Box className={classes.vcardContainer}>
                <Card className={classes.vcardCard}>
                    <Box className={classes.loadingState}>
                        <Avatar className={classes.loadingAvatar} />
                        <Box className={classes.loadingText} />
                        <Box className={classes.loadingText} style={{ width: "40%" }} />
                    </Box>
                </Card>
            </Box>
        );
    }

    return (
        <>
            <ShowTicketOpen 
                isOpen={openAlert}
                handleClose={handleCloseAlert}
                user={userTicketOpen}
                queue={queueTicketOpen}
            />
            
            <Box className={classes.vcardContainer}>
                <Card className={classes.vcardCard}>
                    {/* Header com Avatar */}
                    <Box className={classes.vcardHeader}>
                        <Box className={classes.avatarContainer}>
                            <Avatar 
                                src={selectedContact?.profilePicUrl || selectedContact?.urlPicture}
                                className={classes.vcardAvatar}
                            >
                                {!selectedContact?.profilePicUrl && !selectedContact?.urlPicture && (
                                    <PersonIcon />
                                )}
                            </Avatar>
                            {selectedContact.id && (
                                <Box className={classes.statusIndicator} />
                            )}
                        </Box>
                    </Box>

                    {/* Content */}
                    <CardContent className={classes.vcardContent}>
                        <Typography className={classes.contactName}>
                            {selectedContact.name || contact || "Contato"}
                        </Typography>
                        
                        {selectedContact.number && (
                            <Typography className={classes.contactNumber}>
                                {formatPhoneNumber(selectedContact.number)}
                            </Typography>
                        )}

                        <Divider className={classes.modernDivider} />

                        <Button
                            fullWidth
                            className={classes.chatButton}
                            onClick={handleNewChat}
                            disabled={!selectedContact.number}
                            startIcon={<ChatIcon />}
                        >
                            Conversar
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default VcardPreview;