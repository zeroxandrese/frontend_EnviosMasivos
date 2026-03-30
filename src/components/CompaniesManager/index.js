import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Select,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  InputAdornment,
  TableContainer,
  Chip,
  Tooltip
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import ButtonWithSpinner from "../ButtonWithSpinner";
import ConfirmationModal from "../ConfirmationModal";

import {
  Edit as EditIcon,
  Business,
  FilterList,
  Search,
  Add,
  Person,
  Email,
  Phone,
  Assignment,
  Schedule,
  MonetizationOn,
  CheckCircle,
  Cancel,
  Warning,
  Tune
} from "@material-ui/icons";

import { toast } from "react-toastify";
import useCompanies from "../../hooks/useCompanies";
import usePlans from "../../hooks/usePlans";
import ModalUsers from "../ModalUsers";
import api from "../../services/api";
import { head, isArray, has } from "lodash";
import { useDate } from "../../hooks/useDate";

import moment from "moment";
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
  activeIcon: {
    backgroundColor: "#dcfce7",
    color: "#059669",
  },
  inactiveIcon: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
  },
  warningIcon: {
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
  buttonContainer: {
    display: "flex",
    gap: theme.spacing(1),
    justifyContent: "flex-end",
    marginTop: theme.spacing(2),
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
      padding: theme.spacing(1.5),
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
  expiredRow: {
    backgroundColor: "#fecaca !important",
  },
  expiringRow: {
    backgroundColor: "#fef3c7 !important",
  },
  planChip: {
    backgroundColor: "#dbeafe",
    color: "#3b82f6",
    fontWeight: 600,
    fontSize: "12px",
  },
  valueCell: {
    fontFamily: "monospace",
    fontWeight: 600,
    color: "#059669",
  },
}));

