import React, { useState, useEffect } from "react";

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
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { i18n } from "../../translate/i18n";
import { MenuItem, FormControl, InputLabel, Select } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { InputAdornment, IconButton } from "@material-ui/core";
import QueueSelectSingle from "../../components/QueueSelectSingle";

// Icons
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import PersonIcon from "@material-ui/icons/Person";
import SecurityIcon from "@material-ui/icons/Security";
import MessageIcon from "@material-ui/icons/Message";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import SettingsIcon from "@material-ui/icons/Settings";
import WorkIcon from "@material-ui/icons/Work";

import api from "../../services/api";
import toastError from "../../errors/toastError";

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
	
	// Queue Select Wrapper
	queueSelectWrapper: {
		marginBottom: theme.spacing(1.5),
		"& .MuiFormControl-root": {
			marginBottom: 0,
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
	
	colorAdorment: {
		width: 20,
		height: 20,
	},
}));

const PromptSchema = Yup.object().shape({
  name: Yup.string().min(5, "Muito curto!").max(100, "Muito longo!").required("Obrigatório"),
  prompt: Yup.string().min(50, "Muito curto!").required("Descreva o treinamento para Inteligência Artificial"),
  voice: Yup.string().required("Informe o modo para Voz"),
  max_tokens: Yup.number().required("Informe o número máximo de tokens"),
  temperature: Yup.number().required("Informe a temperatura"),
  apikey: Yup.string().required("Informe a API Key"),
  queueId: Yup.number().required("Informe a fila"),
  max_messages: Yup.number().required("Informe o número máximo de mensagens")
});

