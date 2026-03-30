import React, { useState, useCallback, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { add, format, parseISO } from "date-fns";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { socketConnection } from "../../services/socket";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import {
  Button,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Table,
  TableHead,
  Paper,
  Tooltip,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Container,
  TableContainer,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import {
  Edit,
  CheckCircle,
  SignalCellularConnectedNoInternet2Bar,
  SignalCellularConnectedNoInternet0Bar,
  SignalCellular4Bar,
  CropFree,
  DeleteOutline,
  Facebook,
  Instagram,
  WhatsApp,
  Search,
  FilterList,
  DeviceHub,
  SignalWifi4Bar,
  SignalWifiOff,
  QueuePlayNext,
  Update
} from "@material-ui/icons";

import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import MainContainer from "../../components/MainContainer";
import TableRowSkeleton from "../../components/TableRowSkeleton";

import api from "../../services/api";
import WhatsAppModal from "../../components/WhatsAppModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import QrcodeModal from "../../components/QrcodeModal";
import { i18n } from "../../translate/i18n";
import { WhatsAppsContext } from "../../context/WhatsApp/WhatsAppsContext";
import toastError from "../../errors/toastError";
import formatSerializedId from '../../utils/formatSerializedId';
import { AuthContext } from "../../context/Auth/AuthContext";
import usePlans from "../../hooks/usePlans";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

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
  actionButtonsGroup: {
    display: "flex",
    gap: theme.spacing(1),
    flexWrap: "wrap",
  },
  primaryButton: {
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
  secondaryButton: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    borderRadius: "16px",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    minHeight: "48px",
    padding: theme.spacing(1.5, 3),
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
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
  connectedIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  disconnectedIcon: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
  },
  whatsappIcon: {
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
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
  importCard: {
    background: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)",
    borderRadius: "16px",
    marginBottom: theme.spacing(3),
    border: "1px solid #d8b4fe",
  },
  mainPaper: {
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    border: "none",
    overflow: "hidden",
    marginBottom: theme.spacing(3),
  },
  connectionsTable: {
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
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  connectionName: {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "15px",
  },
  connectionNumber: {
    fontFamily: "monospace",
    backgroundColor: "#f1f5f9",
    padding: theme.spacing(0.5, 1),
    borderRadius: "6px",
    fontSize: "12px",
    color: "#475569",
  },
  actionButtons: {
    display: "flex",
    gap: theme.spacing(0.5),
    justifyContent: "center",
    flexWrap: "wrap",
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
}));

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const CustomToolTip = ({ title, content, children }) => {
  const classes = useStyles();

  return (
    <Tooltip
      arrow
      classes={{
        tooltip: classes.tooltip,
        popper: classes.tooltipPopper,
      }}
      title={
        <React.Fragment>
          <Typography gutterBottom color="inherit">
            {title}
          </Typography>
          {content && <Typography>{content}</Typography>}
        </React.Fragment>
      }
    >
      {children}
    </Tooltip>
  );
};

const IconChannel = (channel) => {
  switch (channel) {
    case "facebook":
      return <Facebook style={{ color: "#3b5998" }} />;
    case "instagram":
      return <Instagram style={{ color: "#e1306c" }} />;
    case "whatsapp":
      return <WhatsApp style={{ color: "#25d366" }} />;
    default:
      return "error";
  }
};

const Connections = () => {
  const classes = useStyles();

  const { whatsApps, loading } = useContext(WhatsAppsContext);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [statusImport, setStatusImport] = useState([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedWhatsApp, setSelectedWhatsApp] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const history = useHistory();
  const confirmationModalInitialState = {
    action: "",
    title: "",
    message: "",
    whatsAppId: "",
    open: false,
  };
  const [confirmModalInfo, setConfirmModalInfo] = useState(confirmationModalInitialState);
  const [planConfig, setPlanConfig] = useState(false);

  const { user } = useContext(AuthContext);
  const companyId = user.companyId;

  const { getPlanCompany } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const planConfigs = await getPlanCompany(undefined, companyId);
      setPlanConfig(planConfigs)
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const responseFacebook = (response) => {
    if (response.status !== "unknown") {
      const { accessToken, id } = response;

      api
        .post("/facebook", {
          facebookUserId: id,
          facebookUserToken: accessToken,
        })
        .then((response) => {
          toast.success(i18n.t("connections.facebook.success"));
        })
        .catch((error) => {
          toastError(error);
        });
    }
  };

  const responseInstagram = (response) => {
    if (response.status !== "unknown") {
      const { accessToken, id } = response;

      api
        .post("/facebook", {
          addInstagram: true,
          facebookUserId: id,
          facebookUserToken: accessToken,
        })
        .then((response) => {
          toast.success(i18n.t("connections.facebook.success"));
        })
        .catch((error) => {
          toastError(error);
        });
    }
  };

  useEffect(() => {
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on(`importMessages-${user.companyId}`, (data) => {
      if (data.action === "refresh") {
        setStatusImport([]);
        history.go(0);
      }
      if (data.action === "update") {
        setStatusImport(data.status);
        console.log("Importação concluida com exito", data);
      }
    });

    /* return () => {
      socket.disconnect();
    }; */
  }, [whatsApps]);

  const handleStartWhatsAppSession = async (whatsAppId) => {
    try {
      await api.post(`/whatsappsession/${whatsAppId}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handleRequestNewQrCode = async (whatsAppId) => {
    try {
      await api.put(`/whatsappsession/${whatsAppId}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenWhatsAppModal = () => {
    setSelectedWhatsApp(null);
    setWhatsAppModalOpen(true);
  };

  const handleCloseWhatsAppModal = useCallback(() => {
    setWhatsAppModalOpen(false);
    setSelectedWhatsApp(null);
  }, [setSelectedWhatsApp, setWhatsAppModalOpen]);

  const handleOpenQrModal = (whatsApp) => {
    setSelectedWhatsApp(whatsApp);
    setQrModalOpen(true);
  };

  const handleCloseQrModal = useCallback(() => {
    setSelectedWhatsApp(null);
    setQrModalOpen(false);
  }, [setQrModalOpen, setSelectedWhatsApp]);

  const handleEditWhatsApp = (whatsApp) => {
    setSelectedWhatsApp(whatsApp);
    setWhatsAppModalOpen(true);
  };

  const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenConfirmationModal = (action, whatsAppId) => {
    if (action === "disconnect") {
      setConfirmModalInfo({
        action: action,
        title: i18n.t("connections.confirmationModal.disconnectTitle"),
        message: i18n.t("connections.confirmationModal.disconnectMessage"),
        whatsAppId: whatsAppId,
      });
    }

    if (action === "delete") {
      setConfirmModalInfo({
        action: action,
        title: i18n.t("connections.confirmationModal.deleteTitle"),
        message: i18n.t("connections.confirmationModal.deleteMessage"),
        whatsAppId: whatsAppId,
      });
    }
    if (action === "closedImported") {
      setConfirmModalInfo({
        action: action,
        title: i18n.t("connections.confirmationModal.closedImportedTitle"),
        message: i18n.t("connections.confirmationModal.closedImportedMessage"),
        whatsAppId: whatsAppId,
      });
    }
    setConfirmModalOpen(true);
  };

  const handleSubmitConfirmationModal = async () => {
    if (confirmModalInfo.action === "disconnect") {
      try {
        await api.delete(`/whatsappsession/${confirmModalInfo.whatsAppId}`);
      } catch (err) {
        toastError(err);
      }
    }

    if (confirmModalInfo.action === "delete") {
      try {
        await api.delete(`/whatsapp/${confirmModalInfo.whatsAppId}`);
        toast.success(i18n.t("connections.toasts.deleted"));
      } catch (err) {
        toastError(err);
      }
    }
    if (confirmModalInfo.action === "closedImported") {
      try {
        await api.post(`/closedimported/${confirmModalInfo.whatsAppId}`);
        toast.success(i18n.t("connections.toasts.closedimported"));
      } catch (err) {
        toastError(err);
      }
    }

    setConfirmModalInfo(confirmationModalInitialState);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const renderImportButton = (whatsApp) => {
    if (whatsApp?.statusImportMessages === "renderButtonCloseTickets") {
      return (
        <Button
          style={{ marginLeft: 12 }}
          size="small"
          variant="outlined"
          color="primary"
          onClick={() => {
            handleOpenConfirmationModal("closedImported", whatsApp.id);
          }}
        >
          {i18n.t("connections.buttons.closedImported")}
        </Button>
      );
    }

    if (whatsApp?.importOldMessages) {
      let isTimeStamp = !isNaN(
        new Date(Math.floor(whatsApp?.statusImportMessages)).getTime()
      );

      if (isTimeStamp) {
        const ultimoStatus = new Date(
          Math.floor(whatsApp?.statusImportMessages)
        ).getTime();
        const dataLimite = +add(ultimoStatus, { seconds: +35 }).getTime();
        if (dataLimite > new Date().getTime()) {
          return (
            <>
              <Button
                disabled
                style={{ marginLeft: 12 }}
                size="small"
                endIcon={
                  <CircularProgress
                    size={12}
                    className={classes.buttonProgress}
                  />
                }
                variant="outlined"
                color="primary"
              >
                {i18n.t("connections.buttons.preparing")}
              </Button>
            </>
          );
        }
      }
    }
  };

  const renderActionButtons = (whatsApp) => {
    return (
      <>
        {whatsApp.status === "qrcode" && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleOpenQrModal(whatsApp)}
          >
            {i18n.t("connections.buttons.qrcode")}
          </Button>
        )}
        {whatsApp.status === "DISCONNECTED" && (
          <>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => handleStartWhatsAppSession(whatsApp.id)}
            >
              {i18n.t("connections.buttons.tryAgain")}
            </Button>{" "}
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={() => handleRequestNewQrCode(whatsApp.id)}
            >
              {i18n.t("connections.buttons.newQr")}
            </Button>
          </>
        )}
        {(whatsApp.status === "CONNECTED" ||
          whatsApp.status === "PAIRING" ||
          whatsApp.status === "TIMEOUT") && (
            <>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={() => {
                  handleOpenConfirmationModal("disconnect", whatsApp.id);
                }}
              >
                {i18n.t("connections.buttons.disconnect")}
              </Button>

              {renderImportButton(whatsApp)}
            </>)}
        {whatsApp.status === "OPENING" && (
          <Button size="small" variant="outlined" disabled color="default">
            {i18n.t("connections.buttons.connecting")}
          </Button>
        )}
      </>
    );
  };

  const renderStatusToolTips = (whatsApp) => {
    return (
      <div className={classes.customTableCell}>
        {whatsApp.status === "DISCONNECTED" && (
          <CustomToolTip
            title={i18n.t("connections.toolTips.disconnected.title")}
            content={i18n.t("connections.toolTips.disconnected.content")}
          >
            <SignalCellularConnectedNoInternet0Bar color="secondary" />
          </CustomToolTip>
        )}
        {whatsApp.status === "OPENING" && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
        {whatsApp.status === "qrcode" && (
          <CustomToolTip
            title={i18n.t("connections.toolTips.qrcode.title")}
            content={i18n.t("connections.toolTips.qrcode.content")}
          >
            <CropFree />
          </CustomToolTip>
        )}
        {whatsApp.status === "CONNECTED" && (
          <CustomToolTip title={i18n.t("connections.toolTips.connected.title")}>
            <SignalCellular4Bar style={{ color: green[500] }} />
          </CustomToolTip>
        )}
        {(whatsApp.status === "TIMEOUT" || whatsApp.status === "PAIRING") && (
          <CustomToolTip
            title={i18n.t("connections.toolTips.timeout.title")}
            content={i18n.t("connections.toolTips.timeout.content")}
          >
            <SignalCellularConnectedNoInternet2Bar color="secondary" />
          </CustomToolTip>
        )}
      </div>
    );
  };

  const restartWhatsapps = async () => {
    try {
      await api.post(`/whatsapp-restart/`);
      toast.success(i18n.t("connections.waitConnection"));
    } catch (err) {
      toastError(err);
    }
  }

  // Filtrar conexões baseado na busca
  const filteredConnections = whatsApps.filter(whatsApp => 
    whatsApp.name?.toLowerCase().includes(searchParam) ||
    whatsApp.number?.toLowerCase().includes(searchParam) ||
    whatsApp.status?.toLowerCase().includes(searchParam)
  );

  // Calcular estatísticas das conexões
  const getConnectionStats = () => {
    const total = whatsApps.length;
    const connected = whatsApps.filter(w => w.status === 'CONNECTED').length;
    const disconnected = whatsApps.filter(w => w.status === 'DISCONNECTED').length;
    const whatsappCount = whatsApps.filter(w => w.channel === 'whatsapp').length;

    return { total, connected, disconnected, whatsappCount };
  };

  const stats = getConnectionStats();

  return (
    <div className={classes.mainContainer}>
      <MainContainer>
        <ConfirmationModal
          title={confirmModalInfo.title}
          open={confirmModalOpen}
          onClose={setConfirmModalOpen}
          onConfirm={handleSubmitConfirmationModal}
        >
          {confirmModalInfo.message}
        </ConfirmationModal>
        
        <QrcodeModal
          open={qrModalOpen}
          onClose={handleCloseQrModal}
          whatsAppId={!whatsAppModalOpen && selectedWhatsApp?.id}
        />
        
        <WhatsAppModal
          open={whatsAppModalOpen}
          onClose={handleCloseWhatsAppModal}
          whatsAppId={!qrModalOpen && selectedWhatsApp?.id}
        />

        <Container maxWidth="xl">
          
          {/* Header Modernizado */}
          <Box className={classes.header}>
            <div className={classes.headerContent}>
              <DeviceHub className={classes.headerIcon} />
              <div>
                <Typography className={classes.headerTitle}>
                  {i18n.t("connections.title")} ({whatsApps.length})
                </Typography>
                <Typography className={classes.headerSubtitle}>
                  Gestiona tus conexiones con WhatsApp, Facebook e Instagram.
                </Typography>
              </div>
            </div>
          </Box>

          {/* Seção de Filtros e Ações */}
          <Paper className={classes.filtersSection} elevation={0}>
            <Typography className={classes.filtersTitle}>
              <FilterList style={{ marginRight: 12 }} />
              Buscar y gestionar conexiones
            </Typography>
            
            <div className={classes.filtersGroup}>
              <TextField
                placeholder="Buscar por nome, número ou status..."
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
              
              <div className={classes.actionButtonsGroup}>
                <Button
                  className={classes.secondaryButton}
                  variant="contained"
                  onClick={restartWhatsapps}
                  startIcon={<Update />}
                >
                  {i18n.t("connections.restartConnections")}
                </Button>

                <Button
                  className={classes.secondaryButton}
                  variant="contained"
                  onClick={() => openInNewTab(`https://wa.me/${process.env.REACT_APP_NUMBER_SUPPORT}`)}
                  startIcon={<WhatsApp />}
                >
                  {i18n.t("connections.callSupport")}
                </Button>
                
                <PopupState variant="popover" popupId="demo-popup-menu">
                  {(popupState) => (
                    <React.Fragment>
                      <Button
                        className={classes.primaryButton}
                        variant="contained"
                        {...bindTrigger(popupState)}
                      >
                        {i18n.t("connections.newConnection")}
                      </Button>
                      <Menu {...bindMenu(popupState)}>
                        {/* WHATSAPP */}
                        <MenuItem
                          disabled={planConfig?.plan?.useWhatsapp ? false : true}
                          onClick={() => {
                            handleOpenWhatsAppModal();
                            popupState.close();
                          }}
                        >
                          <WhatsApp
                            fontSize="small"
                            style={{
                              marginRight: "10px",
                              color: "#25D366",
                            }}
                          />
                          WhatsApp
                        </MenuItem>
                        {/* FACEBOOK */}
                        <FacebookLogin
                          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                          autoLoad={false}
                          fields="name,email,picture"
                          version="9.0"
                          scope="public_profile,pages_messaging,pages_show_list,pages_manage_metadata,pages_read_engagement"
                          callback={responseFacebook}
                          render={(renderProps) => (
                            <MenuItem
                              disabled={planConfig?.plan?.useFacebook ? false : true}
                              onClick={renderProps.onClick}
                            >
                              <Facebook
                                fontSize="small"
                                style={{
                                  marginRight: "10px",
                                  color: "#3b5998",
                                }}
                              />
                              Facebook
                            </MenuItem>
                          )}
                        />
                        {/* INSTAGRAM */}
                        <FacebookLogin
                          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                          autoLoad={false}
                          fields="name,email,picture"
                          version="9.0"
                          scope="public_profile,instagram_basic,instagram_manage_messages,pages_messaging,pages_show_list,pages_manage_metadata,pages_read_engagement"
                          callback={responseInstagram}
                          render={(renderProps) => (
                            <MenuItem
                              disabled={planConfig?.plan?.useInstagram ? false : true}
                              onClick={renderProps.onClick}
                            >
                              <Instagram
                                fontSize="small"
                                style={{
                                  marginRight: "10px",
                                  color: "#e1306c",
                                }}
                              />
                              Instagram
                            </MenuItem>
                          )}
                        />
                      </Menu>
                    </React.Fragment>
                  )}
                </PopupState>
              </div>
            </div>
          </Paper>

          {/* Cards de Estatísticas */}
          <Box className={classes.statsGrid}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                  <DeviceHub />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Conexiones totales
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.total}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.connectedIcon}`}>
                  <SignalWifi4Bar />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Conectadas
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.connected}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.disconnectedIcon}`}>
                  <SignalWifiOff />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    Desconectadas
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.disconnected}
                  </Typography>
                </div>
              </div>

              <div className={classes.statCard}>
                <div className={`${classes.statIcon} ${classes.whatsappIcon}`}>
                  <WhatsApp />
                </div>
                <div className={classes.statContent}>
                  <Typography className={classes.statTitle}>
                    WhatsApp
                  </Typography>
                  <Typography className={classes.statValue}>
                    {stats.whatsappCount}
                  </Typography>
                </div>
              </div>
            </div>
          </Box>

          {/* Card de Importação */}
          {statusImport?.all && (
            <Card className={classes.importCard}>
              <CardContent>
                <Typography component="h5" variant="h5" style={{ color: "#7c3aed", fontWeight: 700 }}>
                  {statusImport?.this === -1 ? i18n.t("connections.buttons.preparing") : i18n.t("connections.buttons.importing")}
                </Typography>
                {statusImport?.this === -1 ? (
                  <Typography component="h6" variant="h6" align="center">
                    <CircularProgress size={24} style={{ color: "#7c3aed" }} />
                  </Typography>
                ) : (
                  <>
                    <Typography component="h6" variant="h6" align="center" style={{ color: "#64748b" }}>
                      {`${i18n.t(`connections.typography.processed`)} ${statusImport?.this} ${i18n.t(`connections.typography.in`)} ${statusImport?.all}  ${i18n.t(`connections.typography.date`)}: ${statusImport?.date} `}
                    </Typography>
                    <Typography align="center">
                      <CircularProgressWithLabel
                        style={{ margin: "auto", color: "#7c3aed" }}
                        value={(statusImport?.this / statusImport?.all) * 100}
                      />
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tabela Modernizada */}
          <Paper className={classes.mainPaper} elevation={0}>
            <TableContainer style={{ maxHeight: 600, overflowY: "auto" }}>
              <Table size="small" className={classes.connectionsTable}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <DeviceHub style={{ marginRight: 8, color: "#64748b" }} />
                        Channel
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        {i18n.t("connections.table.name")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        {i18n.t("connections.table.number")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        {i18n.t("connections.table.status")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        {i18n.t("connections.table.session")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        {i18n.t("connections.table.lastUpdate")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        {i18n.t("connections.table.default")}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        {i18n.t("connections.table.actions")}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRowSkeleton />
                  ) : (
                    <>
                      {filteredConnections?.length > 0 ? (
                        filteredConnections.map((whatsApp) => (
                          <TableRow key={whatsApp.id} hover>
                            <TableCell align="center">{IconChannel(whatsApp.channel)}</TableCell>
                            <TableCell align="center">
                              <Typography className={classes.connectionName}>
                                {whatsApp.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {whatsApp.number ? (
                                <Typography className={classes.connectionNumber}>
                                  {formatSerializedId(whatsApp.number)}
                                </Typography>
                              ) : "-"}
                            </TableCell>
                            <TableCell align="center">{renderStatusToolTips(whatsApp)}</TableCell>
                            <TableCell align="center">{renderActionButtons(whatsApp)}</TableCell>
                            <TableCell align="center">
                              <Typography variant="body2" style={{ fontSize: "12px", color: "#64748b" }}>
                                {format(parseISO(whatsApp.updatedAt), "dd/MM/yy HH:mm")}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {whatsApp.isDefault && (
                                <div className={classes.customTableCell}>
                                  <CheckCircle style={{ color: green[500] }} />
                                </div>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <div className={classes.actionButtons}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditWhatsApp(whatsApp)}
                                  className={classes.editIcon}
                                  title="Editar"
                                >
                                  <Edit fontSize="small" />
                                </IconButton>

                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    handleOpenConfirmationModal("delete", whatsApp.id);
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
                        !loading && (
                          <TableRow>
                            <TableCell colSpan={8} align="center">
                              <Box className={classes.emptyState}>
                                <DeviceHub className={classes.emptyStateIcon} />
                                <Typography variant="h6" style={{ marginBottom: 8 }}>
                                  {searchParam ? "No se encontraron conexiones" : "No hay conexiones configuradas"}
                                </Typography>
                                <Typography variant="body2">
                                  {searchParam ? "Intenta ajustar tu búsqueda" : "Configura tu primera conexión para comenzar."}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </>
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

export default Connections;