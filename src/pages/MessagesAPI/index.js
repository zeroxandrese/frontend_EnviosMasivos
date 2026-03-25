import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import { i18n } from "../../translate/i18n";
import { Button, CircularProgress, Grid, TextField, Typography, Box, Container } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";
import api from "../../services/api";
import axios from "axios";
import usePlans from "../../hooks/usePlans";
import { AuthContext } from "../../context/Auth/AuthContext";

// Modern Icons
import SettingsIcon from '@material-ui/icons/Settings';
import SendIcon from '@material-ui/icons/Send';
import MessageIcon from '@material-ui/icons/Message';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CodeIcon from '@material-ui/icons/Code';
import DescriptionIcon from '@material-ui/icons/Description';
import PublicIcon from '@material-ui/icons/Public';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet'; // Using this for API icon

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
  modernSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: "24px",
    color: "#1e293b",
    marginBottom: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  subsectionTitle: {
    fontWeight: 600,
    fontSize: "18px",
    color: "#3b82f6",
    marginBottom: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  modernTextField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
      "&.Mui-focused": {
        backgroundColor: "white",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#64748b",
      fontWeight: 500,
    },
  },
  sendButton: {
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    borderRadius: "12px",
    padding: theme.spacing(1.5, 3),
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    minHeight: "48px",
    fontSize: "14px",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
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
  textIcon: {
    backgroundColor: "#dbeafe",
    color: "#3b82f6",
  },
  mediaIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  endpointIcon: {
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
  formContainer: {
    maxWidth: "100%",
  },
  textRight: {
    textAlign: "right"
  },
  documentationBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  codeBox: {
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    borderRadius: "8px",
    padding: theme.spacing(2),
    fontFamily: "monospace",
    fontSize: "14px",
    overflow: "auto",
    marginTop: theme.spacing(2),
  },
  fileUploadBox: {
    border: "2px dashed #cbd5e1",
    borderRadius: "12px",
    padding: theme.spacing(3),
    textAlign: "center",
    backgroundColor: "#f8fafc",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#3b82f6",
      backgroundColor: "#f0f9ff",
    },
  },
  fileUploadInput: {
    display: "none",
  },
  instructionsList: {
    "& ol, & ul": {
      paddingLeft: theme.spacing(3),
    },
    "& li": {
      marginBottom: theme.spacing(1),
      color: "#475569",
    },
    "& b": {
      color: "#1e293b",
      fontWeight: 600,
    },
  },
}));

