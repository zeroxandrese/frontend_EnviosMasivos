import React, { useState, useEffect } from "react";
import { makeStyles, TextField, Grid, Typography, Card, CardContent, Box } from "@material-ui/core";
import { Formik, Form, FastField, FieldArray } from "formik";
import { isArray } from "lodash";
import NumberFormat from "react-number-format";
import ButtonWithSpinner from "../ButtonWithSpinner";
import { i18n } from "../../translate/i18n";

// Icons
import ScheduleIcon from "@material-ui/icons/Schedule";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  
  fullWidth: {
    width: "100%",
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
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
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
  
  // Fields Compactos
  textField: {
    width: "100%",
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
      "&.Mui-disabled": {
        backgroundColor: "#f1f5f9",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#e2e8f0",
        },
      },
    },
    "& .MuiInputLabel-root": {
      color: "#64748b",
      fontWeight: 500,
      fontSize: "14px",
      "&.Mui-disabled": {
        color: "#94a3b8",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "12px 14px",
      fontSize: "14px",
      "&.Mui-disabled": {
        color: "#64748b",
        fontWeight: 600,
      },
    },
  },
  
  // Time Field Styling
  timeField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
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
      fontSize: "14px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "12px 14px",
      fontSize: "14px",
      fontFamily: "monospace",
      fontWeight: 500,
    },
  },
  
  // Day Card Styling
  dayCard: {
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    borderRadius: "12px",
    padding: theme.spacing(2),
    border: "1px solid #e2e8f0",
    height: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: "#cbd5e1",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    },
  },
  
  // Period Sections
  periodSection: {
    background: "white",
    borderRadius: "8px",
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    border: "1px solid #e2e8f0",
    "&:last-child": {
      marginBottom: 0,
    },
  },
  
  periodTitle: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    marginBottom: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
  
  // Controls
  control: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  
  // Button Container
  buttonContainer: {
    textAlign: "center",
    padding: theme.spacing(3, 1, 1, 1),
  },
  
  // Modern Button Styling (aplicado via props no ButtonWithSpinner)
  saveButton: {
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    color: "white",
    fontWeight: 600,
    textTransform: "none",
    borderRadius: "12px",
    padding: theme.spacing(1.5, 4),
    minHeight: "48px",
    fontSize: "14px",
    boxShadow: "0 4px 15px rgba(5, 150, 105, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(5, 150, 105, 0.4)",
    },
    "&:disabled": {
      background: "#cbd5e1",
      color: "#9ca3af",
      transform: "none",
      boxShadow: "none",
    },
  },
  
  // Grid Container
  gridContainer: {
    marginBottom: theme.spacing(2),
  },
  
  // Header Section
  headerSection: {
    background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    borderRadius: "16px",
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    color: "white",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    "&:before": {
      content: '""',
      position: "absolute",
      top: "-30px",
      right: "-30px",
      width: "80px",
      height: "80px",
      background: "rgba(255,255,255,0.08)",
      borderRadius: "50%",
    },
  },
  
  headerTitle: {
    fontWeight: 700,
    fontSize: "20px",
    marginBottom: theme.spacing(0.5),
    position: "relative",
    zIndex: 1,
  },
  
  headerSubtitle: {
    opacity: 0.9,
    fontSize: "14px",
    position: "relative",
    zIndex: 1,
  },
  
  // Responsive adjustments
  [theme.breakpoints.down('sm')]: {
    control: {
      paddingRight: theme.spacing(0.5),
      paddingLeft: theme.spacing(0.5),
    },
    dayCard: {
      padding: theme.spacing(1.5),
    },
    periodSection: {
      padding: theme.spacing(1),
    },
  },
}));

