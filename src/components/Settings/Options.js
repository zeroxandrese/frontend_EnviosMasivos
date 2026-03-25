import React, { useEffect, useState, useContext } from "react";

import {
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Tab,
  Tabs,
  TextField,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Paper,
  InputAdornment,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@material-ui/core";

import {
  Settings,
  Tune,
  Star,
  Schedule,
  Person,
  SupervisorAccount,
  Message,
  Phone,
  Edit,
  List,
  VolumeUp,
  Security,
  Label,
  Search,
  FilterList,
  ToggleOn,
  ToggleOff,
  Business,
  Assignment,
  Chat
} from "@material-ui/icons";

import useSettings from "../../hooks/useSettings";
import { makeStyles } from "@material-ui/core/styles";
import { i18n } from "../../translate/i18n";
import useCompanySettings from "../../hooks/useSettings/companySettings";

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
  lgpdIcon: {
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
  section: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
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
    background: "#f8fafc",
    borderRadius: "12px",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f1f5f9",
      transform: "translateY(-1px)",
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
    fontSize: "14px",
  },
  settingIcon: {
    color: "#64748b",
    fontSize: "18px",
  },
  selectContainer: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      fontSize: "14px",
    },
    "& .MuiInputLabel-outlined": {
      fontSize: "14px",
    },
  },
  enabledBadge: {
    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
    color: "#059669",
    padding: theme.spacing(0.3, 1),
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.3),
  },
  disabledBadge: {
    background: "linear-gradient(135deg, #fee2e2, #fecaca)",
    color: "#dc2626",
    padding: theme.spacing(0.3, 1),
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.3),
  },
  lgpdSection: {
    background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
    borderRadius: "20px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    border: "1px solid #d8b4fe",
  },
  lgpdTitle: {
    color: "#7c3aed",
    fontWeight: 700,
    fontSize: "20px",
    marginBottom: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
      borderRadius: "12px",
    },
  },
}));

export default function Options(props) {
  const { oldSettings, settings, scheduleTypeChanged, user } = props;
  const classes = useStyles();
  
  const [searchParam, setSearchParam] = useState("");
  const [userRating, setUserRating] = useState("disabled");
  const [scheduleType, setScheduleType] = useState("disabled");
  const [chatBotType, setChatBotType] = useState("text");

  const [loadingUserRating, setLoadingUserRating] = useState(false);
  const [loadingScheduleType, setLoadingScheduleType] = useState(false);

  const [userCreation, setUserCreation] = useState("disabled");
  const [loadingUserCreation, setLoadingUserCreation] = useState(false);

  const [SendGreetingAccepted, setSendGreetingAccepted] = useState("enabled");
  const [loadingSendGreetingAccepted, setLoadingSendGreetingAccepted] = useState(false);

  const [UserRandom, setUserRandom] = useState("enabled");
  const [loadingUserRandom, setLoadingUserRandom] = useState(false);

  const [SettingsTransfTicket, setSettingsTransfTicket] = useState("enabled");
  const [loadingSettingsTransfTicket, setLoadingSettingsTransfTicket] = useState(false);

  const [AcceptCallWhatsapp, setAcceptCallWhatsapp] = useState("enabled");
  const [loadingAcceptCallWhatsapp, setLoadingAcceptCallWhatsapp] = useState(false);

  const [sendSignMessage, setSendSignMessage] = useState("enabled");
  const [loadingSendSignMessage, setLoadingSendSignMessage] = useState(false);

  const [sendGreetingMessageOneQueues, setSendGreetingMessageOneQueues] = useState("enabled");
  const [loadingSendGreetingMessageOneQueues, setLoadingSendGreetingMessageOneQueues] = useState(false);

  const [sendQueuePosition, setSendQueuePosition] = useState("enabled");
  const [loadingSendQueuePosition, setLoadingSendQueuePosition] = useState(false);

  const [sendFarewellWaitingTicket, setSendFarewellWaitingTicket] = useState("enabled");
  const [loadingSendFarewellWaitingTicket, setLoadingSendFarewellWaitingTicket] = useState(false);

  const [acceptAudioMessageContact, setAcceptAudioMessageContact] = useState("enabled");
  const [loadingAcceptAudioMessageContact, setLoadingAcceptAudioMessageContact] = useState(false);

  //LGPD
  const [enableLGPD, setEnableLGPD] = useState("disabled");
  const [loadingEnableLGPD, setLoadingEnableLGPD] = useState(false);

  const [lgpdMessage, setLGPDMessage] = useState("");
  const [loadinglgpdMessage, setLoadingLGPDMessage] = useState(false);

  const [lgpdLink, setLGPDLink] = useState("");
  const [loadingLGPDLink, setLoadingLGPDLink] = useState(false);

  const [lgpdDeleteMessage, setLGPDDeleteMessage] = useState("disabled");
  const [loadingLGPDDeleteMessage, setLoadingLGPDDeleteMessage] = useState(false);

  const [lgpdConsent, setLGPDConsent] = useState("disabled");
  const [loadingLGPDConsent, setLoadingLGPDConsent] = useState(false);

  const [lgpdHideNumber, setLGPDHideNumber] = useState("disabled");
  const [loadingLGPDHideNumber, setLoadingLGPDHideNumber] = useState(false);

  // Tag obrigatoria
  const [requiredTag, setRequiredTag] = useState("enabled")
  const [loadingRequiredTag, setLoadingRequiredTag] = useState(false)

  const { update:updateUserCreation, getAll } = useSettings();
  const { update } = useCompanySettings();

  const isSuper = () => {
    return user.super;
  };

  useEffect(() => {
    if (Array.isArray(oldSettings) && oldSettings.length) {
      const userPar = oldSettings.find((s) => s.key === "userCreation");
      if (userPar) {
        setUserCreation(userPar.value);
      }
    }
  }, [oldSettings])

  useEffect(() => {
    for (const [key, value] of Object.entries(settings)) {
      if (key === "userRating") setUserRating(value);
      if (key === "scheduleType") setScheduleType(value);
      if (key === "chatBotType") setChatBotType(value);
      if (key === "acceptCallWhatsapp") setAcceptCallWhatsapp(value);
      if (key === "userRandom") setUserRandom(value);
      if (key === "sendGreetingMessageOneQueues") setSendGreetingMessageOneQueues(value);
      if (key === "sendSignMessage") setSendSignMessage(value);
      if (key === "sendFarewellWaitingTicket") setSendFarewellWaitingTicket(value);
      if (key === "sendGreetingAccepted") setSendGreetingAccepted(value);
      if (key === "sendQueuePosition") setSendQueuePosition(value);
      if (key === "acceptAudioMessageContact") setAcceptAudioMessageContact(value);
      if (key === "enableLGPD") setEnableLGPD(value);
      if (key === "requiredTag") setRequiredTag(value);
      if (key === "lgpdDeleteMessage") setLGPDDeleteMessage(value)
      if (key === "lgpdHideNumber") setLGPDHideNumber(value);
      if (key === "lgpdConsent") setLGPDConsent(value);
      if (key === "lgpdMessage") setLGPDMessage(value);
      if (key === "sendMsgTransfTicket") setSettingsTransfTicket(value)
      if (key === "lgpdLink") setLGPDLink(value)
    }    
  }, [settings]);

  // Todas as funções handle* permanecem iguais ao original
  async function handleChangeUserCreation(value) {
    setUserCreation(value);
    setLoadingUserCreation(true);
    await updateUserCreation({
      key: "userCreation",
      value,
    });
    setLoadingUserCreation(false);
  }

  async function handleChangeUserRating(value) {
    setUserRating(value);
    setLoadingUserRating(true);
    await update({
      column:"userRating",
      data:value
    });
    setLoadingUserRating(false);
  }

  async function handleScheduleType(value) {
    setScheduleType(value);
    setLoadingScheduleType(true);
    await update({
      column:"scheduleType",
      data:value
    });
    setLoadingScheduleType(false);
    if (typeof scheduleTypeChanged === "function") {
      scheduleTypeChanged(value);
    }
  }

  async function handleChatBotType(value) {
    setChatBotType(value);
    await update({
      column:"chatBotType",
      data:value
    });
    if (typeof scheduleTypeChanged === "function") {
      setChatBotType(value);
    }
  }

  async function handleLGPDMessage(value) {
    setLGPDMessage(value);
    setLoadingLGPDMessage(true);
    await update({
      column:"lgpdMessage",
      data:value
    });
    setLoadingLGPDMessage(false);
  }

  async function handleLGPDLink(value) {
    setLGPDLink(value);
    setLoadingLGPDLink(true);
    await update({
      column:"lgpdLink",
      data:value
    });
    setLoadingLGPDLink(false);
  }

  async function handleLGPDDeleteMessage(value) {
    setLGPDDeleteMessage(value);
    setLoadingLGPDDeleteMessage(true);
    await update({
      column:"lgpdDeleteMessage",
      data:value
    });
    setLoadingLGPDDeleteMessage(false);
  }

  async function handleLGPDConsent(value) {
    setLGPDConsent(value);
    setLoadingLGPDConsent(true);
    await update({
      column:"lgpdConsent",
      data:value
    });
    setLoadingLGPDConsent(false);
  }

  async function handleLGPDHideNumber (value) {
    setLGPDHideNumber(value);
    setLoadingLGPDHideNumber(true);
    await update({
      column:"lgpdHideNumber",
      data:value
    });
    setLoadingLGPDHideNumber(false);
  }

  async function handleSendGreetingAccepted(value) {
    setSendGreetingAccepted(value);
    setLoadingSendGreetingAccepted(true);
    await update({
      column:"sendGreetingAccepted",
      data:value
    });
    setLoadingSendGreetingAccepted(false);
  }

  async function handleUserRandom(value) {
    setUserRandom(value);
    setLoadingUserRandom(true);
    await update({
      column:"userRandom",
      data:value
    });
    setLoadingUserRandom(false);
  }

  async function handleSettingsTransfTicket(value) {
    setSettingsTransfTicket(value);
    setLoadingSettingsTransfTicket(true);
    await update({
      column:"sendMsgTransfTicket",
      data:value
    });
    setLoadingSettingsTransfTicket(false);
  }

  async function handleAcceptCallWhatsapp(value) {
    setAcceptCallWhatsapp(value);
    setLoadingAcceptCallWhatsapp(true);
    await update({
      column:"acceptCallWhatsapp",
      data:value
    });
    setLoadingAcceptCallWhatsapp(false);
  }

  async function handleSendSignMessage(value) {
    setSendSignMessage(value);
    setLoadingSendSignMessage(true);
    await update({
      column:"sendSignMessage",
      data:value
    });
    localStorage.setItem("sendSignMessage", value === "enabled" ? true: false); //atualiza localstorage para sessão
    setLoadingSendSignMessage(false);
  }

  async function handleSendGreetingMessageOneQueues(value) {
    setSendGreetingMessageOneQueues(value);
    setLoadingSendGreetingMessageOneQueues(true);
    await update({
      column:"sendGreetingMessageOneQueues",
      data:value
    });
    setLoadingSendGreetingMessageOneQueues(false);
  }

  async function handleSendQueuePosition(value) {
    setSendQueuePosition(value);
    setLoadingSendQueuePosition(true);
    await update({
      column:"sendQueuePosition",
      data:value
    });
    setLoadingSendQueuePosition(false);
  }

  async function handleSendFarewellWaitingTicket(value) {
    setSendFarewellWaitingTicket(value);
    setLoadingSendFarewellWaitingTicket(true);
    await update({
      column:"sendFarewellWaitingTicket",
      data:value
    });
    setLoadingSendFarewellWaitingTicket(false);
  }

  async function handleAcceptAudioMessageContact(value) {
    setAcceptAudioMessageContact(value);
    setLoadingAcceptAudioMessageContact(true);
    await update({
      column:"acceptAudioMessageContact",
      data:value
    });
    setLoadingAcceptAudioMessageContact(false);
  }

  async function handleEnableLGPD(value) {
    setEnableLGPD(value);
    setLoadingEnableLGPD(true);
    await update({
      column:"enableLGPD",
      data:value
    });
    setLoadingEnableLGPD(false);
  }

  async function handleRequiredTag(value) {
    setRequiredTag(value);
    setLoadingRequiredTag(true);
    await update({
      column: "requiredTag",
      data:value,
    });
    setLoadingRequiredTag(false);
  }

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  // Renderizar badge de status
  const renderBadge = (value, loading) => {
    if (loading) {
      return <Typography variant="caption" color="textSecondary">Atualizando...</Typography>;
    }
    
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

  // Renderizar configuração
  const renderSetting = (icon, title, value, loading, onChange, options = []) => {
    return (
      <Grid item xs={12} sm={6} md={4}>
        <div className={classes.settingCard}>
          <div className={classes.settingHeader}>
            <div className={classes.settingTitle}>
              {icon}
              {title}
            </div>
            {renderBadge(value, loading)}
          </div>
          
          <FormControl className={classes.selectContainer} size="small" variant="outlined">
            <Select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              displayEmpty
            >
              <MenuItem value="disabled">
                <Box display="flex" alignItems="center" gap={1}>
                  <ToggleOff fontSize="small" color="secondary" />
                  {i18n.t("settings.settings.options.disabled")}
                </Box>
              </MenuItem>
              <MenuItem value="enabled">
                <Box display="flex" alignItems="center" gap={1}>
                  <ToggleOn fontSize="small" color="primary" />
                  {i18n.t("settings.settings.options.enabled")}
                </Box>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Grid>
    );
  };

  // Calcular estatísticas
  const getSettingsStats = () => {
    const allSettings = [
      userRating, scheduleType, SendGreetingAccepted, UserRandom, 
      SettingsTransfTicket, AcceptCallWhatsapp, sendSignMessage,
      sendGreetingMessageOneQueues, sendQueuePosition, sendFarewellWaitingTicket,
      acceptAudioMessageContact, enableLGPD, requiredTag
    ];
    
    if (isSuper()) {
      allSettings.push(userCreation);
    }
    
    const total = allSettings.length;
    const enabled = allSettings.filter(s => s === 'enabled').length;
    const disabled = allSettings.filter(s => s === 'disabled').length;
    const lgpdEnabled = enableLGPD === 'enabled' ? 1 : 0;

    return { total, enabled, disabled, lgpdEnabled };
  };

  const stats = getSettingsStats();

  return (
    <div className={classes.mainContainer}>
      <Container maxWidth="xl">
        
        {/* Header */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <Tune className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                Configurações Avançadas
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Configure o comportamento detalhado do sistema
              </Typography>
            </div>
          </div>
        </Box>

        {/* Busca */}
        <Paper className={classes.filtersSection} elevation={0}>
          <Typography className={classes.filtersTitle}>
            <FilterList style={{ marginRight: 12 }} />
            Buscar Configurações
          </Typography>
          <TextField
            placeholder="Buscar configuração..."
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
        </Paper>

        {/* Estatísticas */}
        <Box className={classes.statsGrid}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                <Settings />
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
              <div className={`${classes.statIcon} ${classes.lgpdIcon}`}>
                <Security />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  LGPD Ativo
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.lgpdEnabled ? 'Sim' : 'Não'}
                </Typography>
              </div>
            </div>
          </div>
        </Box>

        {/* Seção Geral */}
        <Paper className={classes.section} elevation={0}>
          <Typography className={classes.sectionTitle}>
            <Business style={{ marginRight: 12 }} />
            Configurações Gerais
          </Typography>
          
          <Grid container spacing={3}>
            {isSuper() && renderSetting(
              <SupervisorAccount className={classes.settingIcon} />,
              i18n.t("settings.settings.options.creationCompanyUser"),
              userCreation,
              loadingUserCreation,
              handleChangeUserCreation
            )}

            {renderSetting(
              <Star className={classes.settingIcon} />,
              i18n.t("settings.settings.options.evaluations"),
              userRating,
              loadingUserRating,
              handleChangeUserRating
            )}

            {renderSetting(
              <Schedule className={classes.settingIcon} />,
              i18n.t("settings.settings.options.officeScheduling"),
              scheduleType,
              loadingScheduleType,
              handleScheduleType,
              [
                { value: "queue", label: i18n.t("settings.settings.options.queueManagement") },
                { value: "company", label: i18n.t("settings.settings.options.companyManagement") },
                { value: "connection", label: i18n.t("settings.settings.options.connectionManagement") }
              ]
            )}

            {renderSetting(
              <Label className={classes.settingIcon} />,
              i18n.t("settings.settings.options.requiredTag"),
              requiredTag,
              loadingRequiredTag,
              handleRequiredTag
            )}
          </Grid>
        </Paper>

        {/* Seção Atendimento */}
        <Paper className={classes.section} elevation={0}>
          <Typography className={classes.sectionTitle}>
            <Assignment style={{ marginRight: 12 }} />
            Configurações de Atendimento
          </Typography>
          
          <Grid container spacing={3}>
            {renderSetting(
              <Message className={classes.settingIcon} />,
              i18n.t("settings.settings.options.sendGreetingAccepted"),
              SendGreetingAccepted,
              loadingSendGreetingAccepted,
              handleSendGreetingAccepted
            )}

            {renderSetting(
              <Person className={classes.settingIcon} />,
              i18n.t("settings.settings.options.userRandom"),
              UserRandom,
              loadingUserRandom,
              handleUserRandom
            )}

            {renderSetting(
              <Message className={classes.settingIcon} />,
              i18n.t("settings.settings.options.sendMsgTransfTicket"),
              SettingsTransfTicket,
              loadingSettingsTransfTicket,
              handleSettingsTransfTicket
            )}

            {renderSetting(
              <Edit className={classes.settingIcon} />,
              i18n.t("settings.settings.options.sendSignMessage"),
              sendSignMessage,
              loadingSendSignMessage,
              handleSendSignMessage
            )}

            {renderSetting(
              <Message className={classes.settingIcon} />,
              i18n.t("settings.settings.options.sendGreetingMessageOneQueues"),
              sendGreetingMessageOneQueues,
              loadingSendGreetingMessageOneQueues,
              handleSendGreetingMessageOneQueues
            )}

            {renderSetting(
              <List className={classes.settingIcon} />,
              i18n.t("settings.settings.options.sendQueuePosition"),
              sendQueuePosition,
              loadingSendQueuePosition,
              handleSendQueuePosition
            )}

            {renderSetting(
              <Message className={classes.settingIcon} />,
              i18n.t("settings.settings.options.sendFarewellWaitingTicket"),
              sendFarewellWaitingTicket,
              loadingSendFarewellWaitingTicket,
              handleSendFarewellWaitingTicket
            )}
          </Grid>
        </Paper>

        {/* Seção WhatsApp */}
        <Paper className={classes.section} elevation={0}>
          <Typography className={classes.sectionTitle}>
            <Chat style={{ marginRight: 12 }} />
            Configurações WhatsApp
          </Typography>
          
          <Grid container spacing={3}>
            {renderSetting(
              <Phone className={classes.settingIcon} />,
              i18n.t("settings.settings.options.acceptCallWhatsapp"),
              AcceptCallWhatsapp,
              loadingAcceptCallWhatsapp,
              handleAcceptCallWhatsapp
            )}

            {renderSetting(
              <VolumeUp className={classes.settingIcon} />,
              i18n.t("settings.settings.options.acceptAudioMessageContact"),
              acceptAudioMessageContact,
              loadingAcceptAudioMessageContact,
              handleAcceptAudioMessageContact
            )}
          </Grid>
        </Paper>

        {/* Seção Bot */}
        <Paper className={classes.section} elevation={0}>
          <Typography className={classes.sectionTitle}>
            <Settings style={{ marginRight: 12 }} />
            Configurações do Bot
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <div className={classes.settingCard}>
                <div className={classes.settingHeader}>
                  <div className={classes.settingTitle}>
                    <Settings className={classes.settingIcon} />
                    {i18n.t("settings.settings.options.chatBotType")}
                  </div>
                </div>
                
                <FormControl className={classes.selectContainer} size="small" variant="outlined">
                  <Select
                    value={chatBotType}
                    onChange={(e) => handleChatBotType(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="text">Texto</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Grid>
          </Grid>
        </Paper>

        {/* Seção LGPD */}
        <Paper className={classes.section} elevation={0}>
          <Typography className={classes.sectionTitle}>
            <Security style={{ marginRight: 12 }} />
            LGPD - Lei Geral de Proteção de Dados
          </Typography>
          
          <Grid container spacing={3}>
            {renderSetting(
              <Security className={classes.settingIcon} />,
              i18n.t("settings.settings.options.enableLGPD"),
              enableLGPD,
              loadingEnableLGPD,
              handleEnableLGPD
            )}
          </Grid>
        </Paper>

        {/* Seção LGPD Detalhada - Condicional */}
        {enableLGPD === "enabled" && (
          <div className={classes.lgpdSection}>
            <Typography className={classes.lgpdTitle}>
              <Security />
              {i18n.t("settings.settings.LGPD.title")}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl className={classes.selectContainer}>
                  <TextField
                    id="lgpdMessage"
                    name="lgpdMessage"
                    margin="dense"
                    multiline
                    rows={3}
                    label={i18n.t("settings.settings.LGPD.welcome")}
                    variant="outlined"
                    value={lgpdMessage}
                    onChange={(e) => handleLGPDMessage(e.target.value)}
                    className={classes.textField}
                  />
                  <FormHelperText>
                    {loadinglgpdMessage && i18n.t("settings.settings.options.updating")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl className={classes.selectContainer}>
                  <TextField
                    id="lgpdLink"
                    name="lgpdLink"
                    margin="dense"
                    label={i18n.t("settings.settings.LGPD.linkLGPD")}
                    variant="outlined"
                    value={lgpdLink}
                    onChange={(e) => handleLGPDLink(e.target.value)}
                    className={classes.textField}
                  />
                  <FormHelperText>
                    {loadingLGPDLink && i18n.t("settings.settings.options.updating")}
                  </FormHelperText>
                </FormControl>
              </Grid>

              {renderSetting(
                <Security className={classes.settingIcon} />,
                i18n.t("settings.settings.LGPD.obfuscateMessageDelete"),
                lgpdDeleteMessage,
                loadingLGPDDeleteMessage,
                handleLGPDDeleteMessage
              )}

              {renderSetting(
                <Security className={classes.settingIcon} />,
                i18n.t("settings.settings.LGPD.alwaysConsent"),
                lgpdConsent,
                loadingLGPDConsent,
                handleLGPDConsent
              )}

              {renderSetting(
                <Security className={classes.settingIcon} />,
                i18n.t("settings.settings.LGPD.obfuscatePhoneUser"),
                lgpdHideNumber,
                loadingLGPDHideNumber,
                handleLGPDHideNumber
              )}
            </Grid>
          </div>
        )}
      </Container>
    </div>
  );
}