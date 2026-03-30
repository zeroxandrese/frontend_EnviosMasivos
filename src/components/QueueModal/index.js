import React, { useState, useEffect, useRef, useContext } from "react";

import * as Yup from "yup";
import { Formik, FieldArray, Form, Field } from "formik";
import { toast } from "react-toastify";

import { FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, Tab, Tabs } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";

// Icons básicos seguros
import QueueIcon from "@material-ui/icons/Queue";
import SettingsIcon from "@material-ui/icons/Settings";
import MessageIcon from "@material-ui/icons/Message";
import AndroidIcon from "@material-ui/icons/Android";
import CancelIcon from "@material-ui/icons/Cancel";
import BuildIcon from "@material-ui/icons/Build";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import ColorPicker from "../ColorPicker";
import { IconButton, InputAdornment } from "@material-ui/core";
import { Colorize } from "@material-ui/icons";
import ConfirmationModal from "../ConfirmationModal";

import OptionsChatBot from "../ChatBots/options";
import CustomToolTip from "../ToolTips";

import SchedulesForm from "../SchedulesForm";
import useCompanySettings from "../../hooks/useSettings/companySettings";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  
  // Dialog Responsivo - PADRÃO REFERÊNCIA
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
  
  // Header - CORES DO PADRÃO REFERÊNCIA
  dialogTitle: {
    background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
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
  
  // Tabs System
  tabsContainer: {
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderBottom: "1px solid #e2e8f0",
    "& .MuiTabs-indicator": {
      backgroundColor: "#64748b",
      height: "3px",
    },
    "& .MuiTab-root": {
      fontWeight: 600,
      textTransform: "none",
      color: "#64748b",
      "&.Mui-selected": {
        color: "#1e293b",
      },
    },
  },
  
  // Content - PADRÃO REFERÊNCIA
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
  
  // Seções - PADRÃO REFERÊNCIA
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
  
  // Fields - PADRÃO REFERÊNCIA
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
  
  colorAdorment: {
    width: 20,
    height: 20,
    borderRadius: "4px",
    border: "1px solid #e2e8f0",
  },
  
  // Chatbot Stepper Section
  chatbotSection: {
    background: "white",
    borderRadius: "12px",
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    border: "1px solid #e2e8f0",
  },
  
  greetingMessage: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#f8fafc",
    },
  },
  
  stepperContainer: {
    "& .MuiStepLabel-root": {
      cursor: "pointer",
    },
    "& .MuiStepContent-root": {
      borderLeft: "2px solid #e2e8f0",
      marginLeft: "12px",
      paddingLeft: theme.spacing(2),
    },
  },
  
  botOptionFields: {
    background: "#f8fafc",
    borderRadius: "8px",
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(1),
    border: "1px solid #e2e8f0",
  },
  
  // Actions - PADRÃO REFERÊNCIA
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
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "8px",
    padding: theme.spacing(1, 2.5),
    minHeight: "40px",
    boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
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
  
  // Switch customizado
  switchContainer: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    marginBottom: theme.spacing(1),
  },
  
  // Scrollbar customizado - PADRÃO REFERÊNCIA
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
}));

const QueueSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  color: Yup.string().min(3, "Too Short!").max(9, "Too Long!").required(),
  greetingMessage: Yup.string(),
  chatbots: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().min(4, "too short").required("Required"),
      })
    )
    .required("Must have friends"),
});