function SchedulesForm(props) {
  const { initialValues, onSubmit, loading, labelSaveButton } = props;
  const classes = useStyles();

  const [schedules, setSchedules] = useState([
    { weekday: i18n.t("queueModal.serviceHours.monday"), weekdayEn: "monday", startTimeA: "", endTimeA: "", startTimeB: "", endTimeB: "", },
    { weekday: i18n.t("queueModal.serviceHours.tuesday"), weekdayEn: "tuesday", startTimeA: "", endTimeA: "", startTimeB: "", endTimeB: "", },
    { weekday: i18n.t("queueModal.serviceHours.wednesday"), weekdayEn: "wednesday", startTimeA: "", endTimeA: "", startTimeB: "", endTimeB: "", },
    { weekday: i18n.t("queueModal.serviceHours.thursday"), weekdayEn: "thursday", startTimeA: "", endTimeA: "", startTimeB: "", endTimeB: "", },
    { weekday: i18n.t("queueModal.serviceHours.friday"), weekdayEn: "friday", startTimeA: "", endTimeA: "", startTimeB: "", endTimeB: "", },
    { weekday: i18n.t("queueModal.serviceHours.saturday"), weekdayEn: "saturday", startTimeA: "", endTimeA: "", startTimeB: "", endTimeB: "", },
    { weekday: i18n.t("queueModal.serviceHours.sunday"), weekdayEn: "sunday", startTimeA: "", endTimeA: "", startTimeB: "", endTimeB: "", },
  ]);

  useEffect(() => {
    if (isArray(initialValues) && initialValues.length > 0) {
      setSchedules(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className={classes.root}>
      
      {/* Header */}
      <Box className={classes.headerSection}>
        <Typography className={classes.headerTitle}>
          <ScheduleIcon style={{ marginRight: 8, fontSize: "24px" }} />
          Horários de Funcionamento
        </Typography>
        <Typography className={classes.headerSubtitle}>
          Configure os horários de atendimento para cada dia da semana
        </Typography>
      </Box>

      <Formik
        enableReinitialize
        className={classes.fullWidth}
        initialValues={{ schedules }}
        onSubmit={({ schedules }) =>
          setTimeout(() => {
            handleSubmit(schedules);
          }, 500)
        }
      >
        {({ values }) => (
          <Form className={classes.fullWidth}>
            <FieldArray
              name="schedules"
              render={(arrayHelpers) => (
                <Grid spacing={3} container className={classes.gridContainer}>
                  {values.schedules.map((item, index) => {
                    return (
                      <Grid key={index} xs={12} sm={6} lg={4} item>
                        <Card className={classes.dayCard} elevation={0}>
                          <CardContent style={{ padding: 0 }}>
                            
                            {/* Nome do Dia */}
                            <Box marginBottom={2}>
                              <FastField
                                as={TextField}
                                label={i18n.t("queueModal.serviceHours.dayWeek")}
                                name={`schedules[${index}].weekday`}
                                disabled
                                variant="outlined"
                                className={classes.textField}
                                size="small"
                              />
                            </Box>

                            {/* Primeiro Período */}
                            <Box className={classes.periodSection}>
                              <Typography className={classes.periodTitle}>
                                <AccessTimeIcon fontSize="inherit" />
                                Primeiro Período
                              </Typography>
                              
                              <Grid container spacing={1}>
                                <Grid xs={6} item>
                                  <FastField
                                    label={i18n.t("queueModal.serviceHours.startTimeA")}
                                    name={`schedules[${index}].startTimeA`}
                                  >
                                    {({ field }) => (
                                      <NumberFormat
                                        {...field}
                                        variant="outlined"
                                        customInput={TextField}
                                        format="##:##"
                                        className={classes.timeField}
                                        label={i18n.t("queueModal.serviceHours.startTimeA")}
                                        size="small"
                                        placeholder="08:00"
                                      />
                                    )}
                                  </FastField>
                                </Grid>
                                <Grid xs={6} item>
                                  <FastField
                                    label={i18n.t("queueModal.serviceHours.endTimeA")}
                                    name={`schedules[${index}].endTimeA`}
                                  >
                                    {({ field }) => (
                                      <NumberFormat
                                        {...field}
                                        variant="outlined"
                                        customInput={TextField}
                                        format="##:##"
                                        className={classes.timeField}
                                        label={i18n.t("queueModal.serviceHours.endTimeA")}
                                        size="small"
                                        placeholder="12:00"
                                      />
                                    )}
                                  </FastField>
                                </Grid>
                              </Grid>
                            </Box>

                            {/* Segundo Período */}
                            <Box className={classes.periodSection}>
                              <Typography className={classes.periodTitle}>
                                <AccessTimeIcon fontSize="inherit" />
                                Segundo Período
                              </Typography>
                              
                              <Grid container spacing={1}>
                                <Grid xs={6} item>
                                  <FastField
                                    label={i18n.t("queueModal.serviceHours.startTimeB")}
                                    name={`schedules[${index}].startTimeB`}
                                  >
                                    {({ field }) => (
                                      <NumberFormat
                                        {...field}
                                        variant="outlined"
                                        customInput={TextField}
                                        format="##:##"
                                        className={classes.timeField}
                                        label={i18n.t("queueModal.serviceHours.startTimeB")}
                                        size="small"
                                        placeholder="13:00"
                                      />
                                    )}
                                  </FastField>
                                </Grid>
                                <Grid xs={6} item>
                                  <FastField
                                    label={i18n.t("queueModal.serviceHours.endTimeB")}
                                    name={`schedules[${index}].endTimeB`}
                                  >
                                    {({ field }) => (
                                      <NumberFormat
                                        {...field}
                                        variant="outlined"
                                        customInput={TextField}
                                        format="##:##"
                                        className={classes.timeField}
                                        label={i18n.t("queueModal.serviceHours.endTimeB")}
                                        size="small"
                                        placeholder="18:00"
                                      />
                                    )}
                                  </FastField>
                                </Grid>
                              </Grid>
                            </Box>

                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            ></FieldArray>
            
            <div className={classes.buttonContainer}>
              <ButtonWithSpinner
                loading={loading}
                type="submit"
                color="primary"
                variant="contained"
                className={classes.saveButton}
                startIcon={<SaveIcon />}
              >
                {labelSaveButton ?? i18n.t("whatsappModal.buttons.okEdit")}
              </ButtonWithSpinner>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SchedulesForm;