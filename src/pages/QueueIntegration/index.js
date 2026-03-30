import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
import { socketConnection } from "../../services/socket";
import n8n from "../../assets/n8n.png";
import dialogflow from "../../assets/dialogflow.png";
import webhooks from "../../assets/webhook.png"
import typebot from "../../assets/typebot.jpg";

import { makeStyles } from "@material-ui/core/styles";

import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Container,
  Box,
  TableContainer
} from "@material-ui/core";

import {
  DeleteOutline,
  Edit,
  Search,
  Add,
  FilterList,
  SettingsInputComponent,
  Label,
  Settings,
  LocalOffer,
  DeviceHub,
  Extension,
  Http
} from "@material-ui/icons";

import MainContainer from "../../components/MainContainer";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import IntegrationModal from "../../components/QueueIntegrationModal";
import ConfirmationModal from "../../components/ConfirmationModal";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_INTEGRATIONS") {
    const queueIntegration = action.payload;
    const newIntegrations = [];

    queueIntegration.forEach((integration) => {
      const integrationIndex = state.findIndex((u) => u.id === integration.id);
      if (integrationIndex !== -1) {
        state[integrationIndex] = integration;
      } else {
        newIntegrations.push(integration);
      }
    });

    return [...state, ...newIntegrations];
  }

  if (action.type === "UPDATE_INTEGRATIONS") {
    const queueIntegration = action.payload;
    const integrationIndex = state.findIndex((u) => u.id === queueIntegration.id);

    if (integrationIndex !== -1) {
      state[integrationIndex] = queueIntegration;
      return [...state];
    } else {
      return [queueIntegration, ...state];
    }
  }

  if (action.type === "DELETE_INTEGRATION") {
    const integrationId = action.payload;

    const integrationIndex = state.findIndex((u) => u.id === integrationId);
    if (integrationIndex !== -1) {
      state.splice(integrationIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
    padding: theme.spacing(3),
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
  filtersSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  filtersTitle: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(3),
    color: "#1e293b",
    fontWeight: 700,
    fontSize: "20px",
  },
  filtersGroup: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  searchField: {
    flex: 1,
    minWidth: "300px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#64748b",
      fontWeight: 500,
    },
  },
  addButton: {
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    borderRadius: "16px",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    minHeight: "48px",
    padding: theme.spacing(1.5, 3),
    boxShadow: "0 4px 15px rgba(5, 150, 105, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
      transform: "translateY(-2px)",
    },
  },
  statsGrid: {
    marginBottom: theme.spacing(4),
  },
  statCard: {
    background: "white",
    borderRadius: "16px",
    padding: theme.spacing(3),
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    },
  },
  statIcon: {
    fontSize: "40px",
    padding: theme.spacing(1),
    borderRadius: "12px",
  },
  totalIcon: {
    backgroundColor: "#dbeafe",
    color: "#3b82f6",
  },
  dialogflowIcon: {
    backgroundColor: "#fff3cd",
    color: "#f59e0b",
  },
  webhookIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  typebotIcon: {
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    marginBottom: theme.spacing(0.5),
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1e293b",
  },
  mainPaper: {
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    border: "none",
    overflow: "hidden",
    marginBottom: theme.spacing(3),
  },
  integrationsTable: {
    "& .MuiTableHead-root": {
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    },
    "& .MuiTableCell-head": {
      fontWeight: 700,
      color: "#1e293b",
      borderBottom: "2px solid #e2e8f0",
      fontSize: "14px",
      padding: theme.spacing(2),
    },
    "& .MuiTableRow-root:nth-child(even)": {
      backgroundColor: "#f8fafc",
    },
    "& .MuiTableCell-root": {
      borderBottom: "1px solid #e2e8f0",
      padding: theme.spacing(2),
      fontSize: "14px",
    },
    "& .MuiTableRow-hover:hover": {
      backgroundColor: "#e2e8f0 !important",
    },
  },
  integrationName: {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "15px",
  },
  integrationId: {
    fontWeight: 600,
    color: "#3b82f6",
  },
  avatar: {
    width: "140px",
    height: "40px",
    borderRadius: 8,
    border: "2px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  avatarCell: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    display: "flex",
    gap: theme.spacing(0.5),
    justifyContent: "center",
  },
  editIcon: {
    color: "#7c3aed",
    backgroundColor: "#f3e8ff",
    padding: theme.spacing(0.5),
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#e9d5ff",
      transform: "scale(1.1)",
    },
  },
  deleteIcon: {
    color: "#dc2626",
    backgroundColor: "#fecaca",
    padding: theme.spacing(0.5),
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#fca5a5",
      transform: "scale(1.1)",
    },
  },
  emptyState: {
    textAlign: "center",
    padding: theme.spacing(8, 4),
    color: "#64748b",
  },
  emptyStateIcon: {
    fontSize: "64px",
    color: "#cbd5e1",
    marginBottom: theme.spacing(2),
  },
}));