const MessagesAPI = () => {
  const classes = useStyles();
  const history = useHistory();

  const [formMessageTextData,] = useState({ token: '', number: '', body: '', userId: '', queueId: '' })
  const [formMessageMediaData,] = useState({ token: '', number: '', medias: '', body:'', userId: '', queueId: '' })
  const [file, setFile] = useState({})
  const { user } = useContext(AuthContext);

  const { getPlanCompany } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);
      if (!planConfigs.plan.useExternalApi) {
        toast.error("Esta empresa não possui permissão para acessar essa página! Estamos lhe redirecionando.");
        setTimeout(() => {
          history.push(`/`)
        }, 1000);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getEndpoint = () => {
    return process.env.REACT_APP_BACKEND_URL + '/api/messages/send'
  }

  const handleSendTextMessage = async (values) => {
    const { number, body, userId, queueId } = values;
    const data = { number, body, userId, queueId };
    try {
      await axios.request({
        url: getEndpoint(),
        method: 'POST',
        data,
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${values.token}` 
        }
      })
      toast.success('Mensagem enviada com sucesso');
    } catch (err) {
      toastError(err);
    }
  }

  const handleSendMediaMessage = async (values) => {
    try {
      const firstFile = file[0];
      const data = new FormData();
      data.append('number', values.number);
      data.append('body', values.body ? values.body: firstFile.name);
      data.append('userId', values.userId);
      data.append('queueId', values.queueId);
      data.append('medias', firstFile);
      await axios.request({
        url: getEndpoint(),
        method: 'POST',
        data,
        headers: {
          'Content-type': 'multipart/form-data',
          'Authorization': `Bearer ${values.token}`
        }
      })
      toast.success('Mensagem enviada com sucesso');
    } catch (err) {
      toastError(err);
    }
  }

  const renderFormMessageText = () => {
    return (
      <Formik
        initialValues={formMessageTextData}
        enableReinitialize={true}
        onSubmit={(values, actions) => {
          setTimeout(async () => {
            await handleSendTextMessage(values);
            actions.setSubmitting(false);
            actions.resetForm()
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form className={classes.formContainer}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.textMessage.token")}
                  name="token"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.modernTextField}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.textMessage.number")}
                  name="number"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.modernTextField}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.textMessage.body")}
                  name="body"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  multiline
                  rows={3}
                  className={classes.modernTextField}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.textMessage.userId")}
                  name="userId"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.modernTextField}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.textMessage.queueId")}
                  name="queueId"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.modernTextField}
                />
              </Grid>
              <Grid item xs={12} className={classes.textRight}>
                <Button
                  type="submit"
                  className={classes.sendButton}
                  startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    )
  }

  const renderFormMessageMedia = () => {
    return (
      <Formik
        initialValues={formMessageMediaData}
        enableReinitialize={true}
        onSubmit={(values, actions) => {
          setTimeout(async () => {
            await handleSendMediaMessage(values);
            actions.setSubmitting(false);
            actions.resetForm()
            document.getElementById('medias').files = null
            document.getElementById('medias').value = null
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form className={classes.formContainer}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.mediaMessage.token")}
                  name="token"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.modernTextField}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.mediaMessage.number")}
                  name="number"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.modernTextField}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.textMessage.body")}
                  name="body"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  multiline
                  rows={3}
                  className={classes.modernTextField}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.textMessage.userId")}
                  name="userId"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.modernTextField}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  as={TextField}
                  label={i18n.t("messagesAPI.textMessage.queueId")}
                  name="queueId"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  className={classes.modernTextField}
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="medias">
                  <input
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    className={classes.fileUploadInput}
                    id="medias"
                    type="file"
                    required 
                    onChange={(e) => setFile(e.target.files)}
                  />
                  <Box className={classes.fileUploadBox}>
                    <CloudUploadIcon style={{ fontSize: 40, color: "#64748b", marginBottom: 8 }} />
                    <Typography variant="h6" color="textPrimary">
                      Seleccionar archivo
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Haga clic para elegir imagen, vídeo, audio o documento.
                    </Typography>
                  </Box>
                </label>
              </Grid>
              <Grid item xs={12} className={classes.textRight}>
                <Button
                  type="submit"
                  className={classes.sendButton}
                  startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar com Mídia'}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    )
  }

  return (
    <div className={classes.mainContainer}>
      <Container maxWidth="xl">
        
        {/* Header Modernizado */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <SettingsEthernetIcon className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                {i18n.t("messagesAPI.API.title")}
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Interfaz para enviar mensajes a través de API REST
              </Typography>
            </div>
          </div>
        </Box>

        {/* Cards de Estatísticas */}
        <Box className={classes.statsGrid}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.textIcon}`}>
                <MessageIcon />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Mensagens de Texto
                </Typography>
                <Typography className={classes.statValue}>
                  POST
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.mediaIcon}`}>
                <AttachFileIcon />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Mensajería con los medios
                </Typography>
                <Typography className={classes.statValue}>
                  POST
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.endpointIcon}`}>
                <PublicIcon />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Endpoint Único
                </Typography>
                <Typography className={classes.statValue}>
                  /send
                </Typography>
              </div>
            </div>
          </div>
        </Box>

        {/* Seção de Métodos */}
        <Paper className={classes.modernSection} elevation={0}>
          <Typography className={classes.sectionTitle}>
            <CodeIcon />
            {i18n.t("messagesAPI.API.methods.title")}
          </Typography>
          
          <div className={classes.instructionsList}>
            <ol>
              <li>{i18n.t("messagesAPI.API.methods.messagesText")}</li>
              <li>{i18n.t("messagesAPI.API.methods.messagesMidia")}</li>
            </ol>
          </div>
        </Paper>

        {/* Seção de Instruções */}
        <Paper className={classes.modernSection} elevation={0}>
          <Typography className={classes.sectionTitle}>
            <DescriptionIcon />
            {i18n.t("messagesAPI.API.instructions.title")}
          </Typography>
          
          <div className={classes.instructionsList}>
            <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 16 }}>
              {i18n.t("messagesAPI.API.instructions.comments")}
            </Typography>
            <ul>
              <li>{i18n.t("messagesAPI.API.instructions.comments1")}</li>
              <li>
                {i18n.t("messagesAPI.API.instructions.comments2")}
                <ul>
                  <li>{i18n.t("messagesAPI.API.instructions.codeCountry")}</li>
                  <li>{i18n.t("messagesAPI.API.instructions.code")}</li>
                  <li>{i18n.t("messagesAPI.API.instructions.number")}</li>
                </ul>
              </li>
            </ul>
          </div>
        </Paper>

        {/* Seção de Mensagens de Texto */}
        <Paper className={classes.modernSection} elevation={0}>
          <Typography className={classes.sectionTitle}>
            <MessageIcon />
            {i18n.t("messagesAPI.API.text.title")}
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} lg={6}>
              <div className={classes.documentationBox}>
                <Typography variant="body1" paragraph>
                  {i18n.t("messagesAPI.API.text.instructions")}
                </Typography>
                
                <Typography variant="body2" component="div" style={{ marginBottom: 16 }}>
                  <b>Endpoint:</b> {getEndpoint()}<br />
                  <b>Método:</b> POST<br />
                  <b>Headers:</b> Authorization Bearer (token registrado) e Content-Type (application/json)
                </Typography>

                <Typography variant="body2" style={{ fontWeight: 600, marginBottom: 8 }}>
                  Exemplo de Body:
                </Typography>
                
                <div className={classes.codeBox}>
{`{
  "number": "558599999999",
  "body": "Message",
  "userId": "ID usuário",
  "queueId": "ID Fila",
  "sendSignature": "true/false"
}`}
                </div>
              </div>
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <Typography className={classes.subsectionTitle}>
                <SendIcon />
                Teste de Envio
              </Typography>
              {renderFormMessageText()}
            </Grid>
          </Grid>
        </Paper>

        {/* Seção de Mensagens com Mídia */}
        <Paper className={classes.modernSection} elevation={0}>
          <Typography className={classes.sectionTitle}>
            <AttachFileIcon />
            {i18n.t("messagesAPI.API.media.title")}
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} lg={6}>
              <div className={classes.documentationBox}>
                <Typography variant="body1" paragraph>
                  {i18n.t("messagesAPI.API.media.instructions")}
                </Typography>
                
                <Typography variant="body2" component="div" style={{ marginBottom: 16 }}>
                  <b>Endpoint:</b> {getEndpoint()}<br />
                  <b>Método:</b> POST<br />
                  <b>Headers:</b> Authorization Bearer (token cadastrado) e Content-Type (multipart/form-data)
                </Typography>

                <Typography variant="body2" style={{ fontWeight: 600, marginBottom: 8 }}>
                  Parámetros FormData:
                </Typography>
                
                <div className={classes.instructionsList}>
                  <ul>
                    <li><b>number:</b> 558599999999</li>
                    <li><b>body:</b> Message</li>
                    <li><b>userId:</b> ID usuário</li>
                    <li><b>queueId:</b> ID da fila</li>
                    <li><b>medias:</b> archivo</li>
                    <li><b>sendSignature:</b> Assinar mensagem true/false</li>
                  </ul>
                </div>
              </div>
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <Typography className={classes.subsectionTitle}>
                <AttachFileIcon />
                Teste de Envio
              </Typography>
              {renderFormMessageMedia()}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default MessagesAPI;