const PromptModal = ({ open, onClose, promptId }) => {
  const classes = useStyles();
  const [selectedVoice, setSelectedVoice] = useState("texto");
  const [showApiKey, setShowApiKey] = useState(false);

  const handleToggleApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const initialState = {
    name: "",
    prompt: "",
    voice: "texto",
    voiceKey: "",
    voiceRegion: "",
    maxTokens: 100,
    temperature: 1,
    apiKey: "",
    queueId: null,
    maxMessages: 10
  };

  const [prompt, setPrompt] = useState(initialState);

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!promptId) {
        setPrompt(initialState);
        return;
      }
      try {
        const { data } = await api.get(`/prompt/${promptId}`);
        setPrompt(prevState => {
          return { ...prevState, ...data };
        });
        setSelectedVoice(data.voice);
      } catch (err) {
        toastError(err);
      }
    };

    fetchPrompt();
  }, [promptId, open]);

  const handleClose = () => {
    setPrompt(initialState);
    setSelectedVoice("texto");
    onClose();
  };

  const handleChangeVoice = (e) => {
    setSelectedVoice(e.target.value);
  };

  const handleSavePrompt = async values => {
    const promptData = { ...values, voice: selectedVoice };
    if (!values.queueId) {
      toastError("Informe o setor");
      return;
    }
    try {
      if (promptId) {
        await api.put(`/prompt/${promptId}`, promptData);
      } else {
        await api.post("/prompt", promptData);
      }
      toast.success(i18n.t("promptModal.success"));
    } catch (err) {
      toastError(err);
    }
    handleClose();
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
            <PersonIcon className={classes.titleIcon} />
            {promptId
              ? `${i18n.t("promptModal.title.edit")}`
              : `${i18n.t("promptModal.title.add")}`}
          </Typography>
        </DialogTitle>
        
        <Formik
          initialValues={prompt}
          enableReinitialize={true}
          validationSchema={PromptSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSavePrompt(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values }) => (
            <Form style={{ width: "100%" }}>
              <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                
                <Grid container spacing={3} className={classes.gridContainer}>
                  
                  {/* Coluna Esquerda */}
                  <Grid item xs={12} md={6}>
                    
                    {/* Informações Básicas */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <PersonIcon className={classes.sectionIcon} />
                          Informações Básicas
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("promptModal.form.name")}
                            name="name"
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            fullWidth
                          />
                        </div>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("promptModal.form.apikey")}
                            name="apiKey"
                            type={showApiKey ? 'text' : 'password'}
                            error={touched.apiKey && Boolean(errors.apiKey)}
                            helperText={touched.apiKey && errors.apiKey}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={handleToggleApiKey} size="small">
                                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Configurações de Voz */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <VolumeUpIcon className={classes.sectionIcon} />
                          Configurações de Voz
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <FormControl 
                            variant="outlined" 
                            size="small" 
                            fullWidth 
                            className={classes.formControl}
                          >
                            <InputLabel>{i18n.t("promptModal.form.voice")}</InputLabel>
                            <Select
                              id="type-select"
                              name="voice"
                              value={selectedVoice}
                              onChange={handleChangeVoice}
                              label={i18n.t("promptModal.form.voice")}
                              multiple={false}
                            >
                              <MenuItem key={"texto"} value={"texto"}>
                                Texto
                              </MenuItem>
                              <MenuItem key={"pt-BR-FranciscaNeural"} value={"pt-BR-FranciscaNeural"}>
                                Francisa
                              </MenuItem>
                              <MenuItem key={"pt-BR-AntonioNeural"} value={"pt-BR-AntonioNeural"}>
                                Antônio
                              </MenuItem>
                              <MenuItem key={"pt-BR-BrendaNeural"} value={"pt-BR-BrendaNeural"}>
                                Brenda
                              </MenuItem>
                              <MenuItem key={"pt-BR-DonatoNeural"} value={"pt-BR-DonatoNeural"}>
                                Donato
                              </MenuItem>
                              <MenuItem key={"pt-BR-ElzaNeural"} value={"pt-BR-ElzaNeural"}>
                                Elza
                              </MenuItem>
                              <MenuItem key={"pt-BR-FabioNeural"} value={"pt-BR-FabioNeural"}>
                                Fábio
                              </MenuItem>
                              <MenuItem key={"pt-BR-GiovannaNeural"} value={"pt-BR-GiovannaNeural"}>
                                Giovanna
                              </MenuItem>
                              <MenuItem key={"pt-BR-HumbertoNeural"} value={"pt-BR-HumbertoNeural"}>
                                Humberto
                              </MenuItem>
                              <MenuItem key={"pt-BR-JulioNeural"} value={"pt-BR-JulioNeural"}>
                                Julio
                              </MenuItem>
                              <MenuItem key={"pt-BR-LeilaNeural"} value={"pt-BR-LeilaNeural"}>
                                Leila
                              </MenuItem>
                              <MenuItem key={"pt-BR-LeticiaNeural"} value={"pt-BR-LeticiaNeural"}>
                                Letícia
                              </MenuItem>
                              <MenuItem key={"pt-BR-ManuelaNeural"} value={"pt-BR-ManuelaNeural"}>
                                Manuela
                              </MenuItem>
                              <MenuItem key={"pt-BR-NicolauNeural"} value={"pt-BR-NicolauNeural"}>
                                Nicolau
                              </MenuItem>
                              <MenuItem key={"pt-BR-ValerioNeural"} value={"pt-BR-ValerioNeural"}>
                                Valério
                              </MenuItem>
                              <MenuItem key={"pt-BR-YaraNeural"} value={"pt-BR-YaraNeural"}>
                                Yara
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("promptModal.form.voiceKey")}
                            name="voiceKey"
                            error={touched.voiceKey && Boolean(errors.voiceKey)}
                            helperText={touched.voiceKey && errors.voiceKey}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            fullWidth
                          />
                        </div>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("promptModal.form.voiceRegion")}
                            name="voiceRegion"
                            error={touched.voiceRegion && Boolean(errors.voiceRegion)}
                            helperText={touched.voiceRegion && errors.voiceRegion}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            fullWidth
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Fila */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <WorkIcon className={classes.sectionIcon} />
                          Fila de Atendimento
                        </Typography>
                        
                        <Box className={classes.queueSelectWrapper}>
                          <QueueSelectSingle />
                        </Box>
                      </CardContent>
                    </Card>

                  </Grid>
                  
                  {/* Coluna Direita */}
                  <Grid item xs={12} md={6}>
                    
                    {/* Configuração do Prompt */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <MessageIcon className={classes.sectionIcon} />
                          Configuração do Prompt
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("promptModal.form.prompt")}
                            name="prompt"
                            error={touched.prompt && Boolean(errors.prompt)}
                            helperText={touched.prompt && errors.prompt}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            fullWidth
                            rows={10}
                            multiline={true}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Parâmetros Avançados */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <SettingsIcon className={classes.sectionIcon} />
                          Parâmetros Avançados
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("promptModal.form.temperature")}
                            name="temperature"
                            error={touched.temperature && Boolean(errors.temperature)}
                            helperText={touched.temperature && errors.temperature}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                          />
                          <Field
                            as={TextField}
                            label={i18n.t("promptModal.form.max_tokens")}
                            name="maxTokens"
                            error={touched.maxTokens && Boolean(errors.maxTokens)}
                            helperText={touched.maxTokens && errors.maxTokens}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                          />
                        </div>
                        
                        <div className={classes.fieldRow}>
                          <Field
                            as={TextField}
                            label={i18n.t("promptModal.form.max_messages")}
                            name="maxMessages"
                            error={touched.maxMessages && Boolean(errors.maxMessages)}
                            helperText={touched.maxMessages && errors.maxMessages}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            fullWidth
                          />
                        </div>
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
                  {i18n.t("promptModal.buttons.cancel")}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  className={`${classes.saveButton} ${classes.btnWrapper}`}
                  startIcon={<SaveIcon />}
                >
                  {promptId
                    ? `${i18n.t("promptModal.buttons.okEdit")}`
                    : `${i18n.t("promptModal.buttons.okAdd")}`}
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

export default PromptModal;