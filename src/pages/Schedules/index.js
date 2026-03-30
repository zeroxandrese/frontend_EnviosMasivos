import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useContext,
} from "react";
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
import Chip from "@material-ui/core/Chip";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import ScheduleIcon from "@material-ui/icons/Schedule";
import EventIcon from "@material-ui/icons/Event";
import PersonIcon from "@material-ui/icons/Person";
import MessageIcon from "@material-ui/icons/Message";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CancelIcon from "@material-ui/icons/Cancel";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ScheduleModal from "../../components/ScheduleModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import moment from "moment";
import { capitalize } from "lodash";
import { socketConnection } from "../../services/socket";
import { AuthContext } from "../../context/Auth/AuthContext";
import usePlans from "../../hooks/usePlans";

// A custom hook that builds on useLocation to parse
// the query string for you.
const getUrlParam = (param) => {
  return new URLSearchParams(window.location.search).get(param);
};

const reducer = (state, action) => {
  if (action.type === "LOAD_SCHEDULES") {
    const schedules = action.payload;
    const newSchedules = [];

    schedules.forEach((schedule) => {
      const scheduleIndex = state.findIndex((s) => s.id === schedule.id);
      if (scheduleIndex !== -1) {
        state[scheduleIndex] = schedule;
      } else {
        newSchedules.push(schedule);
      }
    });

    return [...state, ...newSchedules];
  }

  if (action.type === "UPDATE_SCHEDULES") {
    const schedule = action.payload;
    const scheduleIndex = state.findIndex((s) => s.id === schedule.id);

    if (scheduleIndex !== -1) {
      state[scheduleIndex] = schedule;
      return [...state];
    } else {
      return [schedule, ...state];
    }
  }

  if (action.type === "DELETE_SCHEDULE") {
    const scheduleId = action.payload;

    const scheduleIndex = state.findIndex((s) => s.id === scheduleId);
    if (scheduleIndex !== -1) {
      state.splice(scheduleIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  modernHeader: {
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
  statsContainer: {
    marginBottom: theme.spacing(3),
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
    gap: 24
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
  pendingIcon: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
  },
  sentIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
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
  schedulesTable: {
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
  contactName: {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "15px",
  },
  messageBody: {
    color: "#64748b",
    fontSize: "13px",
  },
  scheduleDate: {
    fontFamily: "monospace",
    backgroundColor: "#f1f5f9",
    padding: theme.spacing(0.5, 1),
    borderRadius: "6px",
    fontSize: "12px",
    color: "#475569",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    fontWeight: 600,
  },
  statusSent: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontWeight: 600,
  },
  statusCancelled: {
    backgroundColor: "#fecaca",
    color: "#991b1b",
    fontWeight: 600,
  },
  statusError: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    fontWeight: 600,
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
}));

const Schedules = () => {
  const classes = useStyles();
  const history = useHistory();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [schedules, dispatch] = useReducer(reducer, []);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [contactId, setContactId] = useState(+getUrlParam("contactId"));

  const { getPlanCompany } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);
      if (!planConfigs.plan.useSchedules) {
        toast.error("Esta empresa no tiene permiso para acceder a esta página! Le estamos redirigiendo.");
        setTimeout(() => {
          history.push(`/`)
        }, 1000);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSchedules = useCallback(async () => {
    try {
      const { data } = await api.get("/schedules/", {
        params: { searchParam, pageNumber },
      });

      dispatch({ type: "LOAD_SCHEDULES", payload: data.schedules });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  }, [searchParam, pageNumber]);

  const handleOpenScheduleModalFromContactId = useCallback(() => {
    if (contactId) {
      handleOpenScheduleModal();
    }
  }, [contactId]);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchSchedules();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [
    searchParam,
    pageNumber,
    contactId,
    fetchSchedules,
    handleOpenScheduleModalFromContactId,
  ]);

  useEffect(() => {
    handleOpenScheduleModalFromContactId();
    const socket = socketConnection({ companyId: user.companyId });

    socket.on(`company${user.companyId}-schedule`, (data) => {
      console.log(data)
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_SCHEDULES", payload: data.schedule });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_SCHEDULE", payload: +data.scheduleId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [handleOpenScheduleModalFromContactId, user]);

  const cleanContact = () => {
    setContactId("");
  };

  const handleOpenScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setScheduleModalOpen(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await api.delete(`/schedules/${scheduleId}`);
      toast.success(i18n.t("schedules.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingSchedule(null);
    setSearchParam("");
    setPageNumber(1);

    dispatch({ type: "RESET" });
    setPageNumber(1);
    await fetchSchedules();
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

  const truncate = (str, len) => {
    if (str.length > len) {
      return str.substring(0, len) + "...";
    }
    return str;
  };

  const getScheduleStats = () => {
    const total = schedules.length;
    const pending = schedules.filter(s => 
      (s.status && s.status.toLowerCase() === 'pending') || s.status === 'PENDING'
    ).length;
    const sent = schedules.filter(s => 
      (s.status && s.status.toLowerCase() === 'sent') || s.status === 'SENT'
    ).length;

    return { total, pending, sent };
  };

  const getStatusChipClass = (status) => {
    if (!status) return classes.statusPending;
    const normalizedStatus = status.toLowerCase();
    switch(normalizedStatus) {
      case 'pending':
        return classes.statusPending;
      case 'sent':
        return classes.statusSent;
      case 'cancelled':
        return classes.statusCancelled;
      case 'error':
        return classes.statusError;
      default:
        return classes.statusPending;
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <HourglassEmptyIcon fontSize="small" />;
    const normalizedStatus = status.toLowerCase();
    switch(normalizedStatus) {
      case 'pending':
        return <HourglassEmptyIcon fontSize="small" />;
      case 'sent':
        return <CheckCircleIcon fontSize="small" />;
      case 'cancelled':
        return <CancelIcon fontSize="small" />;
      case 'error':
        return <CancelIcon fontSize="small" />;
      default:
        return <HourglassEmptyIcon fontSize="small" />;
    }
  };

  const stats = getScheduleStats();

  return (
    <MainContainer>
      <Box className={classes.modernHeader}>
        <div className={classes.headerContent}>
          <ScheduleIcon className={classes.headerIcon} />
          <div>
            <Typography className={classes.headerTitle}>
              Programación de mensajes
            </Typography>
            <Typography className={classes.headerSubtitle}>
              Programar y gestionar el envío automático de mensajes
            </Typography>
          </div>
        </div>
      </Box>

      <Box className={classes.statsContainer}>
        <div className={classes.statCard}>
          <div className={`${classes.statIcon} ${classes.totalIcon}`}>
            <EventIcon />
          </div>
          <div className={classes.statContent}>
            <Typography className={classes.statTitle}>
              Total de citas
            </Typography>
            <Typography className={classes.statValue}>
              {stats.total}
            </Typography>
          </div>
        </div>

        <div className={classes.statCard}>
          <div className={`${classes.statIcon} ${classes.pendingIcon}`}>
            <HourglassEmptyIcon />
          </div>
          <div className={classes.statContent}>
            <Typography className={classes.statTitle}>
              Pendentes
            </Typography>
            <Typography className={classes.statValue}>
              {stats.pending}
            </Typography>
          </div>
        </div>

        <div className={classes.statCard}>
          <div className={`${classes.statIcon} ${classes.sentIcon}`}>
            <CheckCircleIcon />
          </div>
          <div className={classes.statContent}>
            <Typography className={classes.statTitle}>
              Enviados
            </Typography>
            <Typography className={classes.statValue}>
              {stats.sent}
            </Typography>
          </div>
        </div>
      </Box>

      <ConfirmationModal
        title={
          deletingSchedule &&
          `${i18n.t("schedules.confirmationModal.deleteTitle")}`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteSchedule(deletingSchedule.id)}
      >
        {i18n.t("schedules.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <ScheduleModal
        open={scheduleModalOpen}
        onClose={handleCloseScheduleModal}
        reload={fetchSchedules}
        aria-labelledby="form-dialog-title"
        scheduleId={selectedSchedule && selectedSchedule.id}
        contactId={contactId}
        cleanContact={cleanContact}
      />
      <MainHeader>
        <Title>{i18n.t("schedules.title")} ({schedules.length})</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("contacts.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "gray" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenScheduleModal}
          >
            {i18n.t("schedules.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant="outlined"
        onScroll={handleScroll}
      >
        <Table size="small" className={classes.schedulesTable}>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <PersonIcon style={{ marginRight: 8, color: "#64748b", fontSize: "18px" }} />
                  {i18n.t("schedules.table.contact")}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <MessageIcon style={{ marginRight: 8, color: "#64748b", fontSize: "18px" }} />
                  {i18n.t("schedules.table.body")}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <AccessTimeIcon style={{ marginRight: 8, color: "#64748b", fontSize: "18px" }} />
                  {i18n.t("schedules.table.sendAt")}
                </Box>
              </TableCell>
              <TableCell align="center">
                {i18n.t("schedules.table.status")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("schedules.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell align="center">
                    <Typography className={classes.contactName}>
                      {schedule.contact.name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" title={schedule.body}>
                    <Typography className={classes.messageBody}>
                      {truncate(schedule.body, 25)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography className={classes.scheduleDate}>
                      {moment(schedule.sendAt).format("DD/MM/YYYY HH:mm:ss")}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={capitalize(schedule.status)}
                      className={getStatusChipClass(schedule.status)}
                      size="small"
                      icon={getStatusIcon(schedule.status)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <div className={classes.actionButtons}>
                      <IconButton
                        size="small"
                        className={classes.editIcon}
                        onClick={() => handleEditSchedule(schedule)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        className={classes.deleteIcon}
                        onClick={(e) => {
                          setConfirmModalOpen(true);
                          setDeletingSchedule(schedule);
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={4} />}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Schedules;