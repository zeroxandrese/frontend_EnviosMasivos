import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { socketConnection } from "../../services/socket";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Chip from "@material-ui/core/Chip";

import BusinessIcon from "@material-ui/icons/Business";
import DomainIcon from "@material-ui/icons/Domain";
import EmailIcon from "@material-ui/icons/Email";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import EventIcon from "@material-ui/icons/Event";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import LabelIcon from "@material-ui/icons/Label";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import FilterListIcon from "@material-ui/icons/FilterList";

import MainContainer from "../../components/MainContainer";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import CompanyModal from "../../components/CompaniesModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useDate } from "../../hooks/useDate";
import moment from "moment";

const reducer = (state, action) => {
    if (action.type === "LOAD_COMPANIES") {
        const companies = action.payload;
        const newCompanies = [];

        companies.forEach((company) => {
            const companyIndex = state.findIndex((u) => u.id === company.id);
            if (companyIndex !== -1) {
                state[companyIndex] = company;
            } else {
                newCompanies.push(company);
            }
        });

        return [...state, ...newCompanies];
    }

    if (action.type === "UPDATE_COMPANIES") {
        const company = action.payload;
        const companyIndex = state.findIndex((u) => u.id === company.id);

        if (companyIndex !== -1) {
            state[companyIndex] = company;
            return [...state];
        } else {
            return [company, ...state];
        }
    }

    if (action.type === "DELETE_COMPANIES") {
        const companyId = action.payload;

        const companyIndex = state.findIndex((u) => u.id === companyId);
        if (companyIndex !== -1) {
            state.splice(companyIndex, 1);
        }
        return [...state];
    }

    if (action.type === "RESET") {
        return [];
    }
};

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
    activeIcon: {
        backgroundColor: "#dcfce7",
        color: "#059669",
    },
    planIcon: {
        backgroundColor: "#f3e8ff",
        color: "#7c3aed",
    },
    revenueIcon: {
        backgroundColor: "#fef3c7",
        color: "#f59e0b",
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
    mainPaper: {
        borderRadius: "20px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        border: "none",
        overflow: "hidden",
        marginBottom: theme.spacing(3),
    },
    companiesTable: {
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
    companyName: {
        fontWeight: 600,
        color: "#1e293b",
        fontSize: "15px",
    },
    companyEmail: {
        color: "#64748b",
        fontSize: "13px",
    },
    statusActive: {
        backgroundColor: "#dcfce7",
        color: "#059669",
        fontWeight: 600,
    },
    statusInactive: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        fontWeight: 600,
    },
    planName: {
        backgroundColor: "#f3e8ff",
        color: "#7c3aed",
        fontWeight: 600,
    },
    dateText: {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#475569",
    },
    priceText: {
        fontWeight: 600,
        color: "#059669",
        fontSize: "14px",
    },
    recurrenceText: {
        fontSize: "11px",
        color: "#64748b",
        fontStyle: "italic",
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
    countChip: {
        backgroundColor: "#e0f2fe",
        color: "#0369a1",
        fontWeight: 600,
    },
    // Estilos de linha para status de vencimento
    rowExpiringSoon: {
        backgroundColor: "#fef3c7 !important",
        "&:hover": {
            backgroundColor: "#fef3c7 !important",
        },
    },
    rowExpired: {
        backgroundColor: "#fee2e2 !important",
        "&:hover": {
            backgroundColor: "#fee2e2 !important",
        },
    },
}));

