import React, { useState, useEffect, useReducer, useContext } from "react";

import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Pagination from "@material-ui/lab/Pagination";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import * as XLSX from 'xlsx';

import api from "../../../services/api";
import TableRowSkeleton from "../../../components/TableRowSkeleton";

import { i18n } from "../../../translate/i18n";
import MainHeader from "../../../components/MainHeader";
import Title from "../../../components/Title";
import MainContainer from "../../../components/MainContainer";
import toastError from "../../../errors/toastError";
import { AuthContext } from "../../../context/Auth/AuthContext";

import { 
    CircularProgress, 
    FormControl, 
    Grid, 
    IconButton, 
    InputLabel, 
    MenuItem, 
    Select, 
    TextField, 
    Tooltip, 
} from "@material-ui/core";
import { UsersFilter } from "../../../components/UsersFilter";
import { WhatsappsFilter } from "../../../components/WhatsappsFilter";
import { StatusFilter } from "../../../components/StatusFilter";
import useDashboard from "../../../hooks/useDashboard";
import { TagsFilter } from '../../../components/TagsFilter';
import QueueSelect from "../../../components/QueueSelect";
import moment from "moment";

import { blue, green } from "@material-ui/core/colors";
import { 
  Facebook, 
  Forward, 
  History, 
  Instagram, 
  SaveAlt, 
  Visibility, 
  WhatsApp,
  FilterList,
  Assessment,
  Search,
  TableChart
} from "@material-ui/icons";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    maxWidth: "1400px",
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
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
  formControl: {
    minWidth: "100%",
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
  textField: {
    width: "100%",
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
  filterButton: {
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    borderRadius: "16px",
    padding: theme.spacing(2, 4),
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    minHeight: "56px",
    fontSize: "16px",
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
      transform: "translateY(-2px)",
    },
  },
  exportButton: {
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    borderRadius: "16px",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    minHeight: "56px",
    fontSize: "16px",
    boxShadow: "0 4px 15px rgba(5, 150, 105, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
      boxShadow: "0 8px 25px rgba(5, 150, 105, 0.4)",
      transform: "translateY(-2px)",
    },
  },
  tableCard: {
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    border: "none",
    overflow: "hidden",
    marginBottom: theme.spacing(4),
  },
  tableContainer: {
    maxHeight: "68vh",
    overflow: "auto",
    ...theme.scrollbarStylesSoftBig,
  },
  modernTable: {
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
    "& .MuiTableRow-root:hover": {
      backgroundColor: "#e2e8f0",
      transition: "background-color 0.2s ease",
    },
    "& .MuiTableCell-root": {
      borderBottom: "1px solid #e2e8f0",
      padding: theme.spacing(2),
    },
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  },
  paginationSection: {
    background: "white",
    borderRadius: "20px",
    padding: theme.spacing(3),
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionButton: {
    color: "#059669",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#047857",
      transform: "scale(1.1)",
    },
  },
  statusChip: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
    textAlign: "center",
    minWidth: "80px",
  },
  statusOpen: {
    background: "#dbeafe",
    color: "#1d4ed8",
  },
  statusClosed: {
    background: "#dcfce7",
    color: "#166534",
  },
  statusPending: {
    background: "#fef3c7",
    color: "#92400e",
  },
  mainContainer: {
    background: "#f1f5f9",
    minHeight: "100vh",
  },
}));

