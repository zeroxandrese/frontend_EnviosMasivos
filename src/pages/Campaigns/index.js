/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";

import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import TableContainer from "@material-ui/core/TableContainer";
import Chip from "@material-ui/core/Chip";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import DescriptionIcon from "@material-ui/icons/Description";
import TimerOffIcon from "@material-ui/icons/TimerOff";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import FilterListIcon from "@material-ui/icons/FilterList";
import AddIcon from "@material-ui/icons/Add";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CancelIcon from "@material-ui/icons/Cancel";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ListAltIcon from "@material-ui/icons/ListAlt";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import ScheduleIcon from "@material-ui/icons/Schedule";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import CampaignModal from "../../components/CampaignModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Grid } from "@material-ui/core";
import { isArray } from "lodash";
import { useDate } from "../../hooks/useDate";
import { socketConnection } from "../../services/socket";
import usePlans from "../../hooks/usePlans";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_CAMPAIGNS") {
    const campaigns = action.payload;
    const newCampaigns = [];

    if (isArray(campaigns)) {
      campaigns.forEach((campaign) => {
        const campaignIndex = state.findIndex((u) => u.id === campaign.id);
        if (campaignIndex !== -1) {
          state[campaignIndex] = campaign;
        } else {
          newCampaigns.push(campaign);
        }
      });
    }

    return [...state, ...newCampaigns];
  }

  if (action.type === "UPDATE_CAMPAIGNS") {
    const campaign = action.payload;
    const campaignIndex = state.findIndex((u) => u.id === campaign.id);

    if (campaignIndex !== -1) {
      state[campaignIndex] = campaign;
      return [...state];
    } else {
      return [campaign, ...state];
    }
  }

  if (action.type === "DELETE_CAMPAIGN") {
    const campaignId = action.payload;

    const campaignIndex = state.findIndex((u) => u.id === campaignId);
    if (campaignIndex !== -1) {
      state.splice(campaignIndex, 1);
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
  activeIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  completedIcon: {
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
  },
  cancelledIcon: {
    backgroundColor: "#fecaca",
    color: "#dc2626",
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
  campaignsTable: {
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
  campaignName: {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "15px",
  },
  statusInactive: {
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    fontWeight: 600,
  },
  statusScheduled: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontWeight: 600,
  },
  statusRunning: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontWeight: 600,
  },
  statusCancelled: {
    backgroundColor: "#fecaca",
    color: "#991b1b",
    fontWeight: 600,
  },
  statusCompleted: {
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    fontWeight: 600,
  },
  contactListName: {
    color: "#3b82f6",
    fontWeight: 500,
    fontSize: "13px",
  },
  whatsappName: {
    color: "#059669",
    fontWeight: 500,
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
  scheduleDate: {
    fontFamily: "monospace",
    backgroundColor: "#f1f5f9",
    padding: theme.spacing(0.5, 1),
    borderRadius: "8px",
    fontSize: "12px",
    color: "#475569",
  },
  confirmationEnabled: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontWeight: 600,
  },
  confirmationDisabled: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    fontWeight: 600,
  },
  actionButtons: {
    display: "flex",
    gap: theme.spacing(0.5),
  },
  playIcon: {
    color: "#059669",
    backgroundColor: "#dcfce7",
    padding: theme.spacing(0.5),
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#bbf7d0",
      transform: "scale(1.1)",
    },
  },
  pauseIcon: {
    color: "#f59e0b",
    backgroundColor: "#fef3c7",
    padding: theme.spacing(0.5),
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#fde68a",
      transform: "scale(1.1)",
    },
  },
  reportIcon: {
    color: "#3b82f6",
    backgroundColor: "#dbeafe",
    padding: theme.spacing(0.5),
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#bfdbfe",
      transform: "scale(1.1)",
    },
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
}));

