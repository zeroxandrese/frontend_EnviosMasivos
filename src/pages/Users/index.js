import React, { useState, useEffect, useReducer, useContext } from "react";
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
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import TableContainer from "@material-ui/core/TableContainer";
import Chip from "@material-ui/core/Chip";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import { AccountCircle } from "@material-ui/icons";
import PeopleIcon from "@material-ui/icons/People";
import FilterListIcon from "@material-ui/icons/FilterList";
import AddIcon from "@material-ui/icons/Add";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import LabelIcon from "@material-ui/icons/Label";
import ScheduleIcon from "@material-ui/icons/Schedule";
import WorkIcon from "@material-ui/icons/Work";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import whatsappIcon from '../../assets/nopicture.png'

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import UserModal from "../../components/UserModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { socketConnection } from "../../services/socket";
import UserStatusIcon from "../../components/UserModal/statusIcon";
import { getBackendUrl } from "../../config";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Avatar } from "@material-ui/core";

const backendUrl = getBackendUrl();

const reducer = (state, action) => {
  if (action.type === "LOAD_USERS") {
    const users = action.payload;
    const newUsers = [];

    users.forEach((user) => {
      const userIndex = state.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        state[userIndex] = user;
      } else {
        newUsers.push(user);
      }
    });

    return [...state, ...newUsers];
  }

  if (action.type === "UPDATE_USERS") {
    const user = action.payload;
    const userIndex = state.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      state[userIndex] = user;
      return [...state];
    } else {
      return [user, ...state];
    }
  }

  if (action.type === "DELETE_USER") {
    const userId = action.payload;

    const userIndex = state.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      state.splice(userIndex, 1);
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
  onlineIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  adminIcon: {
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
  },
  userIcon: {
    backgroundColor: "#fef3c7",
    color: "#f59e0b",
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
  usersTable: {
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
  userName: {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "15px",
  },
  userEmail: {
    color: "#64748b",
    fontSize: "13px",
  },
  profileAdmin: {
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
    fontWeight: 600,
  },
  profileUser: {
    backgroundColor: "#dbeafe",
    color: "#3b82f6",
    fontWeight: 600,
  },
  userAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    border: "2px solid #e2e8f0",
  },
  avatarDiv: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  workSchedule: {
    fontFamily: "monospace",
    backgroundColor: "#f1f5f9",
    padding: theme.spacing(0.5, 1),
    borderRadius: "6px",
    fontSize: "12px",
    color: "#475569",
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
  statusIndicator: {
    fontSize: "10px",
    marginRight: "6px",
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

const Users = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [users, dispatch] = useReducer(reducer, []);
  const { user: loggedInUser } = useContext(AuthContext)
  const { profileImage } = loggedInUser;

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/", {
            params: { searchParam, pageNumber },
          });
          
          dispatch({ type: "LOAD_USERS", payload: data.users });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = loggedInUser.companyId;
    const socket = socketConnection({ companyId, userId: loggedInUser.id });

    socket.on(`company-${companyId}-user`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_USERS", payload: data.user });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_USER", payload: +data.userId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenUserModal = () => {
    setSelectedUser(null);
    setUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setUserModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      toast.success(i18n.t("users.toasts.deleted"));
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

  const renderProfileImage = (user) => {
    if (user.id === loggedInUser.id ) {
      return (
        <Avatar
          src={`${backendUrl}/public/company${user.companyId}/user/${profileImage ? profileImage: whatsappIcon}`}
          alt={user.name}
          className={classes.userAvatar}
        />
      )
    }
    if (user.id !== loggedInUser.id) {
      return (
        <Avatar
        src={user.profileImage ? `${backendUrl}/public/company${user.companyId}/user/${user.profileImage}`: whatsappIcon}
          alt={user.name}
          className={classes.userAvatar}
        />
      )
    }
    return (
      <AccountCircle />
    )
  };

  const getProfileChipClass = (profile) => {
    return profile === "admin" ? classes.profileAdmin : classes.profileUser;
  };

  // Calcular estatísticas
  const getUserStats = () => {
    const total = users.length;
    const admins = users.filter(u => u.profile === 'admin').length;
    const regularUsers = total - admins;
    // Para online, assumindo que o UserStatusIcon indica status - seria necessário analisar a lógica específica
    const online = 0; // Placeholder - seria necessário ter acesso ao status real dos usuários

    return { total, admins, regularUsers, online };
  };

  const stats = getUserStats();

  return (
    <div className={classes.mainContainer}>
      <MainContainer>
        <ConfirmationModal
          title={
            deletingUser &&
            `${i18n.t("users.confirmationModal.deleteTitle")} ${deletingUser.name}?`
          }
          open={confirmModalOpen}
          onClose={setConfirmModalOpen}
          onConfirm={() => handleDeleteUser(deletingUser.id)}
        >
          {i18n.t("users.confirmationModal.deleteMessage")}
        </ConfirmationModal>
        
        <UserModal
          open={userModalOpen}
          onClose={handleCloseUserModal}
          aria-labelledby="form-dialog-title"
          userId={selectedUser && selectedUser.id}
        />

        <Container maxWidth="xl">
          
          {/* Header Modernizado */}
          <Box className={classes.header}>
            <div className={classes.headerContent}>
              <PeopleIcon className={classes.headerIcon} />
              <div>
                <Typography className={classes.headerTitle}>
                  {i18n.t("users.title")}
                </Typography>
                <Typography className={classes.headerSubtitle}>
                  Administrar los usuarios y permisos del sistema.
                </Typography>
              </div>
            </div>
          </Box>

          {/* Seção de Filtros Modernizada */}
          <Paper className={classes.filtersSection} elevation={0}>
            <Typography className={classes.filtersTitle}>
              <FilterListIcon style={{ marginRight: 12 }} />
              Buscar y Gerenciar Usuários
            </Typography>
            
            <div className={classes.filtersGroup}>
              <TextField
                placeholder={i18n.t("contacts.searchPlaceholder")}
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
                onClick={handleOpenUserModal}
                startIcon={<AddIcon />}
              >
                {i18n.t("users.buttons.add")}
              </Button>
            </div>
          </Paper>

          {/* Cards de Estatísticas */}
          <Box className={classes.statsGrid}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                  <PeopleIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Total de Usuários
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.total}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.adminIcon}`}>
                  <SupervisorAccountIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Administradores
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.admins}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.userIcon}`}>
                  <PersonIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Usuários Regulares
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.regularUsers}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.onlineIcon}`}>
                  <FiberManualRecordIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Status Online
                  </Typography>
                  <Typography className={classes.statValue}>
                    Activo
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
              <Table stickyHeader className={classes.usersTable}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <LabelIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("users.table.ID")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <FiberManualRecordIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("users.table.status")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <PersonIcon style={{ marginRight: 8, color: "#64748b" }} />
                        Avatar
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <PersonIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("users.table.name")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <EmailIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("users.table.email")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <SupervisorAccountIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("users.table.profile")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <ScheduleIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("users.table.startWork")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <WorkIcon style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("users.table.endWork")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {i18n.t("users.table.actions")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? (
                    <>
                      {users.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell align="center">
                            <Typography variant="body2" style={{ fontWeight: 600, color: "#3b82f6" }}>
                              #{user.id}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <UserStatusIcon user={user} />
                          </TableCell>
                          <TableCell align="center">
                            <div className={classes.avatarDiv}>
                              {renderProfileImage(user)}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <Typography className={classes.userName}>
                              {user.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography className={classes.userEmail}>
                              {user.email}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={user.profile}
                              className={getProfileChipClass(user.profile)}
                              size="small"
                              icon={user.profile === 'admin' ? <SupervisorAccountIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography className={classes.workSchedule}>
                              {user.startWork}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography className={classes.workSchedule}>
                              {user.endWork}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <div className={classes.actionButtons}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditUser(user)}
                                className={classes.editIcon}
                                title="Editar"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>

                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  setConfirmModalOpen(true);
                                  setDeletingUser(user);
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
                      {loading && <TableRowSkeleton columns={9} />}
                    </>
                  ) : (
                    !loading && (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          <Box className={classes.emptyState}>
                            <PeopleIcon className={classes.emptyStateIcon} />
                            <Typography variant="h6" style={{ marginBottom: 8 }}>
                              No se encontraron usuarios
                            </Typography>
                            <Typography variant="body2">
                              Crea tu primer usuario para empezar.
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

export default Users;