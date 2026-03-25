import React, { useEffect, useReducer, useState, useContext } from "react";

import openSocket from "socket.io-client";

import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Container,
  Box,
  TextField,
  InputAdornment,
  Chip,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import MainContainer from "../../components/MainContainer";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { 
  DeleteOutline, 
  Edit, 
  Search, 
  Add, 
  FilterList,
  Chat,
  Label,
  List,
  Tune,
  Build
} from "@material-ui/icons";
import PromptModal from "../../components/PromptModal";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";

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
  queueIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  tokenIcon: {
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
  },
  aiIcon: {
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
  promptsTable: {
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
  promptName: {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "15px",
  },
  queueChip: {
    backgroundColor: "#dbeafe",
    color: "#3b82f6",
    fontWeight: 600,
    fontSize: "12px",
  },
  tokensDisplay: {
    fontFamily: "monospace",
    backgroundColor: "#f1f5f9",
    padding: theme.spacing(0.5, 1),
    borderRadius: "6px",
    fontSize: "12px",
    color: "#475569",
    fontWeight: 600,
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
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const reducer = (state, action) => {
  if (action.type === "LOAD_PROMPTS") {
    const prompts = action.payload;
    const newPrompts = [];

    prompts.forEach((prompt) => {
      const promptIndex = state.findIndex((p) => p.id === prompt.id);
      if (promptIndex !== -1) {
        state[promptIndex] = prompt;
      } else {
        newPrompts.push(prompt);
      }
    });

    return [...state, ...newPrompts];
  }

  if (action.type === "UPDATE_PROMPTS") {
    const prompt = action.payload;
    const promptIndex = state.findIndex((p) => p.id === prompt.id);

    if (promptIndex !== -1) {
      state[promptIndex] = prompt;
      return [...state];
    } else {
      return [prompt, ...state];
    }
  }

  if (action.type === "DELETE_PROMPT") {
    const promptId = action.payload;
    const promptIndex = state.findIndex((p) => p.id === promptId);
    if (promptIndex !== -1) {
      state.splice(promptIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const Prompts = () => {
  const classes = useStyles();

  const [prompts, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/prompt");
        dispatch({ type: "LOAD_PROMPTS", payload: data.prompts });
        setLoading(false);
      } catch (err) {
        toastError(err);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const socket = openSocket(process.env.REACT_APP_BACKEND_URL);

    socket.on("prompt", (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_PROMPTS", payload: data.prompt });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_PROMPT", payload: data.promptId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenPromptModal = () => {
    setPromptModalOpen(true);
    setSelectedPrompt(null);
  };

  const handleClosePromptModal = () => {
    setPromptModalOpen(false);
    setSelectedPrompt(null);
  };

  const handleEditPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setPromptModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedPrompt(null);
  };

  const handleDeletePrompt = async (promptId) => {
    try {
      const { data } = await api.delete(`/prompt/${promptId}`);
      toast.info(i18n.t(data.message));
    } catch (err) {
      toastError(err);
    }
    setSelectedPrompt(null);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  // Filtrar prompts baseado na busca
  const filteredPrompts = prompts.filter(prompt => 
    prompt.name?.toLowerCase().includes(searchParam) ||
    prompt.queue?.name?.toLowerCase().includes(searchParam) ||
    prompt.maxTokens?.toString().includes(searchParam)
  );

  // Calcular estatísticas dos prompts
  const getPromptStats = () => {
    const total = prompts.length;
    const uniqueQueues = [...new Set(prompts.map(p => p.queue?.name).filter(Boolean))].length;
    const totalTokens = prompts.reduce((sum, p) => sum + (parseInt(p.maxTokens) || 0), 0);
    const avgTokens = total > 0 ? Math.round(totalTokens / total) : 0;

    return { total, uniqueQueues, totalTokens, avgTokens };
  };

  const stats = getPromptStats();

  return (
    <div className={classes.mainContainer}>
      <MainContainer>
        <ConfirmationModal
          title={
            selectedPrompt &&
            `${i18n.t("prompts.confirmationModal.deleteTitle")} ${selectedPrompt.name}?`
          }
          open={confirmModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={() => handleDeletePrompt(selectedPrompt.id)}
        >
          {i18n.t("prompts.confirmationModal.deleteMessage")}
        </ConfirmationModal>
        
        <PromptModal
          open={promptModalOpen}
          onClose={handleClosePromptModal}
          promptId={selectedPrompt?.id}
        />

        <Container maxWidth="xl">
          
          {/* Header Modernizado */}
          <Box className={classes.header}>
            <div className={classes.headerContent}>
              <Chat className={classes.headerIcon} />
              <div>
                <Typography className={classes.headerTitle}>
                  {i18n.t("prompts.title")}
                </Typography>
                <Typography className={classes.headerSubtitle}>
                  Gerencie prompts de IA e configurações de tokens
                </Typography>
              </div>
            </div>
          </Box>

          {/* Seção de Filtros Modernizada */}
          <Paper className={classes.filtersSection} elevation={0}>
            <Typography className={classes.filtersTitle}>
              <FilterList style={{ marginRight: 12 }} />
              Buscar e Gerenciar Prompts
            </Typography>
            
            <div className={classes.filtersGroup}>
              <TextField
                placeholder="Buscar por nome, fila ou tokens..."
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
                onClick={handleOpenPromptModal}
                startIcon={<Add />}
              >
                {i18n.t("prompts.buttons.add")}
              </Button>
            </div>
          </Paper>

          {/* Cards de Estatísticas */}
          <Box className={classes.statsGrid}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                  <Chat />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Total de Prompts
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.total}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.queueIcon}`}>
                  <List />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Filas Diferentes
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.uniqueQueues}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.tokenIcon}`}>
                  <Tune />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Total Tokens
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.totalTokens.toLocaleString()}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.aiIcon}`}>
                  <Build />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Média Tokens
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.avgTokens}
                  </Typography>
                </div>
              </div>
            </div>
          </Box>

          {/* Tabela Modernizada */}
          <Paper className={classes.mainPaper} elevation={0}>
            <Table size="small" className={classes.promptsTable}>
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <Chat style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("prompts.table.name")}
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <List style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("prompts.table.queue")}
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <Tune style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("prompts.table.max_tokens")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPrompts.length > 0 ? (
                  <>
                    {filteredPrompts.map((prompt) => (
                      <TableRow key={prompt.id} hover>
                        <TableCell align="left">
                          <Typography className={classes.promptName}>
                            {prompt.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Chip
                            label={prompt.queue?.name || "Não definida"}
                            className={classes.queueChip}
                            size="small"
                            icon={<List fontSize="small" />}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <Typography className={classes.tokensDisplay}>
                            {prompt.maxTokens ? `${prompt.maxTokens} tokens` : "Não definido"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <div className={classes.actionButtons}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditPrompt(prompt)}
                              className={classes.editIcon}
                              title="Editar"
                            >
                              <Edit fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedPrompt(prompt);
                                setConfirmModalOpen(true);
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
                          <Chat className={classes.emptyStateIcon} />
                          <Typography variant="h6" style={{ marginBottom: 8 }}>
                            {searchParam ? "Nenhum prompt encontrado" : "Nenhum prompt cadastrado"}
                          </Typography>
                          <Typography variant="body2">
                            {searchParam ? "Tente ajustar sua busca" : "Crie seu primeiro prompt para começar"}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      </MainContainer>
    </div>
  );
};

export default Prompts;