const GridReport = () => {
  const classes = useStyles();
  const history = useHistory();
  const { getReport } = useDashboard();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [searchParam, setSearchParam] = useState("");
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [selectedWhatsapp, setSelectedWhatsapp] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const [tagIds, setTagIds] = useState([]);
  const [queueIds, setQueueIds] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [options, setOptions] = useState([]);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [totalTickets, setTotalTickets] = useState(0);
  const [tickets, setTickets] = useState([]);

  const [openTicketMessageDialog, setOpenTicketMessageDialog] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          const { data } = await api.get("contacts", {
            params: { searchParam },
          });
          setOptions(data.contacts);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };
      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, []);

  const handleSelectedTags = (selecteds) => {
    const tags = selecteds.map((t) => t.id);
    setTagIds(tags);
  };

  const exportarGridParaExcel = async () => {
    setLoading(true);

    try {
      const data = await getReport({
        searchParam,
        contactId: selectedContactId,
        whatsappId: JSON.stringify(selectedWhatsapp),
        tags: JSON.stringify(tagIds),
        users: JSON.stringify(userIds),
        queueIds: JSON.stringify(queueIds),
        status: JSON.stringify(selectedStatus),
        dateFrom,
        dateTo,
        page: 1,
        pageSize: 9999999,
      });

      const ticketsData = data.tickets.map(ticket => {
        const createdAt = new Date(ticket.createdAt);
        const closedAt = new Date(ticket.closedAt);

        const data = ticket.createdAt.slice(0, -5);
        const hora = ticket.createdAt.slice(11, -5);

        const dataFechamento = closedAt.toLocaleDateString();
        const horaFechamento = closedAt.toLocaleTimeString();
        const dataCriacao = createdAt.toLocaleDateString();
        const horaCriacao = createdAt.toLocaleTimeString();

        return {
          id: ticket.id,
          Conexão: ticket.whatsappName,
          Contato: ticket.contactName,
          Usuário: ticket.userName,
          Fila: ticket.queueName,
          Status: ticket.status,
          ÚltimaMensagem: ticket.lastMessage,
          DataHoraAbertura: ticket.createdAt,
          DataHoraFechamento: ticket.closedAt === null ? "" : ticket.closedAt,
          TempoDeAtendimento: ticket.supportTime,
          nps: ticket.NPS,
        }
      });

      const ws = XLSX.utils.json_to_sheet(ticketsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'RelatorioDeAtendimentos');
      XLSX.writeFile(wb, 'relatorio-de-atendimentos.xlsx');

      setPageNumber(pageNumber);
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (pageNumber) => {
    setLoading(true);

    try {
      const data = await getReport({
        searchParam,
        contactId: selectedContactId,
        whatsappId: JSON.stringify(selectedWhatsapp),
        tags: JSON.stringify(tagIds),
        users: JSON.stringify(userIds),
        queueIds: JSON.stringify(queueIds),
        status: JSON.stringify(selectedStatus),
        dateFrom,
        dateTo,
        page: pageNumber,
        pageSize: pageSize,
      });

      setTotalTickets(data.totalTickets.total);
      setHasMore(data.tickets.length === pageSize);
      setTickets(data.tickets);
      setPageNumber(pageNumber);
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectedUsers = (selecteds) => {
    const users = selecteds.map((t) => t.id);
    setUserIds(users);
  };

  const handleSelectedWhatsapps = (selecteds) => {
    const whatsapp = selecteds.map((t) => t.id);
    setSelectedWhatsapp(whatsapp);
  };

  const handleSelectedStatus = (selecteds) => {
    const statusFilter = selecteds.map((t) => t.status);
    setSelectedStatus(statusFilter);
  };

  const renderOption = (option) => {
    if (option.number) {
      return <>
        <Typography component="span" style={{ fontSize: 14, marginLeft: "10px", display: "inline-flex", alignItems: "center", lineHeight: "2" }}>
          {option.name} - {option.number}
        </Typography>
      </>
    } else {
      return `${i18n.t("newTicketModal.add")} ${option.name}`;
    }
  };

  const handleSelectOption = (e, newValue) => {
    setSelectedContactId(newValue.id);
    setSearchParam("");
  };

  const renderOptionLabel = option => {
    if (option.number) {
      return `${option.name} - ${option.number}`;
    } else {
      return `${option.name}`;
    }
  };

  const filter = createFilterOptions({
    trim: true,
  });

  const createAddContactOption = (filterOptions, params) => {
    const filtered = filter(filterOptions, params);
    if (params.inputValue !== "" && !loading && searchParam.length >= 3) {
      filtered.push({
        name: `${params.inputValue}`,
      });
    }
    return filtered;
  };

  const renderContactAutocomplete = () => {
    return (
      <Autocomplete
        fullWidth
        options={options}
        loading={loading}
        clearOnBlur
        autoHighlight
        freeSolo
        size="small"
        clearOnEscape
        getOptionLabel={renderOptionLabel}
        renderOption={renderOption}
        filterOptions={createAddContactOption}
        onChange={(e, newValue) => handleSelectOption(e, newValue)}
        renderInput={params => (
          <TextField
            {...params}
            label={i18n.t("newTicketModal.fieldLabel")}
            variant="outlined"
            autoFocus
            size="small"
            className={classes.textField}
            onChange={e => setSearchParam(e.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    )
  }

  const getStatusChipClass = (status) => {
    switch(status) {
      case "open":
        return `${classes.statusChip} ${classes.statusOpen}`;
      case "closed":
        return `${classes.statusChip} ${classes.statusClosed}`;
      case "pending":
        return `${classes.statusChip} ${classes.statusPending}`;
      default:
        return classes.statusChip;
    }
  };

  const formatStatus = (status) => {
    switch(status) {
      case "open":
        return "Abierto";
      case "closed":
        return "Fechado";
      case "pending":
        return "Pendente";
      default:
        return status;
    }
  };

  return (
    <div className={classes.mainContainer}>
      <Container maxWidth="xl" className={classes.container}>
        
        {/* Header Section */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <Assessment className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                {/*i18n.t("reportsGrid.title")*/}
                Informes de servicio
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Informe completo de rendimiento operativo y de servicio
              </Typography>
            </div>
          </div>
        </Box>

        {/* Filters Section */}
        <Paper className={classes.filtersSection} elevation={0}>
          <Typography className={classes.filtersTitle}>
            <FilterList style={{ marginRight: 12 }} />
            Filtros y configuraciones
          </Typography>
          
          <Grid container spacing={3} alignItems="flex-end">
            {/* Primeira linha de filtros */}
            <Grid item xs={12} sm={6} md={3}>
              {renderContactAutocomplete()}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <WhatsappsFilter onFiltered={handleSelectedWhatsapps} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatusFilter onFiltered={handleSelectedStatus} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <UsersFilter onFiltered={handleSelectedUsers} />
            </Grid>
            
            {/* Segunda linha de filtros */}
            <Grid item xs={12} sm={6} md={3}>
              <TagsFilter onFiltered={handleSelectedTags} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QueueSelect
                selectedQueueIds={queueIds}
                onChange={values => setQueueIds(values)}
              />
            </Grid>

            {/* Linha para seleção de datas */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Data Inicial"
                type="date"
                value={dateFrom}
                variant="outlined"
                fullWidth
                size="small"
                className={classes.textField}
                onChange={(e) => setDateFrom(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Data Final"
                type="date"
                value={dateTo}
                variant="outlined"
                fullWidth
                size="small"
                className={classes.textField}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Linha para botões */}
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
              <Button
                variant="contained"
                onClick={exportarGridParaExcel}
                className={classes.exportButton}
                startIcon={<SaveAlt />}
                disabled={loading}
              >
                Exportar Excel
              </Button>
              <Button
                variant="contained"
                onClick={() => handleFilter(pageNumber)}
                className={classes.filterButton}
                startIcon={<Search />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : "Filtrar"}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Table Section */}
        <Paper className={classes.tableCard} elevation={0}>
          <div className={classes.tableContainer}>
            {loading ? (
              <div className={classes.loadingContainer}>
                <CircularProgress size={40} />
              </div>
            ) : (
              <Table size="small" className={classes.modernTable} id="grid-attendants">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <TableChart style={{ marginRight: 8, color: "#64748b" }} />
                        {i18n.t("reportsGrid.table.id")}
                      </Box>
                    </TableCell>
                    <TableCell align="left">{/*i18n.t("reportsGrid.table.whatsapp")*/} Conexión</TableCell>
                    <TableCell align="left">{i18n.t("reportsGrid.table.contact")}</TableCell>
                    <TableCell align="left">{i18n.t("reportsGrid.table.user")}</TableCell>
                    <TableCell align="left">{/*i18n.t("reportsGrid.table.queue")*/}Cola</TableCell>
                    <TableCell align="center">{i18n.t("reportsGrid.table.status")}</TableCell>
                    <TableCell align="left">{i18n.t("reportsGrid.table.lastMessage")}</TableCell>
                    <TableCell align="center">{/*i18n.t("reportsGrid.table.dateOpen")*/} Fecha apertura</TableCell>
                    <TableCell align="center">{/*i18n.t("reportsGrid.table.dateClose")*/} Fecha cierre</TableCell>
                    <TableCell align="center">{/*i18n.t("reportsGrid.table.supportTime")*/}Tiempo servicio</TableCell>
                    <TableCell align="center">{i18n.t("reportsGrid.table.NPS")}</TableCell>
                    <TableCell align="center">{/*i18n.t("reportsGrid.table.actions")*/}Comportamiento</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell align="center">
                          <Typography variant="body1" style={{ fontWeight: 600, color: "#1e293b" }}>
                            {ticket.id}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{ticket?.whatsappName}</TableCell>
                        <TableCell align="left">{ticket?.contactName}</TableCell>
                        <TableCell align="left">{ticket?.userName}</TableCell>
                        <TableCell align="left">{ticket?.queueName}</TableCell>
                        <TableCell align="center">
                          <span className={getStatusChipClass(ticket?.status)}>
                            {formatStatus(ticket?.status)}
                          </span>
                        </TableCell>
                        <TableCell align="left" style={{ maxWidth: "200px" }}>
                          <Typography variant="body2" noWrap>
                            {ticket?.lastMessage}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" style={{ color: "#64748b" }}>
                            {ticket?.createdAt}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" style={{ color: "#64748b" }}>
                            {ticket?.closedAt}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" style={{ color: "#0891b2", fontWeight: 600 }}>
                            {ticket?.supportTime}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body1" style={{ fontWeight: 600, color: "#059669" }}>
                            {ticket?.NPS || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Boleto de Acceso">
                            <Forward
                              onClick={() => { history.push(`/tickets/${ticket.uuid}`) }}
                              fontSize="small"
                              className={classes.actionButton}
                            />
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12} align="center" style={{ padding: "60px" }}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <TableChart style={{ fontSize: "64px", color: "#cbd5e1", marginBottom: "16px" }} />
                          <Typography color="textSecondary" variant="h6" style={{ marginBottom: "8px" }}>
                            {loading ? "Cargando datos..." : "No se encontraron entradas"}
                          </Typography>
                          {!loading && (
                            <Typography color="textSecondary" variant="body2">
                              Ajustar filtros o consultar el periodo seleccionado
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                  {loading && <TableRowSkeleton avatar columns={12} />}
                </TableBody>
              </Table>
            )}
          </div>
        </Paper>

        {/* Pagination Section */}
        <Paper className={classes.paginationSection} elevation={0}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" style={{ color: "#64748b", fontWeight: 500 }}>
              Total de registros: <strong style={{ color: "#1e293b" }}>{totalTickets}</strong>
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={3}>
            <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
              <InputLabel>Por página</InputLabel>
              <Select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                label="Por página"
                className={classes.formControl}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            
            <Pagination
              count={Math.ceil(totalTickets / pageSize)}
              page={pageNumber}
              onChange={(event, value) => handleFilter(value)}
              color="primary"
              shape="rounded"
              showFirstButton
              showLastButton
            />
          </Box>
        </Paper>

      </Container>
    </div>
  );
};

export default GridReport;