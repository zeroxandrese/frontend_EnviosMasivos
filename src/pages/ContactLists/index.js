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
import PeopleIcon from "@material-ui/icons/People";
import DownloadIcon from "@material-ui/icons/GetApp";
import ListIcon from "@material-ui/icons/List";
import FilterListIcon from "@material-ui/icons/FilterList";
import AddIcon from "@material-ui/icons/Add";
import ContactsIcon from "@material-ui/icons/Contacts";
import FolderIcon from "@material-ui/icons/Folder";
import PersonIcon from "@material-ui/icons/Person";
import DescriptionIcon from "@material-ui/icons/Description";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ContactListDialog from "../../components/ContactListDialog";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Grid } from "@material-ui/core";

import planilhaExemplo from "../../assets/planilha.xlsx";
import { socketConnection } from "../../services/socket";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_CONTACTLISTS") {
    const contactLists = action.payload;
    const newContactLists = [];

    contactLists.forEach((contactList) => {
      const contactListIndex = state.findIndex((u) => u.id === contactList.id);
      if (contactListIndex !== -1) {
        state[contactListIndex] = contactList;
      } else {
        newContactLists.push(contactList);
      }
    });

    return [...state, ...newContactLists];
  }

  if (action.type === "UPDATE_CONTACTLIST") {
    const contactList = action.payload;
    const contactListIndex = state.findIndex((u) => u.id === contactList.id);

    if (contactListIndex !== -1) {
      state[contactListIndex] = contactList;
      return [...state];
    } else {
      return [contactList, ...state];
    }
  }

  if (action.type === "DELETE_CONTACTLIST") {
    const contactListId = action.payload;

    const contactListIndex = state.findIndex((u) => u.id === contactListId);
    if (contactListIndex !== -1) {
      state.splice(contactListIndex, 1);
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
  contactsIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  averageIcon: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
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
  contactListsTable: {
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
  contactListName: {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  contactsCount: {
    backgroundColor: "#e0f2fe",
    color: "#0277bd",
    fontWeight: 600,
    minWidth: "60px",
  },
  actionButtons: {
    display: "flex",
    gap: theme.spacing(0.5),
    justifyContent: "center",
  },
  downloadIcon: {
    color: "#f59e0b",
    backgroundColor: "#fef3c7",
    padding: theme.spacing(0.5),
    borderRadius: "8px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#fde68a",
      transform: "scale(1.1)",
    },
  },
  viewIcon: {
    color: "#059669",
    backgroundColor: "#dcfce7",
    padding: theme.spacing(0.5),
    borderRadius: "8px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#bbf7d0",
      transform: "scale(1.1)",
    },
  },
  editIcon: {
    color: "#3b82f6",
    backgroundColor: "#dbeafe",
    padding: theme.spacing(0.5),
    borderRadius: "8px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#bfdbfe",
      transform: "scale(1.1)",
    },
  },
  deleteIcon: {
    color: "#dc2626",
    backgroundColor: "#fecaca",
    padding: theme.spacing(0.5),
    borderRadius: "8px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#fca5a5",
      transform: "scale(1.1)",
    },
  },
}));

const ContactLists = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedContactList, setSelectedContactList] = useState(null);
  const [deletingContactList, setDeletingContactList] = useState(null);
  const [contactListModalOpen, setContactListModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [contactLists, dispatch] = useReducer(reducer, []);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContactLists = async () => {
        try {
          const { data } = await api.get("/contact-lists/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_CONTACTLISTS", payload: data.records });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchContactLists();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on(`company-${companyId}-ContactList`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_CONTACTLIST", payload: data.record });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_CONTACTLIST", payload: +data.id });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenContactListModal = () => {
    setSelectedContactList(null);
    setContactListModalOpen(true);
  };

  const handleCloseContactListModal = () => {
    setSelectedContactList(null);
    setContactListModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditContactList = (contactList) => {
    setSelectedContactList(contactList);
    setContactListModalOpen(true);
  };

  const handleDeleteContactList = async (contactListId) => {
    try {
      await api.delete(`/contact-lists/${contactListId}`);
      toast.success(i18n.t("contactLists.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingContactList(null);
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

  const goToContacts = (id) => {
    history.push(`/contact-lists/${id}/contacts`);
  };

  // Calcular estatísticas
  const getContactListStats = () => {
    const totalLists = contactLists.length;
    const totalContacts = contactLists.reduce((acc, list) => acc + (list.contactsCount || 0), 0);
    const averageContacts = totalLists > 0 ? Math.round(totalContacts / totalLists) : 0;

    return { totalLists, totalContacts, averageContacts };
  };

  const stats = getContactListStats();

  return (
    <div className={classes.mainContainer}>
      <Container maxWidth="xl">
        <ConfirmationModal
          title={
            deletingContactList &&
            `${i18n.t("contactLists.confirmationModal.deleteTitle")} ${deletingContactList.name
            }?`
          }
          open={confirmModalOpen}
          onClose={setConfirmModalOpen}
          onConfirm={() => handleDeleteContactList(deletingContactList.id)}
        >
          {i18n.t("contactLists.confirmationModal.deleteMessage")}
        </ConfirmationModal>
        
        <ContactListDialog
          open={contactListModalOpen}
          onClose={handleCloseContactListModal}
          aria-labelledby="form-dialog-title"
          contactListId={selectedContactList && selectedContactList.id}
        />

        {/* Header Modernizado */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <ListIcon className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                Listas de Contactos
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Organiza y gestiona tus listas de contactos para campañas
              </Typography>
            </div>
          </div>
        </Box>

        {/* Seção de Filtros Modernizada */}
        <Paper className={classes.filtersSection} elevation={0}>
          <Typography className={classes.filtersTitle}>
            <FilterListIcon style={{ marginRight: 12 }} />
            Buscar y administrar listas
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
              onClick={handleOpenContactListModal}
              startIcon={<AddIcon />}
            >
              {i18n.t("contactLists.buttons.add")}
            </Button>
          </div>
        </Paper>

        {/* Cards de Estatísticas */}
        <Box className={classes.statsGrid}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                <FolderIcon />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Total de Listas
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.totalLists}
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.contactsIcon}`}>
                <ContactsIcon />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Total de Contactos
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.totalContacts}
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.averageIcon}`}>
                <PersonIcon />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Média por Lista
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.averageContacts}
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
            <Table stickyHeader className={classes.contactListsTable}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <ListIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("contactLists.table.name")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <ContactsIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("contactLists.table.contacts")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {i18n.t("contactLists.table.actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contactLists.map((contactList) => (
                  <TableRow key={contactList.id} hover>
                    <TableCell>
                      <Typography className={classes.contactListName}>
                        <FolderIcon style={{ fontSize: 20, color: "#64748b" }} />
                        {contactList.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${contactList.contactsCount || 0} contatos`}
                        className={classes.contactsCount}
                        size="small"
                        icon={<PersonIcon style={{ fontSize: 16 }} />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <div className={classes.actionButtons}>
                        <a href={planilhaExemplo} download="planilha.xlsx">
                          <IconButton 
                            size="small" 
                            title="Baixar Planilha Exemplo"
                            className={classes.downloadIcon}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </a>

                        <IconButton
                          size="small"
                          onClick={() => goToContacts(contactList.id)}
                          className={classes.viewIcon}
                          title="Ver Contatos"
                        >
                          <PeopleIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => handleEditContactList(contactList)}
                          className={classes.editIcon}
                          title="Editar Lista"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setConfirmModalOpen(true);
                            setDeletingContactList(contactList);
                          }}
                          className={classes.deleteIcon}
                          title="Deletar Lista"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {loading && <TableRowSkeleton columns={3} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
};

export default ContactLists;