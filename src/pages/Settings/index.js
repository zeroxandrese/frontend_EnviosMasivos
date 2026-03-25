import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Typography,
  Container,
  Select,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem as SelectMenuItem,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import {
  Settings as SettingsIcon,
  Security,
  Person,
  ToggleOn,
  ToggleOff,
  Tune
} from "@material-ui/icons";
import { toast } from "react-toastify";
import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError";
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
  enabledIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  disabledIcon: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
  },
  securityIcon: {
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
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
  settingsSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(3),
    color: "#1e293b",
    fontWeight: 700,
    fontSize: "20px",
  },
  settingCard: {
    background: "white",
    borderRadius: "16px",
    padding: theme.spacing(3),
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    marginBottom: theme.spacing(2),
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    },
  },
  settingHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1),
  },
  settingTitle: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: "#1e293b",
    fontWeight: 600,
    fontSize: "16px",
  },
  settingIcon: {
    color: "#64748b",
    fontSize: "20px",
  },
  settingDescription: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: theme.spacing(2),
  },
  selectControl: {
    minWidth: 200,
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
    },
  },
  enabledBadge: {
    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
    color: "#059669",
    padding: theme.spacing(0.5, 1.5),
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
  disabledBadge: {
    background: "linear-gradient(135deg, #fee2e2, #fecaca)",
    color: "#dc2626",
    padding: theme.spacing(0.5, 1.5),
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
}));

const Settings = () => {
  const classes = useStyles();
  const [settings, setSettings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log("initial execution");
    const fetchSession = async () => {
      try {
        const { data } = await api.get("/settings");
        console.log(data);
        setSettings(data);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on(`company-${companyId}-settings`, (data) => {
      if (data.action === "update") {
        setSettings((prevState) => {
          const aux = [...prevState];
          const settingIndex = aux.findIndex((s) => s.key === data.setting.key);
          aux[settingIndex].value = data.setting.value;
          return aux;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleChangeSetting = async (e) => {
    const selectedValue = e.target.value;
    const settingKey = e.target.name;

    try {
      await api.put(`/settings/${settingKey}`, {
        value: selectedValue,
      });
      toast.success(i18n.t("settings.success"));
    } catch (err) {
      toastError(err);
    }
  };

  const getSettingValue = (key) => {
    const setting = settings.find((s) => s.key === key);
    return setting ? setting.value : '';
  };

  // Calcular estatísticas das configurações
  const getSettingsStats = () => {
    const total = settings.length;
    const enabled = settings.filter(s => s.value === 'enabled').length;
    const disabled = settings.filter(s => s.value === 'disabled').length;
    const security = settings.filter(s => s.key.toLowerCase().includes('security') || s.key.toLowerCase().includes('user')).length;

    return { total, enabled, disabled, security };
  };

  const stats = getSettingsStats();

  const renderSettingBadge = (value) => {
    if (value === 'enabled') {
      return (
        <div className={classes.enabledBadge}>
          <ToggleOn fontSize="small" />
          Habilitado
        </div>
      );
    } else if (value === 'disabled') {
      return (
        <div className={classes.disabledBadge}>
          <ToggleOff fontSize="small" />
          Desabilitado
        </div>
      );
    }
    return null;
  };

  return (
    <div className={classes.mainContainer}>
      <Container maxWidth="lg">
        
        {/* Header Modernizado */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <SettingsIcon className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                {i18n.t("settings.title")}
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Configure as opções do sistema e preferências
              </Typography>
            </div>
          </div>
        </Box>

        {/* Cards de Estatísticas */}
        <Box className={classes.statsGrid}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                <SettingsIcon />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Total Configurações
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.total}
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.enabledIcon}`}>
                <ToggleOn />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Habilitadas
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.enabled}
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.disabledIcon}`}>
                <ToggleOff />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Desabilitadas
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.disabled}
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.securityIcon}`}>
                <Security />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Configurações de Segurança
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.security}
                </Typography>
              </div>
            </div>
          </div>
        </Box>

        {/* Seção de Configurações */}
        <Paper className={classes.settingsSection} elevation={0}>
          <Typography className={classes.sectionTitle}>
            <Tune style={{ marginRight: 12 }} />
            Configurações do Sistema
          </Typography>
          
          {/* Configuração de Criação de Usuário */}
          <Card className={classes.settingCard}>
            <div className={classes.settingHeader}>
              <div className={classes.settingTitle}>
                <Person className={classes.settingIcon} />
                {i18n.t("settings.settings.userCreation.name")}
              </div>
              {settings && settings.length > 0 && renderSettingBadge(getSettingValue("userCreation"))}
            </div>
            
            <Typography className={classes.settingDescription}>
              Controla se novos usuários podem ser criados no sistema. Quando desabilitado, apenas administradores podem criar contas.
            </Typography>
            
            <FormControl variant="outlined" className={classes.selectControl}>
              <InputLabel id="userCreation-label">Status</InputLabel>
              <Select
                labelId="userCreation-label"
                id="userCreation-setting"
                name="userCreation"
                value={
                  settings && settings.length > 0 ? getSettingValue("userCreation") : ""
                }
                onChange={handleChangeSetting}
                label="Status"
              >
                <SelectMenuItem value="enabled">
                  <Box display="flex" alignItems="center" gap={1}>
                    <ToggleOn color="primary" />
                    {i18n.t("settings.settings.userCreation.options.enabled")}
                  </Box>
                </SelectMenuItem>
                <SelectMenuItem value="disabled">
                  <Box display="flex" alignItems="center" gap={1}>
                    <ToggleOff color="secondary" />
                    {i18n.t("settings.settings.userCreation.options.disabled")}
                  </Box>
                </SelectMenuItem>
              </Select>
            </FormControl>
          </Card>

          {/* Placeholder para futuras configurações */}
          <Card className={classes.settingCard} style={{ opacity: 0.6, pointerEvents: 'none' }}>
            <div className={classes.settingHeader}>
              <div className={classes.settingTitle}>
                <Security className={classes.settingIcon} />
                Configurações de Segurança
              </div>
              <div className={classes.enabledBadge}>
                <ToggleOn fontSize="small" />
                Em Breve
              </div>
            </div>
            
            <Typography className={classes.settingDescription}>
              Configurações avançadas de segurança e autenticação estarão disponíveis em futuras atualizações.
            </Typography>
          </Card>
          
        </Paper>
      </Container>
    </div>
  );
};

export default Settings;