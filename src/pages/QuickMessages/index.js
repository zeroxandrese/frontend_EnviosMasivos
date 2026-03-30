import React, { useState, useEffect, useReducer, useContext, useCallback  } from "react";
import { toast } from "react-toastify";

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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import MessageIcon from "@material-ui/icons/Message";
import SpeedIcon from "@material-ui/icons/Speed";
import MenuIcon from "@material-ui/icons/Menu";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import AddIcon from "@material-ui/icons/Add";
import PublicIcon from "@material-ui/icons/Public";
import PersonIcon from "@material-ui/icons/Person";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import QuickMessageDialog from "../../components/QuickMessageDialog";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Grid } from "@material-ui/core";
import { isArray } from "lodash";
import { socketConnection } from "../../services/socket";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_QUICKMESSAGES") {
    const quickmessages = action.payload;
    const newQuickmessages = [];

    if (isArray(quickmessages)) {
      quickmessages.forEach((quickemessage) => {
        const quickemessageIndex = state.findIndex(
          (u) => u.id === quickemessage.id
        );
        if (quickemessageIndex !== -1) {
          state[quickemessageIndex] = quickemessage;
        } else {
          newQuickmessages.push(quickemessage);
        }
      });
    }

    return [...state, ...newQuickmessages];
  }

  if (action.type === "UPDATE_QUICKMESSAGES") {
    const quickemessage = action.payload;
    const quickemessageIndex = state.findIndex((u) => u.id === quickemessage.id);

    if (quickemessageIndex !== -1) {
      state[quickemessageIndex] = quickemessage;
      return [...state];
    } else {
      return [quickemessage, ...state];
    }
  }

  if (action.type === "DELETE_QUICKMESSAGE") {
    const quickemessageId = action.payload;

    const quickemessageIndex = state.findIndex((u) => u.id === quickemessageId);
    if (quickemessageIndex !== -1) {
      state.splice(quickemessageIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    maxWidth: "1400px",
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
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
  controlsSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  controlsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(3),
  },
  controlsTitle: {
    display: "flex",
    alignItems: "center",
    color: "#1e293b",
    fontWeight: 700,
    fontSize: "20px",
  },
  searchField: {
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
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    borderRadius: "16px",
    padding: theme.spacing(1.5, 4),
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    fontSize: "16px",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
      transform: "translateY(-2px)",
    },
  },
  tableCard: {
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    border: "none",
    overflow: "hidden",
    marginBottom: theme.spacing(4),
  },
  tableContainer: {
    maxHeight: "65vh",
    overflow: "auto",
    ...theme.scrollbarStyles,
  },
  modernTable: {
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
    "& .MuiTableRow-root:hover": {
      backgroundColor: "#e2e8f0",
      transition: "background-color 0.2s ease",
    },
    "& .MuiTableCell-root": {
      borderBottom: "1px solid #e2e8f0",
      padding: theme.spacing(2),
    },
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  },
  actionButton: {
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  editButton: {
    color: "#3b82f6",
    "&:hover": {
      color: "#1d4ed8",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
    },
  },
  deleteButton: {
    color: "#ef4444",
    "&:hover": {
      color: "#dc2626",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
    },
  },
  typeChip: {
    fontWeight: 600,
    borderRadius: "12px",
    minWidth: "80px",
  },
  menuChip: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
  },
  shortcutChip: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  statusIcon: {
    color: "#059669",
    animation: "$pulse 2s infinite",
  },
  "@keyframes pulse": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.7 },
    "100%": { opacity: 1 },
  },
  mainContainer: {
    background: "#f1f5f9",
    minHeight: "100vh",
  },
}));

