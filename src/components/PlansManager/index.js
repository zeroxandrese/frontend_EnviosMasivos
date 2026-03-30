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
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Container,
    Box,
    TableContainer,
    Chip,
    InputAdornment,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@material-ui/core";
import { Formik, Form, Field } from 'formik';
import ButtonWithSpinner from "../ButtonWithSpinner";
import ConfirmationModal from "../ConfirmationModal";

import {
    Edit as EditIcon,
    Assignment,
    FilterList,
    Search,
    Add,
    Person,
    Settings,
    MonetizationOn,
    CheckCircle,
    Cancel,
    Business,
    Chat,
    Facebook,
    Instagram,
    Schedule,
    Code,
    ViewKanban,
    Extension, // Using Extension instead of Psychology for AI
    Public,
    ExpandMore,
    Tune
} from "@material-ui/icons";

import { toast } from "react-toastify";
import usePlans from "../../hooks/usePlans";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
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
    filtersSection: {
        background: "white",
        borderRadius: "20px",
        padding: theme.spacing(4),
        marginBottom: theme.spacing(4),
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        border: "1px solid #e2e8f0",
    },
    filtersTitle: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(3),
        color: "#1e293b",
        fontWeight: 700,
        fontSize: "20px",
    },
    searchField: {
        flex: 1,
        minWidth: "300px",
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#f8fafc",
            "&:hover": {
                backgroundColor: "#f1f5f9",
            },
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
    totalIcon: {
        backgroundColor: "#dbeafe",
        color: "#3b82f6",
    },
    publicIcon: {
        backgroundColor: "#dcfce7",
        color: "#059669",
    },
    privateIcon: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
    },
    avgIcon: {
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
    formSection: {
        background: "white",
        borderRadius: "20px",
        padding: theme.spacing(4),
        marginBottom: theme.spacing(4),
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        border: "1px solid #e2e8f0",
    },
    sectionTitle: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing(3),
        color: "#1e293b",
        fontWeight: 700,
        fontSize: "20px",
    },
    formField: {
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
        },
    },
    accordion: {
        backgroundColor: "#f8fafc",
        borderRadius: "12px !important",
        boxShadow: "none",
        border: "1px solid #e2e8f0",
        "&:before": {
            display: "none",
        },
        marginBottom: theme.spacing(1),
    },
    accordionSummary: {
        backgroundColor: "#f1f5f9",
        borderRadius: "12px",
        minHeight: "56px",
    },
    accordionTitle: {
        fontWeight: 600,
        color: "#1e293b",
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
    },
    buttonContainer: {
        display: "flex",
        gap: theme.spacing(1),
        justifyContent: "flex-end",
        marginTop: theme.spacing(3),
    },
    primaryButton: {
        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
        borderRadius: "12px",
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        padding: theme.spacing(1, 3),
        "&:hover": {
            background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
        },
    },
    secondaryButton: {
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        borderRadius: "12px",
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        padding: theme.spacing(1, 3),
        "&:hover": {
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
        },
    },
    dangerButton: {
        background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
        borderRadius: "12px",
        color: "white",
        fontWeight: 600,
        textTransform: "none",
        padding: theme.spacing(1, 3),
        "&:hover": {
            background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
        },
    },
    tableSection: {
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        border: "none",
        overflow: "hidden",
        marginBottom: theme.spacing(3),
    },
    plansTable: {
        "& .MuiTableHead-root": {
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        },
        "& .MuiTableCell-head": {
            fontWeight: 700,
            color: "#1e293b",
            borderBottom: "2px solid #e2e8f0",
            fontSize: "12px",
            padding: theme.spacing(1.5),
        },
        "& .MuiTableRow-root:nth-child(even)": {
            backgroundColor: "#f8fafc",
        },
        "& .MuiTableCell-root": {
            borderBottom: "1px solid #e2e8f0",
            padding: theme.spacing(1),
            fontSize: "12px",
        },
        "& .MuiTableRow-hover:hover": {
            backgroundColor: "#e2e8f0 !important",
        },
    },
    planName: {
        fontWeight: 600,
        color: "#1e293b",
        fontSize: "14px",
    },
    enabledChip: {
        backgroundColor: "#dcfce7",
        color: "#059669",
        fontWeight: 600,
        fontSize: "10px",
        height: "24px",
    },
    disabledChip: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        fontWeight: 600,
        fontSize: "10px",
        height: "24px",
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
    valueCell: {
        fontFamily: "monospace",
        fontWeight: 600,
        color: "#059669",
    },
    numberCell: {
        fontFamily: "monospace",
        fontWeight: 600,
        color: "#3b82f6",
    },
}));