export function CompanyForm(props) {
  const { onSubmit, onDelete, onCancel, initialValue, loading } = props;
  const classes = useStyles();
  const [plans, setPlans] = useState([]);
  const [modalUser, setModalUser] = useState(false);
  const [firstUser, setFirstUser] = useState({});

  const [record, setRecord] = useState({
    name: "",
    email: "",
    phone: "",
    planId: "",
    status: true,
    dueDate: "",
    recurrence: "",
    password: "",
    ...initialValue,
  });

  const { list: listPlans } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const list = await listPlans();
      setPlans(list);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRecord((prev) => {
      if (moment(initialValue).isValid()) {
        initialValue.dueDate = moment(initialValue.dueDate).format(
          "YYYY-MM-DD"
        );
      }
      return {
        ...prev,
        ...initialValue,
      };
    });
  }, [initialValue]);

  const handleSubmit = async (data) => {
    if (data.dueDate === "" || moment(data.dueDate).isValid() === false) {
      data.dueDate = null;
    }
    onSubmit(data);
    setRecord({ ...initialValue, dueDate: "" });
  };

  const handleOpenModalUsers = async () => {
    try {
      const { data } = await api.get("/users/list", {
        params: {
          companyId: initialValue.id,
        },
      });
      if (isArray(data) && data.length) {
        setFirstUser(head(data));
      }
      setModalUser(true);
    } catch (e) {
      toast.error(e);
    }
  };

  const handleCloseModalUsers = () => {
    setFirstUser({});
    setModalUser(false);
  };

  const incrementDueDate = () => {
    const data = { ...record };
    if (data.dueDate !== "" && data.dueDate !== null) {
      switch (data.recurrence) {
        case "MENSAL":
          data.dueDate = moment(data.dueDate)
            .add(1, "month")
            .format("YYYY-MM-DD");
          break;
        case "BIMESTRAL":
          data.dueDate = moment(data.dueDate)
            .add(2, "month")
            .format("YYYY-MM-DD");
          break;
        case "TRIMESTRAL":
          data.dueDate = moment(data.dueDate)
            .add(3, "month")
            .format("YYYY-MM-DD");
          break;
        case "SEMESTRAL":
          data.dueDate = moment(data.dueDate)
            .add(6, "month")
            .format("YYYY-MM-DD");
          break;
        case "ANUAL":
          data.dueDate = moment(data.dueDate)
            .add(12, "month")
            .format("YYYY-MM-DD");
          break;
        default:
          break;
      }
    }
    setRecord(data);
  };

  return (
    <>
      <ModalUsers
        userId={firstUser.id}
        companyId={initialValue.id}
        open={modalUser}
        onClose={handleCloseModalUsers}
      />
      
      <Paper className={classes.formSection} elevation={0}>
        <Typography className={classes.sectionTitle}>
          <Add style={{ marginRight: 12 }} />
          {record.id ? 'Editar Empresa' : 'Nueva Empresa'}
        </Typography>
        
        <Formik
          enableReinitialize
          initialValues={record}
          onSubmit={(values, { resetForm }) =>
            setTimeout(() => {
              handleSubmit(values);
              resetForm();
            }, 500)
          }
        >
          {(values, setValues) => (
            <Form>
              <Grid spacing={3} container>
                <Grid xs={12} sm={6} md={3} item>
                  <Field
                    as={TextField}
                    label={i18n.t("compaies.table.name")}
                    name="name"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    className={classes.formField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business color="secondary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                  <Field
                    as={TextField}
                    label={i18n.t("compaies.table.email")}
                    name="email"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    required
                    className={classes.formField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="secondary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={2} item>
                  <Field
                    as={TextField}
                    label={i18n.t("compaies.table.password")}
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    className={classes.formField}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={2} item>
                  <Field
                    as={TextField}
                    label={i18n.t("compaies.table.phone")}
                    name="phone"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    className={classes.formField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="secondary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid xs={12} sm={6} md={2} item>
                  <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                    <InputLabel htmlFor="plan-selection">{i18n.t("compaies.table.plan")}</InputLabel>
                    <Field
                      as={Select}
                      id="plan-selection"
                      label={i18n.t("compaies.table.plan")}
                      labelId="plan-selection-label"
                      name="planId"
                      margin="dense"
                      required
                    >
                      {plans.map((plan, key) => (
                        <MenuItem key={key} value={plan.id}>
                          {plan.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>
                
                <Grid xs={12} sm={6} md={2} item>
                  <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                    <InputLabel htmlFor="status-selection">{i18n.t("compaies.table.active")}</InputLabel>
                    <Field
                      as={Select}
                      id="status-selection"
                      label={i18n.t("compaies.table.active")}
                      labelId="status-selection-label"
                      name="status"
                      margin="dense"
                    >
                      <MenuItem value={true}>{i18n.t("compaies.table.yes")}</MenuItem>
                      <MenuItem value={false}>{i18n.t("compaies.table.no")}</MenuItem>
                    </Field>
                  </FormControl>
                </Grid>
                
                <Grid xs={12} sm={6} md={2} item>
                  <Field
                    as={TextField}
                    label={i18n.t("compaies.table.document")}
                    name="document"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    className={classes.formField}
                  />
                </Grid>
                
                <Grid xs={12} sm={6} md={2} item>
                  <FormControl variant="outlined" fullWidth className={classes.formField}>
                    <Field
                      as={TextField}
                      label={i18n.t("compaies.table.dueDate")}
                      type="date"
                      name="dueDate"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      fullWidth
                      margin="dense"
                    />
                  </FormControl>
                </Grid>
                
                <Grid xs={12} sm={6} md={2} item>
                  <FormControl margin="dense" variant="outlined" fullWidth className={classes.formField}>
                    <InputLabel htmlFor="recorrencia-selection">
                    {i18n.t("compaies.table.recurrence")}
                    </InputLabel>
                    <Field
                      as={Select}
                      label="Recorrência"
                      labelId="recorrencia-selection-label"
                      id="recurrence"
                      name="recurrence"
                      margin="dense"
                    >
                      <MenuItem value="MENSAL">{i18n.t("compaies.table.monthly")}</MenuItem>
                      <MenuItem value="BIMESTRAL">{i18n.t("compaies.table.bimonthly")}</MenuItem>
                      <MenuItem value="TRIMESTRAL">{i18n.t("compaies.table.quarterly")}</MenuItem>
                      <MenuItem value="SEMESTRAL">{i18n.t("compaies.table.semester")}</MenuItem>
                      <MenuItem value="ANUAL">{i18n.t("compaies.table.yearly")}</MenuItem>
                    </Field>
                  </FormControl>
                </Grid>
                
                <Grid xs={12} item>
                  <div className={classes.buttonContainer}>
                    <ButtonWithSpinner
                      loading={loading}
                      onClick={() => onCancel()}
                      variant="contained"
                      style={{ backgroundColor: "#64748b" }}
                    >
                      {i18n.t("compaies.table.clear")}
                    </ButtonWithSpinner>
                    
                    {record.id !== undefined && (
                      <>
                        <ButtonWithSpinner
                          className={classes.dangerButton}
                          loading={loading}
                          onClick={() => onDelete(record)}
                          variant="contained"
                        >
                          {i18n.t("compaies.table.delete")}
                        </ButtonWithSpinner>
                        
                        <ButtonWithSpinner
                          className={classes.secondaryButton}
                          loading={loading}
                          onClick={() => incrementDueDate()}
                          variant="contained"
                        >
                          {i18n.t("compaies.table.dueDate")}
                        </ButtonWithSpinner>
                        
                        <ButtonWithSpinner
                          className={classes.secondaryButton}
                          loading={loading}
                          onClick={() => handleOpenModalUsers()}
                          variant="contained"
                        >
                          {i18n.t("compaies.table.user")}
                        </ButtonWithSpinner>
                      </>
                    )}
                    
                    <ButtonWithSpinner
                      className={classes.primaryButton}
                      loading={loading}
                      type="submit"
                      variant="contained"
                    >
                      {i18n.t("compaies.table.save")}
                    </ButtonWithSpinner>
                  </div>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </>
  );
}

export function CompaniesManagerGrid(props) {
  const { records, onSelect } = props;
  const classes = useStyles();
  const { dateToClient, datetimeToClient } = useDate();

  const renderStatus = (row) => {
    return row.status === false ? "Não" : "Sim";
  };

  const renderPlan = (row) => {
    return row.planId !== null ? row.plan.name : "-";
  };

  const renderPlanValue = (row) => {
    return row.planId !== null ? row.plan.amount ? row.plan.amount.toLocaleString('pt-br', { minimumFractionDigits: 2 }) : '00.00' : "-";
  };

  const rowStyle = (record) => {
    if (moment(record.dueDate).isValid()) {
      const now = moment();
      const dueDate = moment(record.dueDate);
      const diff = dueDate.diff(now, "days");
      if (diff >= 1 && diff <= 5) {
        return classes.expiringRow;
      }
      if (diff <= 0) {
        return classes.expiredRow;
      }
    }
    return {};
  };

  return (
    <Paper className={classes.tableSection} elevation={0}>
      <TableContainer style={{ maxHeight: 600, overflowY: "auto" }}>
        <Table
          stickyHeader
          className={classes.companiesTable}
          size="small"
          aria-label="companies table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center" style={{ width: "50px" }}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <EditIcon style={{ color: "#64748b" }} />
                </Box>
              </TableCell>
              <TableCell align="left">
                <Box display="flex" alignItems="center">
                  <Business style={{ marginRight: 8, color: "#64748b" }} />
                  {i18n.t("compaies.table.name")}
                </Box>
              </TableCell>
              <TableCell align="left">
                <Box display="flex" alignItems="center">
                  <Email style={{ marginRight: 8, color: "#64748b" }} />
                  {i18n.t("compaies.table.email")}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Phone style={{ marginRight: 8, color: "#64748b" }} />
                  {i18n.t("compaies.table.phone")}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Assignment style={{ marginRight: 8, color: "#64748b" }} />
                  {i18n.t("compaies.table.plan")}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <MonetizationOn style={{ marginRight: 8, color: "#64748b" }} />
                  {i18n.t("compaies.table.value")}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <CheckCircle style={{ marginRight: 8, color: "#64748b" }} />
                  {i18n.t("compaies.table.active")}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Schedule style={{ marginRight: 8, color: "#64748b" }} />
                  {i18n.t("compaies.table.createdAt")}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Schedule style={{ marginRight: 8, color: "#64748b" }} />
                  {i18n.t("compaies.table.dueDate")}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Person style={{ marginRight: 8, color: "#64748b" }} />
                  {i18n.t("compaies.table.lastLogin")}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((row, key) => (
              <TableRow 
                key={key} 
                hover 
                className={rowStyle(row)}
              >
                <TableCell align="center">
                  <IconButton 
                    onClick={() => onSelect(row)} 
                    className={classes.editIcon}
                    size="small"
                    title="Editar empresa"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell align="left">
                  <Typography className={classes.companyName}>
                    {row.name || "-"}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography className={classes.companyEmail}>
                    {row.email || "-"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {row.phone || "-"}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={renderPlan(row)}
                    className={classes.planChip}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography className={classes.valueCell}>
                    {i18n.t("compaies.table.money")} {renderPlanValue(row)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={renderStatus(row)}
                    className={row.status ? classes.statusActive : classes.statusInactive}
                    size="small"
                    icon={row.status ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" style={{ fontSize: "12px", color: "#64748b" }}>
                    {dateToClient(row.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box>
                    <Typography variant="body2" style={{ fontSize: "12px", color: "#64748b" }}>
                      {dateToClient(row.dueDate)}
                    </Typography>
                    {row.recurrence && (
                      <Typography variant="caption" style={{ fontSize: "10px", color: "#64748b" }}>
                        {row.recurrence}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" style={{ fontSize: "12px", color: "#64748b" }}>
                    {datetimeToClient(row.lastLogin)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default function CompaniesManager() {
  const classes = useStyles();
  const { list, save, update, remove } = useCompanies();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [record, setRecord] = useState({
    name: "",
    email: "",
    phone: "",
    planId: "",
    status: true,
    dueDate: "",
    recurrence: "",
    password: "",
    document: "",
    paymentMethod: ""
  });

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const companyList = await list();
      setRecords(companyList);
    } catch (e) {
      toast.error("No se pudo cargar la lista de registros");
    }
    setLoading(false);
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (data.id !== undefined) {
        await update(data);
      } else {
        await save(data);
      }
      await loadPlans();
      handleCancel();
      toast.success("Operación realizada con éxito!");
    } catch (e) {
      toast.error(
        "No se pudo completar la operación. Por favor, compruebe si ya existe una empresa con el mismo nombre o si los campos se han rellenado correctamente"
      );
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await remove(record.id);
      await loadPlans();
      handleCancel();
      toast.success("Operación realizada con éxito!");
    } catch (e) {
      toast.error("La operación no pudo completarse");
    }
    setLoading(false);
  };

  const handleOpenDeleteDialog = () => {
    setShowConfirmDialog(true);
  };

  const handleCancel = () => {
    setRecord((prev) => ({
      ...prev,
      name: "",
      email: "",
      phone: "",
      planId: "",
      status: true,
      dueDate: "",
      recurrence: "",
      password: "",
      document: "",
      paymentMethod: ""
    }));
  };

  const handleSelect = (data) => {
    setRecord((prev) => ({
      ...prev,
      id: data.id,
      name: data.name || "",
      phone: data.phone || "",
      email: data.email || "",
      planId: data.planId || "",
      status: data.status === false ? false : true,
      dueDate: data.dueDate || "",
      recurrence: data.recurrence || "",
      password: "",
      document: data.document || "",
      paymentMethod: data.paymentMethod || "",
    }));
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  // Filtrar empresas baseado na busca
  const filteredRecords = records.filter(company => 
    company.name?.toLowerCase().includes(searchParam) ||
    company.email?.toLowerCase().includes(searchParam) ||
    company.phone?.toLowerCase().includes(searchParam) ||
    company.plan?.name?.toLowerCase().includes(searchParam)
  );

  // Calcular estatísticas das empresas
  const getCompanyStats = () => {
    const total = records.length;
    const active = records.filter(c => c.status === true).length;
    const inactive = records.filter(c => c.status === false).length;
    
    // Contar empresas próximas ao vencimento
    const now = moment();
    const expiring = records.filter(c => {
      if (moment(c.dueDate).isValid()) {
        const diff = moment(c.dueDate).diff(now, "days");
        return diff >= 1 && diff <= 5;
      }
      return false;
    }).length;

    return { total, active, inactive, expiring };
  };

  const stats = getCompanyStats();

  return (
    <div className={classes.mainContainer}>
      <Container maxWidth="xl">
        
        {/* Header */}
        <Box className={classes.header}>
          <div className={classes.headerContent}>
            <Business className={classes.headerIcon} />
            <div>
              <Typography className={classes.headerTitle}>
                Gestión Empresarial
              </Typography>
              <Typography className={classes.headerSubtitle}>
                Gestionar empresas, planes y configuraciones.
              </Typography>
            </div>
          </div>
        </Box>

        {/* Busca */}
        <Paper className={classes.filtersSection} elevation={0}>
          <Typography className={classes.filtersTitle}>
            <FilterList style={{ marginRight: 12 }} />
            Buscar Empresas
          </Typography>
          <TextField
            placeholder="Buscar por nombre, correo electrónico, número de teléfono o plan..."
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
                <Business />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Total Empresas
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.total}
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.activeIcon}`}>
                <CheckCircle />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Activas
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.active}
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.inactiveIcon}`}>
                <Cancel />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Inactivas
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.inactive}
                </Typography>
              </div>
            </div>

            <div className={classes.statCard}>
              <div className={`${classes.statIcon} ${classes.warningIcon}`}>
                <Warning />
              </div>
              <div className={classes.statContent}>
                <Typography className={classes.statTitle}>
                  Fecha de vencimiento próxima
                </Typography>
                <Typography className={classes.statValue}>
                  {stats.expiring}
                </Typography>
              </div>
            </div>
          </div>
        </Box>

        {/* Formulário */}
        <CompanyForm
          initialValue={record}
          onDelete={handleOpenDeleteDialog}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />

        {/* Tabela */}
        <CompaniesManagerGrid 
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
  );
}