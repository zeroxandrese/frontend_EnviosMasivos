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
import AnnouncementIcon from "@material-ui/icons/Announcement";
import FilterListIcon from "@material-ui/icons/FilterList";
import AddIcon from "@material-ui/icons/Add";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ImageIcon from "@material-ui/icons/Image";
import ToggleOnIcon from "@material-ui/icons/ToggleOn";
import ToggleOffIcon from "@material-ui/icons/ToggleOff";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import AnnouncementModal from "../../components/AnnouncementModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Grid } from "@material-ui/core";
import { isArray } from "lodash";
import { socketConnection } from "../../services/socket";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_ANNOUNCEMENTS") {
    const announcements = action.payload;
    const newAnnouncements = [];

    if (isArray(announcements)) {
      announcements.forEach((announcement) => {
        const announcementIndex = state.findIndex(
          (u) => u.id === announcement.id
        );
        if (announcementIndex !== -1) {
          state[announcementIndex] = announcement;
        } else {
          newAnnouncements.push(announcement);
        }
      });
    }

    return [...state, ...newAnnouncements];
  }

  if (action.type === "UPDATE_ANNOUNCEMENTS") {
    const announcement = action.payload;
    const announcementIndex = state.findIndex((u) => u.id === announcement.id);

    if (announcementIndex !== -1) {
      state[announcementIndex] = announcement;
      return [...state];
    } else {
      return [announcement, ...state];
    }
  }

  if (action.type === "DELETE_ANNOUNCEMENT") {
    const announcementId = action.payload;

    const announcementIndex = state.findIndex((u) => u.id === announcementId);
    if (announcementIndex !== -1) {
      state.splice(announcementIndex, 1);
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
  priorityIcon: {
    backgroundColor: "#fef3c7",
    color: "#f59e0b",
  },
  mediaIcon: {
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
  announcementsTable: {
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
  announcementTitle: {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "15px",
  },
  priorityHigh: {
    backgroundColor: "#fecaca",
    color: "#991b1b",
    fontWeight: 600,
  },
  priorityMedium: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontWeight: 600,
  },
  priorityLow: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontWeight: 600,
  },
  statusActive: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontWeight: 600,
  },
  statusInactive: {
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    fontWeight: 600,
  },
  mediaName: {
    color: "#7c3aed",
    fontWeight: 500,
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
  actionButtons: {
    display: "flex",
    gap: theme.spacing(0.5),
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

const Announcements = () => {
  const classes = useStyles();
  const history = useHistory();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState(null);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [announcements, dispatch] = useReducer(reducer, []);

  // trava para nao acessar pagina que não pode  
  useEffect(() => {
    async function fetchData() {
      if (!user.super) {
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
      fetchAnnouncements();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on(`company-announcement`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_ANNOUNCEMENTS", payload: data.record });
      }
      if (data.action === "delete") {
        dispatch({ type: "DELETE_ANNOUNCEMENT", payload: +data.id });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get("/announcements/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_ANNOUNCEMENTS", payload: data.records });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenAnnouncementModal = () => {
    setSelectedAnnouncement(null);
    setAnnouncementModalOpen(true);
  };

  const handleCloseAnnouncementModal = () => {
    setSelectedAnnouncement(null);
    setAnnouncementModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setAnnouncementModalOpen(true);
  };

  const handleDeleteAnnouncement = async (announcement) => {
    try {
      if (announcement.mediaName)
      await api.delete(`/announcements/${announcement.id}/media-upload`);

      await api.delete(`/announcements/${announcement.id}`);
      
      toast.success(i18n.t("announcements.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingAnnouncement(null);
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

  const translatePriority = (val) => {
    if (val === 1) {
      return "Alta";
    }
    if (val === 2) {
      return "Média";
    }
    if (val === 3) {
      return "Baixa";
    }
  };

  const getPriorityChipClass = (priority) => {
    switch(priority) {
      case 1:
        return classes.priorityHigh;
      case 2:
        return classes.priorityMedium;
      case 3:
        return classes.priorityLow;
      default:
        return classes.priorityMedium;
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 1:
        return <PriorityHighIcon fontSize="small" />;
      case 2:
        return <TrendingUpIcon fontSize="small" />;
      case 3:
        return <CheckCircleIcon fontSize="small" />;
      default:
        return <TrendingUpIcon fontSize="small" />;
    }
  };

  // Calcular estatísticas
  const getAnnouncementStats = () => {
    const total = announcements.length;
    const active = announcements.filter(a => a.status).length;
    const highPriority = announcements.filter(a => a.priority === 1).length;
    const withMedia = announcements.filter(a => a.mediaName).length;

    return { total, active, highPriority, withMedia };
  };

  const stats = getAnnouncementStats();

  return (
    <div className={classes.mainContainer}>
      <MainContainer>
        <ConfirmationModal
          title={
            deletingAnnouncement &&
            `${i18n.t("announcements.confirmationModal.deleteTitle")} ${deletingAnnouncement.title}?`
          }
          open={confirmModalOpen}
          onClose={setConfirmModalOpen}
          onConfirm={() => handleDeleteAnnouncement(deletingAnnouncement)}
        >
          {i18n.t("announcements.confirmationModal.deleteMessage")}
        </ConfirmationModal>
        
        <AnnouncementModal
          resetPagination={() => {
            setPageNumber(1);
            fetchAnnouncements();
          }}
          open={announcementModalOpen}
          onClose={handleCloseAnnouncementModal}
          aria-labelledby="form-dialog-title"
          announcementId={selectedAnnouncement && selectedAnnouncement.id}
        />

        <Container maxWidth="xl">
          
          {/* Header Modernizado */}
          <Box className={classes.header}>
            <div className={classes.headerContent}>
              <AnnouncementIcon className={classes.headerIcon} />
              <div>
                <Typography className={classes.headerTitle}>
                  {i18n.t("announcements.title")}
                </Typography>
                <Typography className={classes.headerSubtitle}>
                  Gestionar los anuncios y notificaciones del sistema.
                </Typography>
              </div>
            </div>
          </Box>

          {/* Seção de Filtros Modernizada */}
          <Paper className={classes.filtersSection} elevation={0}>
            <Typography className={classes.filtersTitle}>
              <FilterListIcon style={{ marginRight: 12 }} />
              Buscar e Gerenciar Comunicados
            </Typography>
            
            <div className={classes.filtersGroup}>
              <TextField
                placeholder={i18n.t("announcements.searchPlaceholder")}
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
                onClick={handleOpenAnnouncementModal}
                startIcon={<AddIcon />}
              >
                {i18n.t("announcements.buttons.add")}
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
                    Total de Comunicados
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.total}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.activeIcon}`}>
                  <ToggleOnIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Comunicados Activos
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.active}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.priorityIcon}`}>
                  <PriorityHighIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Alta Prioridad
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.highPriority}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.mediaIcon}`}>
                  <ImageIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Con Media
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.withMedia}
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
              <Table stickyHeader className={classes.announcementsTable}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <AssignmentIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("announcements.table.title")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <PriorityHighIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("announcements.table.priority")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <ImageIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("announcements.table.mediaName")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <ToggleOnIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("announcements.table.status")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {i18n.t("announcements.table.actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {announcements.length > 0 ? (
                    <>
                      {announcements.map((announcement) => (
                        <TableRow key={announcement.id} hover>
                          <TableCell>
                            <Typography className={classes.announcementTitle}>
                              {announcement.title}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={translatePriority(announcement.priority)}
                              className={getPriorityChipClass(announcement.priority)}
                              size="small"
                              icon={getPriorityIcon(announcement.priority)}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {announcement.mediaName ? (
                              <Typography className={classes.mediaName}>
                                <ImageIcon style={{ fontSize: 16 }} />
                                {announcement.mediaName}
                              </Typography>
                            ) : (
                              <Typography color="textSecondary" variant="body2">
                                {i18n.t("quickMessages.noAttachment")}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={announcement.status ? i18n.t("announcements.active") : i18n.t("announcements.inactive")}
                              className={announcement.status ? classes.statusActive : classes.statusInactive}
                              size="small"
                              icon={announcement.status ? <ToggleOnIcon fontSize="small" /> : <ToggleOffIcon fontSize="small" />}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <div className={classes.actionButtons}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditAnnouncement(announcement)}
                                className={classes.editIcon}
                                title="Editar"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>

                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  setConfirmModalOpen(true);
                                  setDeletingAnnouncement(announcement);
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
                      {loading && <TableRowSkeleton columns={5} />}
                    </>
                  ) : (
                    !loading && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Box className={classes.emptyState}>
                            <AnnouncementIcon className={classes.emptyStateIcon} />
                            <Typography variant="h6" style={{ marginBottom: 8 }}>
                              No se encontraron anuncios
                            </Typography>
                            <Typography variant="body2">
                              Crea tu primer anuncio para empezar.
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

export default Announcements;