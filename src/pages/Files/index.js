import React, {
    useState,
    useEffect,
    useReducer,
    useCallback,
    useContext,
} from "react";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Chip from "@material-ui/core/Chip";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import FilterListIcon from "@material-ui/icons/FilterList";
import AddIcon from "@material-ui/icons/Add";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import CloudIcon from "@material-ui/icons/Cloud";

import MainContainer from "../../components/MainContainer";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import FileModal from "../../components/FileModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { socketConnection } from "../../services/socket";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
    if (action.type === "LOAD_FILES") {
        const files = action.payload;
        const newFiles = [];

        files.forEach((fileList) => {
            const fileListIndex = state.findIndex((s) => s.id === fileList.id);
            if (fileListIndex !== -1) {
                state[fileListIndex] = fileList;
            } else {
                newFiles.push(fileList);
            }
        });

        return [...state, ...newFiles];
    }

    if (action.type === "UPDATE_FILES") {
        const fileList = action.payload;
        const fileListIndex = state.findIndex((s) => s.id === fileList.id);

        if (fileListIndex !== -1) {
            state[fileListIndex] = fileList;
            return [...state];
        } else {
            return [fileList, ...state];
        }
    }

    if (action.type === "DELETE_TAG") {
        const fileListId = action.payload;

        const fileListIndex = state.findIndex((s) => s.id === fileListId);
        if (fileListIndex !== -1) {
            state.splice(fileListIndex, 1);
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
    fileIcon: {
        backgroundColor: "#dcfce7",
        color: "#059669",
    },
    storageIcon: {
        backgroundColor: "#f3e8ff",
        color: "#7c3aed",
    },
    cloudIcon: {
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
    filesTable: {
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
    fileName: {
        fontWeight: 600,
        color: "#1e293b",
        fontSize: "15px",
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
    },
    fileIcon: {
        color: "#64748b",
        fontSize: "18px",
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
    countChip: {
        backgroundColor: "#e0f2fe",
        color: "#0369a1",
        fontWeight: 600,
    },
}));

const FileLists = () => {
    const classes = useStyles();

    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [selectedFileList, setSelectedFileList] = useState(null);
    const [deletingFileList, setDeletingFileList] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [files, dispatch] = useReducer(reducer, []);
    const [fileListModalOpen, setFileListModalOpen] = useState(false);

    const fetchFileLists = useCallback(async () => {
        try {
            const { data } = await api.get("/files/", {
                params: { searchParam, pageNumber },
            });
            dispatch({ type: "LOAD_FILES", payload: data.files });
            setHasMore(data.hasMore);
            setLoading(false);
        } catch (err) {
            toastError(err);
        }
    }, [searchParam, pageNumber]);

    useEffect(() => {
        dispatch({ type: "RESET" });
        setPageNumber(1);
    }, [searchParam]);

    useEffect(() => {
        setLoading(true);
        const delayDebounceFn = setTimeout(() => {
            fetchFileLists();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchParam, pageNumber, fetchFileLists]);

    useEffect(() => {
        const socket = socketConnection({ companyId: user.companyId });

        socket.on(`company-${user.companyId}-file`, (data) => {
            if (data.action === "update" || data.action === "create") {
                dispatch({ type: "UPDATE_FILES", payload: data.files });
            }

            if (data.action === "delete") {
                dispatch({ type: "DELETE_USER", payload: +data.fileId });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const handleOpenFileListModal = () => {
        setSelectedFileList(null);
        setFileListModalOpen(true);
    };

    const handleCloseFileListModal = () => {
        setSelectedFileList(null);
        setFileListModalOpen(false);
    };

    const handleSearch = (event) => {
        setSearchParam(event.target.value.toLowerCase());
    };

    const handleEditFileList = (fileList) => {
        setSelectedFileList(fileList);
        setFileListModalOpen(true);
    };

    const handleDeleteFileList = async (fileListId) => {
        try {
            await api.delete(`/files/${fileListId}`);
            toast.success(i18n.t("files.toasts.deleted"));
        } catch (err) {
            toastError(err);
        }
        setDeletingFileList(null);
        setSearchParam("");
        setPageNumber(1);

        dispatch({ type: "RESET" });
        setPageNumber(1);
        await fetchFileLists();
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

    // Calcular estatísticas
    const getFileStats = () => {
        const total = files.length;
        
        return { total };
    };

    const stats = getFileStats();

    return (
        <div className={classes.mainContainer}>
            <MainContainer>
                <ConfirmationModal
                    title={deletingFileList && `${i18n.t("files.confirmationModal.deleteTitle")}`}
                    open={confirmModalOpen}
                    onClose={setConfirmModalOpen}
                    onConfirm={() => handleDeleteFileList(deletingFileList.id)}
                >
                    {i18n.t("files.confirmationModal.deleteMessage")}
                </ConfirmationModal>
                
                <FileModal
                    open={fileListModalOpen}
                    onClose={handleCloseFileListModal}
                    reload={fetchFileLists}
                    aria-labelledby="form-dialog-title"
                    fileListId={selectedFileList && selectedFileList.id}
                />

                <Container maxWidth="xl">
                    
                    {/* Header Modernizado */}
                    <Box className={classes.header}>
                        <div className={classes.headerContent}>
                            <FolderOpenIcon className={classes.headerIcon} />
                            <div>
                                <Typography className={classes.headerTitle}>
                                    {i18n.t("files.title")}
                                    <Chip 
                                        label={files.length} 
                                        className={classes.countChip} 
                                        size="small" 
                                        style={{ marginLeft: 16 }}
                                    />
                                </Typography>
                                <Typography className={classes.headerSubtitle}>
                                    Administrar listas de archivos y documentos del sistema.
                                </Typography>
                            </div>
                        </div>
                    </Box>

                    {/* Seção de Filtros Modernizada */}
                    <Paper className={classes.filtersSection} elevation={0}>
                        <Typography className={classes.filtersTitle}>
                            <FilterListIcon style={{ marginRight: 12 }} />
                            Buscar y administrar archivos
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
                                onClick={handleOpenFileListModal}
                                startIcon={<AddIcon />}
                            >
                                {i18n.t("files.buttons.add")}
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
                                        {stats.total}
                                    </Typography>
                                </div>
                            </div>

                            <div className={classes.statCard}>
                                <div className={`${classes.statIcon} ${classes.fileIcon}`}>
                                    <InsertDriveFileIcon />
                                </div>
                                <div className={classes.statContent}>
                                    <Typography className={classes.statTitle}>
                                        Archivos activos
                                    </Typography>
                                    <Typography className={classes.statValue}>
                                        {stats.total}
                                    </Typography>
                                </div>
                            </div>

                            <div className={classes.statCard}>
                                <div className={`${classes.statIcon} ${classes.storageIcon}`}>
                                    <StorageIcon />
                                </div>
                                <div className={classes.statContent}>
                                    <Typography className={classes.statTitle}>
                                        Almacenamiento
                                    </Typography>
                                    <Typography className={classes.statValue}>
                                        OK
                                    </Typography>
                                </div>
                            </div>

                            <div className={classes.statCard}>
                                <div className={`${classes.statIcon} ${classes.cloudIcon}`}>
                                    <CloudIcon />
                                </div>
                                <div className={classes.statContent}>
                                    <Typography className={classes.statTitle}>
                                        Sincronización
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
                            <Table stickyHeader className={classes.filesTable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <DescriptionIcon style={{ marginRight: 8, color: "#64748b" }} />
                                                {i18n.t("files.table.name")}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            {i18n.t("files.table.actions")}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {files.length > 0 ? (
                                        <>
                                            {files.map((fileList) => (
                                                <TableRow key={fileList.id} hover>
                                                    <TableCell align="center">
                                                        <Typography className={classes.fileName}>
                                                            <InsertDriveFileIcon className={classes.fileIcon} />
                                                            {fileList.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <div className={classes.actionButtons}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleEditFileList(fileList)}
                                                                className={classes.editIcon}
                                                                title="Editar"
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>

                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    setConfirmModalOpen(true);
                                                                    setDeletingFileList(fileList);
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
                                            {loading && <TableRowSkeleton columns={2} />}
                                        </>
                                    ) : (
                                        !loading && (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center">
                                                    <Box className={classes.emptyState}>
                                                        <FolderOpenIcon className={classes.emptyStateIcon} />
                                                        <Typography variant="h6" style={{ marginBottom: 8 }}>
                                                            No se encontró ninguna lista de archivos
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Crea tu primera lista para empezar a organizar archivos
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

export default FileLists;