import React from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";

// Ícones
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import MomentsUser from "../../components/MomentsUser";
// import MomentsQueues from "../../components/MomentsQueues";
import Title from "./Title";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
    padding: theme.spacing(3),
  },
  container: {
    maxWidth: "1400px",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
  sectionTitle: {
    fontWeight: 700,
    fontSize: "24px",
    color: "#1e293b",
    marginBottom: theme.spacing(4),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  momentsContainer: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
    position: "relative",
    overflow: "hidden",
    "&:before": {
      content: '""',
      position: "absolute",
      top: "-20px",
      right: "-20px",
      width: "150px",
      height: "150px",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
      borderRadius: "50%",
      opacity: 0.3,
      zIndex: 0,
    },
  },
  momentsContent: {
    position: "relative",
    zIndex: 1,
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: 100,
  },
  chatPapper: {
    display: "flex",
    height: "100%",
  },
  contactsHeader: {
    display: "flex",
    flexWrap: "wrap",
    padding: "0px 6px 6px 6px",
  }
}));

const ChatMoments = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.mainContainer}>
      <Container maxWidth="xl" className={classes.container}>
        
        {/* Header Modernizado */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <AccessTimeIcon className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                Tiempo real
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Seguimiento de actividades e interacciones en tiempo real
              </Typography>
            </div>
          </div>
        </Box>

        {/* Seção de Atividades */}
        <Typography className={classes.sectionTitle}>
          <TrendingUpIcon />
          Actividades del usuario
        </Typography>

        {/* Container Modernizado para MomentsUser */}
        <Paper className={classes.momentsContainer} elevation={0}>
          <div className={classes.momentsContent}>
            <div className={classes.contactsHeader}>
              <MomentsUser />
            </div>
          </div>
        </Paper>

      </Container>
    </div>
  );
};

export default ChatMoments;