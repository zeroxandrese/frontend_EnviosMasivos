import React, { useEffect, useReducer, useState, useContext } from "react";

import {
  Button,
  IconButton,
  makeStyles,
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
} from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { DeleteOutline, Edit, Search, Add, FilterList } from "@material-ui/icons";
import QueueIcon from "@material-ui/icons/Queue";
import LabelIcon from "@material-ui/icons/Label";
import PaletteIcon from "@material-ui/icons/Palette";
import SortIcon from "@material-ui/icons/Sort";
import ChatIcon from "@material-ui/icons/Chat";
import QueueModal from "../../components/QueueModal";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import { socketConnection } from "../../services/socket";
import { AuthContext } from "../../context/Auth/AuthContext";

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
  greetingIcon: {
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
  },
  orderIcon: {
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
  queuesTable: {
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
  queueName: {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "15px",
  },
  queueId: {
    fontWeight: 600,
    color: "#3b82f6",
  },
  colorIndicator: {
    width: "60px",
    height: "20px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    margin: "0 auto",
  },
  queueText: {
    fontFamily: "monospace",
    backgroundColor: "#f1f5f9",
    padding: theme.spacing(0.5, 1),
    borderRadius: "6px",
    fontSize: "12px",
    color: "#475569",
    maxWidth: "300px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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

// Reducer corrigido para evitar mutação direta do estado
const reducer = (state, action) => {
  if (action.type === "LOAD_QUEUES") {
    const queues = action.payload;
    if (!Array.isArray(queues)) {
      console.error("LOAD_QUEUES: payload deve ser um array", queues);
      return state;
    }
    
    const newState = [...state];
    const newQueues = [];

    queues.forEach((queue) => {
      if (!queue || typeof queue.id === 'undefined') {
        console.error("Queue inválida:", queue);
        return;
      }
      
      const queueIndex = newState.findIndex((q) => q.id === queue.id);
      if (queueIndex !== -1) {
        newState[queueIndex] = { ...queue };
      } else {
        newQueues.push({ ...queue });
      }
    });

    return [...newState, ...newQueues];
  }

  if (action.type === "UPDATE_QUEUES") {
    const queue = action.payload;
    if (!queue || typeof queue.id === 'undefined') {
      console.error("UPDATE_QUEUES: queue inválida", queue);
      return state;
    }
    
    const queueIndex = state.findIndex((u) => u.id === queue.id);
    const newState = [...state];

    if (queueIndex !== -1) {
      newState[queueIndex] = { ...queue };
      return newState;
    } else {
      return [{ ...queue }, ...newState];
    }
  }

  if (action.type === "DELETE_QUEUE") {
    const queueId = action.payload;
    if (typeof queueId === 'undefined') {
      console.error("DELETE_QUEUE: queueId inválido", queueId);
      return state;
    }
    
    return state.filter((q) => q.id !== queueId);
  }

  if (action.type === "RESET") {
    return [];
  }

  return state;
};

const Queues = () => {
  const classes = useStyles();

  const [queues, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // UseEffect para carregar filas iniciais
  useEffect(() => {
    const loadQueues = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/queue");
        if (data && Array.isArray(data)) {
          dispatch({ type: "LOAD_QUEUES", payload: data });
        } else {
          console.error("Dados inválidos recebidos da API:", data);
          dispatch({ type: "LOAD_QUEUES", payload: [] });
        }
      } catch (err) {
        console.error("Erro ao carregar filas:", err);
        toastError(err);
        dispatch({ type: "LOAD_QUEUES", payload: [] });
      } finally {
        setLoading(false);
      }
    };

    loadQueues();
  }, []);

  // UseEffect para socket - corrigido com dependências adequadas
  useEffect(() => {
    if (!user || !user.companyId || !user.id) {
      console.warn("User não disponível para conexão socket:", user);
      return;
    }

    let socket;
    
    try {
      const companyId = user.companyId;
      socket = socketConnection({ companyId, userId: user.id });

      socket.on(`company-${companyId}-queue`, (data) => {
        try {
          if (!data) {
            console.error("Dados socket inválidos:", data);
            return;
          }

          if (data.action === "update" || data.action === "create") {
            if (data.queue) {
              dispatch({ type: "UPDATE_QUEUES", payload: data.queue });
            }
          }

          if (data.action === "delete") {
            if (data.queueId) {
              dispatch({ type: "DELETE_QUEUE", payload: data.queueId });
            }
          }
        } catch (error) {
          console.error("Erro ao processar evento socket:", error, data);
        }
      });

      socket.on('connect_error', (error) => {
        console.error("Erro de conexão socket:", error);
      });

    } catch (error) {
      console.error("Erro ao configurar socket:", error);
    }

    return () => {
      if (socket) {
        try {
          socket.disconnect();
        } catch (error) {
          console.error("Erro ao desconectar socket:", error);
        }
      }
    };
  }, [user?.companyId, user?.id]); // Dependências corretas

  const handleOpenQueueModal = () => {
    setQueueModalOpen(true);
    setSelectedQueue(null);
  };

  const handleCloseQueueModal = () => {
    setQueueModalOpen(false);
    setSelectedQueue(null);
  };

  const handleEditQueue = (queue) => {
    if (!queue) {
      console.error("Queue inválida para edição:", queue);
      return;
    }
    setSelectedQueue(queue);
    setQueueModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedQueue(null);
  };

  const handleDeleteQueue = async (queueId) => {
    if (!queueId) {
      console.error("QueueId inválido para deleção:", queueId);
      return;
    }
    
    try {
      await api.delete(`/queue/${queueId}`);
      toast.success(i18n.t("Queue deleted successfully!"));
    } catch (err) {
      console.error("Erro ao deletar fila:", err);
      toastError(err);
    } finally {
      setSelectedQueue(null);
      setConfirmModalOpen(false);
    }
  };

  const handleSearch = (event) => {
    const value = event?.target?.value || "";
    setSearchParam(value.toLowerCase());
  };

  // Filtrar filas baseado na busca - com verificações de segurança
  const filteredQueues = React.useMemo(() => {
    if (!Array.isArray(queues)) {
      console.error("Queues não é um array:", queues);
      return [];
    }

    if (!searchParam.trim()) {
      return queues;
    }

    return queues.filter(queue => {
      if (!queue) return false;
      
      const name = queue.name || "";
      const greeting = queue.greetingMessage || "";
      const order = queue.orderQueue || "";
      
      return (
        name.toLowerCase().includes(searchParam) ||
        greeting.toLowerCase().includes(searchParam) ||
        order.toLowerCase().includes(searchParam)
      );
    });
  }, [queues, searchParam]);

  // Calcular estatísticas das filas - com verificações de segurança
  const getQueueStats = React.useCallback(() => {
    if (!Array.isArray(queues)) {
      return { total: 0, withGreeting: 0, withOrderQueue: 0, active: 0 };
    }

    const validQueues = queues.filter(q => q && typeof q === 'object');
    const total = validQueues.length;
    const withGreeting = validQueues.filter(q => 
      q.greetingMessage && 
      typeof q.greetingMessage === 'string' && 
      q.greetingMessage.trim() !== ''
    ).length;
    const withOrderQueue = validQueues.filter(q => 
      q.orderQueue && 
      typeof q.orderQueue === 'string' && 
      q.orderQueue.trim() !== ''
    ).length;
    const active = total; // Assumindo que todas as filas criadas estão ativas

    return { total, withGreeting, withOrderQueue, active };
  }, [queues]);

  const stats = getQueueStats();

  // Verificação de segurança para renderização
  if (!user) {
    return (
      <div className={classes.mainContainer}>
        <MainContainer>
          <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
              <Typography>Cargando...</Typography>
            </Box>
          </Container>
        </MainContainer>
      </div>
    );
  }

  return (
    <div className={classes.mainContainer}>
      <MainContainer>
        <ConfirmationModal
          title={
            selectedQueue && selectedQueue.name
              ? `${i18n.t("queues.confirmationModal.deleteTitle")} ${selectedQueue.name}?`
              : i18n.t("queues.confirmationModal.deleteTitle")
          }
          open={confirmModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={() => handleDeleteQueue(selectedQueue?.id)}
        >
          {i18n.t("queues.confirmationModal.deleteMessage")}
        </ConfirmationModal>
        
        <QueueModal
          open={queueModalOpen}
          onClose={handleCloseQueueModal}
          queueId={selectedQueue?.id}
          onEdit={(res) => {
            if (res) {
              setTimeout(() => {
                handleEditQueue(res)
              }, 500)
            }
          }}
        />

        <Container maxWidth="xl">
          
          {/* Header Modernizado */}
          <Box className={classes.header}>
            <div className={classes.headerContent}>
              <QueueIcon className={classes.headerIcon} />
              <div>
                <Typography className={classes.headerTitle}>
                  {/*i18n.t("queues.title")*/}
                  Colas
                </Typography>
                <Typography className={classes.headerSubtitle}>
                  Administrar colas y configuraciones de servicio
                </Typography>
              </div>
            </div>
          </Box>

          {/* Seção de Filtros Modernizada */}
          <Paper className={classes.filtersSection} elevation={0}>
            <Typography className={classes.filtersTitle}>
              <FilterList style={{ marginRight: 12 }} />
              Buscar e Gerenciar colas
            </Typography>
            
            <div className={classes.filtersGroup}>
              <TextField
                placeholder="Buscar por nome, saudação ou ordem..."
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
                onClick={handleOpenQueueModal}
                startIcon={<Add />}
              >
                {i18n.t("queues.buttons.add")}
              </Button>
            </div>
          </Paper>

          {/* Cards de Estatísticas */}
          <Box className={classes.statsGrid}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                  <QueueIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Total de Colas
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.total}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.activeIcon}`}>
                  <ChatIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Con saludos
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.withGreeting}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.orderIcon}`}>
                  <SortIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Con orden
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.withOrderQueue}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.greetingIcon}`}>
                  <LabelIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Colas activas
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.active}
                  </Typography>
                </div>
              </div>
            </div>
          </Box>

          {/* Tabela Modernizada */}
          <Paper className={classes.mainPaper} elevation={0}>
            <Table size="small" className={classes.queuesTable}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <LabelIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("queues.table.ID")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <QueueIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("queues.table.name")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <PaletteIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("queues.table.color")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <SortIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("queues.table.orderQueue")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <ChatIcon style={{ marginRight: 8, color: "#64748b" }} />
                      {i18n.t("queues.table.greeting")}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    Comportamiento
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQueues.length > 0 ? (
                  <>
                    {filteredQueues.map((queue) => (
                      <TableRow key={queue.id} hover>
                        <TableCell align="center">
                          <Typography className={classes.queueId}>
                            #{queue.id}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography className={classes.queueName}>
                            {queue.name || "Sin nombre"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <div className={classes.customTableCell}>
                            <div
                              className={classes.colorIndicator}
                              style={{
                                backgroundColor: queue.color || "#cccccc",
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className={classes.customTableCell}>
                            <Typography className={classes.queueText}>
                              {queue.orderQueue || "No definido"}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className={classes.customTableCell}>
                            <Typography className={classes.queueText}>
                              {queue.greetingMessage || "No definido"}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className={classes.actionButtons}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditQueue(queue)}
                              className={classes.editIcon}
                              title="Editar"
                            >
                              <Edit fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedQueue(queue);
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
                    {loading && <TableRowSkeleton columns={6} />}
                  </>
                ) : (
                  !loading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Box className={classes.emptyState}>
                          <QueueIcon className={classes.emptyStateIcon} />
                          <Typography variant="h6" style={{ marginBottom: 8 }}>
                            {searchParam ? "No se encontraron colas" : "No hay cola registrada"}
                          </Typography>
                          <Typography variant="body2">
                            {searchParam ? "Intenta ajustar tu búsqueda" : "Crea tu primera cola para comenzar"}
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

export default Queues;