import React, { useEffect, useState, useContext } from "react";
import QRCode from "qrcode.react";
import toastError from "../../errors/toastError";
import { makeStyles } from "@material-ui/core/styles";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  Paper, 
  Typography, 
  Box,
  Grid,
  Card,
  CardContent,
  Link
} from "@material-ui/core";

// Icons
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import PhoneAndroidIcon from "@material-ui/icons/PhoneAndroid";
import SettingsIcon from "@material-ui/icons/Settings";
import QueueIcon from "@material-ui/icons/Queue";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import { socketConnection } from "../../services/socket";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
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
  
  // Header Modernizado
  dialogTitle: {
    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
    color: "white",
    padding: theme.spacing(3),
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    "&:before": {
      content: '""',
      position: "absolute",
      top: "-50%",
      right: "-10%",
      width: "80px",
      height: "80px",
      background: "rgba(255,255,255,0.08)",
      borderRadius: "50%",
      transform: "scale(2.5)",
    },
  },
  
  titleText: {
    fontWeight: 700,
    fontSize: "24px",
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      fontSize: "20px",
      flexDirection: "column",
      gap: theme.spacing(1),
    },
  },
  
  titleIcon: {
    fontSize: "32px",
  },
  
  subtitle: {
    position: "relative",
    zIndex: 1,
    fontSize: "16px",
    opacity: 0.9,
    marginTop: theme.spacing(1),
    fontWeight: 400,
    [theme.breakpoints.down('sm')]: {
      fontSize: "14px",
    },
  },
  
  // Content Responsivo
  dialogContent: {
    padding: theme.spacing(3),
    backgroundColor: "#f8fafc",
    maxHeight: "calc(90vh - 180px)",
    overflowY: "auto",
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      maxHeight: "calc(100vh - 160px)",
    },
  },
  
  // QR Code Section
  qrSection: {
    background: "white",
    borderRadius: "16px",
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      minHeight: "250px",
    },
  },
  
  qrCodeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  
  loadingText: {
    color: "#64748b",
    fontSize: "16px",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  
  // Instructions Section
  instructionsSection: {
    background: "white",
    borderRadius: "16px",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  },
  
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(3),
    color: "#1e293b",
    fontWeight: 700,
    fontSize: "18px",
    gap: theme.spacing(1),
  },
  
  sectionIcon: {
    color: "#64748b",
    fontSize: "20px",
  },
  
  // Steps
  stepsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  
  stepItem: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f1f5f9",
      transform: "translateX(4px)",
    },
  },
  
  stepNumber: {
    backgroundColor: "#25D366",
    color: "white",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
    marginRight: theme.spacing(2),
    flexShrink: 0,
    marginTop: "2px",
  },
  
  stepText: {
    color: "#1e293b",
    fontSize: "15px",
    fontWeight: 500,
    lineHeight: 1.5,
    flex: 1,
  },
  
  stepImages: {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
  },
  
  stepImageAndroid: {
    width: "16px",
    height: "auto",
    verticalAlign: "middle",
  },
  
  stepImageIOS: {
    width: "20px",
    height: "auto",
    verticalAlign: "middle",
  },
  
  // Help Section
  helpSection: {
    background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)",
    borderRadius: "12px",
    padding: theme.spacing(2.5),
    border: "1px solid #bfdbfe",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  
  helpIcon: {
    color: "#3b82f6",
    fontSize: "24px",
  },
  
  helpText: {
    flex: 1,
  },
  
  helpTitle: {
    color: "#1e293b",
    fontWeight: 600,
    fontSize: "14px",
    marginBottom: theme.spacing(0.5),
  },
  
  helpLink: {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "14px",
    "&:hover": {
      textDecoration: "underline",
    },
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

const QrcodeModal = ({ open, onClose, whatsAppId }) => {
  const [qrCode, setQrCode] = useState("");
  const { user } = useContext(AuthContext);
  const classes = useStyles();

  useEffect(() => {
    const fetchSession = async () => {
      if (!whatsAppId) return;

      try {
        const { data } = await api.get(`/whatsapp/${whatsAppId}`);
        setQrCode(data.qrcode);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, [whatsAppId]);

  useEffect(() => {
    if (!whatsAppId) return;
    const companyId = user.companyId;
    const socket = socketConnection({ companyId, userId: user.id });

    socket.on(`company-${companyId}-whatsappSession`, (data) => {
      if (data.action === "update" && data.session.id === whatsAppId) {
        setQrCode(data.session.qrcode);
      }

      if (data.action === "update" && data.session.qrcode === "") {
        onClose();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [whatsAppId, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      scroll="paper"
      PaperProps={{
        className: classes.dialogPaper
      }}
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        <Typography className={classes.titleText}>
          <WhatsAppIcon className={classes.titleIcon} />
          <Box>
            Conectar WhatsApp
            <Typography className={classes.subtitle}>
              Conecta tu WhatsApp de forma segura.
            </Typography>
          </Box>
        </Typography>
      </DialogTitle>
      
      <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
        
        <Grid container spacing={3}>
          
          {/* QR Code Section */}
          <Grid item xs={12} md={6}>
            <Card className={classes.qrSection} elevation={0}>
              <div className={classes.qrCodeContainer}>
                {qrCode ? (
                  <>
                    <QRCode 
                      value={qrCode} 
                      size={220}
                      style={{
                        padding: "16px",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                      }}
                    />
                    <Typography 
                      variant="body2" 
                      style={{ 
                        color: "#64748b", 
                        fontWeight: 500,
                        textAlign: "center" 
                      }}
                    >
                      Aponte a câmera do seu celular para o QR Code
                    </Typography>
                  </>
                ) : (
                  <Typography className={classes.loadingText}>
                    <QueueIcon />
                    Aguardando QR Code...
                  </Typography>
                )}
              </div>
            </Card>
          </Grid>
          
          {/* Instructions Section */}
          <Grid item xs={12} md={6}>
            <Card className={classes.instructionsSection} elevation={0}>
              <Typography className={classes.sectionTitle}>
                <PhoneAndroidIcon className={classes.sectionIcon} />
                Como Conectar
              </Typography>
              
              <ul className={classes.stepsList}>
                <li className={classes.stepItem}>
                  <div className={classes.stepNumber}>1</div>
                  <div className={classes.stepText}>
                    Abra o WhatsApp no seu celular
                  </div>
                </li>
                
                <li className={classes.stepItem}>
                  <div className={classes.stepNumber}>2</div>
                  <div className={classes.stepText}>
                    Toque em Mais opções no Android
                    <span className={classes.stepImages}>
                      <img 
                        src={require("../../components/QrcodeModal/img/WconfAndroid.png")} 
                        alt="Android" 
                        className={classes.stepImageAndroid} 
                      />
                    </span>
                    {" "}o en Configuración
                    <span className={classes.stepImages}>
                      <img 
                        src={require("../../components/QrcodeModal/img/WconfIos.png")} 
                        alt="iPhone" 
                        className={classes.stepImageIOS} 
                      />
                    </span>
                    {" "}no iPhone
                  </div>
                </li>
                
                <li className={classes.stepItem}>
                  <div className={classes.stepNumber}>3</div>
                  <div className={classes.stepText}>
                    Pulsa en <strong>Dispositivos conectados</strong> y luego en <strong>Conectar dispositivo</strong>
                  </div>
                </li>
                
                <li className={classes.stepItem}>
                  <div className={classes.stepNumber}>4</div>
                  <div className={classes.stepText}>
                    Apunta tu teléfono al código QR que aparece junto a este texto para conectarte.
                  </div>
                </li>
              </ul>
            </Card>
            
            {/* Help Section */}
            <Box className={classes.helpSection}>
              <HelpOutlineIcon className={classes.helpIcon} />
              <div className={classes.helpText}>
                <Typography className={classes.helpTitle}>
                  ¿Necesitar ayuda?
                </Typography>
                <Link 
                  href="https://faq.whatsapp.com/1317564962315842/?cms_platform=web" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={classes.helpLink}
                >
                  Consulta la guía oficial de WhatsApp.
                </Link>
              </div>
            </Box>
          </Grid>
          
        </Grid>
        
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(QrcodeModal);