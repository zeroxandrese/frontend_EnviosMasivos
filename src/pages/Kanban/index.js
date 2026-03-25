import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";

import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import DashboardIcon from "@material-ui/icons/Dashboard";

import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import Board from 'react-trello';
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { useHistory } from 'react-router-dom';
import { socketConnection } from "../../services/socket";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    maxWidth: "1400px",
  },
  header: {
    marginBottom: theme.spacing(4),
    background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    borderRadius: "24px",
    padding: theme.spacing(4),
    color: "white",
    boxShadow: "0 20px 60px rgba(100, 116, 139, 0.2)",
    position: "relative",
    overflow: "hidden",
    "&:before": {
      content: '""',
      position: "absolute",
      top: "-50%",
      right: "-10%",
      width: "100px",
      height: "100px",
      background: "rgba(255,255,255,0.08)",
      borderRadius: "50%",
      transform: "scale(3)",
    },
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
    position: "relative",
    zIndex: 1,
  },
  headerIcon: {
    fontSize: "52px",
    opacity: 0.9,
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: "32px",
    marginBottom: theme.spacing(0.5),
  },
  headerSubtitle: {
    opacity: 0.9,
    fontSize: "16px",
    fontWeight: 400,
  },
  contentSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(3),
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    minHeight: "70vh",
  },
  kanbanContainer: {
    "& .react-trello-board": {
      backgroundColor: "transparent !important",
      fontFamily: theme.typography.fontFamily,
    },
    "& .smooth-dnd-container.horizontal": {
      padding: theme.spacing(1),
    },
    "& .react-trello-lane": {
      backgroundColor: "#f8fafc",
      borderRadius: "16px",
      margin: theme.spacing(0, 1),
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      minWidth: "280px",
      "& header": {
        backgroundColor: "transparent",
        borderRadius: "16px 16px 0 0",
        padding: theme.spacing(2),
        borderBottom: "1px solid #e2e8f0",
        "& h6": {
          fontSize: "16px",
          fontWeight: 700,
          color: "#1e293b",
          margin: 0,
        },
      },
      "& section": {
        backgroundColor: "transparent",
        padding: theme.spacing(1),
      },
    },
    "& .react-trello-card": {
      backgroundColor: "white",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      margin: theme.spacing(1, 0),
      padding: theme.spacing(2),
      transition: "all 0.2s ease",
      "&:hover": {
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        transform: "translateY(-2px)",
      },
      "& header": {
        backgroundColor: "transparent",
        border: "none",
        padding: "0 0 8px 0",
        "& div": {
          fontSize: "14px",
          fontWeight: 600,
          color: "#1e293b",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      },
      "& div[style]": {
        fontSize: "12px",
        color: "#64748b",
        lineHeight: 1.4,
        "& p": {
          margin: "4px 0",
          fontSize: "12px",
          color: "#64748b",
        },
      },
    },
  },
  button: {
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    border: "none",
    padding: "8px 16px",
    color: "white",
    fontWeight: 600,
    borderRadius: "8px",
    fontSize: "12px",
    cursor: "pointer",
    marginTop: "8px",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(5, 150, 105, 0.2)",
    "&:hover": {
      background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
    },
  },
  root: {
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
    "& .react-trello-board": {
      backgroundColor: "transparent !important",
    },
  },
}));

const Kanban = () => {
  const classes = useStyles();
  const history = useHistory();

  const [tags, setTags] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const fetchTags = async () => {
    try {
      const response = await api.get("/tags/kanban");
      const fetchedTags = response.data.lista || []; 

      setTags(fetchedTags);

      // Fetch tickets after fetching tags
      await fetchTickets(jsonString);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const [file, setFile] = useState({
    lanes: []
  });

  const [tickets, setTickets] = useState([]);
  const { user } = useContext(AuthContext);
  const { profile, queues } = user;
  const jsonString = user.queues.map(queue => queue?.UserQueue?.queueId);

  const fetchTickets = async (jsonString) => {
    try {
      const { data } = await api.get("/ticket/kanban", {
        params: {
          queueIds: JSON.stringify(jsonString),
          teste: true
        }
      });
      setTickets(data.tickets);
    } catch (err) {
      console.log(err);
      setTickets([]);
    }
  };

  const popularCards = (jsonString) => {
    const filteredTickets = tickets.filter(ticket => ticket.tags.length === 0);

    const lanes = [
      {
        id: "lane0",
        title: i18n.t("tagsKanban.laneDefault"),
        label: "0",
        cards: filteredTickets.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
              <div>
                <p>
                  {ticket.contact.number}
                  <br />
                  {ticket.lastMessage}
                </p>
                <button 
                  className={classes.button} 
                  onClick={() => {
                    handleCardClick(ticket.uuid)
                  }}>
                    Ver Ticket
                </button>
              </div>
            ),
          title: ticket.contact.name,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
      },
      ...tags.map(tag => {
        const filteredTickets = tickets.filter(ticket => {
          const tagIds = ticket.tags.map(tag => tag.id);
          return tagIds.includes(tag.id);
        });

        return {
          id: tag.id.toString(),
          title: tag.name,
          label: tag.id.toString(),
          cards: filteredTickets.map(ticket => ({
            id: ticket.id.toString(),
            label: "Ticket nº " + ticket.id.toString(),
            description: (
              <div>
                <p>
                  {ticket.contact.number}
                  <br />
                  {ticket.lastMessage}
                </p>
                <button 
                  className={classes.button} 
                  onClick={() => {
                    handleCardClick(ticket.uuid)
                  }}>
                    Ver Ticket
                </button>
              </div>
            ),
            title: ticket.contact.name,
            draggable: true,
            href: "/tickets/" + ticket.uuid,          
          })),
          style: { backgroundColor: tag.color, color: "white" }
        };
      }),
    ];

    setFile({ lanes });
  };

  const handleCardClick = (uuid) => {  
    history.push('/tickets/' + uuid);
  };

  useEffect(() => {
    popularCards(jsonString);
  }, [tags, tickets, reloadData]);

  const handleCardMove = async (cardId, sourceLaneId, targetLaneId) => {
    try {
      await api.delete(`/ticket-tags/${targetLaneId}`);
      toast.success('Ticket Tag Removido!');
      await api.put(`/ticket-tags/${targetLaneId}/${sourceLaneId}`);
      toast.success('Ticket Tag Adicionado com Sucesso!');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="xl" className={classes.container}>
        
        {/* Header Section */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <ViewColumnIcon className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                Kanban Board
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Gerencie tickets visualmente através do quadro Kanban organizados por tags
              </Typography>
            </div>
          </div>
        </Box>

        {/* Kanban Board Section */}
        <Paper className={classes.contentSection} elevation={0}>
          <div className={classes.kanbanContainer}>
            <Board 
              data={file} 
              onCardMoveAcrossLanes={handleCardMove}
              style={{backgroundColor: 'transparent'}}
            />
          </div>
        </Paper>

      </Container>
    </div>
  );
};

export default Kanban;