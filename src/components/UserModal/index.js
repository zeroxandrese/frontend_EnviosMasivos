import React, { useState, useEffect, useContext, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

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
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

// Icons
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import PhoneIcon from "@material-ui/icons/Phone";
import SecurityIcon from "@material-ui/icons/Security";
import ScheduleIcon from "@material-ui/icons/Schedule";
import WorkIcon from "@material-ui/icons/Work";
import MessageIcon from "@material-ui/icons/Message";
import SettingsIcon from "@material-ui/icons/Settings";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import QueueMusicIcon from "@material-ui/icons/QueueMusic";

import whatsappIcon from '../../assets/nopicture.png'
import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import { AuthContext } from "../../context/Auth/AuthContext";
import useWhatsApps from "../../hooks/useWhatsApps";

import { Can } from "../Can";
import { Avatar, Input } from "@material-ui/core";
import { getBackendUrl } from "../../config";

const backendUrl = getBackendUrl();
const getBaseName = (value) => {
	if (!value || typeof value !== "string") return "";
	const normalized = value.split("?")[0].split("#")[0].replace(/\\/g, "/");
	const parts = normalized.split("/");
	return parts[parts.length - 1] || "";
};

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	
	// Dialog Responsivo
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
	
	// Avatar Section Compacta
	avatarSection: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: theme.spacing(2),
		background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
		borderRadius: "16px",
		marginBottom: theme.spacing(2),
		border: "1px solid #e2e8f0",
		height: "fit-content",
	},
	
	avatar: {
		width: theme.spacing(10),
		height: theme.spacing(10),
		marginBottom: theme.spacing(1),
		cursor: 'pointer',
		borderRadius: '50%',
		border: '3px solid #e2e8f0',
		boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
		transition: "all 0.3s ease",
		"&:hover": {
			transform: "scale(1.05)",
			border: '3px solid #3b82f6',
		},
		[theme.breakpoints.down('sm')]: {
			width: theme.spacing(8),
			height: theme.spacing(8),
		},
	},
	
	avatarErrorBorder: {
		border: '3px solid #dc2626',
	},
	
	uploadButton: {
		background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
		color: "white",
		fontWeight: 600,
		textTransform: "none",
		borderRadius: "8px",
		padding: theme.spacing(0.5, 2),
		marginBottom: theme.spacing(0.5),
		fontSize: "12px",
		minHeight: "32px",
		boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
		transition: "all 0.3s ease",
		"&:hover": {
			background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
			transform: "translateY(-1px)",
		},
	},
	
	removeButton: {
		color: "#dc2626",
		borderColor: "#dc2626",
		fontWeight: 600,
		textTransform: "none",
		borderRadius: "8px",
		fontSize: "11px",
		minHeight: "28px",
		padding: theme.spacing(0.5, 1.5),
		"&:hover": {
			backgroundColor: "#fef2f2",
		},
	},
	
	updateInput: {
		display: 'none',
	},
	
	errorText: {
		color: '#dc2626',
		fontSize: '0.75rem',
		fontWeight: 'bold',
		marginTop: theme.spacing(0.5),
		textAlign: "center",
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
	
	// Queue Select Wrapper
	queueSelectWrapper: {
		marginBottom: theme.spacing(1.5),
		"& .MuiFormControl-root": {
			marginBottom: 0,
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
}));

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email").required("Required"),
});

