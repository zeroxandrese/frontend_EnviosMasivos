import React, { useState, useEffect, useContext } from "react";

import * as Yup from "yup";
import {
    Formik,
    Form,
    Field,
    FieldArray
} from "formik";
import { toast } from "react-toastify";

import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    makeStyles,
    TextField,
    Typography,
    Card,
    CardContent
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import FolderIcon from "@material-ui/icons/Folder";
import MessageIcon from "@material-ui/icons/Message";
import ListIcon from "@material-ui/icons/List";
import AddIcon from "@material-ui/icons/Add";

import { green } from "@material-ui/core/colors";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles(theme => ({
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
    
    // File Options Styling
    fileOptionItem: {
        background: "#f8fafc",
        borderRadius: "8px",
        padding: theme.spacing(2),
        marginBottom: theme.spacing(1),
        border: "1px solid #e2e8f0",
        transition: "all 0.3s ease",
        "&:hover": {
            borderColor: "#cbd5e1",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        },
    },
    
    fileNameDisplay: {
        fontSize: "12px",
        color: "#64748b",
        fontStyle: "italic",
        marginTop: theme.spacing(0.5),
        padding: theme.spacing(0.5, 1),
        backgroundColor: "#f1f5f9",
        borderRadius: "4px",
        border: "1px solid #e2e8f0",
        minHeight: "24px",
        display: "flex",
        alignItems: "center",
    },
    
    attachButton: {
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "white",
        borderRadius: "8px",
        minWidth: "40px",
        height: "40px",
        boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            transform: "translateY(-1px)",
        },
    },
    
    deleteButton: {
        color: "#dc2626",
        borderRadius: "8px",
        minWidth: "40px",
        height: "40px",
        transition: "all 0.3s ease",
        "&:hover": {
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
        },
    },
    
    addOptionButton: {
        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        borderRadius: "8px",
        padding: theme.spacing(1.5, 3),
        marginTop: theme.spacing(2),
        boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
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
    extraAttr: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 2000,
    },
    colorAdorment: {
        width: 20,
        height: 20,
    },
}));

const FileListSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "nome muito curto")
        .required("Obrigatório"),
    message: Yup.string()
        .required("Obrigatório")
});