export function PlanManagerForm(props) {
    const { onSubmit, onDelete, onCancel, initialValue, loading } = props;
    const classes = useStyles()

    const [record, setRecord] = useState({
        name: '',
        users: 0,
        connections: 0,
        queues: 0,
        amount: 0,
        useWhatsapp: true,
        useFacebook: true,
        useInstagram: true,
        useCampaigns: true,
        useSchedules: true,
        useInternalChat: true,
        useExternalApi: true,
        useKanban: true,
        useOpenAi: true,
        useIntegration: true,
        isPublic: true,
    });

    useEffect(() => {
        setRecord(initialValue)
    }, [initialValue])

    const handleSubmit = async (data) => {
        onSubmit(data)
    }

    return (
        <Paper className={classes.formSection} elevation={0}>
            <Typography className={classes.sectionTitle}>
                <Add style={{ marginRight: 12 }} />
                {record.id ? 'Editar Plano' : 'Novo Plano'}
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
                        {/* Informações Básicas */}
                        <Accordion className={classes.accordion} defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                className={classes.accordionSummary}
                            >
                                <Typography className={classes.accordionTitle}>
                                    <Settings />
                                    Información básica
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid spacing={3} container>
                                    <Grid xs={12} sm={6} md={3} item>
                                        <Field
                                            as={TextField}
                                            label={i18n.t("plans.form.name")}
                                            name="name"
                                            variant="outlined"
                                            fullWidth
                                            margin="dense"
                                            className={classes.formField}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Assignment color="secondary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6} md={2} item>
                                        <Field
                                            as={TextField}
                                            label={i18n.t("plans.form.users")}
                                            name="users"
                                            variant="outlined"
                                            fullWidth
                                            margin="dense"
                                            type="number"
                                            className={classes.formField}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person color="secondary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6} md={2} item>
                                        <Field
                                            as={TextField}
                                            label={i18n.t("plans.form.connections")}
                                            name="connections"
                                            variant="outlined"
                                            fullWidth
                                            margin="dense"
                                            type="number"
                                            className={classes.formField}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Settings color="secondary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6} md={2} item>
                                        <Field
                                            as={TextField}
                                            label="Filas"
                                            name="queues"
                                            variant="outlined"
                                            fullWidth
                                            margin="dense"
                                            type="number"
                                            className={classes.formField}
                                        />
                                    </Grid>
                                    <Grid xs={12} sm={6} md={3} item>
                                        <Field
                                            as={TextField}
                                            label="Valor"
                                            name="amount"
                                            variant="outlined"
                                            fullWidth
                                            margin="dense"
                                            type="text"
                                            className={classes.formField}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MonetizationOn color="secondary" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/* Recursos de Comunicação */}
                        <Accordion className={classes.accordion}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                className={classes.accordionSummary}
                            >
                                <Typography className={classes.accordionTitle}>
                                    <Chat />
                                    Recursos de comunicación
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid spacing={3} container>
                                    <Grid xs={12} sm={6} md={4} item>
                                        <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                                            <InputLabel htmlFor="useWhatsapp-selection">WhatsApp</InputLabel>
                                            <Field
                                                as={Select}
                                                id="useWhatsapp-selection"
                                                label="Whatsapp"
                                                labelId="useWhatsapp-selection-label"
                                                name="useWhatsapp"
                                                margin="dense"
                                            >
                                                <MenuItem value={true}>{i18n.t("plans.form.enabled")}</MenuItem>
                                                <MenuItem value={false}>{i18n.t("plans.form.disabled")}</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} sm={6} md={4} item>
                                        <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                                            <InputLabel htmlFor="useFacebook-selection">Facebook</InputLabel>
                                            <Field
                                                as={Select}
                                                id="useFacebook-selection"
                                                label="Facebook"
                                                labelId="useFacebook-selection-label"
                                                name="useFacebook"
                                                margin="dense"
                                            >
                                                <MenuItem value={true}>{i18n.t("plans.form.enabled")}</MenuItem>
                                                <MenuItem value={false}>{i18n.t("plans.form.disabled")}</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} sm={6} md={4} item>
                                        <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                                            <InputLabel htmlFor="useInstagram-selection">Instagram</InputLabel>
                                            <Field
                                                as={Select}
                                                id="useInstagram-selection"
                                                label="Instagram"
                                                labelId="useInstagram-selection-label"
                                                name="useInstagram"
                                                margin="dense"
                                            >
                                                <MenuItem value={true}>{i18n.t("plans.form.enabled")}</MenuItem>
                                                <MenuItem value={false}>{i18n.t("plans.form.disabled")}</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} sm={6} md={4} item>
                                        <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                                            <InputLabel htmlFor="useInternalChat-selection">Chat Interno</InputLabel>
                                            <Field
                                                as={Select}
                                                id="useInternalChat-selection"
                                                label="Chat Interno"
                                                labelId="useInternalChat-selection-label"
                                                name="useInternalChat"
                                                margin="dense"
                                            >
                                                <MenuItem value={true}>{i18n.t("plans.form.enabled")}</MenuItem>
                                                <MenuItem value={false}>{i18n.t("plans.form.disabled")}</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/* Recursos Avançados */}
                        <Accordion className={classes.accordion}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                className={classes.accordionSummary}
                            >
                                <Typography className={classes.accordionTitle}>
                                    <Tune />
                                    Recursos Avançados
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid spacing={3} container>
                                    <Grid xs={12} sm={6} md={4} item>
                                        <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                                            <InputLabel htmlFor="useCampaigns-selection">{i18n.t("plans.form.campaigns")}</InputLabel>
                                            <Field
                                                as={Select}
                                                id="useCampaigns-selection"
                                                label={i18n.t("plans.form.campaigns")}
                                                labelId="useCampaigns-selection-label"
                                                name="useCampaigns"
                                                margin="dense"
                                            >
                                                <MenuItem value={true}>{i18n.t("plans.form.enabled")}</MenuItem>
                                                <MenuItem value={false}>{i18n.t("plans.form.disabled")}</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} sm={6} md={4} item>
                                        <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                                            <InputLabel htmlFor="useSchedules-selection">{i18n.t("plans.form.schedules")}</InputLabel>
                                            <Field
                                                as={Select}
                                                id="useSchedules-selection"
                                                label={i18n.t("plans.form.schedules")}
                                                labelId="useSchedules-selection-label"
                                                name="useSchedules"
                                                margin="dense"
                                            >
                                                <MenuItem value={true}>{i18n.t("plans.form.enabled")}</MenuItem>
                                                <MenuItem value={false}>{i18n.t("plans.form.disabled")}</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} sm={6} md={4} item>
                                        <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                                            <InputLabel htmlFor="useExternalApi-selection">API Externa</InputLabel>
                                            <Field
                                                as={Select}
                                                id="useExternalApi-selection"
                                                label="API Externa"
                                                labelId="useExternalApi-selection-label"
                                                name="useExternalApi"
                                                margin="dense"
                                            >
                                                <MenuItem value={true}>{i18n.t("plans.form.enabled")}</MenuItem>
                                                <MenuItem value={false}>{i18n.t("plans.form.disabled")}</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} sm={6} md={4} item>
                                        <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                                            <InputLabel htmlFor="useKanban-selection">Kanban</InputLabel>
                                            <Field
                                                as={Select}
                                                id="useKanban-selection"
                                                label="Kanban"
                                                labelId="useKanban-selection-label"
                                                name="useKanban"
                                                margin="dense"
                                            >
                                                <MenuItem value={true}>{i18n.t("plans.form.enabled")}</MenuItem>
                                                <MenuItem value={false}>{i18n.t("plans.form.disabled")}</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} sm={6} md={4} item>
                                        <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                                            <InputLabel htmlFor="useOpenAi-selection">OpenAI</InputLabel>
                                            <Field
                                                as={Select}
                                                id="useOpenAi-selection"
                                                label="OpenAI"
                                                labelId="useOpenAi-selection-label"
                                                name="useOpenAi"
                                                margin="dense"
                                            >
                                                <MenuItem value={true}>{i18n.t("plans.form.enabled")}</MenuItem>
                                                <MenuItem value={false}>{i18n.t("plans.form.disabled")}</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} sm={6} md={4} item>
                                        <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                                            <InputLabel htmlFor="useIntegration-selection">Integraciones</InputLabel>
                                            <Field
                                                as={Select}
                                                id="useIntegration-selection"
                                                label="Integraciones"
                                                labelId="useIntegration-selection-label"
                                                name="useIntegration"
                                                margin="dense"
                                            >
                                                <MenuItem value={true}>{i18n.t("plans.form.enabled")}</MenuItem>
                                                <MenuItem value={false}>{i18n.t("plans.form.disabled")}</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                    <Grid xs={12} sm={6} md={4} item>
                                        <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                                            <InputLabel htmlFor="isPublic-selection">Público</InputLabel>
                                            <Field
                                                as={Select}
                                                id="isPublic-selection"
                                                label="isPublic"
                                                labelId="isPublic-selection-label"
                                                name="isPublic"
                                                margin="dense"
                                            >
                                                <MenuItem value={true}>{i18n.t("plans.form.enabled")}</MenuItem>
                                                <MenuItem value={false}>{i18n.t("plans.form.disabled")}</MenuItem>
                                            </Field>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        <div className={classes.buttonContainer}>
                            <ButtonWithSpinner 
                                loading={loading} 
                                onClick={() => onCancel()} 
                                variant="contained"
                                style={{ backgroundColor: "#64748b" }}
                            >
                                {i18n.t("plans.form.clear")}
                            </ButtonWithSpinner>
                            
                            {record.id !== undefined && (
                                <ButtonWithSpinner 
                                    className={classes.dangerButton}
                                    loading={loading} 
                                    onClick={() => onDelete(record)} 
                                    variant="contained"
                                >
                                    {i18n.t("plans.form.delete")}
                                </ButtonWithSpinner>
                            )}
                            
                            <ButtonWithSpinner 
                                className={classes.primaryButton}
                                loading={loading} 
                                type="submit" 
                                variant="contained"
                            >
                                {i18n.t("plans.form.save")}
                            </ButtonWithSpinner>
                        </div>
                    </Form>
                )}
            </Formik>
        </Paper>
    )
}

