import React, { useState, useEffect } from "react";
import {
    makeStyles,
    Paper,
    Grid,
    TextField,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Typography,
    Box,
    Container,
    TableContainer
} from "@material-ui/core";
import { Formik, Form, Field } from 'formik';
import ButtonWithSpinner from "../ButtonWithSpinner";
import ConfirmationModal from "../ConfirmationModal";

import { 
    Edit as EditIcon,
    Help as HelpIcon,
    Add as AddIcon,
    Clear as ClearIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Title as TitleIcon,
    Description as DescriptionIcon,
    VideoLibrary as VideoIcon
} from "@material-ui/icons";

import { toast } from "react-toastify";
import useHelps from "../../hooks/useHelps";
import { i18n } from "../../translate/i18n";

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
    formSection: {
        background: "white",
        borderRadius: "20px",
        padding: theme.spacing(4),
        marginBottom: theme.spacing(4),
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        border: "1px solid #e2e8f0",
    },
    formTitle: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(3),
        color: "#1e293b",
        fontWeight: 700,
        fontSize: "20px",
    },
    textField: {
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#f8fafc",
            "&:hover": {
                backgroundColor: "#f1f5f9",
            },
        },
        "& .MuiInputLabel-root": {
            color: "#64748b",
            fontWeight: 500,
        },
    },
    buttonGroup: {
        display: "flex",
        gap: theme.spacing(2),
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: theme.spacing(3),
        padding: theme.spacing(2),
        backgroundColor: "#f8fafc",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
    },
    clearButton: {
        background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
        borderRadius: "12px",
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        minHeight: "40px",
        padding: theme.spacing(1, 3),
        boxShadow: "0 4px 15px rgba(100, 116, 139, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "linear-gradient(135deg, #475569 0%, #334155 100%)",
            transform: "translateY(-2px)",
        },
    },
    deleteButton: {
        background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
        borderRadius: "12px",
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        minHeight: "40px",
        padding: theme.spacing(1, 3),
        boxShadow: "0 4px 15px rgba(220, 38, 38, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
            transform: "translateY(-2px)",
        },
    },
    saveButton: {
        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        borderRadius: "12px",
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        minHeight: "40px",
        padding: theme.spacing(1, 3),
        boxShadow: "0 4px 15px rgba(5, 150, 105, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
            transform: "translateY(-2px)",
        },
    },
    mainPaper: {
        borderRadius: "20px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        border: "none",
        overflow: "hidden",
        marginBottom: theme.spacing(3),
    },
    helpsTable: {
        "& .MuiTableHead-root": {
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        },
        "& .MuiTableCell-head": {
            fontWeight: 700,
            color: "#1e293b",
            borderBottom: "2px solid #e2e8f0",
            fontSize: "14px",
            padding: theme.spacing(2),
        },
        "& .MuiTableRow-root:nth-child(even)": {
            backgroundColor: "#f8fafc",
        },
        "& .MuiTableCell-root": {
            borderBottom: "1px solid #e2e8f0",
            padding: theme.spacing(2),
            fontSize: "14px",
        },
        "& .MuiTableRow-hover:hover": {
            backgroundColor: "#e2e8f0 !important",
        },
    },
    helpTitle: {
        fontWeight: 600,
        color: "#1e293b",
        fontSize: "15px",
    },
    helpDescription: {
        color: "#64748b",
        fontSize: "13px",
        maxWidth: "300px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    videoCode: {
        fontFamily: "monospace",
        backgroundColor: "#f1f5f9",
        padding: theme.spacing(0.5, 1),
        borderRadius: "6px",
        fontSize: "12px",
        color: "#475569",
        border: "1px solid #e2e8f0",
    },
    editIcon: {
        color: "#7c3aed",
        backgroundColor: "#f3e8ff",
        padding: theme.spacing(0.5),
        borderRadius: "8px",
        "&:hover": {
            backgroundColor: "#e9d5ff",
            transform: "scale(1.1)",
        },
    },
    emptyState: {
        textAlign: "center",
        padding: theme.spacing(8, 4),
        color: "#64748b",
    },
    emptyStateIcon: {
        fontSize: "64px",
        color: "#cbd5e1",
        marginBottom: theme.spacing(2),
    },
}));

