import React, { useState, useEffect, useRef } from "react";
import { parseISO, format } from "date-fns";
import * as Yup from "yup";
import { Formik, FieldArray, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Switch from "@material-ui/core/Switch";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";

// Icons que EXISTEM no Material-UI v4
import PersonIcon from "@material-ui/icons/Person";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import InfoIcon from "@material-ui/icons/Info";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import SettingsIcon from "@material-ui/icons/Settings";
import LockIcon from "@material-ui/icons/Lock";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import { TagsContainer } from "../TagsContainer";

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
		height: "auto",
		maxHeight: "calc(90vh - 200px)",
		overflowY: "auto",
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(2),
			maxHeight: "calc(100vh - 160px)",
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
	
	// Fields
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
	
	// Extra Info Section
	extraInfoContainer: {
		background: "#f8fafc",
		borderRadius: "8px",
		padding: theme.spacing(2),
		border: "1px solid #e2e8f0",
	},
	
	extraAttr: {
		display: "flex",
		alignItems: "center",
		gap: theme.spacing(1),
		marginBottom: theme.spacing(1.5),
		[theme.breakpoints.down('sm')]: {
			flexDirection: "column",
			alignItems: "stretch",
		},
	},
	
	extraInfoField: {
		flex: 1,
		"& .MuiOutlinedInput-root": {
			borderRadius: "6px",
			backgroundColor: "white",
		},
	},
	
	addButton: {
		background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
		color: "white",
		fontWeight: 600,
		textTransform: "none",
		borderRadius: "8px",
		padding: theme.spacing(1, 2),
		boxShadow: "0 2px 8px rgba(5, 150, 105, 0.3)",
		transition: "all 0.3s ease",
		"&:hover": {
			background: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
			transform: "translateY(-1px)",
		},
	},
	
	deleteButton: {
		color: "#dc2626",
		backgroundColor: "#fef2f2",
		borderRadius: "8px",
		padding: theme.spacing(0.5),
		transition: "all 0.3s ease",
		"&:hover": {
			backgroundColor: "#fee2e2",
			transform: "scale(1.1)",
		},
	},
	
	// Switch Section
	switchContainer: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(1.5),
		background: "#f8fafc",
		borderRadius: "8px",
		border: "1px solid #e2e8f0",
		marginBottom: theme.spacing(1),
		transition: "all 0.3s ease",
		"&:hover": {
			backgroundColor: "#f1f5f9",
		},
	},
	
	switchLabel: {
		marginLeft: theme.spacing(1),
		fontWeight: 500,
		color: "#374151",
	},
	
	// LGPD Info
	lgpdInfo: {
		display: "flex",
		alignItems: "center",
		gap: theme.spacing(1),
		padding: theme.spacing(1.5),
		background: "#f0f9ff",
		borderRadius: "8px",
		border: "1px solid #bae6fd",
		color: "#0369a1",
		fontWeight: 500,
		fontSize: "14px",
	},
	
	// Tags Container
	tagsWrapper: {
		marginBottom: theme.spacing(1.5),
		"& .MuiFormControl-root": {
			marginBottom: 0,
		},
	},
	
	// Actions
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
		background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
		color: "white",
		fontWeight: 600,
		textTransform: "none",
		borderRadius: "8px",
		padding: theme.spacing(1, 2.5),
		minHeight: "40px",
		boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
		transition: "all 0.3s ease",
		"&:hover": {
			background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
			transform: "translateY(-1px)",
		},
		"&:disabled": {
			background: "#cbd5e1",
			color: "#9ca3af",
		},
	},
	
	btnWrapper: {
		position: "relative",
	},
	
	buttonProgress: {
		color: "white",
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
	
	// Scrollbar
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

const ContactSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	number: Yup.string().min(8, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email"),
});