const QueueIntegration = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [queueIntegration, dispatch] = useReducer(reducer, []);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchIntegrations = async () => {
        try {
          const { data } = await api.get("/queueIntegration/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_INTEGRATIONS", payload: data.queueIntegrations });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchIntegrations();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on(`company-${companyId}-queueIntegration`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_INTEGRATIONS", payload: data.queueIntegration });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_INTEGRATION", payload: +data.integrationId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenUserModal = () => {
    setSelectedIntegration(null);
    setUserModalOpen(true);
  };

  const handleCloseIntegrationModal = () => {
    setSelectedIntegration(null);
    setUserModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditIntegration = (queueIntegration) => {
    setSelectedIntegration(queueIntegration);
    setUserModalOpen(true);
  };

  const handleDeleteIntegration = async (integrationId) => {
    try {
      await api.delete(`/queueIntegration/${integrationId}`);
      toast.success(i18n.t("queueIntegration.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingUser(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  // Filtrar integrações baseado na busca
  const filteredIntegrations = queueIntegration.filter(integration => 
    integration.name?.toLowerCase().includes(searchParam) ||
    integration.type?.toLowerCase().includes(searchParam) ||
    integration.id?.toString().includes(searchParam)
  );

  // Calcular estatísticas das integrações
  const getIntegrationStats = () => {
    const total = queueIntegration.length;
    const dialogflowCount = queueIntegration.filter(i => i.type === 'dialogflow').length;
    const webhookCount = queueIntegration.filter(i => i.type === 'webhook').length;
    const typebotCount = queueIntegration.filter(i => i.type === 'typebot').length;
    const n8nCount = queueIntegration.filter(i => i.type === 'n8n').length;

    return { total, dialogflowCount, webhookCount, typebotCount, n8nCount };
  };

  const stats = getIntegrationStats();

  return (
    <div className={classes.mainContainer}>
      <MainContainer>
        <ConfirmationModal
          title={
            deletingUser &&
            `${i18n.t("queueIntegration.confirmationModal.deleteTitle")} ${deletingUser.name}?`
          }
          open={confirmModalOpen}
          onClose={setConfirmModalOpen}
          onConfirm={() => handleDeleteIntegration(deletingUser.id)}
        >
          {i18n.t("queueIntegration.confirmationModal.deleteMessage")}
        </ConfirmationModal>
        
        <IntegrationModal
          open={userModalOpen}
          onClose={handleCloseIntegrationModal}
          aria-labelledby="form-dialog-title"
          integrationId={selectedIntegration && selectedIntegration.id}
        />

        <Container maxWidth="xl">
          
          {/* Header Modernizado */}
          <Box className={classes.header}>
            <div className={classes.headerContent}>
              <SettingsInputComponent className={classes.headerIcon} />
              <div>
                <Typography className={classes.headerTitle}>
                  {i18n.t("queueIntegration.title")}
                </Typography>
                <Typography className={classes.headerSubtitle}>
                  Gestionar las integraciones con sistemas externos.
                </Typography>
              </div>
            </div>
          </Box>

          {/* Seção de Filtros Modernizada */}
          <Paper className={classes.filtersSection} elevation={0}>
            <Typography className={classes.filtersTitle}>
              <FilterList style={{ marginRight: 12 }} />
              Buscar y gestionar integraciones
            </Typography>
            
            <div className={classes.filtersGroup}>
              <TextField
                placeholder={i18n.t("queueIntegration.searchPlaceholder")}
                type="search"
                value={searchParam}
                onChange={handleSearch}
                className={classes.searchField}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="secondary" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                className={classes.addButton}
                variant="contained"
                onClick={handleOpenUserModal}
                startIcon={<Add />}
              >
                {i18n.t("queueIntegration.buttons.add")}
              </Button>
            </div>
          </Paper>

          {/* Cards de Estatísticas */}
          <Box className={classes.statsGrid}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                  <DeviceHub />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Integraciones totales
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.total}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.dialogflowIcon}`}>
                  <Extension />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Dialogflow
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.dialogflowCount}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.webhookIcon}`}>
                  <Http />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Webhooks
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.webhookCount}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.typebotIcon}`}>
                  <LocalOffer />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Typebot/N8N
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.typebotCount + stats.n8nCount}
                  </Typography>
                </div>
              </div>
            </div>
          </Box>

          {/* Tabela Modernizada */}
          <Paper className={classes.mainPaper} elevation={0}>
            <TableContainer
              style={{ 
                maxHeight: 600,
                overflowY: "auto"
              }}
              onScroll={handleScroll}
            >
              <Table size="small" className={classes.integrationsTable}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Settings style={{ marginRight: 8, color: "#64748b" }} />
                        Tipo
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <Label style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("queueIntegration.table.id")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <LocalOffer style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("queueIntegration.table.name")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      Comportamiento
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIntegrations.length > 0 ? (
                    <>
                      {filteredIntegrations.map((integration) => (
                        <TableRow key={integration.id} hover>
                          <TableCell align="center">
                            <div className={classes.avatarCell}>
                              {integration.type === "dialogflow" && (
                                <Tooltip title="Dialogflow">
                                  <Avatar src={dialogflow} className={classes.avatar} />
                                </Tooltip>
                              )}
                              {integration.type === "n8n" && (
                                <Tooltip title="N8N">
                                  <Avatar src={n8n} className={classes.avatar} />
                                </Tooltip>
                              )}
                              {integration.type === "webhook" && (
                                <Tooltip title="Webhook">
                                  <Avatar src={webhooks} className={classes.avatar} />
                                </Tooltip>
                              )}
                              {integration.type === "typebot" && (
                                <Tooltip title="Typebot">
                                  <Avatar src={typebot} className={classes.avatar} />
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <Typography className={classes.integrationId}>
                              #{integration.id}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography className={classes.integrationName}>
                              {integration.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <div className={classes.actionButtons}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditIntegration(integration)}
                                className={classes.editIcon}
                                title="Editar"
                              >
                                <Edit fontSize="small" />
                              </IconButton>

                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  setConfirmModalOpen(true);
                                  setDeletingUser(integration);
                                }}
                                className={classes.deleteIcon}
                                title="Deletar"
                              >
                                <DeleteOutline fontSize="small" />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {loading && <TableRowSkeleton columns={4} />}
                    </>
                  ) : (
                    !loading && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Box className={classes.emptyState}>
                            <SettingsInputComponent className={classes.emptyStateIcon} />
                            <Typography variant="h6" style={{ marginBottom: 8 }}>
                              {searchParam ? "No se encontrarán integraciones." : "No hay integraciones configuradas"}
                            </Typography>
                            <Typography variant="body2">
                              {searchParam ? "Intenta ajustar tu búsqueda" : "Configura tu primera integración para empezar."}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </MainContainer>
    </div>
  );
};

export default QueueIntegration;