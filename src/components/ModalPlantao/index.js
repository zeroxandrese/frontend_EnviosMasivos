import React, { useState, useEffect, useContext } from "react";

import * as Yup from "yup";
import { Formik, Form, Field, FastField, FieldArray } from "formik";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

// Icons
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import ScheduleIcon from "@material-ui/icons/Schedule";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import NotificationsIcon from "@material-ui/icons/Notifications";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import { FormHelperText, Grid, Tooltip } from "@material-ui/core";
import NumberFormat from "react-number-format";
import toastError from "../../errors/toastError";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  
  // Dialog Responsivo - PADRÃO REFERÊNCIA
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
  
  // Header - CORES DO PADRÃO REFERÊNCIA
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
  
  // Content - PADRÃO REFERÊNCIA
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
  
  // Seções - PADRÃO REFERÊNCIA
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
  
  // Fields - PADRÃO REFERÊNCIA
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
  
  // Days Schedule Section
  dayRow: {
    background: "#f8fafc",
    borderRadius: "8px",
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    border: "1px solid #e2e8f0",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#f1f5f9",
    },
  },
  
  dayLabel: {
    color: "#1e293b",
    fontWeight: 600,
    fontSize: "14px",
    marginBottom: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  
  timeFields: {
    display: "flex",
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column",
    },
  },
  
  errorMessage: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(2),
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: 500,
  },
  
  // Actions - PADRÃO REFERÊNCIA
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
  
  // Scrollbar customizado - PADRÃO REFERÊNCIA
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

const initialValues = {
  userId: '',
  phone: '',
  interval: 1,
  days: [
    { weekday: "Segunda-feira", weekdayEn: "Monday", startTime: null, endTime: null, },
    { weekday: "Terça-feira", weekdayEn: "Tuesday", startTime: null, endTime: null, },
    { weekday: "Quarta-feira", weekdayEn: "Wednesday", startTime: null, endTime: null, },
    { weekday: "Quinta-feira", weekdayEn: "Thursday", startTime: null, endTime: null, },
    { weekday: "Sexta-feira", weekdayEn: "Friday", startTime: null, endTime: null },
    { weekday: "Sábado", weekdayEn: "Saturday", startTime: null, endTime: null },
    { weekday: "Domingo", weekdayEn: "Sunday", startTime: null, endTime: null },
  ]
};

const validationSchema = Yup.object().shape({
  userId: Yup.string().required('Informar al usuario'),
  phone: Yup.string().required('Introduzca el número de teléfono'),
  interval: Yup.number().required('Especifique el intervalo entre las notificaciones'),

  days: Yup.array()
    .of(
      Yup.object().shape({
        startTime: Yup.string()
          .nullable()
          .test(
            'startTime-required-if-endTime',
            'Informe o início do plantão',
            function (value) {
              const { endTime } = this.parent;
              if (endTime) {
                return !!value;
              }
              return true;
            }
          ),
        endTime: Yup.string()
          .nullable()
          .test(
            'endTime-required-if-startTime',
            'Informe o fim do plantão',
            function (value) {
              const { startTime } = this.parent;
              if (startTime) {
                return !!value;
              }
              return true;
            }
          ),
      })
    )
    .test(
      'at-least-one-day-filled',
      'Pelo menos um dia da semana deve ter o horário de início e fim preenchido',
      function (days) {
        return days.some(day => day.startTime && day.endTime);
      }
    ),
});

