/* eslint-disable react/display-name */
/* eslint-disable no-console */
import React from 'react';
import { Grid, Paper, Typography, Box } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

// Ícones para os cards
import AssessmentIcon from '@material-ui/icons/Assessment';
import PollIcon from '@material-ui/icons/Poll';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import BarChartIcon from '@material-ui/icons/BarChart';

import MainHeader from '../../components/MainHeader';
import Title from '../../components/Title';
import MainContainer from './components/MainContainer';
import ReportsContainer from './components/ReportsContainer';
import reportsRoutes from './utils/ReportsRoutes';

const useStyles = makeStyles((theme) => ({
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
  // Cards Modernos para Reports
  modernReportCard: {
    borderRadius: "24px",
    padding: theme.spacing(4),
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.2)",
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
      "& $cardBackgroundIcon": {
        transform: "scale(1.1) rotate(-10deg)",
        opacity: 0.15,
      },
    },
  },
  cardBackgroundIcon: {
    position: "absolute",
    top: "20px",
    right: "20px",
    fontSize: "100px",
    opacity: 0.08,
    transition: "all 0.4s ease",
    zIndex: 0,
  },
  cardContent: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  cardIcon: {
    fontSize: "48px",
    marginBottom: theme.spacing(2),
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: theme.spacing(2),
  },
  // Estilos específicos para cada tipo de card
  ticketsCard: {
    background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
    boxShadow: "0 8px 30px rgba(5, 150, 105, 0.15)",
    "& $cardIcon": {
      color: "#059669",
    },
    "& $cardTitle": {
      color: "#047857",
    },
    "& $cardBackgroundIcon": {
      color: "#059669",
    },
  },
  researchCard: {
    background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
    boxShadow: "0 8px 30px rgba(124, 58, 237, 0.15)",
    "& $cardIcon": {
      color: "#7c3aed",
    },
    "& $cardTitle": {
      color: "#6d28d9",
    },
    "& $cardBackgroundIcon": {
      color: "#7c3aed",
    },
  },
  groupsCard: {
    background: "linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%)",
    boxShadow: "0 8px 30px rgba(8, 145, 178, 0.15)",
    "& $cardIcon": {
      color: "#0891b2",
    },
    "& $cardTitle": {
      color: "#0e7490",
    },
    "& $cardBackgroundIcon": {
      color: "#0891b2",
    },
  },
  gridContainer: {
    padding: theme.spacing(2),
  },
}));

// Componente de Card Modernizado para Reports
const ModernReportCard = ({ icon: Icon, title, cardClass, children }) => {
  const classes = useStyles();
  
  return (
    <div className={`${classes.modernReportCard} ${cardClass}`}>
      <Icon className={classes.cardBackgroundIcon} />
      <div className={classes.cardContent}>
        <div>
          <Icon className={classes.cardIcon} />
          <Typography className={classes.cardTitle}>
            {title}
          </Typography>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

const Reports = () => {
  const classes = useStyles();

  return (
    <div style={{ backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
      <MainContainer>
        {/* Header Modernizado */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <BarChartIcon className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                Informes
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Acceda a informes detallados y análisis de rendimiento
              </Typography>
            </div>
          </div>
        </Box>

        <Typography className={classes.sectionTitle}>
          <AssessmentIcon />
          Categorías de informes
        </Typography>

        <Grid container spacing={4} className={classes.gridContainer} sx={{ overflowY: 'unset' }}>
          <Grid item xs={12} md={6} lg={4}>
            <ModernReportCard
              icon={AssessmentIcon}
              title="Servicios"
              cardClass={classes.ticketsCard}
            >
              <ReportsContainer
                title=""
                links={reportsRoutes.tickets}
                style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
              />
            </ModernReportCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <ModernReportCard
              icon={PollIcon}
              title="Búsquedas"
              cardClass={classes.researchCard}
            >
              <ReportsContainer 
                title="" 
                links={reportsRoutes.research}
                style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
              />
            </ModernReportCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <ModernReportCard
              icon={GroupWorkIcon}
              title="Grupos"
              cardClass={classes.groupsCard}
            >
              <ReportsContainer 
                title="" 
                links={reportsRoutes.groups}
                style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
              />
            </ModernReportCard>
          </Grid>
        </Grid>
      </MainContainer>
    </div>
  );
};

export default Reports;