const Quickemessages = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedQuickemessage, setSelectedQuickemessage] = useState(null);
  const [deletingQuickemessage, setDeletingQuickemessage] = useState(null);
  const [quickemessageModalOpen, setQuickMessageDialogOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [quickemessages, dispatch] = useReducer(reducer, []);
  const { user } = useContext(AuthContext);
  const { profile } = user;

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchQuickemessages();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on(`company${companyId}-quickemessage`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUICKMESSAGES", payload: data.record });
      }
      if (data.action === "delete") {
        dispatch({ type: "DELETE_QUICKMESSAGE", payload: +data.id });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchQuickemessages = async () => {
    try {
      const companyId = user.companyId;
      const { data } = await api.get("/quick-messages", {
        params: { searchParam, companyId, userId: user.id },
      });

      dispatch({ type: "LOAD_QUICKMESSAGES", payload: data.records });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenQuickMessageDialog = () => {
    setSelectedQuickemessage(null);
    setQuickMessageDialogOpen(true);
  };

  const handleCloseQuickMessageDialog = () => {
    setSelectedQuickemessage(null);
    setQuickMessageDialogOpen(false);
    fetchQuickemessages();
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditQuickemessage = (quickemessage) => {
    setSelectedQuickemessage(quickemessage);
    setQuickMessageDialogOpen(true);
  };

  const handleDeleteQuickemessage = async (quickemessageId) => {
    try {
      await api.delete(`/quick-messages/${quickemessageId}`);
      toast.success(i18n.t("quickemessages.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingQuickemessage(null);
    setSearchParam("");
    setPageNumber(1);
    fetchQuickemessages();
    dispatch({ type: "RESET" });
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

  const getTypeChip = (isCategory) => {
    if (isCategory) {
      return (
        <Chip
          icon={<MenuIcon style={{ fontSize: 16 }} />}
          label="Menu"
          className={`${classes.typeChip} ${classes.menuChip}`}
          size="small"
        />
      );
    } else {
      return (
        <Chip
          icon={<SpeedIcon style={{ fontSize: 16 }} />}
          label="Atalho"
          className={`${classes.typeChip} ${classes.shortcutChip}`}
          size="small"
        />
      );
    }
  };

  return (
    <div className={classes.mainContainer}>
      <Container maxWidth="xl" className={classes.container}>
        
        {/* Header Section */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <MessageIcon className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                {i18n.t("quickMessages.title")}
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Gestiona tus mensajes rápidos y menús de atención al cliente.
              </Typography>
            </div>
          </div>
        </Box>

        {/* Controls Section */}
        <Paper className={classes.controlsSection} elevation={0}>
          <div className={classes.controlsHeader}>
            <Typography className={classes.controlsTitle}>
              <SearchIcon style={{ marginRight: 12 }} />
              Buscar y Gerenciar
            </Typography>
            
            <Button
              variant="contained"
              onClick={handleOpenQuickMessageDialog}
              className={classes.addButton}
              startIcon={<AddIcon />}
            >
              {i18n.t("quickMessages.buttons.add")}
            </Button>
          </div>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder={i18n.t("quickMessages.searchPlaceholder")}
                type="search"
                value={searchParam}
                onChange={handleSearch}
                className={classes.searchField}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon style={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Table Section */}
        <Paper className={classes.tableCard} elevation={0}>
          <div 
            className={classes.tableContainer}
            onScroll={handleScroll}
          >
            {loading && quickemessages.length === 0 ? (
              <div className={classes.loadingContainer}>
                <CircularProgress size={40} />
              </div>
            ) : (
              <Table size="small" className={classes.modernTable}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <SpeedIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("quickMessages.table.shortcode")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <MessageIcon style={{ marginRight: 8, color: "#64748b" }} />
                        Tipo de mensaje
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <AttachFileIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("quickMessages.table.mediaName")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <PublicIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("quickMessages.table.status")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <EditIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("quickMessages.table.actions")}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quickemessages.length > 0 ? (
                    quickemessages.map((quickemessage) => (
                      <TableRow key={quickemessage.id}>
                        <TableCell align="center">
                          <Typography variant="body1" style={{ fontWeight: 600, color: "#1e293b" }}>
                            {quickemessage.shortcode}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {getTypeChip(quickemessage.isCategory)}
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center">
                            {quickemessage.mediaName ? (
                              <>
                                <AttachFileIcon style={{ marginRight: 8, color: "#059669", fontSize: 18 }} />
                                <Typography variant="body2" style={{ color: "#059669", fontWeight: 500 }}>
                                  {quickemessage.mediaName}
                                </Typography>
                              </>
                            ) : (
                              <Typography variant="body2" style={{ color: "#64748b" }}>
                                {i18n.t("quickMessages.noAttachment")}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          {quickemessage.geral === true ? (
                            <Box display="flex" alignItems="center" justifyContent="center">
                              <PublicIcon className={classes.statusIcon} style={{ marginRight: 8 }} />
                              <Typography variant="body2" style={{ color: "#059669", fontWeight: 600 }}>
                                Global
                              </Typography>
                            </Box>
                          ) : (
                            <Box display="flex" alignItems="center" justifyContent="center">
                              <PersonIcon style={{ marginRight: 8, color: "#64748b" }} />
                              <Typography variant="body2" style={{ color: "#64748b", fontWeight: 500 }}>
                                Tipo
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                            {(profile === "admin" || profile === "supervisor" ||
                              (profile === "user" && !quickemessage.geral)) && (
                              <IconButton
                                size="small"
                                onClick={() => handleEditQuickemessage(quickemessage)}
                                className={`${classes.actionButton} ${classes.editButton}`}
                              >
                                <EditIcon />
                              </IconButton>
                            )}

                            {(profile === "admin" || profile === "supervisor" ||
                              (profile === "user" && !quickemessage.geral)) && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  setConfirmModalOpen(true);
                                  setDeletingQuickemessage(quickemessage);
                                }}
                                className={`${classes.actionButton} ${classes.deleteButton}`}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    !loading && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" style={{ padding: "60px" }}>
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <MessageIcon style={{ fontSize: "64px", color: "#cbd5e1", marginBottom: "16px" }} />
                            <Typography color="textSecondary" variant="h6" style={{ marginBottom: "8px" }}>
                              No se encontraron mensajes rápidos
                            </Typography>
                            <Typography color="textSecondary" variant="body2">
                              Utilice la función de búsqueda o cree su primer mensaje rápido.
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                  {loading && <TableRowSkeleton columns={5} />}
                </TableBody>
              </Table>
            )}
          </div>
        </Paper>

        {/* Modals */}
        <ConfirmationModal
          title={deletingQuickemessage && `${i18n.t("quickMessages.confirmationModal.deleteTitle")} ${deletingQuickemessage.shortcode}?`}
          open={confirmModalOpen}
          onClose={setConfirmModalOpen}
          onConfirm={() => handleDeleteQuickemessage(deletingQuickemessage.id)}
        >
          {i18n.t("quickMessages.confirmationModal.deleteMessage")}
        </ConfirmationModal>
        
        <QuickMessageDialog
          resetPagination={() => {
            setPageNumber(1);
            fetchQuickemessages();
          }}
          open={quickemessageModalOpen}
          onClose={handleCloseQuickMessageDialog}
          aria-labelledby="form-dialog-title"
          quickemessageId={selectedQuickemessage && selectedQuickemessage.id}
        />

      </Container>
    </div>
  );
};

export default Quickemessages;