export const ModalPlantao = ({ open, onClose, plantaoId, callback }) => {

  const classes = useStyles();
  const [plantao, setPlantao] = useState(initialValues);

  useEffect(() => {
    if (plantaoId) {
      handleGetPlantaoDetails();
    }
  }, [plantaoId]);

  const handleClose = () => {
    onClose();
    setPlantao(initialValues);
  };

  const handleSave = async (values) => {
    try {
      const { data } = await api.post('/plantao', values);
      handleClose();
      callback();
    } catch (error) {
      console.log('erro ao salvar plantonista', error);
      toastError(error);
    }
  }

  const handleGetPlantaoDetails = async () => {
    try {
      const { data } = await api.get(`/plantao/${plantaoId}`);
      console.log('data', data);
      setPlantao(data);
    } catch (error) {
      console.log('erro ao buscar plantonista', error);
    }
  }

  const handleUpdatePlantao = async (values) => {
    try {
      const { data } = await api.put(`/plantao/${plantaoId}`, values);
      handleClose();
      callback();
    } catch (error) {
      console.log('erro ao atualizar plantonista', error);
    }
  }

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
            <ScheduleIcon className={classes.titleIcon} />
            {plantaoId ? "Editar de turno" : "Agregar asistente de guardia"}
          </Typography>
        </DialogTitle>
        
        <Formik
          initialValues={plantao}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              plantaoId
                ? handleUpdatePlantao(values)
                : handleSave(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values, setFieldValue }) => (
            <Form>
              <DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
                
                <Grid container spacing={3}>
                  
                  {/* Coluna Esquerda */}
                  <Grid item xs={12} md={6}>
                    
                    {/* Informações do Plantonista */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <PersonIcon className={classes.sectionIcon} />
                          Información del personal de guardia
                        </Typography>
                        
                        <div className={classes.fieldRow}>
                          <UsersContainer
                            value={values.userId}
                            setFieldValue={setFieldValue}
                            error={touched.userId && Boolean(errors.userId)}
                            helperText={touched.userId && errors.userId}
                          />
                        </div>
                        
                        <div className={classes.fieldRow}>
                          <TextField
                            value={values.phone}
                            label="Telefone"
                            placeholder="5513912344321"
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            onChange={(e) => setFieldValue('phone', e.target.value)}
                            error={touched.phone && Boolean(errors.phone)}
                            helperText={touched.phone && errors.phone}
                            InputProps={{
                              startAdornment: <PhoneIcon style={{ marginRight: 8, color: '#64748b' }} fontSize="small" />
                            }}
                          />
                        </div>
                        
                        <div className={classes.fieldRow}>
                          <TextField
                            value={values.interval.toString()}
                            label="Intervalo"
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            onChange={(e) => setFieldValue('interval', e.target.value)}
                            error={touched.interval && Boolean(errors.interval)}
                            helperText={touched.interval ? errors.interval : 'Intervalo entre notificaciones (minutos)'}
                            InputProps={{
                              startAdornment: <NotificationsIcon style={{ marginRight: 8, color: '#64748b' }} fontSize="small" />
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                  </Grid>
                  
                  {/* Coluna Direita */}
                  <Grid item xs={12} md={6}>
                    
                    {/* Horários da Semana */}
                    <Card className={classes.formSection}>
                      <CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
                        <Typography className={classes.sectionTitle}>
                          <CalendarTodayIcon className={classes.sectionIcon} />
                          Horario semanal
                        </Typography>
                        
                        {values.days.map((item, index) => {
                          const startTimeError = errors?.days?.[index]?.startTime;
                          const endTimeError = errors?.days?.[index]?.endTime;
                          const startTimeTouched = touched?.days?.[index]?.startTime;
                          const endTimeTouched = touched?.days?.[index]?.endTime;

                          return (
                            <div key={index} className={classes.dayRow}>
                              <div className={classes.dayLabel}>
                                <AccessTimeIcon fontSize="small" style={{ color: '#64748b' }} />
                                {item.weekday}
                              </div>
                              
                              <div className={classes.timeFields}>
                                <FastField name={`days[${index}].startTime`}>
                                  {({ field }) => (
                                    <NumberFormat
                                      label="Início"
                                      {...field}
                                      variant="outlined"
                                      size="small"
                                      customInput={TextField}
                                      format="##:##"
                                      className={classes.textField}
                                      error={startTimeTouched && Boolean(startTimeError)}
                                      helperText={startTimeTouched && startTimeError}
                                    />
                                  )}
                                </FastField>
                                
                                <FastField name={`days[${index}].endTime`}>
                                  {({ field }) => (
                                    <NumberFormat
                                      label="Fin"
                                      {...field}
                                      variant="outlined"
                                      size="small"
                                      customInput={TextField}
                                      format="##:##"
                                      className={classes.textField}
                                      error={endTimeTouched && Boolean(endTimeError)}
                                      helperText={endTimeTouched && endTimeError}
                                    />
                                  )}
                                </FastField>
                              </div>
                            </div>
                          );
                        })}
                        
                        {errors.days && typeof errors.days === 'string' && (
                          <div className={classes.errorMessage}>
                            {errors.days}
                          </div>
                        )}
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
                  {i18n.t("userModal.buttons.cancel")}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  className={`${classes.saveButton} ${classes.btnWrapper}`}
                  startIcon={<SaveIcon />}
                >
                  {plantaoId
                    ? i18n.t("userModal.buttons.okEdit")
                    : i18n.t("userModal.buttons.okAdd")}
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
}

export const UsersContainer = (props) => {
  const classes = useStyles();
  const { value, setFieldValue, error, helperText } = props;
  const [listUsersAttendance, setListUsersAttendance] = React.useState([]);

  useEffect(() => {
    fetchUsersAttendance();
  }, [])

  const fetchUsersAttendance = async () => {
    try {
      const { data } = await api.get(`/users/list`);
      setListUsersAttendance(data);
    } catch (error) {
      console.log('erro buscar usuarios', error);
    }
  };

  const handleChange = (event) => {
    const { value: selectedUser } = event.target;
    setFieldValue('userId', selectedUser);
  };

  return (
    <FormControl
      error={error}
      variant="outlined"
      size="small"
      fullWidth
      className={classes.formControl}
    >
      <InputLabel>Usuario</InputLabel>
      <Select
        value={value}
        label="Usuario"
        onChange={handleChange}
        MenuProps={MenuProps}
      >
        {listUsersAttendance.map((user) => (
          <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
        ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  )
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};