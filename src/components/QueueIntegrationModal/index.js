import React, { useState, useEffect } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

// Icons - Todos compatíveis com Material-UI v4
import ExtensionIcon from "@material-ui/icons/Extension";
import SettingsIcon from "@material-ui/icons/Settings";
import CodeIcon from "@material-ui/icons/Code";
import LanguageIcon from "@material-ui/icons/Language";
import WebIcon from "@material-ui/icons/Web";
import AndroidIcon from "@material-ui/icons/Android";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import BugReportIcon from "@material-ui/icons/BugReport";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
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
		background: "linear-gradient(135deg, #57667C 0%, #57667C 100%)",
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
		background: "linear-gradient(135deg, #57667C 0%, #57667C 100%)",
		color: "white",
		fontWeight: 600,
		textTransform: "none",
		borderRadius: "8px",
		padding: theme.spacing(1, 2.5),
		minHeight: "40px",
		boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
		transition: "all 0.3s ease",
		"&:hover": {
			background: "linear-gradient(135deg, #57667C 0%, #b45309 100%)",
			transform: "translateY(-1px)",
		},
		"&:disabled": {
			background: "#cbd5e1",
			color: "#9ca3af",
		},
	},
	
	testButton: {
		background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
		color: "white",
		fontWeight: 600,
		textTransform: "none",
		borderRadius: "8px",
		padding: theme.spacing(1, 2.5),
		minHeight: "40px",
		boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
		transition: "all 0.3s ease",
		"&:hover": {
			background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
			transform: "translateY(-1px)",
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

	btnLeft: {
		display: "flex",
		marginRight: "auto",
		marginLeft: 0,
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
}));

const DialogflowSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
});