const Campaigns = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [deletingCampaign, setDeletingCampaign] = useState(null);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [campaigns, dispatch] = useReducer(reducer, []);
  const { user } = useContext(AuthContext);

  const { datetimeToClient } = useDate();
  const { getPlanCompany } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);
      if (!planConfigs.plan.useCampaigns) {
        toast.error("Esta empresa no tiene permiso para acceder a esta página! Le estamos redirigiendo.");
        setTimeout(() => {          
          history.push(`/`)
        }, 1000);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchCampaigns();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on(`company-${companyId}-campaign`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_CAMPAIGNS", payload: data.record });
      }
      if (data.action === "delete") {
        dispatch({ type: "DELETE_CAMPAIGN", payload: +data.id });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data } = await api.get("/campaigns/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_CAMPAIGNS", payload: data.records });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenCampaignModal = () => {
    setSelectedCampaign(null);
    setCampaignModalOpen(true);
  };

  const handleCloseCampaignModal = () => {
    setSelectedCampaign(null);
    setCampaignModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setCampaignModalOpen(true);
  };

  const handleDeleteCampaign = async (campaignId) => {
    try {
      await api.delete(`/campaigns/${campaignId}`);
      toast.success(i18n.t("campaigns.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingCampaign(null);
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

  const formatStatus = (val) => {
    switch (val) {
      case "INATIVA":
        return "Inativa";
      case "PROGRAMADA":
        return "Programada";
      case "EM_ANDAMENTO":
        return "Em Andamento";
      case "CANCELADA":
        return "Cancelada";
      case "FINALIZADA":
        return "Finalizada";
      default:
        return val;
    }
  };

  const getStatusChipClass = (status) => {
    switch(status) {
      case "INATIVA":
        return classes.statusInactive;
      case "PROGRAMADA":
        return classes.statusScheduled;
      case "EM_ANDAMENTO":
        return classes.statusRunning;
      case "CANCELADA":
        return classes.statusCancelled;
      case "FINALIZADA":
        return classes.statusCompleted;
      default:
        return classes.statusInactive;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "INATIVA":
        return <HourglassEmptyIcon fontSize="small" />;
      case "PROGRAMADA":
        return <ScheduleIcon fontSize="small" />;
      case "EM_ANDAMENTO":
        return <TrendingUpIcon fontSize="small" />;
      case "CANCELADA":
        return <CancelIcon fontSize="small" />;
      case "FINALIZADA":
        return <CheckCircleIcon fontSize="small" />;
      default:
        return <HourglassEmptyIcon fontSize="small" />;
    }
  };

  const cancelCampaign = async (campaign) => {
    try {
      await api.post(`/campaigns/${campaign.id}/cancel`);
      toast.success(i18n.t("campaigns.toasts.cancel"));
      setPageNumber(1);
      fetchCampaigns();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const restartCampaign = async (campaign) => {
    try {
      await api.post(`/campaigns/${campaign.id}/restart`);
      toast.success(i18n.t("campaigns.toasts.restart"));
      setPageNumber(1);
      fetchCampaigns();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Calcular estatísticas
  const getCampaignStats = () => {
    const total = campaigns.length;
    const running = campaigns.filter(c => c.status === 'EM_ANDAMENTO').length;
    const completed = campaigns.filter(c => c.status === 'FINALIZADA').length;
    const cancelled = campaigns.filter(c => c.status === 'CANCELADA').length;

    return { total, running, completed, cancelled };
  };

  const stats = getCampaignStats();

  return (
    <div className={classes.mainContainer}>
      <Container maxWidth="xl">
        <ConfirmationModal
          title={
            deletingCampaign &&
            `${i18n.t("campaigns.confirmationModal.deleteTitle")} ${deletingCampaign.name}?`
          }
          open={confirmModalOpen}
          onClose={setConfirmModalOpen}
          onConfirm={() => handleDeleteCampaign(deletingCampaign.id)}
        >
          {i18n.t("campaigns.confirmationModal.deleteMessage")}
        </ConfirmationModal>
        
        <CampaignModal
          resetPagination={() => {
            setPageNumber(1);
            fetchCampaigns();
          }}
          open={campaignModalOpen}
          onClose={handleCloseCampaignModal}
          aria-labelledby="form-dialog-title"
          campaignId={selectedCampaign && selectedCampaign.id}
        />

        {/* Header Modernizado */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <AnnouncementIcon className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                Gestión de campañas
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Crea, gestiona y monitoriza tus campañas de marketing
              </Typography>
            </div>
          </div>
        </Box>

        {/* Seção de Filtros Modernizada */}
        <Paper className={classes.filtersSection} elevation={0}>
          <Typography className={classes.filtersTitle}>
            <FilterListIcon style={{ marginRight: 12 }} />
            Buscar y Gerenciar campañas
          </Typography>
          
          <div className={classes.filtersGroup}>
            <TextField
              placeholder={i18n.t("campaigns.searchPlaceholder")}
              type="search"
              value={searchParam}
              onChange={handleSearch}
              className={classes.searchField}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="secondary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              className={classes.addButton}
              variant="contained"
              onClick={handleOpenCampaignModal}
              startIcon={<AddIcon />}
            >
              {i18n.t("campaigns.buttons.add")}
            </Button>
          </div>
        </Paper>

        {/* Cards de Estatísticas */}
        <Box className={classes.statsGrid}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                <AnnouncementIcon />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Total de Campañas
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.total}
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.activeIcon}`}>
                <TrendingUpIcon />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  En curso
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.running}
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.completedIcon}`}>
                <DoneAllIcon />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Finalizadas
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.completed}
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.cancelledIcon}`}>
                <CancelIcon />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Canceladas
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.cancelled}
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
            <Table stickyHeader className={classes.campaignsTable}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <AnnouncementIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("campaigns.table.name")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <TrendingUpIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("campaigns.table.status")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <ListAltIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("campaigns.table.contactList")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <WhatsAppIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("campaigns.table.whatsapp")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <ScheduleIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("campaigns.table.scheduledAt")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <EventAvailableIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("campaigns.table.completedAt")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <VerifiedUserIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("campaigns.table.confirmation")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {i18n.t("campaigns.table.actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id} hover>
                    <TableCell>
                      <Typography className={classes.campaignName}>
                        {campaign.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={formatStatus(campaign.status)}
                        className={getStatusChipClass(campaign.status)}
                        size="small"
                        icon={getStatusIcon(campaign.status)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography className={classes.contactListName}>
                        {campaign.contactListId
                          ? campaign.contactList.name
                          : "No definida"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography className={classes.whatsappName}>
                        <WhatsAppIcon style={{ fontSize: 16 }} />
                        {campaign.whatsappId
                          ? campaign.whatsapp.name
                          : "No definido"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography className={classes.scheduleDate}>
                        {campaign.scheduledAt
                          ? datetimeToClient(campaign.scheduledAt)
                          : "Sin agendamento"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography className={classes.scheduleDate}>
                        {campaign.completedAt
                          ? datetimeToClient(campaign.completedAt)
                          : "No concluída"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={campaign.confirmation ? "Habilitada" : "Desabilitada"}
                        className={campaign.confirmation ? classes.confirmationEnabled : classes.confirmationDisabled}
                        size="small"
                        icon={campaign.confirmation ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <div className={classes.actionButtons}>
                        {campaign.status === "EM_ANDAMENTO" && (
                          <IconButton
                            onClick={() => cancelCampaign(campaign)}
                            title="Parar Campaña"
                            size="small"
                            className={classes.pauseIcon}
                          >
                            <PauseCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        )}
                        {campaign.status === "CANCELADA" && (
                          <IconButton
                            onClick={() => restartCampaign(campaign)}
                            title="Reiniciar Campaña"
                            size="small"
                            className={classes.playIcon}
                          >
                            <PlayCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={() =>
                            history.push(`/campaign/${campaign.id}/report`)
                          }
                          size="small"
                          className={classes.reportIcon}
                          title="Ver Informe"
                        >
                          <DescriptionIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditCampaign(campaign)}
                          className={classes.editIcon}
                          title="Editar"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setConfirmModalOpen(true);
                            setDeletingCampaign(campaign);
                          }}
                          className={classes.deleteIcon}
                          title="Deletar"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {loading && <TableRowSkeleton columns={8} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
};

export default Campaigns;