export function PlansManagerGrid(props) {
    const { records, onSelect } = props
    const classes = useStyles()

    const renderFeature = (value) => {
        return value === true ? (
            <Chip 
                label="Si"
                className={classes.enabledChip}
                size="small"
                icon={<CheckCircle fontSize="small" />}
            />
        ) : (
            <Chip 
                label="No"
                className={classes.disabledChip}
                size="small"
                icon={<Cancel fontSize="small" />}
            />
        );
    };

    return (
        <Paper className={classes.tableSection} elevation={0}>
            <TableContainer style={{ maxHeight: 600, overflowY: "auto" }}>
                <Table
                    stickyHeader
                    className={classes.plansTable}
                    size="small"
                    aria-label="plans table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ width: '50px' }}>
                                <EditIcon style={{ color: "#64748b" }} />
                            </TableCell>
                            <TableCell align="left">
                                <Box display="flex" alignItems="center">
                                    <Assignment style={{ marginRight: 4, color: "#64748b", fontSize: "16px" }} />
                                    {i18n.t("plans.form.name")}
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <Person style={{ marginRight: 4, color: "#64748b", fontSize: "16px" }} />
                                    {i18n.t("plans.form.users")}
                                </Box>
                            </TableCell>
                            <TableCell align="center">Conexiones</TableCell>
                            <TableCell align="center">Colas</TableCell>
                            <TableCell align="center">
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <MonetizationOn style={{ marginRight: 4, color: "#64748b", fontSize: "16px" }} />
                                    Valor
                                </Box>
                            </TableCell>
                            <TableCell align="center">WhatsApp</TableCell>
                            <TableCell align="center">Facebook</TableCell>
                            <TableCell align="center">Instagram</TableCell>
                            <TableCell align="center">Campañas</TableCell>
                            <TableCell align="center">
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <Schedule style={{ marginRight: 4, color: "#64748b", fontSize: "16px" }} />
                                    Agend.
                                </Box>
                            </TableCell>
                            <TableCell align="center">Chat</TableCell>
                            <TableCell align="center">API</TableCell>
                            <TableCell align="center">Kanban</TableCell>
                            <TableCell align="center">
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <Extension style={{ marginRight: 4, color: "#64748b", fontSize: "16px" }} />
                                    AI
                                </Box>
                            </TableCell>
                            <TableCell align="center">Integr.</TableCell>
                            <TableCell align="center">
                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <Public style={{ marginRight: 4, color: "#64748b", fontSize: "16px" }} />
                                    Público
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((row) => (
                            <TableRow key={row.id} hover>
                                <TableCell align="center">
                                    <IconButton 
                                        onClick={() => onSelect(row)} 
                                        className={classes.editIcon}
                                        size="small"
                                        title="Editar plano"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography className={classes.planName}>
                                        {row.name || '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography className={classes.numberCell}>
                                        {row.users || '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography className={classes.numberCell}>
                                        {row.connections || '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography className={classes.numberCell}>
                                        {row.queues || '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography className={classes.valueCell}>
                                        {i18n.t("plans.form.money")} {row.amount ? row.amount.toLocaleString('pt-br', { minimumFractionDigits: 2 }) : '00.00'}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">{renderFeature(row.useWhatsapp)}</TableCell>
                                <TableCell align="center">{renderFeature(row.useFacebook)}</TableCell>
                                <TableCell align="center">{renderFeature(row.useInstagram)}</TableCell>
                                <TableCell align="center">{renderFeature(row.useCampaigns)}</TableCell>
                                <TableCell align="center">{renderFeature(row.useSchedules)}</TableCell>
                                <TableCell align="center">{renderFeature(row.useInternalChat)}</TableCell>
                                <TableCell align="center">{renderFeature(row.useExternalApi)}</TableCell>
                                <TableCell align="center">{renderFeature(row.useKanban)}</TableCell>
                                <TableCell align="center">{renderFeature(row.useOpenAi)}</TableCell>
                                <TableCell align="center">{renderFeature(row.useIntegration)}</TableCell>
                                <TableCell align="center">{renderFeature(row.isPublic)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}

export default function PlansManager() {
    const classes = useStyles()
    const { list, save, update, remove } = usePlans()

    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [records, setRecords] = useState([])
    const [searchParam, setSearchParam] = useState("")
    const [record, setRecord] = useState({
        name: '',
        users: 0,
        connections: 0,
        queues: 0,
        amount: 0,
        useWhatsapp: true,
        useFacebook: true,
        useInstagram: true,
        useCampaigns: true,
        useSchedules: true,
        useInternalChat: true,
        useExternalApi: true,
        useKanban: true,
        useOpenAi: true,
        useIntegration: true,
        isPublic: true,
    })

    useEffect(() => {
        async function fetchData() {
            await loadPlans()
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadPlans = async () => {
        setLoading(true)
        try {
            const planList = await list()
            setRecords(planList)
        } catch (e) {
            toast.error('No se pudo cargar la lista de registros.')
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
            await loadPlans()
            handleCancel()
            toast.success('Operación realizada con éxito!')
        } catch (e) {
            toast.error('No se pudo completar la operación. Por favor, compruebe si ya existe un plan con el mismo nombre o si los campos se han rellenado correctamente.')
        }
        setLoading(false)
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            await remove(record.id)
            await loadPlans()
            handleCancel()
            toast.success('Operación realizada con éxito!')
        } catch (e) {
            toast.error('La operación no pudo completarse.')
        }
        setLoading(false)
    }

    const handleOpenDeleteDialog = () => {
        setShowConfirmDialog(true)
    }

    const handleCancel = () => {
        setRecord({
            name: '',
            users: 0,
            connections: 0,
            queues: 0,
            amount: 0,
            useWhatsapp: true,
            useFacebook: true,
            useInstagram: true,
            useCampaigns: true,
            useSchedules: true,
            useInternalChat: true,
            useExternalApi: true,
            isPublic: true,
        })
    }

    const handleSelect = (data) => {
        let useWhatsapp = data.useWhatsapp === false ? false : true
        let useFacebook = data.useFacebook === false ? false : true
        let useInstagram = data.useInstagram === false ? false : true
        let useCampaigns = data.useCampaigns === false ? false : true
        let useSchedules = data.useSchedules === false ? false : true
        let useInternalChat = data.useInternalChat === false ? false : true
        let useExternalApi = data.useExternalApi === false ? false : true
        let useKanban = data.useKanban === false ? false : true
        let useOpenAi = data.useOpenAi === false ? false : true
        let useIntegration = data.useIntegration === false ? false : true
        let isPublic = data.isPublic === false ? false : true

        setRecord({
            id: data.id,
            name: data.name || '',
            users: data.users || 0,
            connections: data.connections || 0,
            queues: data.queues || 0,
            amount: data.amount?.toLocaleString('pt-br', { minimumFractionDigits: 2 }) || 0,
            useWhatsapp,
            useFacebook,
            useInstagram,
            useCampaigns,
            useSchedules,
            useInternalChat,
            useExternalApi,
            useKanban,
            useOpenAi,
            useIntegration,
            isPublic
        })
    }

    const handleSearch = (event) => {
        setSearchParam(event.target.value.toLowerCase());
    };

    // Filtrar planos baseado na busca
    const filteredRecords = records.filter(plan => 
        plan.name?.toLowerCase().includes(searchParam)
    );

    // Calcular estatísticas dos planos
    const getPlanStats = () => {
        const total = records.length;
        const publicPlans = records.filter(p => p.isPublic === true).length;
        const privatePlans = records.filter(p => p.isPublic === false).length;
        const avgPrice = records.length > 0 ? 
            (records.reduce((sum, p) => sum + (p.amount || 0), 0) / records.length).toFixed(2) : 0;

        return { total, publicPlans, privatePlans, avgPrice };
    };

    const stats = getPlanStats();

    return (
        <div className={classes.mainContainer}>
            <Container maxWidth="xl">
                
                {/* Header */}
                <Box className={classes.header}>
                    <div className={classes.headerContent}>
                        <Assignment className={classes.headerIcon} />
                        <div>
                            <Typography className={classes.headerTitle}>
                                Gestión de planes
                            </Typography>
                            <Typography className={classes.headerSubtitle}>
                                Configura planes, funciones y precios.
                            </Typography>
                        </div>
                    </div>
                </Box>

                {/* Busca */}
                <Paper className={classes.filtersSection} elevation={0}>
                    <Typography className={classes.filtersTitle}>
                        <FilterList style={{ marginRight: 12 }} />         
                        Buscar planes
                    </Typography>
                    <TextField
                        placeholder="Buscar por nombre del plan..."
                        type="search"
                        value={searchParam}
                        onChange={handleSearch}
                        className={classes.searchField}
                        variant="outlined"
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="secondary" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Paper>

                {/* Estatísticas */}
                <Box className={classes.statsGrid}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                        <div className={classes.statCard}>
                            <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                                <Assignment />
                            </div>
                            <div className={classes.statContent}>
                                <Typography className={classes.statTitle}>
                                    Planes totales
                                </Typography>
                                <Typography className={classes.statValue}>
                                    {stats.total}
                                </Typography>
                            </div>
                        </div>

                        <div className={classes.statCard}>
                            <div className={`${classes.statIcon} ${classes.publicIcon}`}>
                                <Public />
                            </div>
                            <div className={classes.statContent}>
                                <Typography className={classes.statTitle}>
                                    Planes Públicos
                                </Typography>
                                <Typography className={classes.statValue}>
                                    {stats.publicPlans}
                                </Typography>
                            </div>
                        </div>

                        <div className={classes.statCard}>
                            <div className={`${classes.statIcon} ${classes.privateIcon}`}>
                                <Business />
                            </div>
                            <div className={classes.statContent}>
                                <Typography className={classes.statTitle}>
                                    Planes Privados
                                </Typography>
                                <Typography className={classes.statValue}>
                                    {stats.privatePlans}
                                </Typography>
                            </div>
                        </div>

                        <div className={classes.statCard}>
                            <div className={`${classes.statIcon} ${classes.avgIcon}`}>
                                <MonetizationOn />
                            </div>
                            <div className={classes.statContent}>
                                <Typography className={classes.statTitle}>
                                    Precio medio
                                </Typography>
                                <Typography className={classes.statValue}>
                                    $ {stats.avgPrice}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </Box>

                {/* Formulário */}
                <PlanManagerForm
                    initialValue={record}
                    onDelete={handleOpenDeleteDialog}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                />

                {/* Tabela */}
                <PlansManagerGrid
                    records={filteredRecords}
                    onSelect={handleSelect}
                />

                {/* Modal de Confirmação */}
                <ConfirmationModal
                    title="Eliminación de registro"
                    open={showConfirmDialog}
                    onClose={() => setShowConfirmDialog(false)}
                    onConfirm={() => handleDelete()}
                >
                    ¿De verdad quieres eliminar este registro?
                </ConfirmationModal>
            </Container>
        </div>
    )
}