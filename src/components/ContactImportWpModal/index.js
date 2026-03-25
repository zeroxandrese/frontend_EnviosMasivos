import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogActions, 
  DialogContent,
  Button, 
  Box, 
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// Icons que EXISTEM no Material-UI v4
import GetAppIcon from '@material-ui/icons/GetApp';
import PublishIcon from '@material-ui/icons/Publish';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import DescriptionIcon from '@material-ui/icons/Description';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloseIcon from '@material-ui/icons/Close';

import { i18n } from '../../translate/i18n';
import api from "../../services/api";
import * as XLSX from "xlsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  
  // Dialog Responsivo
  dialogPaper: {
    borderRadius: "20px",
    maxWidth: "700px",
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
  
  // Header Elegante
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
  
  // Content
  dialogContent: {
    padding: theme.spacing(3),
    backgroundColor: "#f8fafc",
    minHeight: "400px",
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  
  // Seções em Cards
  formSection: {
    background: "white",
    borderRadius: "12px",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },
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
  
  // Botões com Gradientes
  exportButton: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "8px",
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(1.5),
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      transform: "translateY(-1px)",
    },
  },
  
  downloadModelButton: {
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "8px",
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(2),
    boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
      transform: "translateY(-1px)",
    },
  },
  
  // Upload Area
  uploadArea: {
    border: "2px dashed #cbd5e1",
    borderRadius: "12px",
    padding: theme.spacing(3),
    textAlign: "center",
    background: "#f8fafc",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      borderColor: "#3b82f6",
      backgroundColor: "#f0f9ff",
      transform: "translateY(-2px)",
    },
    "&:before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "100px",
      height: "100px",
      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))",
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 0,
    },
  },
  
  uploadIcon: {
    fontSize: "48px",
    color: "#64748b",
    marginBottom: theme.spacing(1),
    position: "relative",
    zIndex: 1,
  },
  
  uploadText: {
    color: "#374151",
    fontWeight: 600,
    fontSize: "16px",
    position: "relative",
    zIndex: 1,
  },
  
  uploadSubtext: {
    color: "#64748b",
    fontSize: "14px",
    marginTop: theme.spacing(0.5),
    position: "relative",
    zIndex: 1,
  },
  
  uploadInput: {
    display: "none",
  },
  
  // Progress Section
  progressSection: {
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    borderRadius: "12px",
    padding: theme.spacing(3),
    border: "1px solid #bae6fd",
  },
  
  progressTitle: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    color: "#0369a1",
    fontWeight: 700,
    fontSize: "16px",
  },
  
  statusMessage: {
    color: "#0369a1",
    fontWeight: 500,
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
  
  currentContactCard: {
    background: "white",
    borderRadius: "8px",
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  
  contactInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5),
  },
  
  contactName: {
    fontWeight: 600,
    color: "#1e293b",
  },
  
  contactNumber: {
    color: "#64748b",
    fontSize: "14px",
  },
  
  statusIcon: {
    fontSize: "24px",
  },
  
  successIcon: {
    color: "#059669",
  },
  
  errorIcon: {
    color: "#dc2626",
  },
  
  // Actions
  dialogActions: {
    padding: theme.spacing(2, 3),
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
    justifyContent: "center",
  },
  
  closeButton: {
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
  
  // Button Groups
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  },
}));