const ContactModal = ({ open, onClose, contactId, initialValues, onSave }) => {
	const classes = useStyles();
	const isMounted = useRef(true);

	const initialState = {
		name: "",
		number: "",
		email: "",
		disableBot: false,
		lgpdAcceptedAt: ""
	};

	const [contact, setContact] = useState(initialState);
	const [disableBot, setDisableBot] = useState(false);
	
	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		const fetchContact = async () => {
			if (initialValues) {
				setContact(prevState => {
					return { ...prevState, ...initialValues };
				});
			}

			if (!contactId) return;

			try {
				const { data } = await api.get(`/contacts/${contactId}`);
				if (isMounted.current) {
					setContact(data);
					setDisableBot(data.disableBot)
				}
			} catch (err) {
				toastError(err);
			}
		};

		fetchContact();
	}, [contactId, open, initialValues]);

	const handleClose = () => {
		onClose();
		setContact(initialState);
	};

	const handleSaveContact = async values => {
		console.log('ejecuto el button 1');
		try {
			if (contactId) {
				await api.put(`/contacts/${contactId}`, {...values, disableBot: disableBot});
				handleClose();
			} else {
				const { data } = await api.post("/contacts", {...values, disableBot: disableBot});
				console.log('ejecuto el button 2');
				if (onSave) {
					onSave(data);
				}
				handleClose();
			}
			toast.success(i18n.t("contactModal.success"));
		} catch (err) {
			toastError(err);
		}
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
						<AccountCircleIcon className={classes.titleIcon} />
						{contactId
							? i18n.t("contactModal.title.edit")
							: i18n.t("contactModal.title.add")}
					</Typography>
				</DialogTitle>
				
				<Formik
					initialValues={contact}
					enableReinitialize={true}
					validationSchema={ContactSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveContact(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ values, errors, touched, isSubmitting }) => (
						<Form>
							<DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
								
								{/* Informações Principais */}
								<Card className={classes.formSection}>
									<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
										<Typography className={classes.sectionTitle}>
											<PersonIcon className={classes.sectionIcon} />
											{i18n.t("contactModal.form.mainInfo")}
										</Typography>
										
										<div className={classes.fieldRow}>
											<Field
												as={TextField}
												label={i18n.t("contactModal.form.name")}
												name="name"
												autoFocus
												error={touched.name && Boolean(errors.name)}
												helperText={touched.name && errors.name}
												variant="outlined"
												size="small"
												className={classes.textField}
											/>
										</div>
										
										<div className={classes.fieldRow}>
											<Field
												as={TextField}
												label={i18n.t("contactModal.form.number")}
												name="number"
												error={touched.number && Boolean(errors.number)}
												helperText={touched.number && errors.number}
												placeholder="5513912344321"
												variant="outlined"
												size="small"
												className={classes.textField}
												InputProps={{
													startAdornment: <PhoneIcon style={{ marginRight: 8, color: "#64748b" }} />
												}}
											/>
											
											<Field
												as={TextField}
												label={i18n.t("contactModal.form.email")}
												name="email"
												error={touched.email && Boolean(errors.email)}
												helperText={touched.email && errors.email}
												placeholder="Email address"
												variant="outlined"
												size="small"
												className={classes.textField}
												InputProps={{
													startAdornment: <EmailIcon style={{ marginRight: 8, color: "#64748b" }} />
												}}
											/>
										</div>
										
										<Box className={classes.tagsWrapper}>
											<TagsContainer contact={contact} className={classes.textField} />
										</Box>
									</CardContent>
								</Card>

								{/* Configurações do Bot */}
								<Card className={classes.formSection}>
									<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
										<Typography className={classes.sectionTitle}>
											<SettingsIcon className={classes.sectionIcon} />
											Configuración del Chatbot
										</Typography>
										
										<Box className={classes.switchContainer}>
											<Switch
												size="small"
												checked={disableBot}
												onChange={() => setDisableBot(!disableBot)}
												name="disableBot"
												color="primary"
											/>
											<Typography className={classes.switchLabel}>
												{i18n.t("contactModal.form.chatBotContact")}
											</Typography>
										</Box>
									</CardContent>
								</Card>

								{/* Informações LGPD */}
								{contact?.lgpdAcceptedAt && (
									<Card className={classes.formSection}>
										<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
											<Typography className={classes.sectionTitle}>
												<LockIcon className={classes.sectionIcon} />
												{i18n.t("contactModal.form.termsLGDP")}
											</Typography>
											
											<Box className={classes.lgpdInfo}>
												<LockIcon fontSize="small" />
												<Typography>
													{format(new Date(contact?.lgpdAcceptedAt), "dd/MM/yyyy 'às' HH:mm")}
												</Typography>
											</Box>
										</CardContent>
									</Card>
								)}

								{/* Informações Extras */}
								<Card className={classes.formSection}>
									<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
										<Typography className={classes.sectionTitle}>
											<InfoIcon className={classes.sectionIcon} />
											{i18n.t("contactModal.form.extraInfo")}
										</Typography>

										<Box className={classes.extraInfoContainer}>
											<FieldArray name="extraInfo">
												{({ push, remove }) => (
													<>
														{values.extraInfo &&
															values.extraInfo.length > 0 &&
															values.extraInfo.map((info, index) => (
																<div
																	className={classes.extraAttr}
																	key={`${index}-info`}
																>
																	<Field
																		as={TextField}
																		label={i18n.t("contactModal.form.extraName")}
																		name={`extraInfo[${index}].name`}
																		variant="outlined"
																		size="small"
																		className={classes.extraInfoField}
																	/>
																	<Field
																		as={TextField}
																		label={i18n.t("contactModal.form.extraValue")}
																		name={`extraInfo[${index}].value`}
																		variant="outlined"
																		size="small"
																		className={classes.extraInfoField}
																	/>
																	<IconButton
																		size="small"
																		onClick={() => remove(index)}
																		className={classes.deleteButton}
																	>
																		<DeleteOutlineIcon fontSize="small" />
																	</IconButton>
																</div>
															))}
														
														<Button
															variant="contained"
															className={classes.addButton}
															onClick={() => push({ name: "", value: "" })}
															startIcon={<AddIcon />}
															fullWidth
														>
															{i18n.t("contactModal.buttons.addExtraInfo")}
														</Button>
													</>
												)}
											</FieldArray>
										</Box>
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
									{i18n.t("contactModal.buttons.cancel")}
								</Button>
								
								<Button
									type="submit"
									disabled={isSubmitting}
									variant="contained"
									className={`${classes.saveButton} ${classes.btnWrapper}`}
									startIcon={<SaveIcon />}
								>
									{contactId
										? i18n.t("contactModal.buttons.okEdit")
										: i18n.t("contactModal.buttons.okAdd")}
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

export default ContactModal;