const Companies = () => {
    const classes = useStyles();
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [deletingCompany, setDeletingCompany] = useState(null);
    const [companyModalOpen, setCompanyModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [companies, dispatch] = useReducer(reducer, []);
    const { dateToClient, datetimeToClient } = useDate();

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function fetchData() {
            if (!user.super) {
                toast.error("Esta empresa não possui permissão para acessar essa página! Estamos lhe redirecionando.");
                setTimeout(() => {
                    history.push(`/`)
                }, 1000);
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch({ type: "RESET" });
        setPageNumber(1);
    }, [searchParam]);

    useEffect(() => {
        setLoading(true);
        const delayDebounceFn = setTimeout(() => {
            const fetchCompanies = async () => {
                try {
                    const { data } = await api.get("/companiesPlan/", {
                        params: { searchParam, pageNumber },
                    });
                    dispatch({ type: "LOAD_COMPANIES", payload: data.companies });
                    setHasMore(data.hasMore);
                    setLoading(false);
                } catch (err) {
                    toastError(err);
                }
            };
            fetchCompanies();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchParam, pageNumber]);

    useEffect(() => {
        const companyId = user.companyId;
        const socket = socketConnection({ companyId, userId: user.id });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleOpenCompanyModal = () => {
        setSelectedCompany(null);
        setCompanyModalOpen(true);
    };

    const handleCloseCompanyModal = () => {
        setSelectedCompany(null);
        setCompanyModalOpen(false);
    };

    const handleSearch = (event) => {
        setSearchParam(event.target.value.toLowerCase());
    };

    const handleEditCompany = (company) => {
        setSelectedCompany(company);
        setCompanyModalOpen(true);
    };

    const handleDeleteCompany = async (companyId) => {
        try {
            await api.delete(`/companies/${companyId}`);
            toast.success(i18n.t("compaies.toasts.deleted"));
        } catch (err) {
            toastError(err);
        }
        setDeletingCompany(null);
        setSearchParam("");
        setPageNumber(1);
    };

    const loadMore = () => {
        setPageNumber((prevState) => prevState + 1);
    };

    const handleScroll = (e) => {
        if (!hasMore || loading) return;
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - (scrollTop + 100) < clientHeight) {
            loadMore();
        }
    };

    const renderStatus = (status) => {
        return status === false ? (
            <Chip 
                label="Não" 
                icon={<CancelIcon />}
                className={classes.statusInactive}
                size="small"
            />
        ) : (
            <Chip 
                label="Sim" 
                icon={<CheckCircleIcon />}
                className={classes.statusActive}
                size="small"
            />
        );
    };

    const renderPlanValue = (row) => {
        const value = row.planId !== null ? row.plan.amount ? row.plan.amount.toLocaleString('pt-br', { minimumFractionDigits: 2 }) : '00.00' : "-";
        return value;
    };

    const getRowClassName = (record) => {
        if (moment(record.dueDate).isValid()) {
            const now = moment();
            const dueDate = moment(record.dueDate);
            const diff = dueDate.diff(now, "days");
            if (diff >= 1 && diff <= 5) {
                return classes.rowExpiringSoon;
            }
            if (diff <= 0) {
                return classes.rowExpired;
            }
        }
        return "";
    };

    // Calcular estatísticas
    const getCompanyStats = () => {
        const total = companies.length;
        const active = companies.filter(c => c.status === true).length;
        const totalRevenue = companies
            .filter(c => c.planId !== null && c.plan && c.plan.amount)
            .reduce((sum, c) => sum + c.plan.amount, 0);
        
        return { total, active, totalRevenue, plans: total };
    };

    const stats = getCompanyStats();

    return (
        <div className={classes.mainContainer}>
            <MainContainer>
                <ConfirmationModal
                    title={
                        deletingCompany &&
                        `${i18n.t("compaies.confirmationModal.deleteTitle")} ${deletingCompany.name}?`
                    }
                    open={confirmModalOpen}
                    onClose={setConfirmModalOpen}
                    onConfirm={() => handleDeleteCompany(deletingCompany.id)}
                >
                    {i18n.t("compaies.confirmationModal.deleteMessage")}
                </ConfirmationModal>
                
                <CompanyModal
                    open={companyModalOpen}
                    onClose={handleCloseCompanyModal}
                    aria-labelledby="form-dialog-title"
                    companyId={selectedCompany && selectedCompany.id}
                />

                <Container maxWidth="xl">
                    
                    {/* Header Modernizado */}
                    <Box className={classes.header}>
                        <div className={classes.headerContent}>
                            <BusinessIcon className={classes.headerIcon} />
                            <div>
                                <Typography className={classes.headerTitle}>
                                    {i18n.t("compaies.title")}
                                    <Chip 
                                        label={companies.length} 
                                        className={classes.countChip} 
                                        size="small" 
                                        style={{ marginLeft: 16 }}
                                    />
                                </Typography>
                                <Typography className={classes.headerSubtitle}>
                                    Gestiona empresas, planes y suscripciones al sistema.
                                </Typography>
                            </div>
                        </div>
                    </Box>

                    {/* Seção de Informações */}
                    <Paper className={classes.filtersSection} elevation={0}>
                        <Typography className={classes.filtersTitle}>
                            <FilterListIcon style={{ marginRight: 12 }} />
                            Dashboard de Empresas
                        </Typography>
                    </Paper>

                    {/* Cards de Estatísticas */}
                    <Box className={classes.statsGrid}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                            <div className={classes.statCard}>
                                <div className={`${classes.statIcon} ${classes.totalIcon}`}>
                                    <DomainIcon />
                                </div>
                                <div className={classes.statContent}>
                                    <Typography className={classes.statTitle}>
                                        Total de Empresas
                                    </Typography>
                                    <Typography className={classes.statValue}>
                                        {stats.total}
                                    </Typography>
                                </div>
                            </div>

                            <div className={classes.statCard}>
                                <div className={`${classes.statIcon} ${classes.activeIcon}`}>
                                    <CheckCircleIcon />
                                </div>
                                <div className={classes.statContent}>
                                    <Typography className={classes.statTitle}>
                                        Empresas Activas
                                    </Typography>
                                    <Typography className={classes.statValue}>
                                        {stats.active}
                                    </Typography>
                                </div>
                            </div>

                            <div className={classes.statCard}>
                                <div className={`${classes.statIcon} ${classes.planIcon}`}>
                                    <TrendingUpIcon />
                                </div>
                                <div className={classes.statContent}>
                                    <Typography className={classes.statTitle}>
                                        Planos Activos
                                    </Typography>
                                    <Typography className={classes.statValue}>
                                        {stats.plans}
                                    </Typography>
                                </div>
                            </div>

                            <div className={classes.statCard}>
                                <div className={`${classes.statIcon} ${classes.revenueIcon}`}>
                                    <AttachMoneyIcon />
                                </div>
                                <div className={classes.statContent}>
                                    <Typography className={classes.statTitle}>
                                        Ingresos totales ($)
                                    </Typography>
                                    <Typography className={classes.statValue}>
                                        {stats.totalRevenue.toLocaleString('pt-br', { minimumFractionDigits: 2 })}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </Box>

                    {/* Tabela Modernizada */}
                    <Paper className={classes.mainPaper} elevation={0}>
                        <TableContainer
                            style={{ 
                                maxHeight: 600,
                                overflowY: "auto"
                            }}
                            onScroll={handleScroll}
                        >
                            <Table stickyHeader className={classes.companiesTable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <LabelIcon style={{ marginRight: 8, color: "#64748b" }} />
                                                {i18n.t("compaies.table.ID")}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <CheckCircleIcon style={{ marginRight: 8, color: "#64748b" }} />
                                                {i18n.t("compaies.table.status")}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <BusinessIcon style={{ marginRight: 8, color: "#64748b" }} />
                                                {i18n.t("compaies.table.name")}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <EmailIcon style={{ marginRight: 8, color: "#64748b" }} />
                                                {i18n.t("compaies.table.email")}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <AccountBalanceIcon style={{ marginRight: 8, color: "#64748b" }} />
                                                {i18n.t("compaies.table.namePlan")}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <AttachMoneyIcon style={{ marginRight: 8, color: "#64748b" }} />
                                                {i18n.t("compaies.table.value")}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <EventIcon style={{ marginRight: 8, color: "#64748b" }} />
                                                {i18n.t("compaies.table.createdAt")}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <EventIcon style={{ marginRight: 8, color: "#64748b" }} />
                                                {i18n.t("compaies.table.dueDate")}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box display="flex" alignItems="center" justifyContent="center">
                                                <AccessTimeIcon style={{ marginRight: 8, color: "#64748b" }} />
                                                {i18n.t("compaies.table.lastLogin")}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {companies.length > 0 ? (
                                        <>
                                            {companies.map((company) => (
                                                <TableRow key={company.id} hover className={getRowClassName(company)}>
                                                    <TableCell align="center">
                                                        <Typography variant="body2" style={{ fontWeight: 600, color: "#3b82f6" }}>
                                                            #{company.id}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {renderStatus(company.status)}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography className={classes.companyName}>
                                                            {company.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography className={classes.companyEmail}>
                                                            {company.email}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip 
                                                            label={company.plan.name}
                                                            className={classes.planName}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography className={classes.priceText}>
                                                            $ {renderPlanValue(company)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography className={classes.dateText}>
                                                            {dateToClient(company.createdAt)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography className={classes.dateText}>
                                                            {dateToClient(company.dueDate)}
                                                        </Typography>
                                                        <Typography className={classes.recurrenceText}>
                                                            {company.recurrence}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography className={classes.dateText}>
                                                            {datetimeToClient(company.lastLogin)}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {loading && <TableRowSkeleton columns={9} />}
                                        </>
                                    ) : (
                                        !loading && (
                                            <TableRow>
                                                <TableCell colSpan={9} align="center">
                                                    <Box className={classes.emptyState}>
                                                        <BusinessIcon className={classes.emptyStateIcon} />
                                                        <Typography variant="h6" style={{ marginBottom: 8 }}>
                                                            No se encontraron empresas
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            Aquí aparecerán las empresas registradas.
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Container>
            </MainContainer>
        </div>
    );
};

export default Companies;