const ContactImportWpModal = ({ isOpen, handleClose, selectedTags, hideNum, userProfile }) => {
  const classes = useStyles();

  const initialContact = { name: "", number: "", error: "" }

  const [contactsToImport, setContactsToImport] = useState([])
  const [statusMessage, setStatusMessage] = useState("")
  const [currentContact, setCurrentContact] = useState(initialContact)

  const handleClosed = () => {
    setContactsToImport([])
    setStatusMessage("")
    setCurrentContact(initialContact)
    handleClose()
  }

  useEffect(() => {
    if (contactsToImport?.length) {
      contactsToImport.map(async (item, index) => {
        setTimeout(async () => {
          try {
            if (index >= contactsToImport?.length - 1) {
              setStatusMessage(`Importação concluída com sucesso!`)
              setContactsToImport([])
              setCurrentContact(initialContact)

              setTimeout(() => {
                handleClosed()
              }, 15000);
            }
            if (index % 5 === 0) {
              setStatusMessage(`Importação em andamento ${index} de ${contactsToImport?.length} - não saia desta tela até concluir`)
            }
            await api.post(`/contactsImport`, {
              name: item.name,
              number: item.number.toString(),
              email: item.email,
            });

            setCurrentContact({ name: item.name, number: item.number, error: "success" })
          } catch (err) {
            setCurrentContact({ name: item.name, number: item.number, error: err })
          }
        }, 330 * index);
      });
    }
  }, [contactsToImport]);

  const handleOnExportContacts = async (model = false) => {
    const allDatas = [];

    let i = 1;
    if (!model) {
      while (i !== 0) {
        const { data } = await api.get("/contacts/", {
          params: { searchParam: "", pageNumber: i, contactTag: JSON.stringify(selectedTags)},
        });
        data.contacts.forEach((element) => {
          const tagsContact = element.tags.map(tag => tag.name).join(', ');
          const contactWithTags = { ...element, tags: tagsContact };
          allDatas.push(contactWithTags);
        });

        const pages = data?.count / 20;
        i++;
        if (i > pages) {
          i = 0;
        }
      }
    } else {
      allDatas.push({
        name: "João",
        number: "5547989845213",
        email: "joao@possoatender.com",
      });
    }
    
    const exportData = allDatas.map((e) => {
      return { 
        name: e.name, 
        number: (hideNum && userProfile === "user" ? e.isGroup ? e.number : e.number.slice(0,-6)+"**-**"+ e.number.slice(-2): e.number), 
        email: e.email, 
        tags: e.tags 
      };
    });
    
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "Contatos");
    XLSX.writeFile(wb, "backup_contatos.xlsx");
  };

  const handleImportChange = (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setContactsToImport(data)
    };
    reader.readAsBinaryString(file);
  };

  const progress = contactsToImport.length > 0 ? 
    ((contactsToImport.length - contactsToImport.length) / contactsToImport.length) * 100 : 0;

  return (
    <Dialog 
      fullWidth 
      open={isOpen} 
      onClose={handleClosed}
      maxWidth={false}
      PaperProps={{
        className: classes.dialogPaper
      }}
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        <Typography className={classes.titleText}>
          <ImportExportIcon className={classes.titleIcon} />
          {i18n.t("Exportar / Importar contatos")}
        </Typography>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        
        {/* Seção de Exportação */}
        {!contactsToImport?.length && (
          <Card className={classes.formSection}>
            <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
              <Typography className={classes.sectionTitle}>
                <GetAppIcon className={classes.sectionIcon} />
                Exportar Contactos
              </Typography>
              
              <Box className={classes.buttonGroup}>
                <Button
                  fullWidth
                  variant="contained"
                  className={classes.exportButton}
                  startIcon={<CloudDownloadIcon />}
                  onClick={() => handleOnExportContacts(false)}
                >
                  {i18n.t("contactImportWpModal.title")}
                </Button>
                
                <Button
                  fullWidth
                  variant="contained"
                  className={classes.downloadModelButton}
                  startIcon={<DescriptionIcon />}
                  onClick={() => handleOnExportContacts(true)}
                >
                  {i18n.t("contactImportWpModal.buttons.downloadModel")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Seção de Importação */}
        {!contactsToImport?.length ? (
          <Card className={classes.formSection}>
            <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
              <Typography className={classes.sectionTitle}>
                <PublishIcon className={classes.sectionIcon} />
                Importar Contactos
              </Typography>
              
              <label htmlFor="contacts" className={classes.uploadArea}>
                <input 
                  className={classes.uploadInput} 
                  name='contacts' 
                  id='contacts' 
                  type="file" 
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleImportChange}
                />
                <AttachFileIcon className={classes.uploadIcon} />
                <Typography className={classes.uploadText}>
                  {i18n.t("contactImportWpModal.buttons.import")}
                </Typography>
                <Typography className={classes.uploadSubtext}>
                  Haga clic aquí o arrastre su archivo de Excel
                </Typography>
              </label>
            </CardContent>
          </Card>
        ) : (
          // Seção de Progresso
          <Card className={classes.progressSection}>
            <Typography className={classes.progressTitle}>
              <PublishIcon />
              Importación en curso
            </Typography>
            
            <Typography className={classes.statusMessage}>
              {statusMessage}
            </Typography>
            
            {currentContact?.name && (
              <Box className={classes.currentContactCard}>
                <Box className={classes.contactInfo}>
                  <Typography className={classes.contactName}>
                    {currentContact.name}
                  </Typography>
                  <Typography className={classes.contactNumber}>
                    {currentContact.number}
                  </Typography>
                </Box>
                
                {currentContact.error === "success" ? (
                  <CheckCircleIcon className={`${classes.statusIcon} ${classes.successIcon}`} />
                ) : (
                  <ErrorIcon className={`${classes.statusIcon} ${classes.errorIcon}`} />
                )}
              </Box>
            )}
          </Card>
        )}
        
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button 
          onClick={handleClosed} 
          variant="outlined"
          className={classes.closeButton}
          startIcon={<CloseIcon />}
        >
          {i18n.t("contactImportWpModal.buttons.closed")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContactImportWpModal;