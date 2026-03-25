import React, {
    useState,
    useEffect,
    useReducer,
    useContext,
    useRef,
} from "react";
import { socketConnection } from "../../services/socket";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import { Facebook, Instagram, WhatsApp } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import ContactsIcon from "@material-ui/icons/Contacts";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import FilterListIcon from "@material-ui/icons/FilterList";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import TableContainer from "@material-ui/core/TableContainer";

import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import BlockIcon from "@material-ui/icons/Block";

import api from "../../services/api";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ContactModal from "../../components/ContactModal";
import ConfirmationModal from "../../components/ConfirmationModal/";

import { i18n } from "../../translate/i18n";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import MainContainer from "../../components/MainContainer";
import toastError from "../../errors/toastError";

import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../../components/Can";
import NewTicketModal from "../../components/NewTicketModal";
import { TagsFilter } from "../../components/TagsFilter";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import formatSerializedId from '../../utils/formatSerializedId';

import {
    ArrowDropDown,
    Backup,
    ContactPhone,
} from "@material-ui/icons";
import { Menu, MenuItem } from "@material-ui/core";

import ContactImportWpModal from "../../components/ContactImportWpModal";
import useCompanySettings from "../../hooks/useSettings/companySettings";

const reducer = (state, action) => {
    if (action.type === "LOAD_CONTACTS") {
        const contacts = action.payload;
        const newContacts = [];

        contacts.forEach((contact) => {            
            const contactIndex = state.findIndex((c) => c.id === contact.id);
            if (contactIndex !== -1) {
                state[contactIndex] = contact;
            } else {
                newContacts.push(contact);                
            }
        });

        return [...state, ...newContacts];
    }

    if (action.type === "UPDATE_CONTACTS") {
        const contact = action.payload;
        const contactIndex = state.findIndex((c) => c.id === contact.id);

        if (contactIndex !== -1) {
            state[contactIndex] = contact;
            return [...state];
        } else {
            return [contact, ...state];
        }
    }

    if (action.type === "DELETE_CONTACT") {
        const contactId = action.payload;

        const contactIndex = state.findIndex((c) => c.id === contactId);
        if (contactIndex !== -1) {
            state.splice(contactIndex, 1);
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
    actionButton: {
        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        borderRadius: "16px",
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        minHeight: "48px",
        padding: theme.spacing(1.5, 3),
        boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
            transform: "translateY(-2px)",
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
    importButton: {
        background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
        borderRadius: "16px",
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        minHeight: "48px",
        padding: theme.spacing(1.5, 3),
        boxShadow: "0 4px 15px rgba(220, 38, 38, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
            transform: "translateY(-2px)",
        },
    },
    mainPaper: {
        borderRadius: "20px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        border: "none",
        overflow: "hidden",
        marginBottom: theme.spacing(3),
    },
    contactsTable: {
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
    avatarCell: {
        "& .MuiAvatar-root": {
            width: theme.spacing(5),
            height: theme.spacing(5),
            border: "2px solid #e2e8f0",
        },
    },
    contactName: {
        fontWeight: 600,
        color: "#1e293b",
        fontSize: "15px",
    },
    contactNumber: {
        fontFamily: "monospace",
        backgroundColor: "#f1f5f9",
        padding: theme.spacing(0.5, 1),
        borderRadius: "8px",
        fontSize: "13px",
        color: "#475569",
    },
    contactEmail: {
        color: "#3b82f6",
        fontSize: "13px",
    },
    lastMessage: {
        color: "#64748b",
        fontSize: "12px",
        fontStyle: "italic",
    },
    statusActive: {
        color: "#059669",
        backgroundColor: "#dcfce7",
        padding: theme.spacing(0.5),
        borderRadius: "50%",
    },
    statusInactive: {
        color: "#dc2626",
        backgroundColor: "#fecaca",
        padding: theme.spacing(0.5),
        borderRadius: "50%",
    },
    actionButtons: {
        display: "flex",
        gap: theme.spacing(0.5),
    },
    channelIcon: {
        padding: theme.spacing(0.5),
        borderRadius: "8px",
        transition: "all 0.2s ease",
        "&:hover": {
            transform: "scale(1.1)",
        },
    },
    whatsappIcon: {
        color: "#25d366",
        backgroundColor: "#dcfce7",
    },
    instagramIcon: {
        color: "#e1306c",
        backgroundColor: "#fce7f3",
    },
    facebookIcon: {
        color: "#1877f2",
        backgroundColor: "#dbeafe",
    },
    editIcon: {
        color: "#3b82f6",
        backgroundColor: "#dbeafe",
        padding: theme.spacing(0.5),
        borderRadius: "8px",
        "&:hover": {
            backgroundColor: "#bfdbfe",
        },
    },
    blockIcon: {
        color: "#f59e0b",
        backgroundColor: "#fef3c7",
        padding: theme.spacing(0.5),
        borderRadius: "8px",
        "&:hover": {
            backgroundColor: "#fde68a",
        },
    },
    deleteIcon: {
        color: "#dc2626",
        backgroundColor: "#fecaca",
        padding: theme.spacing(0.5),
        borderRadius: "8px",
        "&:hover": {
            backgroundColor: "#fca5a5",
        },
    },
    activateIcon: {
        color: "#059669",
        backgroundColor: "#dcfce7",
        padding: theme.spacing(0.5),
        borderRadius: "8px",
        "&:hover": {
            backgroundColor: "#bbf7d0",
        },
    },
    statsContainer: {
        background: "white",
        borderRadius: "16px",
        padding: theme.spacing(2, 3),
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        border: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: theme.spacing(3),
    },
    statsText: {
        color: "#64748b",
        fontWeight: 600,
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
    },
    contactCount: {
        color: "#3b82f6",
        fontWeight: 700,
        fontSize: "18px",
    },
}));

const Contacts = () => {
    const classes = useStyles();
    const history = useHistory();

    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchParam, setSearchParam] = useState("");
    const [contacts, dispatch] = useReducer(reducer, []);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [contactModalOpen, setContactModalOpen] = useState(false);

    const [importContactModalOpen, setImportContactModalOpen] = useState(false);
    const [deletingContact, setDeletingContact] = useState(null);
    const [ImportContacts, setImportContacts] = useState(null);
    const [blockingContact, setBlockingContact] = useState(null);
    const [unBlockingContact, setUnBlockingContact] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [exportContact, setExportContact] = useState(false);
    const [confirmChatsOpen, setConfirmChatsOpen] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
    const [contactTicket, setContactTicket] = useState({});
    const fileUploadRef = useRef(null);
    const [selectedTags, setSelectedTags] = useState([]);

    const { get: getSetting } = useCompanySettings();
    const [hideNum, setHideNum] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const setting = await getSetting({
                "column": "lgpdHideNumber"
            });

            if (setting.lgpdHideNumber === "enabled") {
                setHideNum(true);
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleImportExcel = async () => {
        try {
            const formData = new FormData();
            formData.append("file", fileUploadRef.current.files[0]);
            await api.request({
                url: `/contacts/upload`,
                method: "POST",
                data: formData,
            });
            history.go(0);
        } catch (err) {
            toastError(err);
        }
    };

    useEffect(() => {
        dispatch({ type: "RESET" });
        setPageNumber(1);
    }, [searchParam, selectedTags]);

    useEffect(() => {
        setLoading(true);
        const delayDebounceFn = setTimeout(() => {
            const fetchContacts = async () => {
                try {
                    const { data } = await api.get("/contacts/", {
                        params: { searchParam, pageNumber, contactTag: JSON.stringify(selectedTags) },
                    });
                    dispatch({ type: "LOAD_CONTACTS", payload: data.contacts });
                    setHasMore(data.hasMore);
                    setLoading(false);
                } catch (err) {
                    toastError(err);
                }
            };
            fetchContacts();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchParam, pageNumber, selectedTags]);

    useEffect(() => {
        const companyId = user.companyId;
        const socket = socketConnection({ companyId, userId: user.id });

        socket.on(`company-${companyId}-contact`, (data) => {
            if (data.action === "update" || data.action === "create") {
                dispatch({ type: "UPDATE_CONTACTS", payload: data.contact });
            }

            if (data.action === "delete") {
                dispatch({ type: "DELETE_CONTACT", payload: +data.contactId });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleCloseOrOpenTicket = (ticket) => {
        setNewTicketModalOpen(false);
        if (ticket !== undefined && ticket.uuid !== undefined) {
            history.push(`/tickets/${ticket.uuid}`);
        }
    };

    const handleSelectedTags = (selecteds) => {
        const tags = selecteds.map((t) => t.id);
        setSelectedTags(tags);
    };

    const handleSearch = (event) => {
        setSearchParam(event.target.value.toLowerCase());
    };

    const handleOpenContactModal = () => {
        setSelectedContactId(null);
        setContactModalOpen(true);
    };

    const handleCloseContactModal = () => {
        setSelectedContactId(null);
        setContactModalOpen(false);
    };

    const hadleEditContact = (contactId) => {
        setSelectedContactId(contactId);
        setContactModalOpen(true);
    };

    const handleDeleteContact = async (contactId) => {
        try {
            await api.delete(`/contacts/${contactId}`);
            toast.success(i18n.t("contacts.toasts.deleted"));
        } catch (err) {
            toastError(err);
        }
        setDeletingContact(null);
        setSearchParam("");
        setPageNumber(1);
    };

    const handleBlockContact = async (contactId) => {
        try {
            await api.put(`/contacts/block/${contactId}`, { active: false });
            toast.success("Contato bloqueado");
        } catch (err) {
            toastError(err);
        }
        setDeletingContact(null);
        setSearchParam("");
        setPageNumber(1);
        setBlockingContact(null);
    };

    const handleUnBlockContact = async (contactId) => {
        try {
            await api.put(`/contacts/block/${contactId}`, { active: true });
            toast.success("Contato desbloqueado");
        } catch (err) {
            toastError(err);
        }
        setDeletingContact(null);
        setSearchParam("");
        setPageNumber(1);
        setUnBlockingContact(null);
    };

    const handleimportContact = async () => {
        try {
            await api.post("/contacts/import");
            history.go(0);
            setImportContacts(false);
        } catch (err) {
            toastError(err);
            setImportContacts(false);
        }
    };

    const handleimportChats = async () => {
        try {
            await api.post("/contacts/import/chats");
            history.go(0);
        } catch (err) {
            toastError(err);
        }
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

    function getDateLastMessage(contact) {
        if (!contact) return null;
        if (!contact.tickets) return null;

        if (contact.tickets.length > 0) {
            const date = new Date(
                contact.tickets[contact.tickets.length - 1].updatedAt
            );

            const day =
                date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const hours = date.getHours();
            const minutes = date.getMinutes();

            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }

        return null;
    }

    return (
        <div className={classes.mainContainer}>
            <Container maxWidth="xl">
                <NewTicketModal
                    modalOpen={newTicketModalOpen}
                    initialContact={contactTicket}
                    onClose={(ticket) => {
                        handleCloseOrOpenTicket(ticket);
                    }}
                />
                <ContactModal
                    open={contactModalOpen}
                    onClose={handleCloseContactModal}
                    aria-labelledby="form-dialog-title"
                    contactId={selectedContactId}
                />
                <ConfirmationModal
                    title={
                        deletingContact
                            ? `${i18n.t(
                                "contacts.confirmationModal.deleteTitle"
                            )} ${deletingContact.name}?`
                            : blockingContact
                                ? `Bloquear Contato ${blockingContact.name}?`
                                : unBlockingContact
                                    ? `Desbloquear Contato ${unBlockingContact.name}?`
                                    : ImportContacts
                                        ? `${i18n.t("contacts.confirmationModal.importTitlte")}`
                                        : `${i18n.t("contactListItems.confirmationModal.importTitlte")}`
                    }
                    open={confirmOpen}
                    onClose={setConfirmOpen}
                    onConfirm={(e) =>
                        deletingContact
                            ? handleDeleteContact(deletingContact.id)
                            : blockingContact
                                ? handleBlockContact(blockingContact.id)
                                : unBlockingContact
                                    ? handleUnBlockContact(unBlockingContact.id)
                                    : ImportContacts
                                        ? handleimportContact()
                                        : handleImportExcel()
                    }
                >
                    {exportContact
                        ? `${i18n.t("contacts.confirmationModal.exportContact")}`
                        : deletingContact
                            ? `${i18n.t("contacts.confirmationModal.deleteMessage")}`
                            : blockingContact
                                ? `${i18n.t("contacts.confirmationModal.blockContact")}`
                                : unBlockingContact
                                    ? `${i18n.t("contacts.confirmationModal.unblockContact")}`
                                    : ImportContacts
                                        ? `${i18n.t("contacts.confirmationModal.importMessage")}`
                                        : `${i18n.t(
                                            "contactListItems.confirmationModal.importMessage"
                                        )}`}
                </ConfirmationModal>
                <ConfirmationModal
                    title={i18n.t("contacts.confirmationModal.importChat")}
                    open={confirmChatsOpen}
                    onClose={setConfirmChatsOpen}
                    onConfirm={(e) => handleimportChats()}
                >
                    {i18n.t("contacts.confirmationModal.wantImport")}
                </ConfirmationModal>

                {/* Header Modernizado */}
                <Box className={classes.header}>
                    <div className={classes.headerContent}>
                        <ContactsIcon className={classes.headerIcon} />
                        <div>
                            <Typography className={classes.headerTitle}>
                                Gerenciar Contatos
                            </Typography>
                            <Typography className={classes.headerSubtitle}>
                                Visualize, edite e gerencie todos os seus contatos
                            </Typography>
                        </div>
                    </div>
                </Box>

                {/* Seção de Filtros Modernizada */}
                <Paper className={classes.filtersSection} elevation={0}>
                    <Typography className={classes.filtersTitle}>
                        <FilterListIcon style={{ marginRight: 12 }} />
                        Filtros e Ações
                    </Typography>
                    
                    <div className={classes.filtersGroup}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                            <TagsFilter 
                                onFiltered={handleSelectedTags} 
                            />
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
                        </div>
                        
                        <div style={{ display: "flex", gap: 12 }}>
                            <PopupState variant="popover" popupId="demo-popup-menu">
                                {(popupState) => (
                                    <React.Fragment>
                                        <Button
                                            className={classes.importButton}
                                            variant="contained"
                                            {...bindTrigger(popupState)}
                                            startIcon={<ImportExportIcon />}
                                        >
                                            Importar / Exportar
                                            <ArrowDropDown />
                                        </Button>
                                        <Menu {...bindMenu(popupState)}>
                                            <MenuItem
                                                onClick={() => {
                                                    setConfirmOpen(true);
                                                    setImportContacts(true);
                                                    popupState.close();
                                                }}
                                            >
                                                <ContactPhone
                                                    fontSize="small"
                                                    color="primary"
                                                    style={{
                                                        marginRight: 10,
                                                    }}
                                                />
                                                {i18n.t("contacts.menu.importYourPhone")}
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => { setImportContactModalOpen(true) }}
                                            >
                                                <Backup
                                                    fontSize="small"
                                                    color="primary"
                                                    style={{
                                                        marginRight: 10,
                                                    }}
                                                />
                                                {i18n.t("contacts.menu.importToExcel")}
                                            </MenuItem>
                                        </Menu>
                                    </React.Fragment>
                                )}
                            </PopupState>
                            
                            <Button
                                className={classes.addButton}
                                variant="contained"
                                onClick={handleOpenContactModal}
                                startIcon={<PersonAddIcon />}
                            >
                                {i18n.t("contacts.buttons.add")}
                            </Button>
                        </div>
                    </div>
                </Paper>

                {/* Contador de Contatos */}
                <Box className={classes.statsContainer}>
                    <Typography className={classes.statsText}>
                        <ContactsIcon />
                        Total de Contatos: 
                        <span className={classes.contactCount}>{contacts.length}</span>
                    </Typography>
                </Box>

                <ContactImportWpModal
                    isOpen={importContactModalOpen}
                    handleClose={() => setImportContactModalOpen(false)}
                    selectedTags={selectedTags}
                    hideNum={hideNum}
                    userProfile={user.profile}
                />

                {/* Tabela Modernizada */}
                <Paper className={classes.mainPaper} elevation={0}>
                    <input
                        style={{ display: "none" }}
                        id="upload"
                        name="file"
                        type="file"
                        accept=".xls,.xlsx"
                        onChange={() => {
                            setConfirmOpen(true);
                        }}
                        ref={fileUploadRef}
                    />
                    
                    <TableContainer
                        style={{ 
                            maxHeight: 600,
                            overflowY: "auto"
                        }}
                        onScroll={handleScroll}
                    >
                        <Table stickyHeader className={classes.contactsTable}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">Avatar</TableCell>
                                    <TableCell>{i18n.t("contacts.table.name")}</TableCell>
                                    <TableCell align="center">{i18n.t("contacts.table.whatsapp")}</TableCell>
                                    <TableCell align="center">{i18n.t("contacts.table.email")}</TableCell>
                                    <TableCell align="center">{i18n.t("contacts.table.lastMessage")}</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">{i18n.t("contacts.table.actions")}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contacts.map((contact) => (
                                    <TableRow key={contact.id} hover>
                                        <TableCell className={classes.avatarCell}>
                                            <Avatar src={`${contact?.urlPicture}`} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography className={classes.contactName}>
                                                {contact.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography className={classes.contactNumber}>
                                                {(hideNum && user.profile === "user" ? contact.isGroup ? contact.number : formatSerializedId(contact.number).slice(0, -6) + "**-**" + contact.number.slice(-2) : contact.isGroup ? contact.number : formatSerializedId(contact.number))}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography className={classes.contactEmail}>
                                                {contact.email}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography className={classes.lastMessage}>
                                                {getDateLastMessage(contact)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            {contact.active ? (
                                                <CheckCircleIcon
                                                    className={classes.statusActive}
                                                    fontSize="small"
                                                />
                                            ) : (
                                                <CancelIcon
                                                    className={classes.statusInactive}
                                                    fontSize="small"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className={classes.actionButtons}>
                                                <IconButton
                                                    size="small"
                                                    className={`${classes.channelIcon} ${
                                                        contact.channel === "whatsapp" ? classes.whatsappIcon :
                                                        contact.channel === "instagram" ? classes.instagramIcon :
                                                        contact.channel === "facebook" ? classes.facebookIcon : ""
                                                    }`}
                                                    onClick={() => {
                                                        setContactTicket(contact);
                                                        setNewTicketModalOpen(true);
                                                    }}
                                                >
                                                    {contact.channel === "whatsapp" && <WhatsApp fontSize="small" />}
                                                    {contact.channel === "instagram" && <Instagram fontSize="small" />}
                                                    {contact.channel === "facebook" && <Facebook fontSize="small" />}
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    className={classes.editIcon}
                                                    onClick={() => hadleEditContact(contact.id)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>

                                                <IconButton
                                                    size="small"
                                                    className={contact.active ? classes.blockIcon : classes.activateIcon}
                                                    onClick={
                                                        contact.active
                                                            ? () => {
                                                                setConfirmOpen(true);
                                                                setBlockingContact(contact);
                                                            }
                                                            : () => {
                                                                setConfirmOpen(true);
                                                                setUnBlockingContact(contact);
                                                            }
                                                    }
                                                >
                                                    {contact.active ? (
                                                        <BlockIcon fontSize="small" />
                                                    ) : (
                                                        <CheckCircleIcon fontSize="small" />
                                                    )}
                                                </IconButton>

                                                <Can
                                                    role={user.profile}
                                                    perform="contacts-page:deleteContact"
                                                    yes={() => (
                                                        <IconButton
                                                            size="small"
                                                            className={classes.deleteIcon}
                                                            onClick={(e) => {
                                                                setConfirmOpen(true);
                                                                setDeletingContact(contact);
                                                            }}
                                                        >
                                                            <DeleteOutlineIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {loading && <TableRowSkeleton avatar columns={6} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </div>
    );
};

export default Contacts;