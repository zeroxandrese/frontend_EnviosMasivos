import React, { useState, useEffect, useRef, useContext } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { head } from "lodash";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Chip from '@material-ui/core/Chip';
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

// Icons
import AnnouncementIcon from "@material-ui/icons/Announcement";
import EditIcon from "@material-ui/icons/Edit";
import MessageIcon from "@material-ui/icons/Message";
import SettingsIcon from "@material-ui/icons/Settings";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import ImageIcon from "@material-ui/icons/Image";
import AddIcon from "@material-ui/icons/Add";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import ContactsIcon from "@material-ui/icons/Contacts";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import ScheduleIcon from "@material-ui/icons/Schedule";

import { i18n } from "../../translate/i18n";
import moment from "moment";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@material-ui/core";
import { AuthContext } from "../../context/Auth/AuthContext";
import ConfirmationModal from "../ConfirmationModal";

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
  
  // Tabs System
  tabsContainer: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  
  tabsHeader: {
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
  
  tabContent: {
    padding: theme.spacing(3),
  },
  
  // File Upload Section
  fileUploadSection: {
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderRadius: "12px",
    padding: theme.spacing(2),
    border: "2px dashed #cbd5e1",
    textAlign: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: "#64748b",
      backgroundColor: "#f1f5f9",
    },
  },
  
  fileInput: {
    display: "none",
  },
  
  uploadButton: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "8px",
    padding: theme.spacing(0.5, 2),
    fontSize: "12px",
    minHeight: "32px",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      transform: "translateY(-1px)",
    },
  },
  
  attachedFile: {
    background: "white",
    borderRadius: "12px",
    padding: theme.spacing(1.5),
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  
  fileInfo: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: "#1e293b",
    fontWeight: 500,
    fontSize: "14px",
  },
  
  deleteFileButton: {
    color: "#dc2626",
    backgroundColor: "#fef2f2",
    borderRadius: "8px",
    padding: theme.spacing(0.5),
    "&:hover": {
      backgroundColor: "#fca5a5",
      transform: "scale(1.1)",
    },
  },
  
  // Chip styling
  whatsappChip: {
    backgroundColor: "#dcfce7",
    color: "#059669",
    margin: theme.spacing(0.25),
    fontSize: "12px",
    height: "24px",
  },
  
  // Actions - PADRÃO REFERÊNCIA
  dialogActions: {
    padding: theme.spacing(2, 3),
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
    gap: theme.spacing(1),
    position: "sticky",
    bottom: 0,
    zIndex: 10,
    flexWrap: "wrap",
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  
  attachButton: {
    color: "#64748b",
    borderColor: "#cbd5e1",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "8px",
    padding: theme.spacing(0.5, 1.5),
    fontSize: "12px",
    "&:hover": {
      backgroundColor: "#f1f5f9",
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
  
  actionButton: {
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "8px",
    padding: theme.spacing(1, 2.5),
    minHeight: "40px",
    fontSize: "13px",
  },
  
  restartButton: {
    color: "#059669",
    borderColor: "#059669",
    "&:hover": {
      backgroundColor: "#f0fdf4",
    },
  },
  
  cancelCampaignButton: {
    color: "#dc2626",
    borderColor: "#dc2626",
    "&:hover": {
      backgroundColor: "#fef2f2",
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

const CampaignSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

const CampaignModal = ({
  open,
  onClose,
  campaignId,
  initialValues,
  onSave,
  resetPagination,
}) => {
  const classes = useStyles();
  const isMounted = useRef(true);
  const { user } = useContext(AuthContext);
  const { companyId } = user;

  const initialState = {
    name: "",
    message1: "",
    message2: "",
    message3: "",
    message4: "",
    message5: "",
    confirmationMessage1: "",
    confirmationMessage2: "",
    confirmationMessage3: "",
    confirmationMessage4: "",
    confirmationMessage5: "",
    status: "INATIVA",
    confirmation: false,
    scheduledAt: "",
    contactListId: "",
    tagListId: "Nenhuma",
    companyId,
  };

  const [campaign, setCampaign] = useState(initialState);
  const [whatsapps, setWhatsapps] = useState([]);
  const [selectedWhatsapps, setSelectedWhatsapps] = useState([]);
  const [contactLists, setContactLists] = useState([]);
  const [tagLists, setTagLists] = useState([]);
  const [messageTab, setMessageTab] = useState(0);
  const [attachment, setAttachment] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [campaignEditable, setCampaignEditable] = useState(true);
  const attachmentFile = useRef(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      if (initialValues) {
        setCampaign((prevState) => {
          return { ...prevState, ...initialValues };
        });
      }

      api
        .get(`/contact-lists/list`, { params: { companyId } })
        .then(({ data }) => setContactLists(data));

      api
        .get(`/whatsapp`, { params: { companyId, session: 0 } })
        .then(({ data }) => {
          const mappedWhatsapps = data.map((whatsapp) => ({
            ...whatsapp,
            selected: false,
          }));
          setWhatsapps(mappedWhatsapps);
        });

      api.get(`/tags`, { params: { companyId, kanban: 0 } })
      .then(({ data }) => {
        const fetchedTags = data.tags;
        const formattedTagLists = fetchedTags.map((tag) => ({
          id: tag.id,
          name: tag.name,
        }));
        setTagLists(formattedTagLists);
      })
      .catch((error) => {
        console.error("Error retrieving tags:", error);
      });
      
      if (!campaignId) return;

      api.get(`/campaigns/${campaignId}`).then(({ data }) => {
        setCampaign((prev) => {
          let prevCampaignData = Object.assign({}, prev);

          Object.entries(data).forEach(([key, value]) => {
            if (key === "scheduledAt" && value !== "" && value !== null) {
              prevCampaignData[key] = moment(value).format("YYYY-MM-DDTHH:mm");
            } else {
              prevCampaignData[key] = value === null ? "" : value;
            }
          });

          return prevCampaignData;
        });
      });
    }
  }, [campaignId, open, initialValues, companyId]);

  useEffect(() => {
    const now = moment();
    const scheduledAt = moment(campaign.scheduledAt);
    const moreThenAnHour =
      !Number.isNaN(scheduledAt.diff(now)) && scheduledAt.diff(now, "hour") > 1;
    const isEditable =
      campaign.status === "INATIVA" ||
      (campaign.status === "PROGRAMADA" && moreThenAnHour);

    setCampaignEditable(isEditable);
  }, [campaign.status, campaign.scheduledAt]);

  const handleClose = () => {
    onClose();
    setCampaign(initialState);
  };

  const handleAttachmentFile = (e) => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };

  const handleSaveCampaign = async (values) => {
    try {
      const dataValues = {
        ...values,
        whatsappId: selectedWhatsapps.join(","),
      };

      Object.entries(values).forEach(([key, value]) => {
        if (key === "scheduledAt" && value !== "" && value !== null) {
          dataValues[key] = moment(value).format("YYYY-MM-DD HH:mm:ss");
        } else {
          dataValues[key] = value === "" ? null : value;
        }
      });

      if (campaignId) {
        await api.put(`/campaigns/${campaignId}`, dataValues);

        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(`/campaigns/${campaignId}/media-upload`, formData);
        }
        handleClose();
      } else {
        const { data } = await api.post("/campaigns", dataValues);

        if (attachment != null) {
          const formData = new FormData();
          formData.append("file", attachment);
          await api.post(`/campaigns/${data.id}/media-upload`, formData);
        }
        if (onSave) {
          onSave(data);
        }
        handleClose();
      }
      toast.success(i18n.t("campaigns.toasts.success"));
    } catch (err) {
      console.log(err);
      toastError(err);
    }
  };

  const deleteMedia = async () => {
    if (attachment) {
      setAttachment(null);
      attachmentFile.current.value = null;
    }

    if (campaign.mediaPath) {
      await api.delete(`/campaigns/${campaign.id}/media-upload`);
      setCampaign((prev) => ({ ...prev, mediaPath: null, mediaName: null }));
      toast.success(i18n.t("campaigns.toasts.deleted"));
    }
  };

  const renderMessageField = (identifier) => {
    return (
      <Field
        as={TextField}
        id={identifier}
        name={identifier}
        fullWidth
        rows={5}
        label={i18n.t(`campaigns.dialog.form.${identifier}`)}
        placeholder={i18n.t("campaigns.dialog.form.messagePlaceholder")}
        multiline={true}
        variant="outlined"
        size="small"
        className={classes.textField}
        helperText="Utilice variables como {nome}, {numero}, {email} o definir variables personalizadas."
        disabled={!campaignEditable && campaign.status !== "CANCELADA"}
      />
    );
  };

  const renderConfirmationMessageField = (identifier) => {
    return (
      <Field
        as={TextField}
        id={identifier}
        name={identifier}
        fullWidth
        rows={5}
        label={i18n.t(`campaigns.dialog.form.${identifier}`)}
        placeholder={i18n.t("campaigns.dialog.form.messagePlaceholder")}
        multiline={true}
        variant="outlined"
        size="small"
        className={classes.textField}
        disabled={!campaignEditable && campaign.status !== "CANCELADA"}
      />
    );
  };

  const cancelCampaign = async () => {
    try {
      await api.post(`/campaigns/${campaign.id}/cancel`);
      toast.success(i18n.t("campaigns.toasts.cancel"));
      setCampaign((prev) => ({ ...prev, status: "CANCELADA" }));
      resetPagination();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const restartCampaign = async () => {
    try {
      await api.post(`/campaigns/${campaign.id}/restart`);
      toast.success(i18n.t("campaigns.toasts.restart"));
      setCampaign((prev) => ({ ...prev, status: "EM_ANDAMENTO" }));
      resetPagination();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={i18n.t("campaigns.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      >
        {i18n.t("campaigns.confirmationModal.deleteMessage")}
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
            <MessageIcon className={classes.titleIcon} />
            {campaignEditable ? (
              <>
                {campaignId
                  ? i18n.t("campaigns.dialog.update")
                  : i18n.t("campaigns.dialog.new")}
              </>
            ) : (
              <>{i18n.t("campaigns.dialog.readonly")}</>
            )}
          </Typography>
        </DialogTitle>
        
        <div style={{ display: "none" }}>
          <input
            type="file"
            ref={attachmentFile}
            onChange={(e) => handleAttachmentFile(e)}
            className={classes.fileInput}
          />
        </div>
        
        <Formik
          initialValues={campaign}
          enableReinitialize={true}
          validationSchema={CampaignSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveCampaign(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                
                <Grid container spacing={3}>
                  
                  {/* Coluna Esquerda */}
                  <Grid item xs={12} md={6}>
                    
                    {/* Configurações Básicas */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <SettingsIcon className={classes.sectionIcon} />
                          Configuración de campaña
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("campaigns.dialog.form.name")}
                            name="name"
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            disabled={!campaignEditable}
                          />
                        </div>
                        
                        <div className={classes.fieldRow}>
                          <FormControl
                            variant="outlined"
                            size="small"
                            className={classes.formControl}
                          >
                            <InputLabel id="confirmation-selection-label">
                              {i18n.t("campaigns.dialog.form.confirmation")}
                            </InputLabel>
                            <Field
                              as={Select}
                              label={i18n.t("campaigns.dialog.form.confirmation")}
                              labelId="confirmation-selection-label"
                              id="confirmation"
                              name="confirmation"
                              error={touched.confirmation && Boolean(errors.confirmation)}
                              disabled={!campaignEditable}
                            >
                              <MenuItem value={false}>Desabilitada</MenuItem>
                              <MenuItem value={true}>Habilitada</MenuItem>
                            </Field>
                          </FormControl>
                          
                          <Field
                            as={TextField}
                            label={i18n.t("campaigns.dialog.form.scheduledAt")}
                            name="scheduledAt"
                            error={touched.scheduledAt && Boolean(errors.scheduledAt)}
                            helperText={touched.scheduledAt && errors.scheduledAt}
                            variant="outlined"
                            size="small"
                            type="datetime-local"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            className={classes.textField}
                            disabled={!campaignEditable}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Listas e Integrações */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <ContactsIcon className={classes.sectionIcon} />
                          Listas e integraciones
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <FormControl
                            variant="outlined"
                            size="small"
                            className={classes.formControl}
                          >
                            <InputLabel id="contactList-selection-label">
                              {i18n.t("campaigns.dialog.form.contactList")}
                            </InputLabel>
                            <Field
                              as={Select}
                              label={i18n.t("campaigns.dialog.form.contactList")}
                              labelId="contactList-selection-label"
                              id="contactListId"
                              name="contactListId"
                              error={touched.contactListId && Boolean(errors.contactListId)}
                              disabled={!campaignEditable}
                            >
                              <MenuItem value="">Ninguno</MenuItem>
                              {contactLists &&
                                contactLists.map((contactList) => (
                                  <MenuItem key={contactList.id} value={contactList.id}>
                                    {contactList.name}
                                  </MenuItem>
                                ))}
                            </Field>
                          </FormControl>
                        </div>
                        
                        <div className={classes.fieldRow}>
                          <FormControl
                            variant="outlined"
                            size="small"
                            className={classes.formControl}
                          >
                            <InputLabel id="tagList-selection-label">
                              {i18n.t("campaigns.dialog.form.tagList")}
                            </InputLabel>
                            <Field
                              as={Select}
                              label={i18n.t("campaigns.dialog.form.tagList")}
                              labelId="tagList-selection-label"
                              id="tagListId"
                              name="tagListId"
                              error={touched.tagListId && Boolean(errors.tagListId)}
                              disabled={!campaignEditable}
                            >
                              {Array.isArray(tagLists) &&
                                tagLists.map((tagList) => (
                                  <MenuItem key={tagList.id} value={tagList.id}>
                                    {tagList.name}
                                  </MenuItem>
                                ))}
                            </Field>
                          </FormControl>
                        </div>
                        
                        <div className={classes.fieldRow}>
                          <FormControl
                            variant="outlined"
                            size="small"
                            className={classes.formControl}
                          >
                            <InputLabel id="whatsapp-selection-label">
                              {i18n.t("campaigns.dialog.form.whatsapp")}
                            </InputLabel>
                            <Field
                              as={Select}
                              multiple 
                              label={i18n.t("campaigns.dialog.form.whatsapp")}
                              labelId="whatsapp-selection-label"
                              id="whatsappIds"
                              name="whatsappIds"
                              required
                              error={touched.whatsappId && Boolean(errors.whatsappId)}
                              disabled={!campaignEditable}
                              value={selectedWhatsapps}  
                              onChange={(event) => setSelectedWhatsapps(event.target.value)} 
                              renderValue={(selected) => (
                                <div>
                                  {selected.map((value) => (
                                    <Chip 
                                      key={value} 
                                      label={whatsapps.find((whatsapp) => whatsapp.id === value)?.name} 
                                      className={classes.whatsappChip}
                                      size="small"
                                    />
                                  ))}
                                </div>
                              )}
                            >
                              {whatsapps &&
                                whatsapps.map((whatsapp) => (
                                  <MenuItem key={whatsapp.id} value={whatsapp.id}>
                                    {whatsapp.name}
                                  </MenuItem>
                                ))}
                            </Field>
                          </FormControl>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Anexo */}
                    {(campaign.mediaPath || attachment) && (
                      <Card className={classes.formSection}>
                        <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                          <Typography className={classes.sectionTitle}>
                            <ImageIcon className={classes.sectionIcon} />
                            Archivo adjunto
                          </Typography>
                          
                          <div className={classes.attachedFile}>
                            <div className={classes.fileInfo}>
                              <AttachFileIcon fontSize="small" />
                              <Typography>
                                {attachment != null ? attachment.name : campaign.mediaName}
                              </Typography>
                            </div>
                            {campaignEditable && (
                              <IconButton
                                onClick={() => setConfirmationOpen(true)}
                                className={classes.deleteFileButton}
                                size="small"
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  </Grid>
                  
                  {/* Coluna Direita */}
                  <Grid item xs={12} md={6}>
                    
                    {/* Mensagens */}
                    <Card className={classes.formSection} style={{ height: "fit-content" }}>
                      <div className={classes.tabsContainer}>
                        <Tabs
                          value={messageTab}
                          onChange={(e, v) => setMessageTab(v)}
                          variant="fullWidth"
                          className={classes.tabsHeader}
                        >
                          <Tab label="Msg. 1" />
                          <Tab label="Msg. 2" />
                          <Tab label="Msg. 3" />
                          <Tab label="Msg. 4" />
                          <Tab label="Msg. 5" />
                        </Tabs>
                        
                        <div className={classes.tabContent}>
                          {messageTab === 0 && (
                            <>
                              {values.confirmation ? (
                                <Grid spacing={2} container>
                                  <Grid xs={12} md={8} item>
                                    {renderMessageField("message1")}
                                  </Grid>
                                  <Grid xs={12} md={4} item>
                                    {renderConfirmationMessageField("confirmationMessage1")}
                                  </Grid>
                                </Grid>
                              ) : (
                                <>{renderMessageField("message1")}</>
                              )}
                            </>
                          )}
                          {messageTab === 1 && (
                            <>
                              {values.confirmation ? (
                                <Grid spacing={2} container>
                                  <Grid xs={12} md={8} item>
                                    {renderMessageField("message2")}
                                  </Grid>
                                  <Grid xs={12} md={4} item>
                                    {renderConfirmationMessageField("confirmationMessage2")}
                                  </Grid>
                                </Grid>
                              ) : (
                                <>{renderMessageField("message2")}</>
                              )}
                            </>
                          )}
                          {messageTab === 2 && (
                            <>
                              {values.confirmation ? (
                                <Grid spacing={2} container>
                                  <Grid xs={12} md={8} item>
                                    {renderMessageField("message3")}
                                  </Grid>
                                  <Grid xs={12} md={4} item>
                                    {renderConfirmationMessageField("confirmationMessage3")}
                                  </Grid>
                                </Grid>
                              ) : (
                                <>{renderMessageField("message3")}</>
                              )}
                            </>
                          )}
                          {messageTab === 3 && (
                            <>
                              {values.confirmation ? (
                                <Grid spacing={2} container>
                                  <Grid xs={12} md={8} item>
                                    {renderMessageField("message4")}
                                  </Grid>
                                  <Grid xs={12} md={4} item>
                                    {renderConfirmationMessageField("confirmationMessage4")}
                                  </Grid>
                                </Grid>
                              ) : (
                                <>{renderMessageField("message4")}</>
                              )}
                            </>
                          )}
                          {messageTab === 4 && (
                            <>
                              {values.confirmation ? (
                                <Grid spacing={2} container>
                                  <Grid xs={12} md={8} item>
                                    {renderMessageField("message5")}
                                  </Grid>
                                  <Grid xs={12} md={4} item>
                                    {renderConfirmationMessageField("confirmationMessage5")}
                                  </Grid>
                                </Grid>
                              ) : (
                                <>{renderMessageField("message5")}</>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </Card>

                  </Grid>
                </Grid>
                
              </DialogContent>
              
              <DialogActions className={classes.dialogActions}>
                {campaign.status === "CANCELADA" && (
                  <Button
                    onClick={() => restartCampaign()}
                    variant="outlined"
                    className={`${classes.actionButton} ${classes.restartButton}`}
                    startIcon={<PlayArrowIcon />}
                  >
                    {i18n.t("campaigns.dialog.buttons.restart")}
                  </Button>
                )}
                
                {campaign.status === "EM_ANDAMENTO" && (
                  <Button
                    onClick={() => cancelCampaign()}
                    variant="outlined"
                    className={`${classes.actionButton} ${classes.cancelCampaignButton}`}
                    startIcon={<StopIcon />}
                  >
                    {i18n.t("campaigns.dialog.buttons.cancel")}
                  </Button>
                )}
                
                {!attachment && !campaign.mediaPath && campaignEditable && (
                  <Button
                    onClick={() => attachmentFile.current.click()}
                    disabled={isSubmitting}
                    variant="outlined"
                    className={classes.attachButton}
                    startIcon={<AddIcon />}
                  >
                    {i18n.t("campaigns.dialog.buttons.attach")}
                  </Button>
                )}
                
                <Button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  variant="outlined"
                  className={classes.cancelButton}
                  startIcon={<CancelIcon />}
                >
                  {i18n.t("campaigns.dialog.buttons.close")}
                </Button>
                
                {(campaignEditable || campaign.status === "CANCELADA") && (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    className={`${classes.saveButton} ${classes.btnWrapper}`}
                    startIcon={<SaveIcon />}
                  >
                    {campaignId
                      ? i18n.t("campaigns.dialog.buttons.edit")
                      : i18n.t("campaigns.dialog.buttons.add")}
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                )}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default CampaignModal;