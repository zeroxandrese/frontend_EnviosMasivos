import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { toast } from "react-toastify";

import MainContainer from "../../components/MainContainer";
import api from "../../services/api";
import usePlans from "../../hooks/usePlans";
import toastError from "../../errors/toastError";
import { i18n } from "../../translate/i18n";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Container,
  CircularProgress,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
} from "@material-ui/core";
import ConfirmationModal from "../../components/ConfirmationModal";

// Ícones modernos
import SettingsIcon from '@material-ui/icons/Settings';
import TimerIcon from '@material-ui/icons/Timer';
import SaveIcon from '@material-ui/icons/Save';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import TuneIcon from '@material-ui/icons/Tune';
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CodeIcon from '@material-ui/icons/Code';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

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
  modernFormControl: {
    minWidth: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
      "&.Mui-focused": {
        backgroundColor: "white",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#64748b",
      fontWeight: 500,
    },
  },
  modernTextField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
      "&.Mui-focused": {
        backgroundColor: "white",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#64748b",
      fontWeight: 500,
    },
  },
  successButton: {
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    borderRadius: "12px",
    padding: theme.spacing(1.5, 3),
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    minHeight: "48px",
    fontSize: "14px",
    boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
      boxShadow: "0 8px 25px rgba(34, 197, 94, 0.4)",
      transform: "translateY(-2px)",
    },
  },
  secondaryButton: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "12px",
    padding: theme.spacing(1.5, 3),
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    minHeight: "48px",
    fontSize: "14px",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
      transform: "translateY(-2px)",
    },
  },
  cancelButton: {
    background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    borderRadius: "12px",
    padding: theme.spacing(1.5, 3),
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    minHeight: "48px",
    fontSize: "14px",
    boxShadow: "0 4px 15px rgba(100, 116, 139, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #475569 0%, #334155 100%)",
      boxShadow: "0 8px 25px rgba(100, 116, 139, 0.4)",
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
  intervalIcon: {
    backgroundColor: "#dbeafe",
    color: "#3b82f6",
  },
  settingsIcon: {
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
  },
  performanceIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  variableIcon: {
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
  textRight: {
    textAlign: "right",
  },
  variablesTable: {
    marginTop: theme.spacing(3),
    "& .MuiTableCell-head": {
      backgroundColor: "#f8fafc",
      fontWeight: 600,
      color: "#374151",
      borderBottom: "2px solid #e5e7eb",
    },
    "& .MuiTableRow-root:nth-child(even)": {
      backgroundColor: "#f9fafb",
    },
    "& .MuiTableRow-root:hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  variableKey: {
    fontFamily: "monospace",
    backgroundColor: "#f1f5f9",
    padding: theme.spacing(0.5, 1),
    borderRadius: "6px",
    color: "#1e40af",
    fontWeight: 600,
  },
  expandButton: {
    backgroundColor: "transparent",
    color: "#64748b",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    cursor: "pointer",
    fontWeight: 600,
    "&:hover": {
      color: "#3b82f6",
    },
  },
}));

const initialSettings = {
  messageInterval: 20,
  longerIntervalAfter: 20,
  greaterInterval: 60,
  variables: [],
};