const QueueModal = ({ open, onClose, queueId, onEdit }) => {
  const classes = useStyles();

  const initialState = {
    name: "",
    color: "",
    greetingMessage: "",
    chatbots: [],
    outOfHoursMessage: "",
    orderQueue: "",
    tempoRoteador: 0,
    ativarRoteador: false,
    integrationId: "",
    fileListId: "",
    closeTicket: false,
    promptId: ""
  };

  const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
  const [queue, setQueue] = useState(initialState);
  const greetingRef = useRef();
  const [activeStep, setActiveStep] = React.useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isStepContent, setIsStepContent] = React.useState(true);
  const [isNameEdit, setIsNamedEdit] = React.useState(null);
  const [isGreetingMessageEdit, setGreetingMessageEdit] = React.useState(null);
  const [queues, setQueues] = useState([]);
  const [users, setUsers] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);
  const [tab, setTab] = useState(0);
  const [file, setFile] = useState(null);
  const { user } = useContext(AuthContext);

  const [schedules, setSchedules] = useState([
    { weekday: i18n.t("queueModal.serviceHours.monday"), weekdayEn: "monday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.tuesday"), weekdayEn: "tuesday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.wednesday"), weekdayEn: "wednesday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.thursday"), weekdayEn: "thursday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: i18n.t("queueModal.serviceHours.friday"), weekdayEn: "friday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: "Sábado", weekdayEn: "saturday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
    { weekday: "Domingo", weekdayEn: "sunday", startTimeA: "08:00", endTimeA: "12:00", startTimeB: "13:00", endTimeB: "18:00", },
  ]);

  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [prompts, setPrompts] = useState([]);

  const companyId = user.companyId;

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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const setting = await getSetting({
        "column": "scheduleType"
      });
      if (setting.scheduleType === "queue") setSchedulesEnabled(true);
    }
    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/files/", {
          params: { companyId }
        });
        setFile(data.files);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!queueId) return;
      try {
        const { data } = await api.get(`/queue/${queueId}`);
        setQueue((prevState) => {
          return { ...prevState, ...data };
        });

        data.promptId ? setSelectedPrompt(data.promptId) : setSelectedPrompt(null);
        setSchedules(data.schedules);
      } catch (err) {
        toastError(err);
      }
    })();

    return () => {
      setQueue({
        name: "",
        color: "",
        greetingMessage: "",
        chatbots: [],
        outOfHoursMessage: "",
        orderQueue: "",
        tempoRoteador: "",
        ativarRoteador: false,
        integrationId: "",
        fileListId: "",
        closeTicket: false
      });
    };
  }, [queueId, open]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/queue", {
          params: { companyId }
        });
        setQueues(data);
      } catch (err) {
        toastError(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/", {
          params: { companyId }
        });
        setUsers(data.users);
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

  useEffect(() => {
    if (activeStep === isNameEdit) {
      setIsStepContent(false);
    } else {
      setIsStepContent(true);
    }
  }, [isNameEdit, activeStep]);

  const handleClose = () => {
    onClose();
    setIsNamedEdit(null);
    setActiveStep(null);
    setGreetingMessageEdit(null);
  };

  const handleSaveSchedules = async (values) => {
    toast.success("Haz clic en guardar para registrar los cambios.");
    setSchedules(values);
    setTab(0);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedQueue(null);
  };

  const handleDeleteQueue = async (optionsId) => {
    try {
      await api.delete(`/chatbot/${optionsId}`);
      const { data } = await api.get(`/queue/${queueId}`);
      setQueue(initialState);
      setQueue(data);
      setIsNamedEdit(null);
      setGreetingMessageEdit(null);
      toast.success(`${i18n.t("queues.toasts.deleted")}`);
    } catch (err) {
      toastError(err);
    }
  };

  const handleSaveQueue = async (values) => {
    try {
      if (queueId) {
        await api.put(`/queue/${queueId}`, { ...values, schedules, promptId: selectedPrompt ? selectedPrompt : null });
      } else {
        await api.post("/queue", { ...values, schedules, promptId: selectedPrompt ? selectedPrompt : null });
      }

      toast.success(`${i18n.t("queues.toasts.success")}`);
      handleClose();
    } catch (err) {
      toastError(err);
    }
  };

  const handleSaveBot = async (values) => {
    try {
      if (queueId) {
        const { data } = await api.put(`/queue/${queueId}`, values);
        if (data.chatbots && data.chatbots.length) {
          onEdit(data);
          setQueue(data);
        }
      } else {
        const { data } = await api.post("/queue", values);
        if (data.chatbots && data.chatbots.length) {
          setQueue(data);
          onEdit(data);
          handleClose();
        }
      }

      setIsNamedEdit(null)
      setGreetingMessageEdit(null)
      toast.success(`${i18n.t("queues.toasts.success")}`);

    } catch (err) {
      toastError(err);
    }
  };

  const handleChangePrompt = (e) => {
    setSelectedPrompt(e.target.value);
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={
          selectedQueue &&
          `${i18n.t("queues.confirmationModal.deleteTitle")} ${selectedQueue.name}?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteQueue(selectedQueue.id)}
      >
        {i18n.t("queueModal.title.confirmationDelete")}
      </ConfirmationModal>
      
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
            <QueueIcon className={classes.titleIcon} />
            {queueId
              ? i18n.t("queueModal.title.edit")
              : i18n.t("queueModal.title.add")}
          </Typography>
        </DialogTitle>
        
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          className={classes.tabsContainer}
          variant="fullWidth"
        >
          <Tab label={i18n.t("queueModal.title.queueData")} />
          {schedulesEnabled && <Tab label={i18n.t("queueModal.title.text")} />}
        </Tabs>
        
        {tab === 0 && (
          <Formik
            initialValues={queue}
            validateOnChange={false}
            enableReinitialize={true}
            validationSchema={QueueSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                handleSaveQueue(values);
                actions.setSubmitting(false);
              }, 400);
            }}
          >
            {({ handleChange, touched, errors, isSubmitting, values }) => (
              <Form>
                <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                  
                  {/* Configurações Básicas */}
                  <Card className={classes.formSection}>
                    <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                      <Typography className={classes.sectionTitle}>
                        <SettingsIcon className={classes.sectionIcon} />
                        Configuración de cola
                      </Typography>
                      
                      <div className={classes.fieldRow}>
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.name")}
                          autoFocus
                          name="name"
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                          variant="outlined"
                          size="small"
                          className={classes.textField}
                        />
                        
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.orderQueue")}
                          name="orderQueue"
                          type="number"
                          error={touched.orderQueue && Boolean(errors.orderQueue)}
                          helperText={touched.orderQueue && errors.orderQueue}
                          variant="outlined"
                          size="small"
                          className={classes.textField}
                        />
                      </div>
                      
                      <div className={classes.fieldRow}>
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.color")}
                          name="color"
                          id="color"
                          onFocus={() => {
                            setColorPickerModalOpen(true);
                            greetingRef.current.focus();
                          }}
                          error={touched.color && Boolean(errors.color)}
                          helperText={touched.color && errors.color}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <div
                                  style={{ backgroundColor: values.color }}
                                  className={classes.colorAdorment}
                                ></div>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <IconButton
                                size="small"
                                color="default"
                                onClick={() => setColorPickerModalOpen(true)}
                              >
                                <Colorize />
                              </IconButton>
                            ),
                          }}
                          variant="outlined"
                          size="small"
                          className={classes.textField}
                        />
                      </div>
                      
                      <ColorPicker
                        open={colorPickerModalOpen}
                        handleClose={() => setColorPickerModalOpen(false)}
                        onChange={(color) => {
                          values.color = color;
                          setQueue(() => {
                            return { ...values, color };
                          });
                        }}
                      />
                      
                      <div className={classes.switchContainer}>
                        <FormControlLabel
                          control={
                            <Field
                              as={Switch}
                              color="primary"
                              name="closeTicket"
                              checked={values.closeTicket}
                            />
                          }
                          label={i18n.t("queueModal.form.closeTicket")}
                        />
                      </div>
                      
                      <div className={classes.switchContainer}>
                        <FormControlLabel
                          control={
                            <Field
                              as={Switch}
                              color="primary"
                              name="ativarRoteador"
                              checked={values.ativarRoteador}
                            />
                          }
                          label={i18n.t("queueModal.form.rotate")}
                        />
                        {values.ativarRoteador && (
                          <FormControl
                            variant="outlined"
                            size="small"
                            className={classes.formControl}
                            style={{ marginLeft: 16, minWidth: 150 }}
                          >
                            <InputLabel>{i18n.t("queueModal.form.timeRotate")}</InputLabel>
                            <Field
                              as={Select}
                              label={i18n.t("queueModal.form.timeRotate")}
                              name="tempoRoteador"
                              id="tempoRoteador"
                            >
                              <MenuItem value="2">2 minutos</MenuItem>
                              <MenuItem value="5">5 minutos</MenuItem>
                              <MenuItem value="10">10 minutos</MenuItem>
                              <MenuItem value="15">15 minutos</MenuItem>
                              <MenuItem value="30">30 minutos</MenuItem>
                              <MenuItem value="45">45 minutos</MenuItem>
                              <MenuItem value="60">60 minutos</MenuItem>
                            </Field>
                          </FormControl>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Integrações */}
                  <Card className={classes.formSection}>
                    <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                      <Typography className={classes.sectionTitle}>
                        <BuildIcon className={classes.sectionIcon} />
                        Integraciones y Archivos
                      </Typography>
                      
                      <div className={classes.fieldRow}>
                        <FormControl
                          variant="outlined"
                          size="small"
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
                            labelId="integrationId-selection-label"
                            value={values.integrationId || ""}
                          >
                            <MenuItem value={""}>{"Nenhum"}</MenuItem>
                            {integrations.map((integration) => (
                              <MenuItem key={integration.id} value={integration.id}>
                                {integration.name}
                              </MenuItem>
                            ))}
                          </Field>
                        </FormControl>
                        
                        <FormControl
                          variant="outlined"
                          size="small"
                          className={classes.formControl}
                        >
                          <InputLabel>
                            {i18n.t("whatsappModal.form.prompt")}
                          </InputLabel>
                          <Select
                            name="promptId"
                            value={selectedPrompt || ""}
                            onChange={handleChangePrompt}
                            label={i18n.t("whatsappModal.form.prompt")}
                          >
                            <MenuItem value={0}>&nbsp;</MenuItem>
                            {prompts.map((prompt) => (
                              <MenuItem key={prompt.id} value={prompt.id}>
                                {prompt.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      
                      <div className={classes.fieldRow}>
                        <FormControl
                          variant="outlined"
                          size="small"
                          className={classes.formControl}
                        >
                          <InputLabel id="fileListId-selection-label">
                            {i18n.t("queueModal.form.fileListId")}
                          </InputLabel>
                          <Field
                            as={Select}
                            label={i18n.t("queueModal.form.fileListId")}
                            name="fileListId"
                            id="fileListId"
                            labelId="fileListId-selection-label"
                            value={values.fileListId || ""}
                          >
                            <MenuItem value={""}>{"Nenhum"}</MenuItem>
                            {file && file.map(f => (
                              <MenuItem key={f.id} value={f.id}>
                                {f.name}
                              </MenuItem>
                            ))}
                          </Field>
                        </FormControl>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mensagens */}
                  <Card className={classes.formSection}>
                    <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                      <Typography className={classes.sectionTitle}>
                        <MessageIcon className={classes.sectionIcon} />
                        Mensajes en cola
                      </Typography>
                      
                      <Field
                        as={TextField}
                        label={i18n.t("queueModal.form.greetingMessage")}
                        type="greetingMessage"
                        multiline
                        inputRef={greetingRef}
                        minRows={4}
                        fullWidth
                        name="greetingMessage"
                        error={touched.greetingMessage && Boolean(errors.greetingMessage)}
                        helperText={touched.greetingMessage && errors.greetingMessage}
                        variant="outlined"
                        size="small"
                        className={classes.textField}
                        style={{ marginBottom: 16 }}
                      />
                      
                      {schedulesEnabled && (
                        <Field
                          as={TextField}
                          label={i18n.t("queueModal.form.outOfHoursMessage")}
                          type="outOfHoursMessage"
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
                      )}
                    </CardContent>
                  </Card>

                  {/* Chatbots */}
                  <div className={classes.chatbotSection}>
                    <Typography className={classes.sectionTitle}>
                      <AndroidIcon className={classes.sectionIcon} />
                      {i18n.t("queueModal.bot.title")}
                      <CustomToolTip
                        title={i18n.t("queueModal.bot.toolTipTitle")}
                        content={i18n.t("queueModal.bot.toolTip")}
                      >
                        <HelpOutlineOutlinedIcon
                          style={{ marginLeft: "8px", color: "#64748b" }}
                          fontSize="small"
                        />
                      </CustomToolTip>
                    </Typography>

                    <FieldArray name="chatbots">
                      {({ push, remove }) => (
                        <div className={classes.stepperContainer}>
                          <Stepper
                            nonLinear
                            activeStep={activeStep}
                            orientation="vertical"
                          >
                            {values.chatbots &&
                              values.chatbots.length > 0 &&
                              values.chatbots.map((info, index) => (
                                <Step
                                  key={`${info.id ? info.id : index}-chatbots`}
                                  onClick={() => setActiveStep(index)}
                                >
                                  <StepLabel key={`${info.id}-chatbots`}>
                                    {isNameEdit !== index &&
                                      queue.chatbots[index]?.name ? (
                                      <div className={classes.greetingMessage}>
                                        <Typography variant="body1" style={{ fontWeight: 600 }}>
                                          {values.chatbots[index].name}
                                        </Typography>

                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            setIsNamedEdit(index);
                                            setIsStepContent(false);
                                          }}
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>

                                        <IconButton
                                          onClick={() => {
                                            setSelectedQueue(info);
                                            setConfirmModalOpen(true);
                                          }}
                                          size="small"
                                        >
                                          <DeleteOutline fontSize="small" />
                                        </IconButton>
                                      </div>
                                    ) : (
                                      <div className={classes.botOptionFields}>
                                        <Field
                                          as={TextField}
                                          name={`chatbots[${index}].name`}
                                          variant="outlined"
                                          size="small"
                                          label="Nome da Opção"
                                          disabled={isSubmitting}
                                          autoFocus
                                          error={
                                            touched?.chatbots?.[index]?.name &&
                                            Boolean(errors.chatbots?.[index]?.name)
                                          }
                                          className={classes.textField}
                                          style={{ marginBottom: 16 }}
                                        />

                                        <FormControl
                                          variant="outlined"
                                          size="small"
                                          className={classes.formControl}
                                          style={{ marginBottom: 16 }}
                                        >
                                          <InputLabel>{i18n.t("queueModal.bot.selectOption")}</InputLabel>
                                          <Field
                                            as={Select}
                                            name={`chatbots[${index}].queueType`}
                                            label={i18n.t("queueModal.bot.selectOption")}
                                            error={touched?.chatbots?.[index]?.queueType &&
                                              Boolean(errors?.chatbots?.[index]?.queueType)}
                                          >
                                            <MenuItem value={"text"}>{i18n.t("queueModal.bot.text")}</MenuItem>
                                            <MenuItem value={"attendent"}>{i18n.t("queueModal.bot.attendent")}</MenuItem>
                                            <MenuItem value={"queue"}>{i18n.t("queueModal.bot.queue")}</MenuItem>
                                            <MenuItem value={"integration"}>{i18n.t("queueModal.bot.integration")}</MenuItem>
                                            <MenuItem value={"file"}>{i18n.t("queueModal.bot.file")}</MenuItem>
                                          </Field>
                                        </FormControl>
                                        
                                        <FormControlLabel
                                          control={
                                            <Field
                                              as={Switch}
                                              color="primary"
                                              name={`chatbots[${index}].closeTicket`}
                                              checked={values.chatbots[index].closeTicket || false}
                                            />
                                          }
                                          label={i18n.t("queueModal.form.closeTicket")}
                                          style={{ marginBottom: 16 }}
                                        />

                                        <Box display="flex" gap={1}>
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              values.chatbots[index].name
                                                ? handleSaveBot(values)
                                                : null
                                            }
                                            disabled={isSubmitting}
                                            style={{ 
                                              backgroundColor: "#f0fdf4", 
                                              color: "#059669",
                                              "&:hover": { backgroundColor: "#dcfce7" }
                                            }}
                                          >
                                            <SaveIcon fontSize="small" />
                                          </IconButton>

                                          <IconButton
                                            size="small"
                                            onClick={() => remove(index)}
                                            disabled={isSubmitting}
                                            style={{ 
                                              backgroundColor: "#fef2f2", 
                                              color: "#dc2626",
                                              "&:hover": { backgroundColor: "#fca5a5" }
                                            }}
                                          >
                                            <DeleteOutline fontSize="small" />
                                          </IconButton>
                                        </Box>
                                      </div>
                                    )}
                                  </StepLabel>

                                  {isStepContent && queue.chatbots[index] && (
                                    <StepContent>
                                      <div className={classes.botOptionFields}>
                                        {isGreetingMessageEdit !== index ? (
                                          <div className={classes.greetingMessage}>
                                            <Typography color="textSecondary" variant="body2">
                                              Mensagem:
                                            </Typography>
                                            <Typography variant="body2">
                                              {values.chatbots[index].greetingMessage || "Sem mensagem configurada"}
                                            </Typography>
                                            <IconButton
                                              size="small"
                                              onClick={() => setGreetingMessageEdit(index)}
                                            >
                                              <EditIcon fontSize="small" />
                                            </IconButton>
                                          </div>
                                        ) : (
                                          <div>
                                            {queue.chatbots[index].queueType === "text" && (
                                              <Field
                                                as={TextField}
                                                name={`chatbots[${index}].greetingMessage`}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label="Mensagem"
                                                className={classes.textField}
                                                style={{ marginBottom: 16 }}
                                              />
                                            )}
                                            {queue.chatbots[index].queueType === "queue" && (
                                              <>
                                                <Field
                                                  as={TextField}
                                                  name={`chatbots[${index}].greetingMessage`}
                                                  variant="outlined"
                                                  size="small"
                                                  fullWidth
                                                  multiline
                                                  rows={3}
                                                  label="Mensagem"
                                                  className={classes.textField}
                                                  style={{ marginBottom: 16 }}
                                                />
                                                <FormControl
                                                  variant="outlined"
                                                  size="small"
                                                  className={classes.formControl}
                                                  fullWidth
                                                >
                                                  <InputLabel>{i18n.t("queueModal.bot.queue")}</InputLabel>
                                                  <Field
                                                    as={Select}
                                                    name={`chatbots[${index}].optQueueId`}
                                                    label={i18n.t("queueModal.bot.queue")}
                                                  >
                                                    {queues.map(queue => (
                                                      <MenuItem key={queue.id} value={queue.id}>
                                                        {queue.name}
                                                      </MenuItem>
                                                    ))}
                                                  </Field>
                                                </FormControl>
                                              </>
                                            )}
                                            {queue.chatbots[index].queueType === "attendent" && (
                                              <>
                                                <Field
                                                  as={TextField}
                                                  name={`chatbots[${index}].greetingMessage`}
                                                  variant="outlined"
                                                  size="small"
                                                  fullWidth
                                                  multiline
                                                  rows={3}
                                                  label="Mensagem"
                                                  className={classes.textField}
                                                  style={{ marginBottom: 16 }}
                                                />
                                                <FormControl
                                                  variant="outlined"
                                                  size="small"
                                                  className={classes.formControl}
                                                  fullWidth
                                                  style={{ marginBottom: 16 }}
                                                >
                                                  <InputLabel>{i18n.t("queueModal.bot.selectUser")}</InputLabel>
                                                  <Field
                                                    as={Select}
                                                    name={`chatbots[${index}].optUserId`}
                                                    label={i18n.t("queueModal.bot.selectUser")}
                                                  >
                                                    {users.map(user => (
                                                      <MenuItem key={user.id} value={user.id}>
                                                        {user.name}
                                                      </MenuItem>
                                                    ))}
                                                  </Field>
                                                </FormControl>
                                                <FormControl
                                                  variant="outlined"
                                                  size="small"
                                                  className={classes.formControl}
                                                  fullWidth
                                                >
                                                  <InputLabel>Seleccione una cola</InputLabel>
                                                  <Field
                                                    as={Select}
                                                    name={`chatbots[${index}].optQueueId`}
                                                    label="Seleccione una cola"
                                                  >
                                                    {queues.map(queue => (
                                                      <MenuItem key={queue.id} value={queue.id}>
                                                        {queue.name}
                                                      </MenuItem>
                                                    ))}
                                                  </Field>
                                                </FormControl>
                                              </>
                                            )}
                                            {queue.chatbots[index].queueType === "integration" && (
                                              <>
                                                <Field
                                                  as={TextField}
                                                  name={`chatbots[${index}].greetingMessage`}
                                                  variant="outlined"
                                                  size="small"
                                                  fullWidth
                                                  multiline
                                                  rows={3}
                                                  label="Mensagem"
                                                  className={classes.textField}
                                                  style={{ marginBottom: 16 }}
                                                />
                                                <FormControl
                                                  variant="outlined"
                                                  size="small"
                                                  className={classes.formControl}
                                                  fullWidth
                                                >
                                                  <InputLabel>{i18n.t("queueModal.bot.selectIntegration")}</InputLabel>
                                                  <Field
                                                    as={Select}
                                                    name={`chatbots[${index}].optIntegrationId`}
                                                    label={i18n.t("queueModal.bot.selectIntegration")}
                                                  >
                                                    {integrations.map(integration => (
                                                      <MenuItem key={integration.id} value={integration.id}>
                                                        {integration.name}
                                                      </MenuItem>
                                                    ))}
                                                  </Field>
                                                </FormControl>
                                              </>
                                            )}
                                            {queue.chatbots[index].queueType === "file" && (
                                              <>
                                                <Field
                                                  as={TextField}
                                                  name={`chatbots[${index}].greetingMessage`}
                                                  variant="outlined"
                                                  size="small"
                                                  fullWidth
                                                  multiline
                                                  rows={3}
                                                  label="Mensagem"
                                                  className={classes.textField}
                                                  style={{ marginBottom: 16 }}
                                                />
                                                <FormControl
                                                  variant="outlined"
                                                  size="small"
                                                  className={classes.formControl}
                                                  fullWidth
                                                >
                                                  <InputLabel>Seleccione un archivo</InputLabel>
                                                  <Field
                                                    as={Select}
                                                    name={`chatbots[${index}].optFileId`}
                                                    label="Seleccione un archivo"
                                                  >
                                                    {file && file.map(f => (
                                                      <MenuItem key={f.id} value={f.id}>
                                                        {f.name}
                                                      </MenuItem>
                                                    ))}
                                                  </Field>
                                                </FormControl>
                                              </>
                                            )}
                                            <IconButton
                                              size="small"
                                              onClick={() => handleSaveBot(values)}
                                              disabled={isSubmitting}
                                              style={{ 
                                                backgroundColor: "#f0fdf4", 
                                                color: "#059669",
                                                marginTop: 8
                                              }}
                                            >
                                              <SaveIcon fontSize="small" />
                                            </IconButton>
                                          </div>
                                        )}

                                        <OptionsChatBot chatBotId={info.id} />
                                      </div>
                                    </StepContent>
                                  )}
                                </Step>
                              ))}

                            <Step>
                              <StepLabel
                                onClick={() => push({ name: "", value: "" })}
                                style={{ cursor: "pointer" }}
                              >
                                <Typography style={{ color: "#059669", fontWeight: 600 }}>
                                  {i18n.t("queueModal.bot.addOptions")}
                                </Typography>
                              </StepLabel>
                            </Step>
                          </Stepper>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                </DialogContent>
                
                <DialogActions className={classes.dialogActions}>
                  <Button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    variant="outlined"
                    className={classes.cancelButton}
                    startIcon={<CancelIcon />}
                  >
                    {i18n.t("queueModal.buttons.cancel")}
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    className={`${classes.saveButton} ${classes.btnWrapper}`}
                    startIcon={<SaveIcon />}
                  >
                    {queueId
                      ? i18n.t("queueModal.buttons.okEdit")
                      : i18n.t("queueModal.buttons.okAdd")}
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
        )}
        
        {tab === 1 && (
          <Paper style={{ padding: 20, margin: 20, borderRadius: 12 }}>
            <SchedulesForm
              loading={false}
              onSubmit={handleSaveSchedules}
              initialValues={schedules}
              labelSaveButton={i18n.t("whatsappModal.buttons.okAdd")}
            />
          </Paper>
        )}
      </Dialog>
    </div>
  );
};

export default QueueModal;