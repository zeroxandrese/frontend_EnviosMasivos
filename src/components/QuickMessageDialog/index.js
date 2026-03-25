import React, { useContext, useState, useEffect, useRef } from "react";

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
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { i18n } from "../../translate/i18n";
import { head, padEnd } from "lodash";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import MessageVariablesPicker from "../MessageVariablesPicker";
import ButtonWithSpinner from "../ButtonWithSpinner";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import ConfirmationModal from "../ConfirmationModal";

// Icons
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import SettingsIcon from "@material-ui/icons/Settings";
import CategoryIcon from "@material-ui/icons/Category";
import MessageIcon from "@material-ui/icons/Message";
import AttachmentIcon from "@material-ui/icons/Attachment";
import SecurityIcon from "@material-ui/icons/Security";

const getBaseName = (value) => {
  if (!value || typeof value !== "string") return "";
  const normalized = value.split("?")[0].split("#")[0].replace(/\\/g, "/");
  const parts = normalized.split("/");
  return parts[parts.length - 1] || "";
};

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	
	// Dialog Responsivo
	dialogPaper: {
		borderRadius: "20px",
		maxWidth: "900px",
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
	
	// Attachment Section
	attachmentSection: {
		background: "#f0f9ff",
		borderRadius: "8px",
		padding: theme.spacing(2),
		border: "1px solid #0ea5e9",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	
	attachmentInfo: {
		display: "flex",
		alignItems: "center",
		gap: theme.spacing(1),
		color: "#0c4a6e",
		fontWeight: 500,
	},
	
	// Message Variables Section
	variablesSection: {
		background: "#f0fdf4",
		borderRadius: "8px",
		padding: theme.spacing(2),
		border: "1px solid #22c55e",
		marginBottom: theme.spacing(2),
	},
	
	// Upload Button
	uploadButton: {
		background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
		color: "white",
		fontWeight: 600,
		textTransform: "none",
		borderRadius: "8px",
		padding: theme.spacing(1, 2),
		boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
		transition: "all 0.3s ease",
		"&:hover": {
			background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
			transform: "translateY(-1px)",
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
	
	// Mantém compatibilidade com estilos originais
	multFieldLine: {
		display: "flex",
		"& > *:not(:last-child)": {
			marginRight: theme.spacing(1),
		},
	},
	colorAdorment: {
		width: 20,
		height: 20,
	},
}));

const QuickeMessageSchema = Yup.object().shape({
  shortcode: Yup.string().required("Obrigatório"),
//   message: Yup.string().required("Obrigatório"),
});

const QuickMessageDialog = ({ open, onClose, quickemessageId, reload }) => {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const { profile } = user;
  const messageInputRef = useRef();

  const initialState = {
    shortcode: "",
    message: "",
    geral: false,
    status: true,
    isCategory: false,
    categoryId: '',
  };

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [quickemessage, setQuickemessage] = useState(initialState);
  const [attachment, setAttachment] = useState(null);
  const attachmentFile = useRef(null);

  useEffect(() => {
    try {
      (async () => {
        if (!quickemessageId) return;

        const { data } = await api.get(`/quick-messages/${quickemessageId}`);
        setQuickemessage((prevState) => {
          return { ...prevState, ...data };
        });
      })();
    } catch (err) {
      toastError(err);
    }
  }, [quickemessageId, open]);

  const handleClose = () => {
    setQuickemessage(initialState);
    setAttachment(null);
    onClose();
  };

  const handleAttachmentFile = (e) => {
    const file = head(e.target.files);
    if (file) {
      setAttachment(file);
    }
  };

  const handleSaveQuickeMessage = async (values) => {
    const quickemessageData = { ...values, isMedia: true, mediaPath: attachment ? attachment.name : values.mediaPath ? getBaseName(values.mediaPath) : null };
    try {
      if (quickemessageId) {
        await api.put(`/quick-messages/${quickemessageId}`, quickemessageData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("typeArch", "quickMessage");
          formData.append("file", attachment);
          await api.post(
            `/quick-messages/${quickemessageId}/media-upload`,
            formData
          );
        }
      } else {
        const { data } = await api.post("/quick-messages", quickemessageData);
        if (attachment != null) {
          const formData = new FormData();
          formData.append("typeArch", "quickMessage");
          formData.append("file", attachment);
          await api.post(`/quick-messages/${data.id}/media-upload`, formData);
        }
      }
      toast.success(i18n.t("quickMessages.toasts.success"));
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

    if (quickemessage.mediaPath) {
      await api.delete(`/quick-messages/${quickemessage.id}/media-upload`);
      setQuickemessage((prev) => ({
        ...prev,
        mediaPath: null,
      }));
      toast.success(i18n.t("quickMessages.toasts.deleted"));
      if (typeof reload == "function") {
        reload();
      }
    }
  };

  const handleClickMsgVar = async (msgVar, setValueFunc) => {
    const el = messageInputRef.current;
    const firstHalfText = el.value.substring(0, el.selectionStart);
    const secondHalfText = el.value.substring(el.selectionEnd);
    const newCursorPos = el.selectionStart + msgVar.length;

    setValueFunc("message", `${firstHalfText}${msgVar}${secondHalfText}`);

    await new Promise(r => setTimeout(r, 100));
    messageInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
  };

  return (
    <div className={classes.root}>
      <ConfirmationModal
        title={i18n.t("quickMessages.confirmationModal.deleteTitle")}
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={deleteMedia}
      >
        {i18n.t("quickMessages.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      
      <div style={{ display: "none" }}>
        <input
          type="file"
          ref={attachmentFile}
          onChange={(e) => handleAttachmentFile(e)}
        />
      </div>
      
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
            <QuestionAnswerIcon className={classes.titleIcon} />
            {quickemessageId
              ? `${i18n.t("quickMessages.dialog.edit")}`
              : `${i18n.t("quickMessages.dialog.add")}`}
          </Typography>
        </DialogTitle>
        
        <Formik
          initialValues={quickemessage}
          enableReinitialize={true}
          validationSchema={QuickeMessageSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveQuickeMessage(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, setFieldValue, values }) => (
            <Form>
              <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                
                <Grid container spacing={3} className={classes.gridContainer}>
                  
                  {/* Coluna Esquerda */}
                  <Grid item xs={12} md={6}>
                    
                    {/* Tipo de Mensagem */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <SettingsIcon className={classes.sectionIcon} />
                          Tipo de Mensagem
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <FormControl
                            size="small"
                            variant="outlined"
                            fullWidth
                            className={classes.formControl}
                          >
                            <InputLabel id="profile-selection-input-label">
                              Categoria
                            </InputLabel>
                            <Field
                              as={Select}
                              label="Categoria"
                              name="isCategory"
                              labelId="profile-selection-label"
                              id="profile-selection"
                              required
                            >
                              <MenuItem value={true}>Menu</MenuItem>
                              <MenuItem value={false}>Resposta</MenuItem>
                            </Field>
                          </FormControl>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Informações Básicas */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <CategoryIcon className={classes.sectionIcon} />
                          Informações Básicas
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            autoFocus
                            label={values.isCategory ? 'Nome do menu' : i18n.t("quickMessages.dialog.shortcode")}
                            name="shortcode"
                            error={touched.shortcode && Boolean(errors.shortcode)}
                            helperText={touched.shortcode && errors.shortcode}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            fullWidth
                          />
                        </div>
                        
                        {!values.isCategory && (
                          <div className={classes.fieldRow}>
                            <SelectQuickMessages value={values.categoryId} setValue={setFieldValue} />
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Configurações Avançadas */}
                    {(profile === "admin" || profile === "supervisor") && (
                      <Card className={classes.formSection}>
                        <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                          <Typography className={classes.sectionTitle}>
                            <SecurityIcon className={classes.sectionIcon} />
                            Configurações Avançadas
                          </Typography>
                          
                          <div className={classes.fieldRow}>
                            <FormControl 
                              variant="outlined" 
                              size="small" 
                              fullWidth
                              className={classes.formControl}
                            >
                              <InputLabel id="geral-selection-label">
                                {i18n.t("quickMessages.dialog.geral")}
                              </InputLabel>
                              <Field
                                as={Select}
                                label={i18n.t("quickMessages.dialog.geral")}
                                placeholder={i18n.t("quickMessages.dialog.geral")}
                                labelId="geral-selection-label"
                                id="geral"
                                name="geral"
                                error={touched.geral && Boolean(errors.geral)}
                              >
                                <MenuItem value={true}>{i18n.t("announcements.active")}</MenuItem>
                                <MenuItem value={false}>{i18n.t("announcements.inactive")}</MenuItem>
                              </Field>
                            </FormControl>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  </Grid>
                  
                  {/* Coluna Direita */}
                  <Grid item xs={12} md={6}>
                    
                    {!values.isCategory && (
                      <>
                        {/* Conteúdo da Mensagem */}
                        <Card className={classes.formSection}>
                          <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                            <Typography className={classes.sectionTitle}>
                              <MessageIcon className={classes.sectionIcon} />
                              Conteúdo da Mensagem
                            </Typography>
                            
                            <div className={classes.fieldRow}>
                              <Field
                                as={TextField}
                                label={i18n.t("quickMessages.dialog.message")}
                                name="message"
                                inputRef={messageInputRef}
                                error={touched.message && Boolean(errors.message)}
                                helperText={touched.message && errors.message}
                                variant="outlined"
                                size="small"
                                className={classes.textField}
                                multiline={true}
                                rows={7}
                                fullWidth
                              />
                            </div>

                            {/* Variáveis de Mensagem */}
                            <Box className={classes.variablesSection}>
                              <Typography style={{ fontSize: "14px", fontWeight: 600, color: "#059669", marginBottom: 8 }}>
                                Variáveis Disponíveis
                              </Typography>
                              <MessageVariablesPicker
                                disabled={isSubmitting}
                                onClick={value => handleClickMsgVar(value, setFieldValue)}
                              />
                            </Box>
                          </CardContent>
                        </Card>

                        {/* Anexos */}
                        <Card className={classes.formSection}>
                          <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                            <Typography className={classes.sectionTitle}>
                              <AttachmentIcon className={classes.sectionIcon} />
                              Anexos
                            </Typography>
                            
                            {(quickemessage.mediaPath || attachment) ? (
                              <Box className={classes.attachmentSection}>
                                <Box className={classes.attachmentInfo}>
                                  <AttachFileIcon />
                                  <Typography variant="body2">
                                    {attachment ? attachment.name : quickemessage.mediaName}
                                  </Typography>
                                </Box>
                                <IconButton
                                  onClick={() => setConfirmationOpen(true)}
                                  color="secondary"
                                  size="small"
                                >
                                  <DeleteOutlineIcon color="secondary" />
                                </IconButton>
                              </Box>
                            ) : (
                              <Button
                                className={classes.uploadButton}
                                onClick={() => attachmentFile.current.click()}
                                disabled={isSubmitting}
                                startIcon={<AttachFileIcon />}
                                fullWidth
                              >
                                {i18n.t("quickMessages.buttons.attach")}
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </>
                    )}

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
                  {i18n.t("quickMessages.buttons.cancel")}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  className={`${classes.saveButton} ${classes.btnWrapper}`}
                  startIcon={<SaveIcon />}
                >
                  {quickemessageId
                    ? `${i18n.t("quickMessages.buttons.edit")}`
                    : `${i18n.t("quickMessages.buttons.add")}`}
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

export const SelectQuickMessages = (props) => {
  const { value, setValue } = props;
  const classes = useStyles();

  const [listCategories, setListCategories] = useState([]);

  useEffect(() => {
    getListQuickMessages();
  }, []);

  const getListQuickMessages = async () => {
    try {
      const { data } = await api.get('/quick-messages/listCategories');
      setListCategories(data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <FormControl size="small" variant='outlined' fullWidth className={classes?.formControl}>
      <InputLabel id="demo-simple-select-label">Menu</InputLabel>
      <Select
        fullWidth
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Menu"
        onChange={(e) => setValue('categoryId', e.target.value)}
      >
        {listCategories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.shortcode}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default QuickMessageDialog;