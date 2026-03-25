import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { head } from "lodash";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Tab,
  Tabs,
  Paper,
  Box,
  Typography,
  Card,
  CardContent
} from "@material-ui/core";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import TabPanel from "../TabPanel";
import { Autorenew, FileCopy } from "@material-ui/icons";
import useCompanySettings from "../../hooks/useSettings/companySettings";
import SchedulesForm from "../SchedulesForm";

// Icons básicos do Material-UI
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import SettingsIcon from "@material-ui/icons/Settings";
import LinkIcon from "@material-ui/icons/Link";
import MessageIcon from "@material-ui/icons/Message";
import PersonIcon from "@material-ui/icons/Person";
import BarChartIcon from "@material-ui/icons/BarChart";
import ScheduleIcon from "@material-ui/icons/Schedule";
import InfoIcon from "@material-ui/icons/Info";
import SecurityIcon from "@material-ui/icons/Security";
import ImageIcon from "@material-ui/icons/Image";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	
	// Dialog Responsivo
	dialogPaper: {
		borderRadius: "20px",
		maxWidth: "1000px",
		width: "95vw",
		maxHeight: "90vh",
		overflow: "hidden",
		margin: theme.spacing(1),
		[theme.breakpoints.down('sm')]: {
			maxWidth: "100vw",
			width: "100vw",
			height: "100vh",
			maxHeight: "100vh",
			borderRadius: 0,
			margin: 0,
		},
	},
	
	// Header Compacto
	dialogTitle: {
		background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
		color: "white",
		padding: theme.spacing(2, 3),
		textAlign: "center",
		position: "relative",
		overflow: "hidden",
		"&:before": {
			content: '""',
			position: "absolute",
			top: "-50%",
			right: "-10%",
			width: "60px",
			height: "60px",
			background: "rgba(255,255,255,0.08)",
			borderRadius: "50%",
			transform: "scale(2)",
		},
	},
	
	titleText: {
		fontWeight: 700,
		fontSize: "20px",
		position: "relative",
		zIndex: 1,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: theme.spacing(1),
		[theme.breakpoints.down('sm')]: {
			fontSize: "18px",
		},
	},
	
	titleIcon: {
		fontSize: "24px",
	},
	
	// Content Responsivo
	dialogContent: {
		padding: theme.spacing(3),
		backgroundColor: "#f8fafc",
		height: "auto",
		maxHeight: "calc(90vh - 200px)",
		overflowY: "auto",
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(2),
			maxHeight: "calc(100vh - 160px)",
		},
	},
	
	// Grid Responsivo
	gridContainer: {
		height: "100%",
	},
	
	// Seções Compactas
	formSection: {
		background: "white",
		borderRadius: "12px",
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2),
		boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
		border: "1px solid #e2e8f0",
		height: "fit-content",
	},
	
	sectionTitle: {
		display: "flex",
		alignItems: "center",
		marginBottom: theme.spacing(2),
		color: "#1e293b",
		fontWeight: 700,
		fontSize: "16px",
		gap: theme.spacing(1),
	},
	
	sectionIcon: {
		color: "#64748b",
		fontSize: "18px",
	},
	
	// Fields Compactos
	fieldRow: {
		display: "flex",
		gap: theme.spacing(1.5),
		marginBottom: theme.spacing(2),
		[theme.breakpoints.down('sm')]: {
			flexDirection: "column",
			gap: theme.spacing(1),
		},
		"& > *": {
			flex: 1,
		},
	},
	
	textField: {
		"& .MuiOutlinedInput-root": {
			borderRadius: "8px",
			backgroundColor: "#f8fafc",
			transition: "all 0.3s ease",
			"&:hover": {
				backgroundColor: "#f1f5f9",
			},
			"&.Mui-focused": {
				backgroundColor: "white",
			},
		},
		"& .MuiInputLabel-root": {
			color: "#64748b",
			fontWeight: 500,
			fontSize: "14px",
		},
		"& .MuiOutlinedInput-input": {
			padding: "12px 14px",
		},
	},
	
	formControl: {
		"& .MuiOutlinedInput-root": {
			borderRadius: "8px",
			backgroundColor: "#f8fafc",
			transition: "all 0.3s ease",
			"&:hover": {
				backgroundColor: "#f1f5f9",
			},
			"&.Mui-focused": {
				backgroundColor: "white",
			},
		},
		"& .MuiInputLabel-root": {
			color: "#64748b",
			fontWeight: 500,
			fontSize: "14px",
		},
		"& .MuiOutlinedInput-input": {
			padding: "12px 14px",
		},
	},
	
	// Tabs Container
	tabsContainer: {
		backgroundColor: "#f8fafc",
		borderBottom: "1px solid #e2e8f0",
		marginBottom: theme.spacing(0),
	},
	
	// Queue Select Wrapper
	queueSelectWrapper: {
		marginBottom: theme.spacing(1.5),
		"& .MuiFormControl-root": {
			marginBottom: 0,
		},
	},
	
	// Import Message Box
	importMessage: {
		background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
		border: "1px solid #f59e0b",
		borderRadius: "12px",
		padding: theme.spacing(2),
		marginBottom: theme.spacing(2),
		"& .MuiFormControlLabel-root": {
			color: "#92400e",
			fontWeight: 500,
		},
	},
	
	// Token Section
	tokenSection: {
		background: "#f8fafc",
		borderRadius: "8px",
		padding: theme.spacing(2),
		border: "1px solid #e2e8f0",
	},
	
	tokenRefresh: {
		minWidth: "auto",
		borderRadius: "8px",
		marginLeft: theme.spacing(1),
		"&:hover": {
			backgroundColor: "#f1f5f9",
		},
	},
	
	// Queue Redirection
	queueRedirection: {
		background: "#f0f9ff",
		borderRadius: "12px",
		padding: theme.spacing(2),
		marginTop: theme.spacing(2),
		border: "1px solid #0ea5e9",
		"& h3": {
			color: "#0c4a6e",
			margin: "0 0 8px 0",
			fontSize: "16px",
			fontWeight: 600,
		},
		"& p": {
			color: "#075985",
			margin: "0 0 16px 0",
			fontSize: "14px",
		},
	},
	
	// Upload Button
	uploadButton: {
		background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
		color: "white",
		fontWeight: 600,
		textTransform: "none",
		borderRadius: "8px",
		padding: theme.spacing(1, 2),
		marginBottom: theme.spacing(2),
		boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
		transition: "all 0.3s ease",
		"&:hover": {
			background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
			transform: "translateY(-1px)",
		},
	},
	
	deleteFileButton: {
		color: "#dc2626",
		borderColor: "#dc2626",
		borderRadius: "8px",
		textTransform: "none",
		marginBottom: theme.spacing(2),
		"&:hover": {
			backgroundColor: "#fef2f2",
		},
	},
	
	// Actions Fixas
	dialogActions: {
		padding: theme.spacing(2, 3),
		backgroundColor: "#f8fafc",
		borderTop: "1px solid #e2e8f0",
		gap: theme.spacing(2),
		position: "sticky",
		bottom: 0,
		zIndex: 10,
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(2),
		},
	},
	
	cancelButton: {
		color: "#64748b",
		borderColor: "#cbd5e1",
		fontWeight: 600,
		textTransform: "none",
		borderRadius: "8px",
		padding: theme.spacing(1, 2.5),
		minHeight: "40px",
		"&:hover": {
			backgroundColor: "#f1f5f9",
		},
	},
	
	saveButton: {
		background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
		color: "white",
		fontWeight: 600,
		textTransform: "none",
		borderRadius: "8px",
		padding: theme.spacing(1, 2.5),
		minHeight: "40px",
		boxShadow: "0 2px 8px rgba(37, 211, 102, 0.3)",
		transition: "all 0.3s ease",
		"&:hover": {
			background: "linear-gradient(135deg, #128c7e 0%, #0d7377 100%)",
			transform: "translateY(-1px)",
		},
		"&:disabled": {
			background: "#cbd5e1",
			color: "#9ca3af",
		},
	},
	
	buttonProgress: {
		color: "white",
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
	
	btnWrapper: {
		position: "relative",
	},
	
	// Scrollbar customizado
	customScrollbar: {
		"&::-webkit-scrollbar": {
			width: "6px",
		},
		"&::-webkit-scrollbar-track": {
			background: "#f1f5f9",
		},
		"&::-webkit-scrollbar-thumb": {
			background: "#cbd5e1",
			borderRadius: "3px",
		},
		"&::-webkit-scrollbar-thumb:hover": {
			background: "#94a3b8",
		},
	},
	
	// Alert Warning
	warningAlert: {
		color: "#dc2626",
		fontSize: "14px",
		fontWeight: 500,
		marginTop: theme.spacing(1),
		padding: theme.spacing(1),
		backgroundColor: "#fef2f2",
		borderRadius: "6px",
		border: "1px solid #fecaca",
	},
	
	// Mantém compatibilidade com estilos originais
	multFieldLine: {
		marginTop: 12,
		display: "flex",
		"& > *:not(:last-child)": {
			marginRight: theme.spacing(1),
		},
	},
	
	mainPaper: {
		margin: 0,
		boxShadow: "none",
		borderRadius: 0,
	},
	
	paper: {
		margin: 0,
		boxShadow: "none",
		borderRadius: 0,
	},
	
	container: {
		padding: 0,
	},
	
	tab: {
		"& .MuiTabs-scroller": {
			overflow: "auto !important",
		},
		"& .MuiTab-root": {
			textTransform: "none",
			fontWeight: 600,
			fontSize: "14px",
			minHeight: "48px",
			color: "#64748b",
			transition: "all 0.3s ease",
			"&.Mui-selected": {
				color: "#25d366",
			},
		},
		"& .MuiTabs-indicator": {
			backgroundColor: "#25d366",
		},
	},
}));

const SessionSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

const WhatsAppModal = ({ open, onClose, whatsAppId }) => {
  const classes = useStyles();
  const [autoToken, setAutoToken] = useState("");

  const inputFileRef = useRef(null);

  const [attachment, setAttachment] = useState(null)
  const [attachmentName, setAttachmentName] = useState('')

  const initialState = {
    name: "",
    greetingMessage: "",
    complationMessage: "",
    outOfHoursMessage: "",
    ratingMessage: "",
    isDefault: false,
    token: "",
    maxUseBotQueues: 3,
    provider: "beta",
    expiresTicket: 0,
    allowGroup: false,
    groupAsTicket: "disabled",
    timeUseBotQueues: 0,
    timeSendQueue: 0,
    sendIdQueue: 0,
    expiresTicketNPS: 0,
    expiresInactiveMessage: "",
    timeInactiveMessage: "",
    inactiveMessage: "",
    maxUseBotQueuesNPS: 3,
    whenExpiresTicket: 0,
    timeCreateNewTicket: 0,
    greetingMediaAttachment: "",
    importRecentMessages: "",
    importOldMessages: "",
    importOldMessagesGroups: "",
    integrationId: "",
  };
  const [whatsApp, setWhatsApp] = useState(initialState);
  const [selectedQueueIds, setSelectedQueueIds] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [queues, setQueues] = useState([]);
  const [tab, setTab] = useState("general");
  const [enableImportMessage, setEnableImportMessage] = useState(false);
  const [importOldMessagesGroups, setImportOldMessagesGroups] = useState(false);
  const [closedTicketsPostImported, setClosedTicketsPostImported] = useState(false);
  const [importOldMessages, setImportOldMessages] = useState(moment().add(-1, "days").format("YYYY-MM-DDTHH:mm"));
  const [importRecentMessages, setImportRecentMessages] = useState(moment().add(-1, "minutes").format("YYYY-MM-DDTHH:mm"));
  const [copied, setCopied] = useState(false);
  const [integrations, setIntegrations] = useState([]);
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);

  const [schedules, setSchedules] = useState([
    { weekday: i18n.t("queueModal.serviceHours.monday"), weekdayEn: "monday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.tuesday"), weekdayEn: "tuesday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.wednesday"), weekdayEn: "wednesday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.thursday"), weekdayEn: "thursday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.friday"), weekdayEn: "friday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: "Sábado", weekdayEn: "saturday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: "Domingo", weekdayEn: "sunday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
  ]);

  const { get: getSetting } = useCompanySettings();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/prompt");
        setPrompts(data.prompts);
      } catch (err) {
        toastError(err);
      }
    })();
  }, [whatsAppId]);

  useEffect(() => {
    const fetchData = async () => {
      const setting = await getSetting({
        "column": "scheduleType"
      });
      setSchedulesEnabled(setting.scheduleType === "connection");
    }
    fetchData();
  }, []);

  const handleEnableImportMessage = async (e) => {
    setEnableImportMessage(e.target.checked);
  };

  useEffect(() => {
    const fetchSession = async () => {
      if (!whatsAppId) return;

      try {
        const { data } = await api.get(`whatsapp/${whatsAppId}?session=0`);
        setWhatsApp(data);
        data.promptId ? setSelectedPrompt(data.promptId) : setSelectedPrompt(null);
        setAttachmentName(data.greetingMediaAttachment);
        setAutoToken(data.token);
        const whatsQueueIds = data.queues?.map((queue) => queue.id);
        setSelectedQueueIds(whatsQueueIds);
        setSchedules(data.schedules)
        if (data?.importOldMessages) {
          setEnableImportMessage(true);
          setImportOldMessages(data?.importOldMessages);
          setImportRecentMessages(data?.importRecentMessages);
          setClosedTicketsPostImported(data?.closedTicketsPostImported);
          setImportOldMessagesGroups(data?.importOldMessagesGroups);
        }
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, [whatsAppId]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/queue");
        setQueues(data);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/queueIntegration");
        setIntegrations(data.queueIntegrations);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  const handleSaveWhatsApp = async (values) => {
    if (!whatsAppId) setAutoToken(generateRandomCode(30));

    const whatsappData = {
      ...values, queueIds: selectedQueueIds,
      promptId: selectedPrompt ? selectedPrompt : null,
      importOldMessages: enableImportMessage ? importOldMessages : null,
      importRecentMessages: enableImportMessage ? importRecentMessages : null,
      importOldMessagesGroups: importOldMessagesGroups ? importOldMessagesGroups : null,
      closedTicketsPostImported: closedTicketsPostImported ? closedTicketsPostImported : null,
      token: autoToken ? autoToken : null, schedules
    };
    //delete whatsappData["queues"];
    delete whatsappData["session"];

    try {
      if (whatsAppId) {
        if (whatsAppId && enableImportMessage && whatsApp?.status === "CONNECTED") {
          toast.warning(
            i18n.t("userModal.warning.updateImage"),
            { autoClose: false }
          );
          try {
            setWhatsApp({ ...whatsApp, status: "qrcode" });
            await api.delete(`/whatsappsession/${whatsApp.id}`);
          } catch (err) {
            toastError(err);
          }
        }

        await api.put(`/whatsapp/${whatsAppId}`, whatsappData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(`/whatsapp/${whatsAppId}/media-upload`, formData);
        }
        if (!attachmentName && (whatsApp.greetingMediaAttachment !== null)) {
          await api.delete(`/whatsapp/${whatsAppId}/media-upload`);
        }
      } else {
        const { data } = await api.post("/whatsapp", whatsappData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(`/whatsapp/${data.id}/media-upload`, formData);
        }
      }
      toast.success(i18n.t("whatsappModal.success"));

      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  function generateRandomCode(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset.charAt(randomIndex);
    }
    return code;
  }

  const handleRefreshToken = () => {
    setAutoToken(generateRandomCode(30));
  }

  const handleCopyToken = () => {
    navigator.clipboard.writeText(autoToken);
    setCopied(true);
  };

  const handleSaveSchedules = async (values) => {
    toast.success("Clique em salvar para registar as alterações");
    setSchedules(values);
  };

  const handleClose = () => {
    onClose();
    setWhatsApp(initialState);
    setAttachment(null)
    setAttachmentName("")
    setCopied(false);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleFileUpload = () => {
    const file = inputFileRef.current.files[0];
    setAttachment(file)
    setAttachmentName(file.name)
    inputFileRef.current.value = null
  };

  const handleDeleFile = () => {
    setAttachment(null)
    setAttachmentName(null)
  }

  const handleChangeQueue = (e) => {
    setSelectedQueueIds(e);
    setSelectedPrompt(null);
  };

  const handleChangePrompt = (e) => {
    setSelectedPrompt(e.target.value);
    setSelectedQueueIds([]);
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        fullWidth
        scroll="paper"
        PaperProps={{
          className: classes.dialogPaper
        }}
      >
        <DialogTitle className={classes.dialogTitle} disableTypography>
          <Typography className={classes.titleText}>
            <WhatsAppIcon className={classes.titleIcon} />
            {whatsAppId
              ? i18n.t("whatsappModal.title.edit")
              : i18n.t("whatsappModal.title.add")}
          </Typography>
        </DialogTitle>
        
        <Formik
          initialValues={whatsApp}
          enableReinitialize={true}
          validationSchema={SessionSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveWhatsApp(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, touched, errors, isSubmitting }) => (
            <Form>
              {/* Tabs Container */}
              <Paper className={classes.mainPaper} elevation={1}>
                <Box className={classes.tabsContainer}>
                  <Tabs
                    value={tab}
                    indicatorColor="primary"
                    textColor="primary"
                    scrollButtons="on"
                    variant="scrollable"
                    onChange={handleTabChange}
                    className={classes.tab}
                  >
                    <Tab label={i18n.t("whatsappModal.tabs.general")} value={"general"} />
                    <Tab label={i18n.t("whatsappModal.tabs.integrations")} value={"integrations"} />
                    <Tab label={i18n.t("whatsappModal.tabs.messages")} value={"messages"} />
                    <Tab label="Chatbot" value={"chatbot"} />
                    <Tab label={i18n.t("whatsappModal.tabs.assessments")} value={"nps"} />
                    {schedulesEnabled && <Tab label={i18n.t("whatsappModal.tabs.schedules")} value={"schedules"} />}
                  </Tabs>
                </Box>
              </Paper>
              
              <Paper className={classes.paper} elevation={0}>
                <TabPanel
                  className={classes.container}
                  value={tab}
                  name={"general"}
                >
                  <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                    
                    <Grid container spacing={3} className={classes.gridContainer}>
                      
                      {/* Coluna Esquerda */}
                      <Grid item xs={12} md={6}>
                        
                        {/* Upload de Arquivo */}
                        <Card className={classes.formSection}>
                          <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                            <Typography className={classes.sectionTitle}>
                              <ImageIcon className={classes.sectionIcon} />
                              Mídia de Saudação
                            </Typography>
                            
                            {attachmentName && (
                              <Button
                                variant='outlined'
                                className={classes.deleteFileButton}
                                endIcon={<DeleteOutlineIcon />}
                                onClick={handleDeleFile}
                                fullWidth
                              >
                                {attachmentName}
                              </Button>
                            )}
                            
                            <input
                              type="file"
                              accept="video/*,image/*"
                              ref={inputFileRef}
                              style={{ display: 'none' }}
                              onChange={handleFileUpload}
                            />
                            <Button 
                              variant="contained" 
                              className={classes.uploadButton}
                              onClick={() => inputFileRef.current.click()}
                              startIcon={<ImageIcon />}
                              fullWidth
                            >
                              {i18n.t("userModal.buttons.addImage")}
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Configurações Básicas */}
                        <Card className={classes.formSection}>
                          <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                            <Typography className={classes.sectionTitle}>
                              <SettingsIcon className={classes.sectionIcon} />
                              Configurações Básicas
                            </Typography>
                            
                            <div className={classes.fieldRow}>
                              <Field
                                as={TextField}
                                label={i18n.t("whatsappModal.form.name")}
                                autoFocus
                                name="name"
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                variant="outlined"
                                size="small"
                                className={classes.textField}
                              />
                            </div>

                            <div className={classes.fieldRow}>
                              <FormControlLabel
                                control={
                                  <Field
                                    as={Switch}
                                    color="primary"
                                    name="isDefault"
                                    checked={values.isDefault}
                                  />
                                }
                                label={i18n.t("whatsappModal.form.default")}
                              />
                              <FormControlLabel
                                control={
                                  <Field
                                    as={Switch}
                                    color="primary"
                                    name="allowGroup"
                                    checked={values.allowGroup}
                                  />
                                }
                                label={i18n.t("whatsappModal.form.group")}
                              />
                            </div>

                            <div className={classes.fieldRow}>
                              <FormControl
                                variant="outlined"
                                size="small"
                                fullWidth
                                className={classes.formControl}
                              >
                                <InputLabel id="groupAsTicket-selection-label">
                                  {i18n.t("whatsappModal.form.groupAsTicket")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  label={i18n.t("whatsappModal.form.groupAsTicket")}
                                  placeholder={i18n.t("whatsappModal.form.groupAsTicket")}
                                  labelId="groupAsTicket-selection-label"
                                  id="groupAsTicket"
                                  name="groupAsTicket"
                                >
                                  <MenuItem value={"disabled"}>{i18n.t("whatsappModal.menuItem.disabled")}</MenuItem>
                                  <MenuItem value={"enabled"}>{i18n.t("whatsappModal.menuItem.enabled")}</MenuItem>
                                </Field>
                              </FormControl>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Token */}
                        <Card className={classes.formSection}>
                          <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                            <Typography className={classes.sectionTitle}>
                              <SecurityIcon className={classes.sectionIcon} />
                              Token de Autenticação
                            </Typography>
                            
                            <Box display="flex" alignItems="center" gap={1}>
                              <Field
                                as={TextField}
                                label={i18n.t("whatsappModal.form.token")}
                                type="token"
                                fullWidth
                                value={autoToken}
                                variant="outlined"
                                size="small"
                                className={classes.textField}
                                disabled
                              />
                              <Button
                                onClick={handleRefreshToken}
                                disabled={isSubmitting}
                                className={classes.tokenRefresh}
                                variant="text"
                                startIcon={<Autorenew style={{ color: "#059669" }} />}
                              />
                              <Button
                                onClick={handleCopyToken}
                                className={classes.tokenRefresh}
                                variant="text"
                                startIcon={<FileCopy style={{ color: copied ? "#3b82f6" : "inherit" }} />}
                              />
                            </Box>
                          </CardContent>
                        </Card>

                      </Grid>
                      
                      {/* Coluna Direita */}
                      <Grid item xs={12} md={6}>

                        {/* Importação de Mensagens */}
                        <Box className={classes.importMessage}>
                          <FormControlLabel
                            style={{ marginRight: 7, color: "#92400e" }}
                            label={i18n.t("whatsappModal.form.importOldMessagesEnable")}
                            labelPlacement="end"
                            control={
                              <Switch
                                size="medium"
                                checked={enableImportMessage}
                                onChange={handleEnableImportMessage}
                                name="importOldMessagesEnable"
                                color="primary"
                              />
                            }
                          />

                          {enableImportMessage && (
                            <>
                              <FormControlLabel
                                style={{ marginRight: 7, color: "#92400e" }}
                                label={i18n.t("whatsappModal.form.importOldMessagesGroups")}
                                labelPlacement="end"
                                control={
                                  <Switch
                                    size="medium"
                                    checked={importOldMessagesGroups}
                                    onChange={(e) => setImportOldMessagesGroups(e.target.checked)}
                                    name="importOldMessagesGroups"
                                    color="primary"
                                  />
                                }
                              />

                              <FormControlLabel
                                style={{ marginRight: 7, color: "#92400e" }}
                                label={i18n.t("whatsappModal.form.closedTicketsPostImported")}
                                labelPlacement="end"
                                control={
                                  <Switch
                                    size="medium"
                                    checked={closedTicketsPostImported}
                                    onChange={(e) => setClosedTicketsPostImported(e.target.checked)}
                                    name="closedTicketsPostImported"
                                    color="primary"
                                  />
                                }
                              />

                              <Grid container spacing={2} style={{ marginTop: 16 }}>
                                <Grid item xs={12} md={6}>
                                  <Field
                                    fullWidth
                                    as={TextField}
                                    label={i18n.t("whatsappModal.form.importOldMessages")}
                                    type="datetime-local"
                                    name="importOldMessages"
                                    inputProps={{
                                      max: moment().add(0, "minutes").format("YYYY-MM-DDTHH:mm"),
                                      min: moment().add(-2, "years").format("YYYY-MM-DDTHH:mm"),
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    error={touched.importOldMessages && Boolean(errors.importOldMessages)}
                                    helperText={touched.importOldMessages && errors.importOldMessages}
                                    variant="outlined"
                                    size="small"
                                    className={classes.textField}
                                    value={moment(importOldMessages).format("YYYY-MM-DDTHH:mm")}
                                    onChange={(e) => setImportOldMessages(e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <Field
                                    fullWidth
                                    as={TextField}
                                    label={i18n.t("whatsappModal.form.importRecentMessages")}
                                    type="datetime-local"
                                    name="importRecentMessages"
                                    inputProps={{
                                      max: moment().add(0, "minutes").format("YYYY-MM-DDTHH:mm"),
                                      min: moment(importOldMessages).format("YYYY-MM-DDTHH:mm")
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    error={touched.importRecentMessages && Boolean(errors.importRecentMessages)}
                                    helperText={touched.importRecentMessages && errors.importRecentMessages}
                                    variant="outlined"
                                    size="small"
                                    className={classes.textField}
                                    value={moment(importRecentMessages).format("YYYY-MM-DDTHH:mm")}
                                    onChange={(e) => setImportRecentMessages(e.target.value)}
                                  />
                                </Grid>
                              </Grid>
                            </>
                          )}

                          {enableImportMessage && (
                            <Typography className={classes.warningAlert}>
                              {i18n.t("whatsappModal.form.importAlert")}
                            </Typography>
                          )}
                        </Box>
                        
                        {/* Filas e Prompts */}
                        <Card className={classes.formSection}>
                          <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                            <Typography className={classes.sectionTitle}>
                              <InfoIcon className={classes.sectionIcon} />
                              Filas e Prompts
                            </Typography>
                            
                            <Box className={classes.queueSelectWrapper}>
                              <QueueSelect
                                selectedQueueIds={selectedQueueIds}
                                onChange={(selectedIds) => handleChangeQueue(selectedIds)}
                              />
                            </Box>

                            <FormControl
                              variant="outlined"
                              size="small"
                              fullWidth
                              className={classes.formControl}
                            >
                              <InputLabel>
                                {i18n.t("whatsappModal.form.prompt")}
                              </InputLabel>
                              <Select
                                labelId="dialog-select-prompt-label"
                                id="dialog-select-prompt"
                                name="promptId"
                                value={selectedPrompt || ""}
                                onChange={handleChangePrompt}
                                label={i18n.t("whatsappModal.form.prompt")}
                                fullWidth
                                MenuProps={{
                                  anchorOrigin: { vertical: "bottom", horizontal: "left" },
                                  transformOrigin: { vertical: "top", horizontal: "left" },
                                  getContentAnchorEl: null,
                                }}
                              >
                                {prompts.map((prompt) => (
                                  <MenuItem key={prompt.id} value={prompt.id}>
                                    {prompt.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </CardContent>
                        </Card>

                        {/* Redirecionamento de Filas */}
                        <Box className={classes.queueRedirection}>
                          <h3>{i18n.t("whatsappModal.form.queueRedirection")}</h3>
                          <p>{i18n.t("whatsappModal.form.queueRedirectionDesc")}</p>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <FormControl
                                variant="outlined"
                                size="small"
                                fullWidth
                                className={classes.formControl}
                              >
                                <InputLabel id="sendIdQueue-selection-label">
                                  {i18n.t("whatsappModal.form.sendIdQueue")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  name="sendIdQueue"
                                  id="sendIdQueue"
                                  label={i18n.t("whatsappModal.form.sendIdQueue")}
                                  placeholder={i18n.t("whatsappModal.form.sendIdQueue")}
                                  labelId="sendIdQueue-selection-label"
                                >
                                  <MenuItem value={0}>&nbsp;</MenuItem>
                                  {queues.map(queue => (
                                    <MenuItem key={queue.id} value={queue.id}>
                                      {queue.name}
                                    </MenuItem>
                                  ))}
                                </Field>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <FormControl
                                variant="outlined"
                                size="small"
                                fullWidth
                                className={classes.formControl}
                              >
                                <InputLabel id="timeSendQueue-selection-label">
                                  {i18n.t("whatsappModal.form.timeSendQueue")}
                                </InputLabel>
                                <Field
                                  as={Select}
                                  label={i18n.t("whatsappModal.form.timeSendQueue")}
                                  placeholder={i18n.t("whatsappModal.form.timeSendQueue")}
                                  labelId="timeSendQueue-selection-label"
                                  id="timeSendQueue"
                                  name="timeSendQueue"
                                >
                                  <MenuItem value={"0"}>{i18n.t("userModal.form.allTicketDisable")}</MenuItem>
                                  <MenuItem value={"5"}>5 {i18n.t("whatsappModal.menuItem.minutes")}</MenuItem>
                                  <MenuItem value={"10"}>10 {i18n.t("whatsappModal.menuItem.minutes")}</MenuItem>
                                  <MenuItem value={"15"}>15 {i18n.t("whatsappModal.menuItem.minutes")}</MenuItem>
                                  <MenuItem value={"20"}>20 {i18n.t("whatsappModal.menuItem.minutes")}</MenuItem>
                                  <MenuItem value={"25"}>25 {i18n.t("whatsappModal.menuItem.minutes")}</MenuItem>
                                  <MenuItem value={"30"}>30 {i18n.t("whatsappModal.menuItem.minutes")}</MenuItem>
                                  <MenuItem value={"60"}>60 {i18n.t("whatsappModal.menuItem.minutes")}</MenuItem>
                                </Field>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Box>

                      </Grid>
                    </Grid>
                    
                  </DialogContent>
                </TabPanel>

                <TabPanel className={classes.container} value={tab} name={"integrations"}>
                  <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <LinkIcon className={classes.sectionIcon} />
                          Configurações de Integração
                        </Typography>
                        
                        <FormControl
                          variant="outlined"
                          size="small"
                          fullWidth
                          className={classes.formControl}
                        >
                          <InputLabel id="integrationId-selection-label">
                            {i18n.t("queueModal.form.integrationId")}
                          </InputLabel>
                          <Field
                            as={Select}
                            label={i18n.t("queueModal.form.integrationId")}
                            name="integrationId"
                            id="integrationId"
                            variant="outlined"
                            placeholder={i18n.t("queueModal.form.integrationId")}
                            labelId="integrationId-selection-label"
                          >
                            <MenuItem value={null}>{"Desabilitado"}</MenuItem>
                            {integrations.map((integration) => (
                              <MenuItem key={integration.id} value={integration.id}>
                                {integration.name}
                              </MenuItem>
                            ))}
                          </Field>
                        </FormControl>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </TabPanel>

                <TabPanel className={classes.container} value={tab} name={"messages"}>
                  <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <MessageIcon className={classes.sectionIcon} />
                          Mensagens Automáticas
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("whatsappModal.form.greetingMessage")}
                            type="greetingMessage"
                            multiline
                            rows={4}
                            fullWidth
                            name="greetingMessage"
                            error={touched.greetingMessage && Boolean(errors.greetingMessage)}
                            helperText={touched.greetingMessage && errors.greetingMessage}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                          />
                        </div>

                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("whatsappModal.form.complationMessage")}
                            multiline
                            rows={4}
                            fullWidth
                            name="complationMessage"
                            error={touched.complationMessage && Boolean(errors.complationMessage)}
                            helperText={touched.complationMessage && errors.complationMessage}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                          />
                        </div>

                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("whatsappModal.form.outOfHoursMessage")}
                            multiline
                            rows={4}
                            fullWidth
                            name="outOfHoursMessage"
                            error={touched.outOfHoursMessage && Boolean(errors.outOfHoursMessage)}
                            helperText={touched.outOfHoursMessage && errors.outOfHoursMessage}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </TabPanel>

                <TabPanel className={classes.container} value={tab} name={"chatbot"}>
                  <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <PersonIcon className={classes.sectionIcon} />
                          Configurações do Chatbot
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Field
                              as={TextField}
                              label={i18n.t("whatsappModal.form.timeCreateNewTicket")}
                              fullWidth
                              name="timeCreateNewTicket"
                              variant="outlined"
                              size="small"
                              className={classes.textField}
                              error={touched.timeCreateNewTicket && Boolean(errors.timeCreateNewTicket)}
                              helperText={touched.timeCreateNewTicket && errors.timeCreateNewTicket}
                            />
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Field
                              as={TextField}
                              label={i18n.t("whatsappModal.form.maxUseBotQueues")}
                              fullWidth
                              name="maxUseBotQueues"
                              variant="outlined"
                              size="small"
                              className={classes.textField}
                              error={touched.maxUseBotQueues && Boolean(errors.maxUseBotQueues)}
                              helperText={touched.maxUseBotQueues && errors.maxUseBotQueues}
                            />
                          </Grid>

                          <Grid item xs={12} md={4}>
                            <Field
                              as={TextField}
                              label={i18n.t("whatsappModal.form.timeUseBotQueues")}
                              fullWidth
                              name="timeUseBotQueues"
                              variant="outlined"
                              size="small"
                              className={classes.textField}
                              error={touched.timeUseBotQueues && Boolean(errors.timeUseBotQueues)}
                              helperText={touched.timeUseBotQueues && errors.timeUseBotQueues}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Field
                              as={TextField}
                              label={i18n.t("whatsappModal.form.expiresTicket")}
                              fullWidth
                              name="expiresTicket"
                              variant="outlined"
                              size="small"
                              className={classes.textField}
                              error={touched.expiresTicket && Boolean(errors.expiresTicket)}
                              helperText={touched.expiresTicket && errors.expiresTicket}
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl
                              variant="outlined"
                              size="small"
                              fullWidth
                              className={classes.formControl}
                            >
                              <InputLabel id="whenExpiresTicket-selection-label">
                                {i18n.t("whatsappModal.form.whenExpiresTicket")}
                              </InputLabel>
                              <Field
                                as={Select}
                                label={i18n.t("whatsappModal.form.whenExpiresTicket")}
                                placeholder={i18n.t("whatsappModal.form.whenExpiresTicket")}
                                labelId="whenExpiresTicket-selection-label"
                                id="whenExpiresTicket"
                                name="whenExpiresTicket"
                              >
                                <MenuItem value={"0"}>{i18n.t("whatsappModal.form.closeLastMessageOptions1")}</MenuItem>
                                <MenuItem value={"1"}>{i18n.t("whatsappModal.form.closeLastMessageOptions2")}</MenuItem>
                              </Field>
                            </FormControl>
                          </Grid>
                        </Grid>

                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("whatsappModal.form.expiresInactiveMessage")}
                            multiline
                            rows={4}
                            fullWidth
                            name="expiresInactiveMessage"
                            error={touched.expiresInactiveMessage && Boolean(errors.expiresInactiveMessage)}
                            helperText={touched.expiresInactiveMessage && errors.expiresInactiveMessage}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                          />
                        </div>

                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("whatsappModal.form.timeInactiveMessage")}
                            fullWidth
                            name="timeInactiveMessage"
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            error={touched.timeInactiveMessage && Boolean(errors.timeInactiveMessage)}
                            helperText={touched.timeInactiveMessage && errors.timeInactiveMessage}
                          />
                        </div>

                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("whatsappModal.form.inactiveMessage")}
                            multiline
                            rows={4}
                            fullWidth
                            name="inactiveMessage"
                            error={touched.inactiveMessage && Boolean(errors.inactiveMessage)}
                            helperText={touched.inactiveMessage && errors.inactiveMessage}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </TabPanel>

                <TabPanel className={classes.container} value={tab} name={"nps"}>
                  <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <BarChartIcon className={classes.sectionIcon} />
                          Sistema de Avaliação (NPS)
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("whatsappModal.form.ratingMessage")}
                            multiline
                            rows={4}
                            fullWidth
                            name="ratingMessage"
                            error={touched.ratingMessage && Boolean(errors.ratingMessage)}
                            helperText={touched.ratingMessage && errors.ratingMessage}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                          />
                        </div>

                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("whatsappModal.form.maxUseBotQueuesNPS")}
                            fullWidth
                            name="maxUseBotQueuesNPS"
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            error={touched.maxUseBotQueuesNPS && Boolean(errors.maxUseBotQueuesNPS)}
                            helperText={touched.maxUseBotQueuesNPS && errors.maxUseBotQueuesNPS}
                          />
                        </div>

                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("whatsappModal.form.expiresTicketNPS")}
                            fullWidth
                            name="expiresTicketNPS"
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            error={touched.expiresTicketNPS && Boolean(errors.expiresTicketNPS)}
                            helperText={touched.expiresTicketNPS && errors.expiresTicketNPS}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </TabPanel>

                <TabPanel className={classes.container} value={tab} name={"schedules"}>
                  <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                    {tab === "schedules" && (
                      <Card className={classes.formSection}>
                        <CardContent>
                          <Typography className={classes.sectionTitle}>
                            <ScheduleIcon className={classes.sectionIcon} />
                            Horários de Funcionamento
                          </Typography>
                          
                          <SchedulesForm
                            loading={false}
                            onSubmit={handleSaveSchedules}
                            initialValues={schedules}
                            labelSaveButton={i18n.t("whatsappModal.buttons.okAdd")}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </DialogContent>
                </TabPanel>
              </Paper>
              
              <DialogActions className={classes.dialogActions}>
                <Button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  variant="outlined"
                  className={classes.cancelButton}
                  startIcon={<CancelIcon />}
                >
                  {i18n.t("whatsappModal.buttons.cancel")}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  className={`${classes.saveButton} ${classes.btnWrapper}`}
                  startIcon={<SaveIcon />}
                >
                  {whatsAppId
                    ? i18n.t("whatsappModal.buttons.okEdit")
                    : i18n.t("whatsappModal.buttons.okAdd")}
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default React.memo(WhatsAppModal);