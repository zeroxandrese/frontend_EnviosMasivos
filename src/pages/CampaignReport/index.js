import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { toast } from "react-toastify";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import { Grid, LinearProgress, Typography, Box, Container, CircularProgress } from "@material-ui/core";
import api from "../../services/api";
import { has, get, isNull } from "lodash";
import CardCounter from "../../components/Dashboard/CardCounter";
import GroupIcon from "@material-ui/icons/Group";
import ScheduleIcon from "@material-ui/icons/Schedule";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import DoneIcon from "@material-ui/icons/Done";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ErrorIcon from "@material-ui/icons/Error";
import { useDate } from "../../hooks/useDate";
import usePlans from "../../hooks/usePlans";
import { AuthContext } from "../../context/Auth/AuthContext";

import { i18n } from "../../translate/i18n";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
    padding: theme.spacing(3),
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    flexDirection: "column",
    gap: theme.spacing(2),
    color: "#ef4444",
  },
  header: {
    marginBottom: theme.spacing(4),
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    borderRadius: "24px",
    padding: theme.spacing(4),
    color: "white",
    boxShadow: "0 20px 60px rgba(59, 130, 246, 0.2)",
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
  statusSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  statusTitle: {
    fontWeight: 700,
    fontSize: "20px",
    color: "#1e293b",
    marginBottom: theme.spacing(2),
  },
  statusDescription: {
    color: "#64748b",
    fontSize: "16px",
    marginBottom: theme.spacing(3),
  },
  progressSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  progressBar: {
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
    "& .MuiLinearProgress-bar": {
      borderRadius: 10,
      background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
    },
  },
  progressText: {
    textAlign: "center",
    marginTop: theme.spacing(2),
    fontWeight: 600,
    fontSize: "18px",
    color: "#1e293b",
  },
  cardsGrid: {
    marginBottom: theme.spacing(4),
  },
  modernCard: {
    background: "white",
    borderRadius: "16px",
    padding: theme.spacing(3),
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    },
  },
  cardIcon: {
    fontSize: "40px",
    padding: theme.spacing(1),
    borderRadius: "12px",
    marginBottom: theme.spacing(2),
  },
  contactsIcon: {
    backgroundColor: "#dbeafe",
    color: "#3b82f6",
  },
  deliveredIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  confirmationIcon: {
    backgroundColor: "#fef3c7",
    color: "#f59e0b",
  },
  confirmedIcon: {
    backgroundColor: "#f3e8ff",
    color: "#7c3aed",
  },
  whatsappIcon: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
  },
  listIcon: {
    backgroundColor: "#e0e7ff",
    color: "#6366f1",
  },
  scheduleIcon: {
    backgroundColor: "#fce7f3",
    color: "#ec4899",
  },
  completedIcon: {
    backgroundColor: "#d1fae5",
    color: "#059669",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    marginBottom: theme.spacing(0.5),
  },
  cardValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1e293b",
    wordBreak: "break-word",
  },
  mainPaper: {
    flex: 1,
    padding: theme.spacing(0),
    overflowY: "scroll",
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  textRight: {
    textAlign: "right",
  },
  tabPanelsContainer: {
    padding: theme.spacing(2),
  },
}));

