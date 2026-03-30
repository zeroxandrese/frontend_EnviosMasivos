import React, { useEffect } from 'react';

import api from '../../services/api';
import { toast } from 'react-toastify';

import MainContainer from '../../components/MainContainer';
import { ModalPlantao } from '../../components/ModalPlantao';
import ConfirmationModal from '../../components/ConfirmationModal';

import { 
  Button, 
  IconButton, 
  makeStyles, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer,
  TableHead, 
  TableRow, 
  Typography, 
  Box,
  Container,
  Chip
} from '@material-ui/core';
import { green } from "@material-ui/core/colors";
import { 
  DeleteOutline, 
  Edit,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  SupervisorAccount as SupervisorAccountIcon,
  AccessTime as AccessTimeIcon,
  FilterList as FilterListIcon
} from '@material-ui/icons';

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
  scheduleIcon: {
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
  },
  phoneIcon: {
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
  plantaoTable: {
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
  phoneNumber: {
    color: "#64748b",
    fontSize: "13px",
    fontFamily: "monospace",
  },
  scheduleChip: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    fontFamily: "monospace",
    fontSize: "11px",
    margin: theme.spacing(0.25),
    fontWeight: 500,
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
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: theme.typography.pxToRem(14),
    border: "1px solid #dadde9",
    maxWidth: 450,
  },
  tooltipPopper: {
    textAlign: "center",
  },
  buttonProgress: {
    color: green[500],
  },
}));

export const Plantao = () => {
  const classes = useStyles();

  const [openModal, setOpenModal] = React.useState(false);
  const [plantaoId, setPlantaoId] = React.useState(null);
  const [listPlantao, setListPlantao] = React.useState([]);
  const [modalConfirmationOpen, setModalConfirmationOpen] = React.useState(false);

  useEffect(() => {
    handleGetPlantao();
  }, []);

  const handleGetPlantao = async () => {
    try {
      const { data } = await api.get("/plantao");
      setListPlantao(data);
    } catch (error) {
      console.log('lista plantao', error);
    }
  };

  const handleEditPlantao = (plantao) => {
    setPlantaoId(plantao.id);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setPlantaoId(null);
  }

  const handleDeletePlantao = async () => {
    try {
      const { data } = await api.delete(`/plantao/${plantaoId}`);
      handleGetPlantao();
      toast.success('El cambio se eliminó correctamente');
    } catch (error) {
      console.log('delete plantao', error);
    }
  }

  const handleOpenConfirmationModal = (plantaoId) => {
    setModalConfirmationOpen(true);
    setPlantaoId(plantaoId);
  }

  // Calcular estatísticas
  const getPlantaoStats = () => {
    const total = listPlantao.length;
    const withSchedules = listPlantao.filter(p => p.days && p.days.some(d => d.startTime && d.endTime)).length;
    const withPhones = listPlantao.filter(p => p.phone).length;
    
    return { total, withSchedules, withPhones };
  };

  const stats = getPlantaoStats();

  return (
    <div className={classes.mainContainer}>
      <MainContainer>
        <ModalPlantao
          plantaoId={plantaoId}
          onClose={handleClose}
          open={openModal}
          callback={handleGetPlantao}
        />

        <ConfirmationModal
          title={'Remover plantonista'}
          open={modalConfirmationOpen}
          onClose={setModalConfirmationOpen}
          onConfirm={handleDeletePlantao}
        >
          {'Deseja realmente excluir este plantonista?'}
        </ConfirmationModal>

        <Container maxWidth="xl">
          
          {/* Header Modernizado */}
          <Box className={classes.header}>
            <div className={classes.headerContent}>
              <ScheduleIcon className={classes.headerIcon} />
              <div>
                <Typography className={classes.headerTitle}>
                  Deber
                </Typography>
                <Typography className={classes.headerSubtitle}>
                  Gestionar al personal de guardia y sus horarios de servicio.
                </Typography>
              </div>
            </div>
          </Box>

          {/* Seção de Controles Modernizada */}
          <Paper className={classes.filtersSection} elevation={0}>
            <Typography className={classes.filtersTitle}>
              <FilterListIcon style={{ marginRight: 12 }} />
              Administrar turnos
            </Typography>
            
            <div className={classes.filtersGroup}>
              <div style={{ flex: 1 }}></div>
              
              <Button
                className={classes.addButton}
                variant="contained"
                onClick={() => setOpenModal(true)}
                startIcon={<AddIcon />}
              >
                Agregar deber
              </Button>
            </div>
          </Paper>

          {/* Cards de Estatísticas */}
          <Box className={classes.statsGrid}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                  <SupervisorAccountIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Número total de personal de guardia
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.total}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.scheduleIcon}`}>
                  <AccessTimeIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Con Horários Definidos
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.withSchedules}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.phoneIcon}`}>
                  <PhoneIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Con número de teléfono registrado
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.withPhones}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.activeIcon}`}>
                  <AssignmentIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Status General
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
            <TableContainer style={{ maxHeight: 600, overflowY: "auto" }}>
              <Table stickyHeader className={classes.plantaoTable}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <AssignmentIcon style={{ marginRight: 8, color: "#64748b" }} />
                        ID
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <PersonIcon style={{ marginRight: 8, color: "#64748b" }} />
                        Servicio
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <PhoneIcon style={{ marginRight: 8, color: "#64748b" }} />
                        Telefono
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <ScheduleIcon style={{ marginRight: 8, color: "#64748b" }} />
                        Horários
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      Comportamiento
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listPlantao?.length > 0 ? (
                    listPlantao.map((users) => (
                      <TableRow key={users.id} hover>
                        <TableCell align="center">
                          <Typography variant="body2" style={{ fontWeight: 600, color: "#3b82f6" }}>
                            #{users?.id}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography className={classes.userName}>
                            {users?.user?.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography className={classes.phoneNumber}>
                            {users?.phone || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            {users?.days?.map((dia, index) => {
                              if (dia.startTime && dia.endTime) {
                                return (
                                  <Chip
                                    key={index}
                                    label={`${dia.weekday} - ${dia.startTime} às ${dia.endTime}`}
                                    className={classes.scheduleChip}
                                    size="small"
                                    variant="outlined"
                                  />
                                );
                              }
                              return null;
                            })}
                            {(!users?.days || users?.days?.filter(d => d.startTime && d.endTime).length === 0) && (
                              <Typography variant="body2" color="textSecondary" style={{ fontStyle: 'italic' }}>
                                Sin horarios establecidos
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <div className={classes.actionButtons}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditPlantao(users)}
                              className={classes.editIcon}
                              title="Editar"
                            >
                              <Edit fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={(e) => {
                                handleOpenConfirmationModal(users.id);
                              }}
                              className={classes.deleteIcon}
                              title="Deletar"
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Box className={classes.emptyState}>
                          <ScheduleIcon className={classes.emptyStateIcon} />
                          <Typography variant="h6" style={{ marginBottom: 8 }}>
                            No se encontró personal de guardia.
                          </Typography>
                          <Typography variant="body2">
                            Para empezar, añade al primer trabajador de guardia.
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
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