const QueueIntegration = ({ open, onClose, integrationId }) => {
  const classes = useStyles();

  const initialState = {
    type: "typebot",
    name: "",
    projectName: "",
    jsonContent: "",
    language: "",
    urlN8N: "",
    typebotDelayMessage: 1000,
    typebotExpires: 1,
    typebotKeywordFinish: "",
    typebotKeywordRestart: "",
    typebotRestartMessage: "",
    typebotSlug: "",
    typebotUnknownMessage: "",
  };

  const [integration, setIntegration] = useState(initialState);

  useEffect(() => {
    (async () => {
      if (!integrationId) return;
      try {
        const { data } = await api.get(`/queueIntegration/${integrationId}`);
        setIntegration((prevState) => {
          return { ...prevState, ...data };
        });
      } catch (err) {
        toastError(err);
      }
    })();

    return () => {
      setIntegration({
        type: "dialogflow",
        name: "",
        projectName: "",
        jsonContent: "",
        language: "",
        urlN8N: "",
        typebotDelayMessage: 1000
      });
    };
  }, [integrationId, open]);

  const handleClose = () => {
    onClose();
    setIntegration(initialState);
  };

  const handleTestSession = async (event, values) => {
    try {
      const { projectName, jsonContent, language } = values;

      await api.post(`/queueIntegration/testSession`, {
        projectName,
        jsonContent,
        language,
      });

      toast.success(i18n.t("queueIntegrationModal.messages.testSuccess"));
    } catch (err) {
      toastError(err);
    }
  };

  const handleSaveDialogflow = async (values) => {
    try {
      if (values.type === 'n8n' || values.type === 'webhook' || values.type === 'typebot') values.projectName = values.name
      if (integrationId) {
        await api.put(`/queueIntegration/${integrationId}`, values);
        toast.success(i18n.t("queueIntegrationModal.messages.editSuccess"));
      } else {
        await api.post("/queueIntegration", values);
        toast.success(i18n.t("queueIntegrationModal.messages.addSuccess"));
      }
      handleClose();
    } catch (err) {
      toastError(err);
    }
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
            <ExtensionIcon className={classes.titleIcon} />
            {integrationId
              ? i18n.t("queueIntegrationModal.title.edit")
              : i18n.t("queueIntegrationModal.title.add")}
          </Typography>
        </DialogTitle>
        
        <Formik
          initialValues={integration}
          enableReinitialize={true}
          validationSchema={DialogflowSchema}
          onSubmit={(values, actions, event) => {
            setTimeout(() => {
              handleSaveDialogflow(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form>
              <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                
                <Grid container spacing={3} className={classes.gridContainer}>
                  
                  {/* Coluna Esquerda */}
                  <Grid item xs={12} md={6}>
                    
                    {/* Configuração Básica */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <SettingsIcon className={classes.sectionIcon} />
                          Configuração Básica
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <FormControl
                            variant="outlined"
                            size="small"
                            className={classes.formControl}
                          >
                            <InputLabel id="type-selection-input-label">
                              {i18n.t("queueIntegrationModal.form.type")}
                            </InputLabel>
                            <Field
                              as={Select}
                              label={i18n.t("queueIntegrationModal.form.type")}
                              name="type"
                              labelId="type-selection-label"
                              error={touched.type && Boolean(errors.type)}
                              helpertext={touched.type && errors.type}
                              id="type"
                              required
                            >
                              <MenuItem value="dialogflow">DialogFlow</MenuItem>
                              <MenuItem value="n8n">N8N</MenuItem>
                              <MenuItem value="webhook">WebHooks</MenuItem>
                              <MenuItem value="typebot">Typebot</MenuItem>
                            </Field>
                          </FormControl>
                        </div>

                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("queueIntegrationModal.form.name")}
                            autoFocus
                            name="name"
                            error={touched.name && Boolean(errors.name)}
                            helpertext={touched.name && errors.name}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Configurações DialogFlow */}
                    {values.type === "dialogflow" && (
                      <Card className={classes.formSection}>
                        <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                          <Typography className={classes.sectionTitle}>
                            <LanguageIcon className={classes.sectionIcon} />
                            Configurações DialogFlow
                          </Typography>
                          
                          <div className={classes.fieldRow}>
                            <FormControl
                              variant="outlined"
                              size="small"
                              className={classes.formControl}
                            >
                              <InputLabel id="language-selection-input-label">
                                {i18n.t("queueIntegrationModal.form.language")}
                              </InputLabel>
                              <Field
                                as={Select}
                                label={i18n.t("queueIntegrationModal.form.language")}
                                name="language"
                                labelId="language-selection-label"
                                error={touched.language && Boolean(errors.language)}
                                helpertext={touched.language && errors.language}
                                id="language-selection"
                                required
                              >
                                <MenuItem value="pt-BR">Português</MenuItem>
                                <MenuItem value="en">Inglês</MenuItem>
                                <MenuItem value="es">Español</MenuItem>
                              </Field>
                            </FormControl>
                          </div>
                          
                          <div className={classes.fieldRow}>
                            <Field
                              as={TextField}
                              label={i18n.t("queueIntegrationModal.form.projectName")}
                              name="projectName"
                              error={touched.projectName && Boolean(errors.projectName)}
                              helpertext={touched.projectName && errors.projectName}
                              variant="outlined"
                              size="small"
                              className={classes.textField}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Configurações N8N/Webhook */}
                    {(values.type === "n8n" || values.type === "webhook") && (
                      <Card className={classes.formSection}>
                        <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                          <Typography className={classes.sectionTitle}>
                            <WebIcon className={classes.sectionIcon} />
                            Configurações {values.type.toUpperCase()}
                          </Typography>
                          
                          <div className={classes.fieldRow}>
                            <Field
                              as={TextField}
                              label={i18n.t("queueIntegrationModal.form.urlN8N")}
                              name="urlN8N"
                              error={touched.urlN8N && Boolean(errors.urlN8N)}
                              helpertext={touched.urlN8N && errors.urlN8N}
                              variant="outlined"
                              size="small"
                              required
                              placeholder="https://..."
                              className={classes.textField}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  </Grid>
                  
                  {/* Coluna Direita */}
                  <Grid item xs={12} md={6}>

                    {/* JSON DialogFlow */}
                    {values.type === "dialogflow" && (
                      <Card className={classes.formSection}>
                        <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                          <Typography className={classes.sectionTitle}>
                            <CodeIcon className={classes.sectionIcon} />
                            Conteúdo JSON
                          </Typography>
                          
                          <Field
                            as={TextField}
                            label={i18n.t("queueIntegrationModal.form.jsonContent")}
                            name="jsonContent"
                            error={touched.jsonContent && Boolean(errors.jsonContent)}
                            helpertext={touched.jsonContent && errors.jsonContent}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            fullWidth
                            multiline
                            rows={15}
                            placeholder="Cole aqui o conteúdo JSON do DialogFlow..."
                          />
                        </CardContent>
                      </Card>
                    )}

                    {/* Configurações Typebot */}
                    {values.type === "typebot" && (
                      <Card className={classes.formSection}>
                        <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                          <Typography className={classes.sectionTitle}>
                            <AndroidIcon className={classes.sectionIcon} />
                            Configurações Typebot
                          </Typography>
                          
                          <div className={classes.fieldRow}>
                            <Field
                              as={TextField}
                              label={i18n.t("queueIntegrationModal.form.urlN8N")}
                              name="urlN8N"
                              error={touched.urlN8N && Boolean(errors.urlN8N)}
                              helpertext={touched.urlN8N && errors.urlN8N}
                              variant="outlined"
                              size="small"
                              required
                              placeholder="https://..."
                              className={classes.textField}
                            />
                          </div>

                          <div className={classes.fieldRow}>
                            <Field
                              as={TextField}
                              label={i18n.t("queueIntegrationModal.form.typebotSlug")}
                              name="typebotSlug"
                              error={touched.typebotSlug && Boolean(errors.typebotSlug)}
                              helpertext={touched.typebotSlug && errors.typebotSlug}
                              variant="outlined"
                              size="small"
                              required
                              className={classes.textField}
                            />
                            <Field
                              as={TextField}
                              label={i18n.t("queueIntegrationModal.form.typebotExpires")}
                              name="typebotExpires"
                              type="number"
                              error={touched.typebotExpires && Boolean(errors.typebotExpires)}
                              helpertext={touched.typebotExpires && errors.typebotExpires}
                              variant="outlined"
                              size="small"
                              className={classes.textField}
                              inputProps={{ min: 1, max: 60 }}
                            />
                          </div>

                          <div className={classes.fieldRow}>
                            <Field
                              as={TextField}
                              label={i18n.t("queueIntegrationModal.form.typebotDelayMessage")}
                              name="typebotDelayMessage"
                              type="number"
                              error={touched.typebotDelayMessage && Boolean(errors.typebotDelayMessage)}
                              helpertext={touched.typebotDelayMessage && errors.typebotDelayMessage}
                              variant="outlined"
                              size="small"
                              className={classes.textField}
                              inputProps={{ min: 0, max: 10000 }}
                            />
                          </div>

                          <div className={classes.fieldRow}>
                            <Field
                              as={TextField}
                              label={i18n.t("queueIntegrationModal.form.typebotKeywordFinish")}
                              name="typebotKeywordFinish"
                              error={touched.typebotKeywordFinish && Boolean(errors.typebotKeywordFinish)}
                              helpertext={touched.typebotKeywordFinish && errors.typebotKeywordFinish}
                              variant="outlined"
                              size="small"
                              className={classes.textField}
                            />
                            <Field
                              as={TextField}
                              label={i18n.t("queueIntegrationModal.form.typebotKeywordRestart")}
                              name="typebotKeywordRestart"
                              error={touched.typebotKeywordRestart && Boolean(errors.typebotKeywordRestart)}
                              helpertext={touched.typebotKeywordRestart && errors.typebotKeywordRestart}
                              variant="outlined"
                              size="small"
                              className={classes.textField}
                            />
                          </div>

                          <div className={classes.fieldRow}>
                            <Field
                              as={TextField}
                              label={i18n.t("queueIntegrationModal.form.typebotUnknownMessage")}
                              name="typebotUnknownMessage"
                              error={touched.typebotUnknownMessage && Boolean(errors.typebotUnknownMessage)}
                              helpertext={touched.typebotUnknownMessage && errors.typebotUnknownMessage}
                              variant="outlined"
                              size="small"
                              className={classes.textField}
                            />
                          </div>

                          <div className={classes.fieldRow}>
                            <Field
                              as={TextField}
                              label={i18n.t("queueIntegrationModal.form.typebotRestartMessage")}
                              name="typebotRestartMessage"
                              error={touched.typebotRestartMessage && Boolean(errors.typebotRestartMessage)}
                              helpertext={touched.typebotRestartMessage && errors.typebotRestartMessage}
                              variant="outlined"
                              size="small"
                              className={classes.textField}
                              fullWidth
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  </Grid>
                </Grid>
                
              </DialogContent>

              <DialogActions className={classes.dialogActions}>
                {values.type === "dialogflow" && (
                  <Button
                    onClick={(e) => handleTestSession(e, values)}
                    disabled={isSubmitting}
                    variant="contained"
                    className={`${classes.testButton} ${classes.btnLeft}`}
                    startIcon={<BugReportIcon />}
                  >
                    {i18n.t("queueIntegrationModal.buttons.test")}
                  </Button>
                )}
                <Button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  variant="outlined"
                  className={classes.cancelButton}
                  startIcon={<CancelIcon />}
                >
                  {i18n.t("queueIntegrationModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  className={`${classes.saveButton} ${classes.btnWrapper}`}
                  startIcon={<SaveIcon />}
                >
                  {integrationId
                    ? i18n.t("queueIntegrationModal.buttons.okEdit")
                    : i18n.t("queueIntegrationModal.buttons.okAdd")}
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

export default QueueIntegration;