const FilesModal = ({ open, onClose, fileListId, reload }) => {
    const classes = useStyles();
    const { user } = useContext(AuthContext);
    const [ files, setFiles ] = useState([]);
    const [selectedFileNames, setSelectedFileNames] = useState([]);

    const initialState = {
        name: "",
        message: "",
        options: [{ name: "", path:"", mediaType:"" }],
    };

    const [fileList, setFileList] = useState(initialState);

    useEffect(() => {
        try {
            (async () => {
                if (!fileListId) return;

                const { data } = await api.get(`/files/${fileListId}`);
                setFileList(data);
            })()
        } catch (err) {
            toastError(err);
        }
    }, [fileListId, open]);

    const handleClose = () => {
        setFileList(initialState);
        setFiles([]);
        onClose();
    };

    const handleSaveFileList = async (values) => {

        const uploadFiles = async (options, filesOptions, id) => {
                const formData = new FormData();
                formData.append("fileId", id);
                formData.append("typeArch", "fileList")
                filesOptions.forEach((fileOption, index) => {
                    if (fileOption.file) {
                        formData.append("files", fileOption.file);
                        formData.append("mediaType", fileOption.file.type)
                        formData.append("name", options[index].name);
                        formData.append("id", options[index].id);
                    }
                });
      
              try {
                const { data } = await api.post(`/files/uploadList/${id}`, formData);
                setFiles([]);
                return data;
              } catch (err) {
                toastError(err);
              }
            return null;
        }

        const fileData = { ...values, userId: user.id };
        
        try {
            if (fileListId) {
                const { data } = await api.put(`/files/${fileListId}`, fileData)
                if (data.options.length > 0)
            
                    uploadFiles(data.options, values.options, fileListId)
            } else {
                const { data } = await api.post("/files", fileData);
                if (data.options.length > 0)
                    uploadFiles(data.options, values.options, data.id)
            }
            toast.success(i18n.t("fileModal.success"));
            if (typeof reload == 'function') {
                reload();
            }            
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
                        <FolderIcon className={classes.titleIcon} />
                        {(fileListId ? `${i18n.t("fileModal.title.edit")}` : `${i18n.t("fileModal.title.add")}`)}
                    </Typography>
                </DialogTitle>
                
                <Formik
                    initialValues={fileList}
                    enableReinitialize={true}
                    validationSchema={FileListSchema}
                    onSubmit={(values, actions) => {
                        setTimeout(() => {
                            handleSaveFileList(values);
                            actions.setSubmitting(false);
                        }, 400);
                    }}
                >
                    {({ touched, errors, isSubmitting, values }) => (
                        <Form>
                            <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                                
                                {/* Informações Básicas */}
                                <Card className={classes.formSection}>
                                    <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                                        <Typography className={classes.sectionTitle}>
                                            <FolderIcon className={classes.sectionIcon} />
                                            Información básica
                                        </Typography>
                                        
                                        <div className={classes.fieldRow}>
                                            <Field
                                                as={TextField}
                                                label={i18n.t("fileModal.form.name")}
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
                                                label={i18n.t("fileModal.form.message")}
                                                type="message"
                                                multiline
                                                rows={4}
                                                fullWidth
                                                name="message"
                                                error={touched.message && Boolean(errors.message)}
                                                helperText={touched.message && errors.message}
                                                variant="outlined"
                                                size="small"
                                                className={classes.textField}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Opções de Arquivos */}
                                <Card className={classes.formSection}>
                                    <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                                        <Typography className={classes.sectionTitle}>
                                            <ListIcon className={classes.sectionIcon} />
                                            {i18n.t("fileModal.form.fileOptions")}
                                        </Typography>

                                        <FieldArray name="options">
                                            {({ push, remove }) => (
                                                <>
                                                    {values.options &&
                                                        values.options.length > 0 &&
                                                        values.options.map((info, index) => (    
                                                            <Box
                                                                key={`${index}-info`}
                                                                className={classes.fileOptionItem}
                                                            >
                                                                <Grid container spacing={2}>
                                                                    <Grid xs={12} md={9} item> 
                                                                        <Field
                                                                            as={TextField}
                                                                            label={i18n.t("fileModal.form.extraName")}
                                                                            name={`options[${index}].name`}
                                                                            variant="outlined"
                                                                            size="small"
                                                                            multiline
                                                                            fullWidth
                                                                            rows={2}
                                                                            className={classes.textField}
                                                                        />
                                                                    </Grid>     
                                                                    <Grid xs={12} md={3} item style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                                                        <input
                                                                            type="file"
                                                                            onChange={(e) => {
                                                                                const selectedFile = e.target.files[0];
                                                                                const updatedOptions = [...values.options];                                                                
                                                                                updatedOptions[index].file = selectedFile;
                                                                            
                                                                                setFiles('options', updatedOptions);

                                                                                // Atualize a lista selectedFileNames para o campo específico
                                                                                const updatedFileNames = [...selectedFileNames];
                                                                                updatedFileNames[index] = selectedFile ? selectedFile.name : '';
                                                                                setSelectedFileNames(updatedFileNames);
                                                                            }}
                                                                            style={{ display: 'none' }}
                                                                            name={`options[${index}].file`}
                                                                            id={`file-upload-${index}`}
                                                                        />
                                                                        <label htmlFor={`file-upload-${index}`}>
                                                                            <IconButton 
                                                                                component="span"
                                                                                className={classes.attachButton}
                                                                                size="small"
                                                                            >
                                                                                <AttachFileIcon />
                                                                            </IconButton>
                                                                        </label>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => remove(index)}
                                                                            className={classes.deleteButton}
                                                                        >
                                                                            <DeleteOutlineIcon />
                                                                        </IconButton>    
                                                                    </Grid>
                                                                    <Grid xs={12} item>
                                                                        <Box className={classes.fileNameDisplay}>
                                                                            {info.path || selectedFileNames[index] || "No hay archivos seleccionados"}                               
                                                                        </Box>
                                                                    </Grid> 
                                                                </Grid>                                                    
                                                            </Box>                     
                                                        ))}
                                                    
                                                    <Box style={{ textAlign: 'center' }}>
                                                        <Button
                                                            variant="contained"
                                                            className={classes.addOptionButton}
                                                            onClick={() => {
                                                                push({ name: "", path: ""});
                                                                setSelectedFileNames([...selectedFileNames, ""]);
                                                            }}
                                                            startIcon={<AddIcon />}
                                                        >
                                                            {`${i18n.t("fileModal.buttons.fileOptions")}`}
                                                        </Button>
                                                    </Box>
                                                </>
                                            )}
                                        </FieldArray>
                                    </CardContent>
                                </Card>
                                
                            </DialogContent>
                            
                            <DialogActions className={classes.dialogActions}>
                                <Button
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    variant="outlined"
                                    className={classes.cancelButton}
                                    startIcon={<CancelIcon />}
                                >
                                    {i18n.t("fileModal.buttons.cancel")}
                                </Button>
                                
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    variant="contained"
                                    className={`${classes.saveButton} ${classes.btnWrapper}`}
                                    startIcon={<SaveIcon />}
                                >
                                    {fileListId
                                        ? `${i18n.t("fileModal.buttons.okEdit")}`
                                        : `${i18n.t("fileModal.buttons.okAdd")}`}
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

export default FilesModal;