const UserModal = ({ open, onClose, userId }) => {
	const classes = useStyles();

	const initialState = {
		name: "",
		email: "",
		password: "",
		profile: "user",
		startWork: "00:00",
		endWork: "23:59",
		farewellMessage: "",
		allTicket: "disable",
		allowGroup: false,
		defaultTheme: "light",
		defaultMenu: "open",
		wpp: "",
	};

	const { user: loggedInUser } = useContext(AuthContext);

	const [user, setUser] = useState(initialState);
	const [selectedQueueIds, setSelectedQueueIds] = useState([]);
	const [selectedQueueIdsRead, setSelectedQueueIdsRead] = useState([]);
	const [whatsappId, setWhatsappId] = useState(false);
	const { loading, whatsApps } = useWhatsApps();
	const [profileUrl, setProfileUrl] = useState(null)

	const startWorkRef = useRef();
	const endWorkRef = useRef();

	useEffect(() => {
		const fetchUser = async () => {
			if (!userId) return;
			try {
				const { data } = await api.get(`/users/${userId}`);
				setUser(prevState => {
					return { ...prevState, ...data };
				});

				const { profileImage } = data;
				setProfileUrl(`${backendUrl}/public/company${data.companyId}/user/${profileImage}`);

				const userQueueIds = data.queues?.map(queue => queue.id);
				setSelectedQueueIds(userQueueIds);
				setWhatsappId(data.whatsappId ? data.whatsappId : '');
			} catch (err) {
				toastError(err);
			}
		};

		fetchUser();
	}, [userId, open]);

	const handleClose = () => {
		onClose();
		setUser(initialState);
	};

	const handleSaveUser = async values => {
		const uploadAvatar = async (file) => {
			const formData = new FormData();
			formData.append('userId', file.id);
			formData.append('typeArch', "user");
			formData.append('profileImage', file.profileImage);

			const { data } = await api.post(`/users/${file.id}/media-upload`, formData);

			localStorage.setItem("profileImage", data.user.profileImage);
		}
		
		const userData = { ...values, whatsappId, queueIds: selectedQueueIds };
		try {
			if (userId) {
				const { data } = await api.put(`/users/${userId}`, userData);
				window.localStorage.setItem("preferredTheme", values.defaultTheme);

				if (user.profileImage && user.profileImage !== getBaseName(profileUrl))
					uploadAvatar(user)
			} else {
				const { data } = await api.post("/users", userData);
				window.localStorage.setItem("preferredTheme", values.defaultTheme);

				if (user.profileImage && user.avatar)
					uploadAvatar(user)
			}

			toast.success(i18n.t("userModal.success"));
		} catch (err) {
			toastError(err);
		}
		handleClose();
	};

	const handleUpdateProfileImage = (e) => {
		if (!e.target.files[0]) return;

		const newAvatarUrl = URL.createObjectURL(e.target.files[0]);
		setUser(prevState => ({
			...prevState,
			avatar: newAvatarUrl,
			profileImage: e.target.files[0]
		}));
		setProfileUrl(newAvatarUrl);
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
						<PersonIcon className={classes.titleIcon} />
						{userId
							? i18n.t("userModal.title.edit")
							: i18n.t("userModal.title.add")}
					</Typography>
				</DialogTitle>
				
				<Formik
					initialValues={user}
					enableReinitialize={true}
					validationSchema={UserSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveUser(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form>
							<DialogContent className={`${classes.dialogContent} ${classes.customScrollbar}`}>
								
								<Grid container spacing={3} className={classes.gridContainer}>
									
									{/* Coluna Esquerda */}
									<Grid item xs={12} md={6}>
										
										{/* Avatar */}
										<Box className={classes.avatarSection}>
											<label htmlFor="profileImage">
												<Avatar
													src={profileUrl ? profileUrl : whatsappIcon}
													alt="profile-image"
													className={`${classes.avatar} ${touched.profileImage && errors.profileImage ? classes.avatarErrorBorder : ''}`}
												/>
											</label>
											
											<Button
												variant="contained"
												component="label"
												htmlFor="profileImage"
												className={classes.uploadButton}
												startIcon={<PhotoCameraIcon fontSize="small" />}
												size="small"
											>
												{profileUrl ? "Alterar" : "Adicionar"}
											</Button>
											
											{touched.profileImage && errors.profileImage && (
												<Typography className={classes.errorText}>
													{errors.profileImage}
												</Typography>
											)}
											
											<Input
												type="file"
												name="profileImage"
												id="profileImage"
												className={classes.updateInput}
												onChange={event => handleUpdateProfileImage(event)}
											/>
											
											{user.avatar && (
												<Button
													variant="outlined"
													className={classes.removeButton}
													startIcon={<DeleteIcon fontSize="small" />}
													size="small"
													onClick={() => {
														setUser(prevState => ({ ...prevState, avatar: null, profileImage: null }));
														setProfileUrl(whatsappIcon);
													}}
												>
													Remover
												</Button>
											)}
										</Box>

										{/* Informações Básicas */}
										<Card className={classes.formSection}>
											<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
												<Typography className={classes.sectionTitle}>
													<PersonIcon className={classes.sectionIcon} />
													Informações Básicas
												</Typography>
												
												<div className={classes.fieldRow}>
													<Field
														as={TextField}
														label={i18n.t("userModal.form.name")}
														autoFocus
														name="name"
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
														label={i18n.t("userModal.form.email")}
														name="email"
														error={touched.email && Boolean(errors.email)}
														helperText={touched.email && errors.email}
														variant="outlined"
														size="small"
														className={classes.textField}
													/>
												</div>
												
												<div className={classes.fieldRow}>
													<Field
														as={TextField}
														label={i18n.t("userModal.form.password")}
														type="password"
														name="password"
														error={touched.password && Boolean(errors.password)}
														helperText={touched.password && errors.password}
														variant="outlined"
														size="small"
														className={classes.textField}
													/>
												</div>

												<div className={classes.fieldRow}>
													<Field
														as={TextField}
														label={i18n.t("contactModal.form.number")}
														name="wpp"
														placeholder="5513912344321"
														error={touched.wpp && Boolean(errors.wpp)}
														helperText={touched.wpp && errors.wpp}
														variant="outlined"
														size="small"
														className={classes.textField}
													/>
												</div>
												
												<Can
													role={loggedInUser.profile}
													perform="user-modal:editProfile"
													yes={() => (
														<FormControl
															variant="outlined"
															className={classes.formControl}
															size="small"
															fullWidth
														>
															<InputLabel id="profile-selection-input-label">
																{i18n.t("userModal.form.profile")}
															</InputLabel>
															<Field
																as={Select}
																label={i18n.t("userModal.form.profile")}
																name="profile"
																labelId="profile-selection-label"
																id="profile-selection"
																required
															>
																<MenuItem value="admin">Admin</MenuItem>
																<MenuItem value="user">User</MenuItem>
															</Field>
														</FormControl>
													)}
												/>
											</CardContent>
										</Card>

										{/* Horário de Trabalho */}
										<Card className={classes.formSection}>
											<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
												<Typography className={classes.sectionTitle}>
													<ScheduleIcon className={classes.sectionIcon} />
													Horário de Trabalho
												</Typography>
												
												<Can
													role={loggedInUser.profile}
													perform="user-modal:editProfile"
													yes={() => (
														<div className={classes.fieldRow}>
															<Field
																as={TextField}
																label={i18n.t("userModal.form.startWork")}
																type="time"
																ampm={"false"}
																inputRef={startWorkRef}
																InputLabelProps={{
																	shrink: true,
																}}
																inputProps={{
																	step: 600,
																}}
																name="startWork"
																error={touched.startWork && Boolean(errors.startWork)}
																helperText={touched.startWork && errors.startWork}
																variant="outlined"
																size="small"
																className={classes.textField}
															/>
															<Field
																as={TextField}
																label={i18n.t("userModal.form.endWork")}
																type="time"
																ampm={"false"}
																inputRef={endWorkRef}
																InputLabelProps={{
																	shrink: true,
																}}
																inputProps={{
																	step: 600,
																}}
																name="endWork"
																error={touched.endWork && Boolean(errors.endWork)}
																helperText={touched.endWork && errors.endWork}
																variant="outlined"
																size="small"
																className={classes.textField}
															/>
														</div>
													)}
												/>
											</CardContent>
										</Card>

									</Grid>
									
									{/* Coluna Direita */}
									<Grid item xs={12} md={6}>
										
										{/* Filas e WhatsApp */}
										<Card className={classes.formSection}>
											<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
												<Typography className={classes.sectionTitle}>
													<QueueMusicIcon className={classes.sectionIcon} />
													Filas e Integrações
												</Typography>
												
												<Can
													role={loggedInUser.profile}
													perform="user-modal:editQueues"
													yes={() => (
														<Box className={classes.queueSelectWrapper}>
															<QueueSelect
																selectedQueueIds={selectedQueueIds}
																onChange={values => setSelectedQueueIds(values)}
																fullWidth
															/>
														</Box>
													)}
												/>
												
												<Can
													role={loggedInUser.profile}
													perform="user-modal:editQueues"
													yes={() => (
														<Box className={classes.queueSelectWrapper}>
															<QueueSelect
																selectedQueueIds={selectedQueueIdsRead}
																onChange={values => setSelectedQueueIdsRead(values)}
																fullWidth
																label={"RO"}
															/>
														</Box>
													)}
												/>
												
												<Can
													role={loggedInUser.profile}
													perform="user-modal:editProfile"
													yes={() => (
														<FormControl 
															variant="outlined" 
															className={classes.formControl} 
															size="small"
															fullWidth
														>
															<InputLabel>
																{i18n.t("userModal.form.whatsapp")}
															</InputLabel>
															<Field
																as={Select}
																value={whatsappId}
																onChange={(e) => setWhatsappId(e.target.value)}
																label={i18n.t("userModal.form.whatsapp")}
															>
																<MenuItem value={''}>&nbsp;</MenuItem>
																{whatsApps.map((whatsapp) => (
																	<MenuItem key={whatsapp.id} value={whatsapp.id}>
																		{whatsapp.name}
																	</MenuItem>
																))}
															</Field>
														</FormControl>
													)}
												/>
											</CardContent>
										</Card>

										{/* Permissões */}
										<Card className={classes.formSection}>
											<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
												<Typography className={classes.sectionTitle}>
													<SecurityIcon className={classes.sectionIcon} />
													Permissões
												</Typography>
												
												<div className={classes.fieldRow}>
													<Can
														role={loggedInUser.profile}
														perform="user-modal:editProfile"
														yes={() => (
															<FormControl
																variant="outlined"
																className={classes.formControl}
																size="small"
															>
																<InputLabel>
																	{i18n.t("userModal.form.allTicket")}
																</InputLabel>
																<Field
																	as={Select}
																	label={i18n.t("userModal.form.allTicket")}
																	name="allTicket"
																	type="allTicket"
																	required
																>
																	<MenuItem value="enable">
																		{i18n.t("userModal.form.allTicketEnable")}
																	</MenuItem>
																	<MenuItem value="disable">
																		{i18n.t("userModal.form.allTicketDisable")}
																	</MenuItem>
																</Field>
															</FormControl>
														)}
													/>
													
													<Can
														role={loggedInUser.profile}
														perform="user-modal:editProfile"
														yes={() => (
															<FormControl
																variant="outlined"
																className={classes.formControl}
																size="small"
															>
																<InputLabel>
																	{i18n.t("userModal.form.allowGroup")}
																</InputLabel>
																<Field
																	as={Select}
																	label={i18n.t("userModal.form.allowGroup")}
																	name="allowGroup"
																	type="allowGroup"
																	required
																>
																	<MenuItem value={true}>
																		{i18n.t("userModal.form.allTicketEnable")}
																	</MenuItem>
																	<MenuItem value={false}>
																		{i18n.t("userModal.form.allTicketDisable")}
																	</MenuItem>
																</Field>
															</FormControl>
														)}
													/>
												</div>
											</CardContent>
										</Card>

										{/* Preferências */}
										<Card className={classes.formSection}>
											<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
												<Typography className={classes.sectionTitle}>
													<SettingsIcon className={classes.sectionIcon} />
													Preferências
												</Typography>
												
												<div className={classes.fieldRow}>
													<FormControl
														variant="outlined"
														className={classes.formControl}
														size="small"
													>
														<InputLabel>
															{i18n.t("userModal.form.defaultTheme")}
														</InputLabel>
														<Field
															as={Select}
															label={i18n.t("userModal.form.defaultTheme")}
															name="defaultTheme"
															type="defaultTheme"
															required
														>
															<MenuItem value="light">
																{i18n.t("userModal.form.defaultThemeLight")}
															</MenuItem>
															<MenuItem value="dark">
																{i18n.t("userModal.form.defaultThemeDark")}
															</MenuItem>
														</Field>
													</FormControl>

													<FormControl
														variant="outlined"
														className={classes.formControl}
														size="small"
													>
														<InputLabel>
															{i18n.t("userModal.form.defaultMenu")}
														</InputLabel>
														<Field
															as={Select}
															label={i18n.t("userModal.form.defaultMenu")}
															name="defaultMenu"
															type="defaultMenu"
															required
														>
															<MenuItem value={"open"}>
																{i18n.t("userModal.form.defaultMenuOpen")}
															</MenuItem>
															<MenuItem value={"closed"}>
																{i18n.t("userModal.form.defaultMenuClosed")}
															</MenuItem>
														</Field>
													</FormControl>
												</div>
											</CardContent>
										</Card>

										{/* Mensagem de Despedida */}
										<Card className={classes.formSection}>
											<CardContent style={{ padding: "16px", paddingBottom: "16px" }}>
												<Typography className={classes.sectionTitle}>
													<MessageIcon className={classes.sectionIcon} />
													Mensagem de Despedida
												</Typography>
												
												<Field
													as={TextField}
													label={i18n.t("userModal.form.farewellMessage")}
													type="farewellMessage"
													multiline
													rows={3}
													name="farewellMessage"
													error={touched.farewellMessage && Boolean(errors.farewellMessage)}
													helperText={touched.farewellMessage && errors.farewellMessage}
													variant="outlined"
													size="small"
													className={classes.textField}
													fullWidth
												/>
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
									{userId
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
};

export default UserModal;