const CampaignsConfig = () => {
  const classes = useStyles();
  const history = useHistory();

  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [showVariablesForm, setShowVariablesForm] = useState(false);
  const [showVariablesSection, setShowVariablesSection] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [variable, setVariable] = useState({ key: "", value: "" });
  const { user } = useContext(AuthContext);

  const { getPlanCompany } = usePlans();

  useEffect(() => {
    async function fetchData() {
      try {
        if (!user?.companyId) return;
        
        const companyId = user.companyId;
        const planConfigs = await getPlanCompany(undefined, companyId);
        
        if (!planConfigs?.plan?.useCampaigns) {
          toast.error("Esta empresa não possui permissão para acessar essa página! Estamos lhe redirecionando.");
          setTimeout(() => {
            history.push("/");
          }, 1000);
        }
      } catch (error) {
        console.error("Erro ao verificar plano:", error);
        toastError(error);
      }
    }
    fetchData();
  }, [user, history, getPlanCompany]);

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/campaign-settings");
        const settingsList = [];
        
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((item) => {
            settingsList.push([item.key, JSON.parse(item.value)]);
          });
          const loadedSettings = Object.fromEntries(settingsList);
          setSettings({ ...initialSettings, ...loadedSettings });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toastError(error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleOnChangeSettings = (e) => {
    const changedProp = {};
    changedProp[e.target.name] = e.target.value;
    setSettings((prev) => ({ ...prev, ...changedProp }));
  };

  const handleOnChangeVariable = (e) => {
    if (e.target.value !== null) {
      const changedProp = {};
      changedProp[e.target.name] = e.target.value;
      setVariable((prev) => ({ ...prev, ...changedProp }));
    }
  };

  const addVariable = async () => {
    if (!variable.key.trim() || !variable.value.trim()) {
      toast.error("Por favor, preencha tanto o atalho quanto o conteúdo da variável.");
      return;
    }

    const variablesExists = settings.variables.filter(
      (v) => v.key === variable.key.trim()
    );

    if (variablesExists.length > 0) {
      toast.error("Já existe uma variável com este atalho!");
      return;
    }

    try {
      const newVariable = { 
        key: variable.key.trim(), 
        value: variable.value.trim() 
      };
      
      const updatedVariables = [...settings.variables, newVariable];
      const updatedSettings = { ...settings, variables: updatedVariables };
      
      // Atualiza o estado local
      setSettings(updatedSettings);
      
      // Persiste no backend
      await api.post("/campaign-settings", { settings: updatedSettings });
      
      // Limpa o formulário
      setVariable({ key: "", value: "" });
      toast.success("Variable agregada exitosamente!");
      
    } catch (error) {
      console.error("Erro ao adicionar variável:", error);
      // Reverte o estado local em caso de erro
      setSettings(settings);
      toast.error("Error al agregar variable");
      toastError(error);
    }
  };

  const removeVariable = async () => {
    const newList = settings.variables.filter((v) => v.key !== selectedKey);
    const updatedSettings = { ...settings, variables: newList };
    
    try {
      // Atualiza o estado local
      setSettings(updatedSettings);
      
      // Persiste no backend
      await api.post("/campaign-settings", { settings: updatedSettings });
      
      setSelectedKey(null);
      toast.success("Variable eliminada correctamente!");
    } catch (error) {
      console.error("Error al remover variável:", error);
      // Reverte o estado local em caso de erro
      setSettings(settings);
      toast.error("Error al remover variável");
      toastError(error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await api.post("/campaign-settings", { settings });
      toast.success("La configuración se guardó correctamente!");
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      toast.error("Error al guardar la configuración");
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  // Estatísticas das configurações
  const getConfigStats = () => {
    return {
      intervalConfigs: 3,
      avgInterval: Math.round((settings.messageInterval + settings.greaterInterval) / 2),
      efficiency: settings.messageInterval > 0 ? "Alta" : "Máxima",
      variables: settings.variables ? settings.variables.length : 0
    };
  };

  const stats = getConfigStats();

  if (loading && !settings.messageInterval) {
    return (
      <div className={classes.mainContainer}>
        <MainContainer>
          <Container maxWidth="xl">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
              <CircularProgress size={60} />
            </Box>
          </Container>
        </MainContainer>
      </div>
    );
  }

  return (
    <div className={classes.mainContainer}>
      <MainContainer>
        <Container maxWidth="xl">
          
          {/* Modal de Confirmação */}
          <ConfirmationModal
            title={i18n.t("campaigns.confirmationModal.deleteTitle")}
            open={confirmationOpen}
            onClose={() => setConfirmationOpen(false)}
            onConfirm={removeVariable}
          >
            {i18n.t("campaigns.confirmationModal.deleteMessage")}
          </ConfirmationModal>

          {/* Header Modernizado */}
          <Box className={classes.header}>
            <div className={classes.headerContent}>
              <SettingsIcon className={classes.headerIcon} />
              <div>
                <Typography className={classes.headerTitle}>
                  {i18n.t("campaignsConfig.title")}
                </Typography>
                <Typography className={classes.headerSubtitle}>
                  Configura los intervalos y las variables para las campañas de marketing.
                </Typography>
              </div>
            </div>
          </Box>

          {/* Cards de Estatísticas */}
          <Box className={classes.statsGrid}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.intervalIcon}`}>
                  <TimerIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Configuración de intervalos
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.intervalConfigs}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.performanceIcon}`}>
                  <DataUsageIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Rango medio
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.avgInterval}s
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.settingsIcon}`}>
                  <TuneIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Eficiencia
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.efficiency}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.variableIcon}`}>
                  <CodeIcon />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Variables creadas
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.variables}
                  </Typography>
                </div>
              </div>
            </div>
          </Box>

          {/* Seção de Intervalos */}
          <Paper className={classes.filtersSection} elevation={0}>
            <Typography className={classes.filtersTitle}>
              <TimerIcon style={{ marginRight: 12 }} />
              Configuración de intervalos
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.modernFormControl} variant="outlined">
                    <InputLabel id="messageInterval-label">
                      {i18n.t("campaigns.settings.randomInterval")}
                    </InputLabel>
                    <Select
                      name="messageInterval"
                      id="messageInterval"
                      labelId="messageInterval-label"
                      label={i18n.t("campaigns.settings.randomInterval")}
                      value={settings.messageInterval}
                      onChange={handleOnChangeSettings}
                    >
                      <MenuItem value={0}>{i18n.t("campaigns.settings.noBreak")}</MenuItem>
                      <MenuItem value={5}>5 segundos</MenuItem>
                      <MenuItem value={10}>10 segundos</MenuItem>
                      <MenuItem value={15}>15 segundos</MenuItem>
                      <MenuItem value={20}>20 segundos</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl className={classes.modernFormControl} variant="outlined">
                    <InputLabel id="longerIntervalAfter-label">
                      {i18n.t("campaigns.settings.intervalGapAfter")}
                    </InputLabel>
                    <Select
                      name="longerIntervalAfter"
                      id="longerIntervalAfter"
                      labelId="longerIntervalAfter-label"
                      label={i18n.t("campaigns.settings.intervalGapAfter")}
                      value={settings.longerIntervalAfter}
                      onChange={handleOnChangeSettings}
                    >
                      <MenuItem value={0}>{i18n.t("campaigns.settings.undefined")}</MenuItem>
                      <MenuItem value={5}>5 {i18n.t("campaigns.settings.messages")}</MenuItem>
                      <MenuItem value={10}>10 {i18n.t("campaigns.settings.messages")}</MenuItem>
                      <MenuItem value={15}>15 {i18n.t("campaigns.settings.messages")}</MenuItem>
                      <MenuItem value={20}>20 {i18n.t("campaigns.settings.messages")}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl className={classes.modernFormControl} variant="outlined">
                    <InputLabel id="greaterInterval-label">
                      {i18n.t("campaigns.settings.laggerTriggerRange")}
                    </InputLabel>
                    <Select
                      name="greaterInterval"
                      id="greaterInterval"
                      labelId="greaterInterval-label"
                      label={i18n.t("campaigns.settings.laggerTriggerRange")}
                      value={settings.greaterInterval}
                      onChange={handleOnChangeSettings}
                    >
                      <MenuItem value={0}>{i18n.t("campaigns.settings.noBreak")}</MenuItem>
                      <MenuItem value={20}>20 segundos</MenuItem>
                      <MenuItem value={30}>30 segundos</MenuItem>
                      <MenuItem value={40}>40 segundos</MenuItem>
                      <MenuItem value={50}>50 segundos</MenuItem>
                      <MenuItem value={60}>60 segundos</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </Paper>

          {/* Seção de Variáveis */}
          <Paper className={classes.filtersSection} elevation={0}>
            <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
              <Typography className={classes.filtersTitle}>
                <CodeIcon style={{ marginRight: 12 }} />
                Gestión de variables
              </Typography>
              <button
                className={classes.expandButton}
                onClick={() => setShowVariablesSection(!showVariablesSection)}
              >
                {showVariablesSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                {showVariablesSection ? "Ocultar" : "Mostrar"} Sección
              </button>
            </Box>

            <Collapse in={showVariablesSection}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
                    <Typography variant="body2" color="textSecondary">
                      Las variables te permiten personalizar automáticamente los mensajes de tu campaña.
                    </Typography>
                    <Button
                      onClick={() => setShowVariablesForm(!showVariablesForm)}
                      className={classes.secondaryButton}
                      startIcon={<AddIcon />}
                    >
                      {i18n.t("campaigns.settings.addVar")}
                    </Button>
                  </Box>
                </Grid>

                {showVariablesForm && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label={i18n.t("campaigns.settings.shortcut")}
                        variant="outlined"
                        value={variable.key}
                        name="key"
                        onChange={handleOnChangeVariable}
                        fullWidth
                        className={classes.modernTextField}
                        placeholder="Ex: nome, empresa, produto"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label={i18n.t("campaigns.settings.content")}
                        variant="outlined"
                        value={variable.value}
                        name="value"
                        onChange={handleOnChangeVariable}
                        fullWidth
                        className={classes.modernTextField}
                        placeholder="Ex: João Silva, Minha Empresa LTDA"
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.textRight}>
                      <Button
                        onClick={() => setShowVariablesForm(false)}
                        className={classes.cancelButton}
                        style={{ marginRight: 16 }}
                      >
                        {i18n.t("campaigns.settings.close")}
                      </Button>
                      <Button
                        onClick={addVariable}
                        className={classes.successButton}
                        startIcon={<AddIcon />}
                      >
                        {i18n.t("campaigns.settings.add")}
                      </Button>
                    </Grid>
                  </>
                )}

                {settings.variables && settings.variables.length > 0 && (
                  <Grid item xs={12}>
                    <Table size="small" className={classes.variablesTable}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "1%" }}>Comportamiento</TableCell>
                          <TableCell>{i18n.t("campaigns.settings.shortcut")}</TableCell>
                          <TableCell>{i18n.t("campaigns.settings.content")}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {settings.variables.map((v, k) => (
                          <TableRow key={k}>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedKey(v.key);
                                  setConfirmationOpen(true);
                                }}
                                style={{ color: "#ef4444" }}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <span className={classes.variableKey}>
                                {"{" + v.key + "}"}
                              </span>
                            </TableCell>
                            <TableCell>{v.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                )}

                {(!settings.variables || settings.variables.length === 0) && showVariablesSection && (
                  <Grid item xs={12}>
                    <Box textAlign="center" padding={4} color="textSecondary">
                      <CodeIcon style={{ fontSize: 48, opacity: 0.3, marginBottom: 16 }} />
                      <Typography variant="h6" style={{ opacity: 0.7, marginBottom: 8 }}>
                        No se crearon variables
                      </Typography>
                      <Typography variant="body2" style={{ opacity: 0.5 }}>
                        Crea variables para personalizar automáticamente tus campañas.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Collapse>
          </Paper>

          {/* Botão de Salvar Global */}
          <Box display="flex" justifyContent="center" marginTop={4}>
            <Button
              onClick={saveSettings}
              className={classes.successButton}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
              size="large"
            >
              {i18n.t("campaigns.settings.save")}
            </Button>
          </Box>
        </Container>
      </MainContainer>
    </div>
  );
};

export default CampaignsConfig;