import React, { useState, useEffect, useContext } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { FormControl } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment"
import { AuthContext } from "../../context/Auth/AuthContext";
import { isArray, capitalize } from "lodash";

// Icons
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import ScheduleIcon from "@material-ui/icons/Schedule";
import PersonIcon from "@material-ui/icons/Person";
import MessageIcon from "@material-ui/icons/Message";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	
	// Dialog Responsivo
	dialogPaper: {
		borderRadius: "20px",
		maxWidth: "800px",
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
	
	// Grid Responsivo
	gridContainer: {
		height: "100%",
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
	
	// Autocomplete Styling
	autocompleteRoot: {
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
}));

const ScheduleSchema = Yup.object().shape({
	body: Yup.string()
		.min(5, "Mensagem muito curta")
		.required("Obrigatório"),
	contactId: Yup.number().required("Obrigatório"),
	sendAt: Yup.string().required("Obrigatório")
});

const ScheduleModal = ({ open, onClose, scheduleId, contactId, cleanContact, reload }) => {
	const classes = useStyles();
	const history = useHistory();
	const { user } = useContext(AuthContext);

	const initialState = {
		body: "",
		contactId: "",
		sendAt: moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
		sentAt: ""
	};

	const initialContact = {
		id: "",
		name: ""
	}

	const [schedule, setSchedule] = useState(initialState);
	const [currentContact, setCurrentContact] = useState(initialContact);
	const [contacts, setContacts] = useState([initialContact]);

	useEffect(() => {
		if (contactId && contacts.length) {
			const contact = contacts.find(c => c.id === contactId);
			if (contact) {
				setCurrentContact(contact);
			}
		}
	}, [contactId, contacts]);

	useEffect(() => {
		const { companyId } = user;
		if (open) {
			try {
				(async () => {
					const { data: contactList } = await api.get('/contacts/list', { params: { companyId: companyId } });
					let customList = contactList.map((c) => ({id: c.id, name: c.name}));
					if (isArray(customList)) {
						setContacts([{id: "", name: ""}, ...customList]);
					}
					if (contactId) {
						setSchedule(prevState => {
							return { ...prevState, contactId }
						});
					}

					if (!scheduleId) return;

					const { data } = await api.get(`/schedules/${scheduleId}`);
					setSchedule(prevState => {
						return { ...prevState, ...data, sendAt: moment(data.sendAt).format('YYYY-MM-DDTHH:mm') };
					});
					setCurrentContact(data.contact);
				})()
			} catch (err) {
				toastError(err);
			}
		}
	}, [scheduleId, contactId, open, user]);

	const handleClose = () => {
		onClose();
		setSchedule(initialState);
	};

	const handleSaveSchedule = async values => {
		const scheduleData = { ...values, userId: user.id };
		try {
			if (scheduleId) {
				await api.put(`/schedules/${scheduleId}`, scheduleData);
			} else {
				await api.post("/schedules", scheduleData);
			}
			toast.success(i18n.t("scheduleModal.success"));
			if (typeof reload == 'function') {
				reload();
			}
			if (contactId) {
				if (typeof cleanContact === 'function') {
					cleanContact();
					history.push('/schedules');
				}
			}
		} catch (err) {
			toastError(err);
		}
		setCurrentContact(initialContact);
		setSchedule(initialState);
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
						<ScheduleIcon className={classes.titleIcon} />
						{schedule.status === 'ERRO' ? 'Erro de Envio' : `${i18n.t("scheduleModal.form.body")} ${capitalize(schedule.status)}`}
					</Typography>
				</DialogTitle>
				
				<Formik
					initialValues={schedule}
					enableReinitialize={true}
					validationSchema={ScheduleSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveSchedule(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting, values }) => (
						<Form>
							<DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
								
								<Grid container spacing={3} className={classes.gridContainer}>
									
									{/* Coluna Esquerda */}
									<Grid item xs={12} md={6}>
										
										{/* Seleção de Contato */}
										<Card className={classes.formSection}>
											<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
												<Typography className={classes.sectionTitle}>
													<PersonIcon className={classes.sectionIcon} />
													Destinatário
												</Typography>
												
												<div className={classes.fieldRow}>
													<FormControl
														variant="outlined"
														fullWidth
														className={classes.formControl}
													>
														<Autocomplete
															fullWidth
															value={currentContact}
															options={contacts}
															onChange={(e, contact) => {
																const contactId = contact ? contact.id : '';
																setSchedule({ ...schedule, contactId });
																setCurrentContact(contact ? contact : initialContact);
															}}
															getOptionLabel={(option) => option.name}
															getOptionSelected={(option, value) => {
																return value.id === option.id
															}}
															className={classes.autocompleteRoot}
															renderInput={(params) => 
																<TextField 
																	{...params} 
																	variant="outlined" 
																	placeholder={i18n.t("scheduleModal.form.contact")}
																	className={classes.textField}
																	size="small"
																/>
															}
														/>
													</FormControl>
												</div>
											</CardContent>
										</Card>

										{/* Agendamento */}
										<Card className={classes.formSection}>
											<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
												<Typography className={classes.sectionTitle}>
													<AccessTimeIcon className={classes.sectionIcon} />
													Data e Hora
												</Typography>
												
												<div className={classes.fieldRow}>
													<Field
														as={TextField}
														label={i18n.t("scheduleModal.form.sendAt")}
														type="datetime-local"
														name="sendAt"
														InputLabelProps={{
														  shrink: true,
														}}
														error={touched.sendAt && Boolean(errors.sendAt)}
														helperText={touched.sendAt && errors.sendAt}
														variant="outlined"
														size="small"
														className={classes.textField}
														fullWidth
													/>
												</div>
											</CardContent>
										</Card>

									</Grid>
									
									{/* Coluna Direita */}
									<Grid item xs={12} md={6}>
										
										{/* Mensagem */}
										<Card className={classes.formSection}>
											<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
												<Typography className={classes.sectionTitle}>
													<MessageIcon className={classes.sectionIcon} />
													Conteúdo da Mensagem
												</Typography>
												
												<div className={classes.fieldRow}>
													<Field
														as={TextField}
														rows={9}
														multiline={true}
														label={i18n.t("scheduleModal.form.body")}
														name="body"
														error={touched.body && Boolean(errors.body)}
														helperText={touched.body && errors.body}
														variant="outlined"
														size="small"
														className={classes.textField}
														fullWidth
													/>
												</div>
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
									{i18n.t("scheduleModal.buttons.cancel")}
								</Button>
								
								{(schedule.sentAt === null || schedule.sentAt === "") && (
									<Button
										type="submit"
										disabled={isSubmitting}
										variant="contained"
										className={`${classes.saveButton} ${classes.btnWrapper}`}
										startIcon={<SaveIcon />}
									>
										{scheduleId
											? `${i18n.t("scheduleModal.buttons.okEdit")}`
											: `${i18n.t("scheduleModal.buttons.okAdd")}`}
										{isSubmitting && (
											<CircularProgress
												size={24}
												className={classes.buttonProgress}
											/>
										)}
									</Button>
								)}
							</DialogActions>
						</Form>
					)}
				</Formik>
			</Dialog>
		</div>
	);
};

export default ScheduleModal;