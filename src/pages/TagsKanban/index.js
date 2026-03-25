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
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";
import CircularProgress from "@material-ui/core/CircularProgress";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import AddIcon from "@material-ui/icons/Add";
import LabelIcon from "@material-ui/icons/Label";
import AssignmentIcon from "@material-ui/icons/Assignment";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import TagModal from "../../components/TagModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Chip } from "@material-ui/core";
import { socketConnection } from "../../services/socket";
import { AuthContext } from "../../context/Auth/AuthContext";
import { CheckCircle } from "@material-ui/icons";

const reducer = (state, action) => {
  if (action.type === "LOAD_TAGS") {
    const tags = action.payload;
    const newTags = [];

    tags.forEach((tag) => {
      const tagIndex = state.findIndex((s) => s.id === tag.id);
      if (tagIndex !== -1) {
        state[tagIndex] = tag;
      } else {
        newTags.push(tag);
      }
    });

    return [...state, ...newTags];
  }

  if (action.type === "UPDATE_TAGS") {
    const tag = action.payload;
    const tagIndex = state.findIndex((s) => s.id === tag.id);

    if (tagIndex !== -1) {
      state[tagIndex] = tag;
      return [...state];
    } else {
      return [tag, ...state];
    }
  }

  if (action.type === "DELETE_TAG") {
    const tagId = action.payload;

    const tagIndex = state.findIndex((s) => s.id == tagId);
    if (tagIndex !== -1) {
      state.splice(tagIndex, 1);
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
    justifyContent: "space-between",
    gap: theme.spacing(3),
    position: "relative",
    zIndex: 1,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(3),
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
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  searchField: {
    width: "300px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.2)",
      color: "white",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.3)",
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(255,255,255,0.2)",
        border: "1px solid rgba(255,255,255,0.4)",
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
      "&::placeholder": {
        color: "rgba(255,255,255,0.7)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255,255,255,0.8)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
  addButton: {
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    borderRadius: "16px",
    padding: theme.spacing(1.5, 3),
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    minHeight: "48px",
    fontSize: "14px",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
      transform: "translateY(-2px)",
    },
  },
  contentSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: "24px",
    color: "#1e293b",
    marginBottom: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  modernTable: {
    "& .MuiTableHead-root": {
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    },
    "& .MuiTableCell-head": {
      fontWeight: 700,
      color: "#1e293b",
      borderBottom: "2px solid #e2e8f0",
      fontSize: "16px",
      padding: theme.spacing(2),
    },
    "& .MuiTableRow-root:nth-child(even)": {
      backgroundColor: "#f8fafc",
    },
    "& .MuiTableRow-root:hover": {
      backgroundColor: "#f1f5f9",
      transform: "scale(1.001)",
      transition: "all 0.2s ease",
    },
    "& .MuiTableCell-root": {
      borderBottom: "1px solid #e2e8f0",
      padding: theme.spacing(2),
      fontSize: "14px",
    },
  },
  tableCard: {
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  actionButton: {
    borderRadius: "10px",
    padding: theme.spacing(1),
    margin: theme.spacing(0, 0.5),
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
  },
  editButton: {
    color: "#3b82f6",
    "&:hover": {
      backgroundColor: "rgba(59, 130, 246, 0.1)",
    },
  },
  deleteButton: {
    color: "#ef4444",
    "&:hover": {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
    },
  },
  modernChip: {
    borderRadius: "12px",
    fontWeight: 600,
    fontSize: "12px",
    padding: theme.spacing(0.5, 1),
    minHeight: "32px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    },
  },
  statsChip: {
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    color: "white",
    fontWeight: 700,
    borderRadius: "12px",
    minWidth: "60px",
    boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)",
  },
  emptyState: {
    padding: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#64748b",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: theme.spacing(2),
    opacity: 0.5,
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  },
}));

