import React, { useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

// Icons básicos que existem em todas as versões
import AnnouncementIcon from "@material-ui/icons/Announcement";
import EditIcon from "@material-ui/icons/Edit";
import MessageIcon from "@material-ui/icons/Message";
import SettingsIcon from "@material-ui/icons/Settings";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import ImageIcon from "@material-ui/icons/Image";
import AddIcon from "@material-ui/icons/Add";

import { i18n } from "../../translate/i18n";
import { head } from "lodash";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
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
  
  // Priority indicators
  priorityBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: 600,
    marginLeft: theme.spacing(1),
  },
  
  priorityHigh: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
  },
  
  priorityMedium: {
    backgroundColor: "#fef3c7",
    color: "#f59e0b",
  },
  
  priorityLow: {
    backgroundColor: "#f0fdf4",
    color: "#059669",
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

const AnnouncementSchema = Yup.object().shape({
  title: Yup.string().required("Obrigatório"),
  text: Yup.string().required("Obrigatório"),
});

const AnnouncementModal = ({ open, onClose, announcementId, reload }) => {
  const classes = useStyles();

  const initialState = {
    title: "",
    text: "",
    priority: 3,
    status: true,
  };

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(initialState);
  const [attachment, setAttachment] = useState(null);
  const attachmentFile = useRef(null);

  useEffect(() => {
    try {
      (async () => {
        if (!announcementId) return;

        const { data } = await api.get(`/announcements/${announcementId}`);
        setAnnouncement((prevState) => {
          return { ...prevState, ...data };
        });
      })();
    } catch (err) {
      toastError(err);
    }
  }, [announcementId, open]);

  const handleClose = () => {
    setAnnouncement(initialState);
    setAttachment(null);
    onClose();
  };

  const handleAttachmentFile = (e) => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };

  const handleSaveAnnouncement = async (values) => {
    const announcementData = { ...values };
    try {
      if (announcementId) {
        await api.put(`/announcements/${announcementId}`, announcementData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("typeArch", "announcements");
          formData.append("file", attachment);
          await api.post(
            `/announcements/${announcementId}/media-upload`,
            formData
          );
        }
      } else {
        const { data } = await api.post("/announcements", announcementData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("typeArch", "announcements");
          formData.append("file", attachment);

          await api.post(`/announcements/${data.id}/media-upload`, formData);
        }
      }
      toast.success(i18n.t("announcements.toasts.success"));
      if (typeof reload == "function") {
        reload();
      }
    } catch (err) {
      toastError(err);
    }
    handleClose();
  };

  const deleteMedia = async () => {
    if (attachment) {
      setAttachment(null);
      attachmentFile.current.value = null;
    }

    if (announcement.mediaPath) {
      await api.delete(`/announcements/${announcement.id}/media-upload`);
      setAnnouncement((prev) => ({
        ...prev,
        mediaPath: null,
      }));
      toast.success(i18n.t("announcements.toasts.deleted"));
      if (typeof reload == "function") {
        reload();
      }
    }
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={i18n.t("announcements.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      >
        {i18n.t("announcements.confirmationModal.deleteMessage")}
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
            <AnnouncementIcon className={classes.titleIcon} />
            {announcementId
              ? i18n.t("announcements.dialog.edit")
              : i18n.t("announcements.dialog.add")}
          </Typography>
        </DialogTitle>
        
        <div style={{ display: "none" }}>
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            ref={attachmentFile}
            onChange={(e) => handleAttachmentFile(e)}
            className={classes.fileInput}
          />
        </div>
        
        <Formik
          initialValues={announcement}
          enableReinitialize={true}
          validationSchema={AnnouncementSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveAnnouncement(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form>
              <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                
                <Grid container spacing={3}>
                  
                  {/* Coluna Esquerda */}
                  <Grid item xs={12} md={6}>
                    
                    {/* Informações Básicas */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <EditIcon className={classes.sectionIcon} />
                          Información del anuncio
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("announcements.dialog.form.title")}
                            name="title"
                            error={touched.title && Boolean(errors.title)}
                            helperText={touched.title && errors.title}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                          />
                        </div>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("announcements.dialog.form.text")}
                            name="text"
                            error={touched.text && Boolean(errors.text)}
                            helperText={touched.text && errors.text}
                            variant="outlined"
                            size="small"
                            multiline={true}
                            rows={6}
                            className={classes.textField}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Configurações */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <SettingsIcon className={classes.sectionIcon} />
                          Ajustes
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <FormControl 
                            variant="outlined" 
                            size="small" 
                            className={classes.formControl}
                          >
                            <InputLabel id="status-selection-label">
                              {i18n.t("announcements.dialog.form.status")}
                            </InputLabel>
                            <Field
                              as={Select}
                              label={i18n.t("announcements.dialog.form.status")}
                              labelId="status-selection-label"
                              id="status"
                              name="status"
                              error={touched.status && Boolean(errors.status)}
                            >
                              <MenuItem value={true}>
                                {i18n.t("announcements.dialog.form.active")}
                              </MenuItem>
                              <MenuItem value={false}>
                                {i18n.t("announcements.dialog.form.inactive")}
                              </MenuItem>
                            </Field>
                          </FormControl>
                          
                          <FormControl 
                            variant="outlined" 
                            size="small" 
                            className={classes.formControl}
                          >
                            <InputLabel id="priority-selection-label">
                              {i18n.t("announcements.dialog.form.priority")}
                            </InputLabel>
                            <Field
                              as={Select}
                              label={i18n.t("announcements.dialog.form.priority")}
                              labelId="priority-selection-label"
                              id="priority"
                              name="priority"
                              error={touched.priority && Boolean(errors.priority)}
                            >
                              <MenuItem value={1}>
                                {i18n.t("announcements.dialog.form.high")}
                                <span className={`${classes.priorityBadge} ${classes.priorityHigh}`}>
                                  Alta
                                </span>
                              </MenuItem>
                              <MenuItem value={2}>
                                {i18n.t("announcements.dialog.form.medium")}
                                <span className={`${classes.priorityBadge} ${classes.priorityMedium}`}>
                                  Média
                                </span>
                              </MenuItem>
                              <MenuItem value={3}>
                                {i18n.t("announcements.dialog.form.low")}
                                <span className={`${classes.priorityBadge} ${classes.priorityLow}`}>
                                  Bajo
                                </span>
                              </MenuItem>
                            </Field>
                          </FormControl>
                        </div>
                      </CardContent>
                    </Card>

                  </Grid>
                  
                  {/* Coluna Direita */}
                  <Grid item xs={12} md={6}>
                    
                    {/* Anexo */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <ImageIcon className={classes.sectionIcon} />
                          Adjuntar imagen
                        </Typography>
                        
                        {(announcement.mediaPath || attachment) ? (
                          <div className={classes.attachedFile}>
                            <div className={classes.fileInfo}>
                              <AttachFileIcon fontSize="small" />
                              <Typography>
                                {attachment ? attachment.name : announcement.mediaName}
                              </Typography>
                            </div>
                            <IconButton
                              onClick={() => setConfirmationOpen(true)}
                              className={classes.deleteFileButton}
                              size="small"
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </div>
                        ) : (
                          <div className={classes.fileUploadSection}>
                            <ImageIcon style={{ fontSize: 36, color: "#cbd5e1", marginBottom: 12 }} />
                            <Typography variant="body2" style={{ color: "#64748b", marginBottom: 12, fontSize: "13px" }}>
                              Añade una imagen a tu anuncio
                            </Typography>
                            <Typography variant="body2" style={{ color: "#94a3b8", marginBottom: 16, fontSize: "11px" }}>
                              (PNG, JPG, JPEG)
                            </Typography>
                            <Button
                              className={classes.uploadButton}
                              onClick={() => attachmentFile.current.click()}
                              startIcon={<AddIcon fontSize="small" />}
                              size="small"
                            >
                              Elija archivo
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                  </Grid>
                </Grid>
                
              </DialogContent>
              
              <DialogActions className={classes.dialogActions}>
                <Button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  variant="outlined"
                  className={classes.cancelButton}
                  startIcon={<CancelIcon />}
                >
                  {i18n.t("announcements.dialog.buttons.cancel")}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  className={`${classes.saveButton} ${classes.btnWrapper}`}
                  startIcon={<SaveIcon />}
                >
                  {announcementId
                    ? i18n.t("announcements.dialog.buttons.edit")
                    : i18n.t("announcements.dialog.buttons.add")}
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

export default AnnouncementModal;