const CampaignReport = () => {
  const classes = useStyles();
  const history = useHistory();
  const { campaignId } = useParams();

  const [campaign, setCampaign] = useState({});
  const [validContacts, setValidContacts] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [confirmationRequested, setConfirmationRequested] = useState(0);
  const [confirmed, setConfirmed] = useState(0);
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const mounted = useRef(true);
  
  // Safe context usage with fallbacks
  const authContext = useContext(AuthContext);
  const user = authContext?.user || null;
  const socket = authContext?.socket || null;
  
  // Safe hook usage with fallbacks
  let datetimeToClient;
  let getPlanCompany;
  
  try {
    const dateHook = useDate();
    datetimeToClient = dateHook?.datetimeToClient || ((date) => date ? new Date(date).toLocaleString() : "N/A");
  } catch (error) {
    console.warn("useDate hook não disponível, usando fallback");
    datetimeToClient = (date) => date ? new Date(date).toLocaleString() : "N/A";
  }

  try {
    const plansHook = usePlans();
    getPlanCompany = plansHook?.getPlanCompany || (() => Promise.resolve({ plan: { useCampaigns: true } }));
  } catch (error) {
    console.warn("usePlans hook não disponível, usando fallback");
    getPlanCompany = () => Promise.resolve({ plan: { useCampaigns: true } });
  }

  // Verificação de permissões
  useEffect(() => {
    async function checkPermissions() {
      try {
        setLoading(true);
        setError(null);

        if (!user?.companyId) {
          setError("Usuário não autenticado");
          return;
        }

        const planConfigs = await getPlanCompany(undefined, user.companyId);
        
        if (!planConfigs?.plan?.useCampaigns) {
          setError("Esta empresa não possui permissão para acessar essa página");
          setTimeout(() => {
            history.push("/");
          }, 3000);
          return;
        }

        setHasPermission(true);
      } catch (error) {
        console.error("Erro ao verificar plano:", error);
        setError("Erro ao verificar permissões");
      }
    }
    
    checkPermissions();
  }, [user, getPlanCompany, history]);

  // Carregamento da campanha
  useEffect(() => {
    if (!hasPermission || !campaignId || !mounted.current) return;

    findCampaign();

    return () => {
      mounted.current = false;
    };
  }, [campaignId, hasPermission]);

  // Processamento dos dados da campanha
  useEffect(() => {
    if (!mounted.current || !campaign || !Object.keys(campaign).length) return;

    try {
      // Reset values
      setValidContacts(0);
      setDelivered(0);
      setConfirmationRequested(0);
      setConfirmed(0);

      if (campaign.contactList?.contacts) {
        const valids = campaign.contactList.contacts.filter((c) => c?.isWhatsappValid);
        setValidContacts(valids.length);
      }

      if (campaign.shipping) {
        const contacts = campaign.shipping;
        const deliveredContacts = contacts.filter((c) => !isNull(c?.deliveredAt));
        const confirmationRequestedContacts = contacts.filter(
          (c) => !isNull(c?.confirmationRequestedAt)
        );
        const confirmedContacts = contacts.filter(
          (c) => !isNull(c?.deliveredAt) && !isNull(c?.confirmationRequestedAt)
        );
        
        setDelivered(deliveredContacts.length);
        setConfirmationRequested(confirmationRequestedContacts.length);
        setConfirmed(confirmedContacts.length);
      }
    } catch (error) {
      console.error("Erro ao processar dados da campanha:", error);
    }
  }, [campaign]);

  // Cálculo da porcentagem
  useEffect(() => {
    const newPercent = validContacts > 0 ? Math.min((delivered / validContacts) * 100, 100) : 0;
    setPercent(newPercent);
  }, [delivered, validContacts]);

  // Socket listeners
  useEffect(() => {
    if (!user?.companyId || !socket || !campaignId || !hasPermission) return;

    const companyId = user.companyId;

    const onCampaignEvent = (data) => {
      try {
        if (data?.record?.id === +campaignId) {
          setCampaign(prev => ({ ...prev, ...data.record }));

          if (data.record.status === "FINALIZADA") {
            setTimeout(() => {
              findCampaign();
            }, 5000);
          }
        }
      } catch (error) {
        console.error("Erro ao processar evento de campanha:", error);
      }
    };

    socket.on(`company-${companyId}-campaign`, onCampaignEvent);

    return () => {
      socket.off(`company-${companyId}-campaign`, onCampaignEvent);
    };
  }, [campaignId, user?.companyId, socket, hasPermission]);

  const findCampaign = async () => {
    if (!campaignId) {
      setError("ID da campanha não fornecido");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await api.get(`/campaigns/${campaignId}`);
      
      if (!data) {
        setError("Campanha não encontrada");
        return;
      }
      
      setCampaign(data);
    } catch (error) {
      console.error("Erro ao buscar campanha:", error);
      setError("Erro ao carregar dados da campanha");
      
      if (error.response?.status === 404) {
        setError("Campanha não encontrada");
      } else if (error.response?.status === 403) {
        setError("Sem permissão para acessar esta campanha");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (val) => {
    const statusMap = {
      "INATIVA": "Inativa",
      "PROGRAMADA": "Programada", 
      "EM_ANDAMENTO": "Em Andamento",
      "CANCELADA": "Cancelada",
      "FINALIZADA": "Finalizada"
    };

    // Fallback se i18n não estiver disponível
    try {
      switch (val) {
        case "INATIVA":
          return i18n?.t ? i18n.t("campaignReport.inactive") : statusMap.INATIVA;
        case "PROGRAMADA":
          return i18n?.t ? i18n.t("campaignReport.scheduled") : statusMap.PROGRAMADA;
        case "EM_ANDAMENTO":
          return i18n?.t ? i18n.t("campaignReport.process") : statusMap.EM_ANDAMENTO;
        case "CANCELADA":
          return i18n?.t ? i18n.t("campaignReport.cancelled") : statusMap.CANCELADA;
        case "FINALIZADA":
          return i18n?.t ? i18n.t("campaignReport.finished") : statusMap.FINALIZADA;
        default:
          return val || "N/A";
      }
    } catch (error) {
      console.warn("i18n não disponível, usando fallback");
      return statusMap[val] || val || "N/A";
    }
  };

  const getTranslation = (key, fallback) => {
    try {
      return i18n?.t ? i18n.t(key) : fallback;
    } catch (error) {
      return fallback;
    }
  };

  // Loading state
  if (loading && !hasPermission) {
    return (
      <div className={classes.mainContainer}>
        <MainContainer>
          <Container maxWidth="xl">
            <div className={classes.loadingContainer}>
              <CircularProgress size={50} />
              <Typography variant="h6">Cargando...</Typography>
            </div>
          </Container>
        </MainContainer>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={classes.mainContainer}>
        <MainContainer>
          <Container maxWidth="xl">
            <div className={classes.errorContainer}>
              <ErrorIcon style={{ fontSize: 60 }} />
              <Typography variant="h6">{error}</Typography>
              <Typography variant="body2" color="textSecondary">
                Intente recargar la página o comuníquese con el soporte.
              </Typography>
            </div>
          </Container>
        </MainContainer>
      </div>
    );
  }

  // No permission state
  if (!hasPermission) {
    return (
      <div className={classes.mainContainer}>
        <MainContainer>
          <Container maxWidth="xl">
            <div className={classes.errorContainer}>
              <ErrorIcon style={{ fontSize: 60 }} />
              <Typography variant="h6">Sin permiso</Typography>
              <Typography variant="body2" color="textSecondary">
                No tienes permiso para acceder a esta página.
              </Typography>
            </div>
          </Container>
        </MainContainer>
      </div>
    );
  }

  return (
    <div className={classes.mainContainer}>
      <MainContainer>
        <Container maxWidth="xl">
          {/* Header Modernizado */}
          <Box className={classes.header}>
            <div className={classes.headerContent}>
              <AssessmentIcon className={classes.headerIcon} />
              <div>
                <Typography className={classes.headerTitle}>
                  {getTranslation("campaignReport.title", "Relatório de Campanha")} {campaign.name || getTranslation("campaignReport.campaign", "Campanha")}
                </Typography>
                <Typography className={classes.headerSubtitle}>
                  Informe detallado del rendimiento de la campaña
                </Typography>
              </div>
            </div>
          </Box>

          {/* Seção de Status */}
          <Paper className={classes.statusSection} elevation={0}>
            <Typography className={classes.statusTitle}>
              Status de campaña
            </Typography>
            <Typography className={classes.statusDescription}>
              {formatStatus(campaign.status)} - {delivered} de {validContacts} mensagens enviadas
            </Typography>
          </Paper>

          {/* Seção de Progresso */}
          <Paper className={classes.progressSection} elevation={0}>
            <Typography className={classes.statusTitle}>
              Progresso de Envio
            </Typography>
            <LinearProgress
              variant="determinate"
              className={classes.progressBar}
              value={percent}
            />
            <Typography className={classes.progressText}>
              {percent.toFixed(1)}% Concluído
            </Typography>
          </Paper>

          {/* Cards de Métricas */}
          <Box className={classes.cardsGrid}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <div className={classes.modernCard}>
                  <GroupIcon className={`${classes.cardIcon} ${classes.contactsIcon}`} />
                  <Typography className={classes.cardTitle}>
                    {getTranslation("campaignReport.validContacts", "Contatos Válidos")}
                  </Typography>
                  <Typography className={classes.cardValue}>
                    {loading ? "..." : validContacts}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12} md={4}>
                <div className={classes.modernCard}>
                  <CheckCircleIcon className={`${classes.cardIcon} ${classes.deliveredIcon}`} />
                  <Typography className={classes.cardTitle}>
                    {getTranslation("campaignReport.deliver", "Entregues")}
                  </Typography>
                  <Typography className={classes.cardValue}>
                    {loading ? "..." : delivered}
                  </Typography>
                </div>
              </Grid>

              {campaign.confirmation && (
                <>
                  <Grid item xs={12} md={4}>
                    <div className={classes.modernCard}>
                      <DoneIcon className={`${classes.cardIcon} ${classes.confirmationIcon}`} />
                      <Typography className={classes.cardTitle}>
                        {getTranslation("campaignReport.confirmationsRequested", "Confirmações Solicitadas")}
                      </Typography>
                      <Typography className={classes.cardValue}>
                        {loading ? "..." : confirmationRequested}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <div className={classes.modernCard}>
                      <DoneAllIcon className={`${classes.cardIcon} ${classes.confirmedIcon}`} />
                      <Typography className={classes.cardTitle}>
                        {getTranslation("campaignReport.confirmations", "Confirmações")}
                      </Typography>
                      <Typography className={classes.cardValue}>
                        {loading ? "..." : confirmed}
                      </Typography>
                    </div>
                  </Grid>
                </>
              )}

              {campaign.whatsappId && (
                <Grid item xs={12} md={4}>
                  <div className={classes.modernCard}>
                    <WhatsAppIcon className={`${classes.cardIcon} ${classes.whatsappIcon}`} />
                    <Typography className={classes.cardTitle}>
                      {getTranslation("campaignReport.connection", "Conexão")}
                    </Typography>
                    <Typography className={classes.cardValue}>
                      {loading ? "..." : (campaign.whatsapp?.name || "N/A")}
                    </Typography>
                  </div>
                </Grid>
              )}

              {campaign.contactListId && (
                <Grid item xs={12} md={4}>
                  <div className={classes.modernCard}>
                    <ListAltIcon className={`${classes.cardIcon} ${classes.listIcon}`} />
                    <Typography className={classes.cardTitle}>
                      {getTranslation("campaignReport.contactLists", "Lista de Contatos")}
                    </Typography>
                    <Typography className={classes.cardValue}>
                      {loading ? "..." : (campaign.contactList?.name || "N/A")}
                    </Typography>
                  </div>
                </Grid>
              )}

              <Grid item xs={12} md={4}>
                <div className={classes.modernCard}>
                  <ScheduleIcon className={`${classes.cardIcon} ${classes.scheduleIcon}`} />
                  <Typography className={classes.cardTitle}>
                    {getTranslation("campaignReport.schedule", "Agendamento")}
                  </Typography>
                  <Typography className={classes.cardValue}>
                    {loading ? "..." : (datetimeToClient(campaign.scheduledAt) || "N/A")}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12} md={4}>
                <div className={classes.modernCard}>
                  <EventAvailableIcon className={`${classes.cardIcon} ${classes.completedIcon}`} />
                  <Typography className={classes.cardTitle}>
                    {getTranslation("campaignReport.conclusion", "Conclusão")}
                  </Typography>
                  <Typography className={classes.cardValue}>
                    {loading ? "..." : (datetimeToClient(campaign.completedAt) || "Em andamento")}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </MainContainer>
    </div>
  );
};

export default CampaignReport;