const Tags = () => {
  const classes = useStyles();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [deletingTag, setDeletingTag] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [tags, dispatch] = useReducer(reducer, []);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  const fetchTags = async () => {
    try {
      const { data } = await api.get("/tags/", {
        params: { searchParam, offset: tags?.length, kanban: 1 },
      });
      dispatch({ type: "LOAD_TAGS", payload: data.tags });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  };

  useEffect(() => {
      fetchTags();
  }, [searchParam]);

  useEffect(() => {
    const socket = socketConnection({ companyId: user.companyId });

    socket.on(`company${user.companyId}-tag`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_TAGS", payload: data.tag });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_TAG", payload: data.tagId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleOpenTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setSelectedTag(null);
    setTagModalOpen(false);
  };

  const handleSearch = (event) => {
    dispatch({ type: "RESET" });
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditTag = (tag) => {
    setSelectedTag(tag);
    setTagModalOpen(true);
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await api.delete(`/tags/${tagId}`);
      toast.success(i18n.t("tags.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingTag(null);
    setSearchParam("");

    dispatch({ type: "RESET" });
    await fetchTags();
  };

  const loadMore = async () => {
    await fetchTags()
  };

  const handleScroll = async (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      await loadMore();
    }
  };

  return (
    <div style={{ backgroundColor: "#f1f5f9", minHeight: "100vh" }}>
      <Container maxWidth="xl" className={classes.container}>
        
        <ConfirmationModal
          title={deletingTag && `${i18n.t("tagsKanban.confirmationModal.deleteTitle")}`}
          open={confirmModalOpen}
          onClose={setConfirmModalOpen}
          onConfirm={() => handleDeleteTag(deletingTag.id)}
        >
          {i18n.t("tagsKanban.confirmationModal.deleteMessage")}
        </ConfirmationModal>
        
        <TagModal
          open={tagModalOpen}
          onClose={handleCloseTagModal}
          reload={fetchTags}
          aria-labelledby="form-dialog-title"
          tagId={selectedTag && selectedTag.id}
          kanban={1}
        />

        {/* Header Section */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <div className={classes.headerLeft}>
              <LocalOfferIcon className={classes.headerIcon} />
              <div>
                <Typography className={classes.headerTitle}>
                  {i18n.t("tagsKanban.title")}
                </Typography>
                <Typography className={classes.headerSubtitle}>
                  Gerencie tags e etiquetas para organização de tickets ({tags.length} tags)
                </Typography>
              </div>
            </div>
            
            <div className={classes.headerActions}>
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
                      <SearchIcon style={{ color: "rgba(255,255,255,0.7)" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={handleOpenTagModal}
                className={classes.addButton}
                startIcon={<AddIcon />}
              >
                {i18n.t("tagsKanban.buttons.add")}
              </Button>
            </div>
          </div>
        </Box>

        {/* Content Section */}
        <Paper className={classes.contentSection} elevation={0}>
          <Typography className={classes.sectionTitle}>
            <LabelIcon />
            Lista de Tags
          </Typography>
          
          <Paper className={classes.tableCard} elevation={0}>
            {loading && tags.length === 0 ? (
              <div className={classes.loadingContainer}>
                <CircularProgress size={40} />
              </div>
            ) : (
              <TableContainer>
                <Table className={classes.modernTable} size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <LabelIcon style={{ marginRight: 8, color: "#64748b" }} />
                          {i18n.t("tagsKanban.table.name")}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" alignItems="center" justifyContent="center">
                          <AssignmentIcon style={{ marginRight: 8, color: "#64748b" }} />
                          {i18n.t("tagsKanban.table.tickets")}
                        </Box>
                      </TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody onScroll={handleScroll}>
                    {tags.length > 0 ? (
                      <>
                        {tags.map((tag) => (
                          <TableRow key={tag.id}>
                            <TableCell align="center">
                              <Chip
                                variant="outlined"
                                style={{
                                  backgroundColor: tag.color,
                                  color: "white",
                                }}
                                label={tag.name}
                                className={classes.modernChip}
                                size="medium"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={tag?.ticketsCount || "0"}
                                className={classes.statsChip}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditTag(tag)}
                                className={`${classes.actionButton} ${classes.editButton}`}
                              >
                                <EditIcon />
                              </IconButton>

                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  setConfirmModalOpen(true);
                                  setDeletingTag(tag);
                                }}
                                className={`${classes.actionButton} ${classes.deleteButton}`}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        {loading && <TableRowSkeleton columns={3} />}
                      </>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className={classes.emptyState}>
                          <LocalOfferIcon className={classes.emptyIcon} />
                          <Typography variant="h6" style={{ marginBottom: "8px" }}>
                            {loading ? "Carregando tags..." : "Nenhuma tag encontrada"}
                          </Typography>
                          {!loading && (
                            <Typography variant="body2" color="textSecondary">
                              {searchParam 
                                ? "Ajuste sua pesquisa ou crie uma nova tag" 
                                : "Comece criando sua primeira tag"}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Paper>

      </Container>
    </div>
  );
};

export default Tags;