export function HelpManagerForm(props) {
    const { onSubmit, onDelete, onCancel, initialValue, loading } = props;
    const classes = useStyles();

    const [record, setRecord] = useState(initialValue);

    useEffect(() => {
        setRecord(initialValue)
    }, [initialValue])

    const handleSubmit = async (data) => {
        onSubmit(data)
    }

    return (
        <Paper className={classes.formSection} elevation={0}>
            <Typography className={classes.formTitle}>
                <AddIcon style={{ marginRight: 12 }} />
                Configurar Ajuda
            </Typography>
            
            <Formik
                enableReinitialize
                initialValues={record}
                onSubmit={(values, { resetForm }) =>
                    setTimeout(() => {
                        handleSubmit(values)
                        resetForm()
                    }, 500)
                }
            >
                {(values) => (
                    <Form>
                        <Grid spacing={3} container>
                            <Grid xs={12} sm={6} md={3} item>
                                <Field
                                    as={TextField}
                                    label="Título"
                                    name="title"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid xs={12} sm={6} md={3} item>
                                <Field
                                    as={TextField}
                                    label={i18n.t("helps.settings.codeVideo")}
                                    name="video"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid xs={12} sm={12} md={6} item>
                                <Field
                                    as={TextField}
                                    label={i18n.t("helps.settings.description")}
                                    name="description"
                                    variant="outlined"
                                    fullWidth
                                    margin="dense"
                                    multiline
                                    rows={1}
                                    className={classes.textField}
                                />
                            </Grid>
                        </Grid>
                        
                        <Box className={classes.buttonGroup}>
                            <ButtonWithSpinner 
                                className={classes.clearButton} 
                                loading={loading} 
                                onClick={() => onCancel()} 
                                variant="contained"
                                startIcon={<ClearIcon />}
                            >
                                {i18n.t("helps.settings.clear")}
                            </ButtonWithSpinner>
                            
                            {record.id !== undefined ? (
                                <ButtonWithSpinner 
                                    className={classes.deleteButton} 
                                    loading={loading} 
                                    onClick={() => onDelete(record)} 
                                    variant="contained"
                                    startIcon={<DeleteIcon />}
                                >
                                    {i18n.t("helps.settings.delete")}
                                </ButtonWithSpinner>
                            ) : null}
                            
                            <ButtonWithSpinner 
                                className={classes.saveButton} 
                                loading={loading} 
                                type="submit" 
                                variant="contained"
                                startIcon={<SaveIcon />}
                            >
                                {i18n.t("helps.settings.save")}
                            </ButtonWithSpinner>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Paper>
    )
}

export function HelpsManagerGrid(props) {
    const { records, onSelect } = props;
    const classes = useStyles();

    return (
        <Paper className={classes.mainPaper} elevation={0}>
            <TableContainer style={{ maxHeight: 600, overflowY: "auto" }}>
                <Table stickyHeader className={classes.helpsTable}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ width: '1%' }}>
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <EditIcon style={{ marginRight: 8, color: "#64748b" }} />
                                    Ações
                                </Box>
                            </TableCell>
                            <TableCell align="left">
                                <Box display="flex" alignItems="center">
                                    <TitleIcon style={{ marginRight: 8, color: "#64748b" }} />
                                    Título
                                </Box>
                            </TableCell>
                            <TableCell align="left">
                                <Box display="flex" alignItems="center">
                                    <DescriptionIcon style={{ marginRight: 8, color: "#64748b" }} />
                                    {i18n.t("helps.settings.description")}
                                </Box>
                            </TableCell>
                            <TableCell align="left">
                                <Box display="flex" alignItems="center">
                                    <VideoIcon style={{ marginRight: 8, color: "#64748b" }} />
                                    Vídeo
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.length > 0 ? (
                            records.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell align="center" style={{ width: '1%' }}>
                                        <IconButton 
                                            onClick={() => onSelect(row)} 
                                            className={classes.editIcon}
                                            title="Editar Ajuda"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Typography className={classes.helpTitle}>
                                            {row.title || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Typography className={classes.helpDescription} title={row.description}>
                                            {row.description || '-'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left">
                                        <Typography className={classes.videoCode}>
                                            {row.video || '-'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Box className={classes.emptyState}>
                                        <HelpIcon className={classes.emptyStateIcon} />
                                        <Typography variant="h6" style={{ marginBottom: 8 }}>
                                            Nenhuma ajuda encontrada
                                        </Typography>
                                        <Typography variant="body2">
                                            Crie sua primeira ajuda para começar
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default function HelpsManager() {
    const classes = useStyles();
    const { list, save, update, remove } = useHelps();
    
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [record, setRecord] = useState({
        title: '',
        description: '',
        video: ''
    });

    useEffect(() => {
        async function fetchData() {
            await loadHelps()
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadHelps = async () => {
        setLoading(true)
        try {
            const helpList = await list()
            setRecords(helpList)
        } catch (e) {
            toast.error('Não foi possível carregar a lista de registros')
        }
        setLoading(false)
    }

    const handleSubmit = async (data) => {
        setLoading(true)
        try {
            if (data.id !== undefined) {
                await update(data)
            } else {
                await save(data)
            }
            await loadHelps()
            handleCancel()
            toast.success('Operação realizada com sucesso!')
        } catch (e) {
            toast.error('Não foi possível realizar a operação. Verifique se já existe uma helpo com o mesmo nome ou se os campos foram preenchidos corretamente')
        }
        setLoading(false)
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            await remove(record.id)
            await loadHelps()
            handleCancel()
            toast.success('Operação realizada com sucesso!')
        } catch (e) {
            toast.error('Não foi possível realizar a operação')
        }
        setLoading(false)
    }

    const handleOpenDeleteDialog = () => {
        setShowConfirmDialog(true)
    }

    const handleCancel = () => {
        setRecord({
            title: '',
            description: '',
            video: ''
        })
    }

    const handleSelect = (data) => {
        setRecord({
            id: data.id,
            title: data.title || '',
            description: data.description || '',
            video: data.video || ''
        })
    }

    return (
        <div className={classes.mainContainer}>
            <Container maxWidth="xl">
                
                {/* Header Modernizado */}
                <Box className={classes.header}>
                    <div className={classes.headerContent}>
                        <HelpIcon className={classes.headerIcon} />
                        <div>
                            <Typography className={classes.headerTitle}>
                                Gerenciar Ajudas
                            </Typography>
                            <Typography className={classes.headerSubtitle}>
                                Configure tutoriais e vídeos de ajuda para usuários
                            </Typography>
                        </div>
                    </div>
                </Box>

                {/* Formulário e Tabela */}
                <Grid spacing={3} container>
                    <Grid xs={12} item>
                        <HelpManagerForm 
                            initialValue={record} 
                            onDelete={handleOpenDeleteDialog} 
                            onSubmit={handleSubmit} 
                            onCancel={handleCancel} 
                            loading={loading}
                        />
                    </Grid>
                    <Grid xs={12} item>
                        <HelpsManagerGrid 
                            records={records}
                            onSelect={handleSelect}
                        />
                    </Grid>
                </Grid>
                
                <ConfirmationModal
                    title="Exclusão de Registro"
                    open={showConfirmDialog}
                    onClose={() => setShowConfirmDialog(false)}
                    onConfirm={() => handleDelete()}
                >
                    Deseja realmente excluir esse registro?
                </ConfirmationModal>
            </Container>
        </div>
    )
}