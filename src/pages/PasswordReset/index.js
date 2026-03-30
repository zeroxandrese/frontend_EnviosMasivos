import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import {
  TextField,
  Button,
  Snackbar,
  SnackbarContent,
  Typography,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import api from "../../services/api";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { i18n } from "../../translate/i18n";
import Grid from "@material-ui/core/Grid";
import toastError from '../../errors/toastError';
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  content: {
    position: "relative",
    background: `url(https://source.unsplash.com/random/?tech) center/cover no-repeat`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "55px 30px",
    borderRadius: "35px",
  },
  logo: {
    marginBottom: theme.spacing(2),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ResetPasswordPage = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [userFound, setUserFound] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeIncorrect, setCodeIncorrect] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [showVerifyButton, setShowVerifyButton] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const customSpacing = 16;

  const linkStyle = {
    textDecoration: "none", // Remover sublinhado do link
    color: "inherit", // Herdar a cor do texto original
    cursor: "pointer", // Adicionar cursor ao passar o mouse para indicar clicabilidade
  };

  const handleResetPassword = async () => {
    try {
      const response = await api.get("/api/obter-usuarios");
      const users = response.data;

      const foundUser = users.find((user) => user.email === email);

      if (foundUser) {
        setUserFound(true);
        setUserId(foundUser.id);
        setShowEmailInput(false);

        try {
          await api.post("/api/enviar-email", { email: foundUser.email });
          console.log("E-mail de verificação enviado com sucesso!");
        } catch (error) {
          console.error("Erro ao enviar e-mail de verificação:", error);
        }
      } else {
        setUserFound(false);
        toastError("Usuario no registrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toastError("Usuario no registrado.");
    }
  };

  const handleResetPass = async () => {
    setLoading(true);
    try {
      const { data: { userId } } = await api.post("/api/enviar-email", { wpp: email });

      setUserId(userId);
      setShowEmailInput(false);
      setUserFound(true);
      toast.success("Código de verificación enviado correctamente!");
    } catch (error) {
      toastError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/verificar-code/${email}`);
      const codeData = response.data;

      if (codeData && codeData.code === verificationCode) {
        setCodeVerified(true);
        setShowVerifyButton(false);
        setShowSuccessMessage(true);
      } else {
        toastError("Código de verificación no válido. No se puede cambiar la contraseña.");
        setCodeIncorrect(true);
        setVerificationAttempts(verificationAttempts + 1);
      }
    } catch (error) {
      console.error("Error al verificar código:", error);
      toastError("Código de comprobación de errores.");
    } finally {
      setLoading(false);
    }

    if (codeIncorrect) {
      toastError("Código de verificación incorrecto. Inténtalo de nuevo.");

      if (verificationAttempts >= 2) {
        toastError("Tentativas excedidas. Redirecionando...");

        setTimeout(() => {
          history.push("/login");
        }, 3000);
      }

      setCodeIncorrect(false);
    }
  };

  const handleResetCode = () => {
    setCodeIncorrect(false);
    setVerificationCode("");
  };

  const handleSavePassword = async () => {
    if (userFound && codeVerified) {
      setLoading(true);
      try {
        await api.put("/api/atualizar-senha", { userId, newPassword });

        toast.success("Contraseña actualizada exitosamente!");

        setTimeout(() => {
          history.push("/login");
        }, 1000);
      } catch (err) {
        console.error("Error al guardar la contraseña:", err);
        toastError("Error al guardar la contraseña.");
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Usuario no encontrado o código de verificación inválido.");
    }
  };

  const handleCloseSnackbar = () => {
    // setOpenSnackbar(false);
  };

  // Estilos do visual moderno
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: '#050A1B',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: 'relative',
    overflow: 'hidden'
  };

  const lightsBgStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0
  };

  const lightStyles = [
    {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'float1 6s ease-in-out infinite',
      width: '250px',
      height: '250px',
      background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(168, 85, 247, 0.2) 40%, transparent 70%)',
      top: '15%',
      left: '5%'
    },
    {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'float2 6s ease-in-out infinite',
      width: '180px',
      height: '180px',
      background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, rgba(219, 39, 119, 0.15) 50%, transparent 70%)',
      top: '55%',
      right: '10%',
      animationDelay: '2s'
    },
    {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'float3 6s ease-in-out infinite',
      width: '120px',
      height: '120px',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.15) 50%, transparent 70%)',
      bottom: '25%',
      left: '15%',
      animationDelay: '4s'
    },
    {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'float4 6s ease-in-out infinite',
      width: '160px',
      height: '160px',
      background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.1) 50%, transparent 70%)',
      top: '40%',
      left: '50%',
      animationDelay: '1s'
    },
    {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'float5 6s ease-in-out infinite',
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 50%, transparent 70%)',
      bottom: '10%',
      right: '30%',
      animationDelay: '3s'
    },
    {
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(40px)',
      animation: 'float6 6s ease-in-out infinite',
      width: '140px',
      height: '140px',
      background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(79, 70, 229, 0.15) 50%, transparent 70%)',
      top: '5%',
      right: '25%',
      animationDelay: '5s'
    }
  ];

  const geometricShapesStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1
  };

  const squareStyles = [
    {
      position: 'absolute',
      width: '80px',
      height: '80px',
      border: '1px solid rgba(168, 85, 247, 0.4)',
      background: 'transparent',
      animation: 'spin 12s linear infinite',
      filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))',
      top: '15%',
      left: '8%'
    },
    {
      position: 'absolute',
      width: '80px',
      height: '80px',
      border: '1px solid rgba(236, 72, 153, 0.4)',
      background: 'transparent',
      animation: 'spin 15s linear infinite reverse',
      filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.4))',
      top: '70%',
      right: '12%'
    },
    {
      position: 'absolute',
      width: '80px',
      height: '80px',
      border: '1px solid rgba(6, 182, 212, 0.4)',
      background: 'transparent',
      animation: 'spin 10s linear infinite',
      filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))',
      bottom: '25%',
      left: '25%'
    }
  ];

  const circleStyles = [
    {
      position: 'absolute',
      width: '25px',
      height: '25px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(168, 85, 247, 0.3))',
      animation: 'pulse 5s ease-in-out infinite',
      filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.3))',
      top: '25%',
      right: '20%'
    },
    {
      position: 'absolute',
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(244, 114, 182, 0.3))',
      animation: 'pulse 6s ease-in-out infinite',
      filter: 'drop-shadow(0 0 12px rgba(236, 72, 153, 0.3))',
      bottom: '35%',
      right: '25%',
      animationDelay: '1s'
    },
    {
      position: 'absolute',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(8, 145, 178, 0.3))',
      animation: 'pulse 4.5s ease-in-out infinite',
      filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.3))',
      top: '60%',
      left: '15%',
      animationDelay: '2s'
    }
  ];

  const cardStyle = {
    background: 'rgba(30, 30, 50, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 25px 45px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '28rem',
    animation: 'fadeIn 0.8s ease-out'
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '3rem',
    paddingRight: '3rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.75rem',
    color: 'white',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(135deg, #10B0D7, #1BB08C)',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  };

  return (
    <>
      <style jsx>{`
        @keyframes float1 { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-20px) translateX(10px); } 50% { transform: translateY(-10px) translateX(-10px); } 75% { transform: translateY(-30px) translateX(5px); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-15px) translateX(8px); } 50% { transform: translateY(-8px) translateX(-8px); } 75% { transform: translateY(-25px) translateX(4px); } }
        @keyframes float3 { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-18px) translateX(12px); } 50% { transform: translateY(-12px) translateX(-12px); } 75% { transform: translateY(-28px) translateX(6px); } }
        @keyframes float4 { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-22px) translateX(14px); } 50% { transform: translateY(-14px) translateX(-14px); } 75% { transform: translateY(-32px) translateX(7px); } }
        @keyframes float5 { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-16px) translateX(9px); } 50% { transform: translateY(-9px) translateX(-9px); } 75% { transform: translateY(-26px) translateX(5px); } }
        @keyframes float6 { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-24px) translateX(11px); } 50% { transform: translateY(-11px) translateX(-11px); } 75% { transform: translateY(-34px) translateX(8px); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.3); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        body { background: #050A1B !important; margin: 0; padding: 0; }
      `}</style>

      <div style={containerStyle}>
        {/* Animated Lights Background */}
        <div style={lightsBgStyle}>
          {lightStyles.map((style, index) => (
            <div key={index} style={style}></div>
          ))}
        </div>
        
        {/* Geometric Shapes */}
        <div style={geometricShapesStyle}>
          {squareStyles.map((style, index) => (
            <div key={`square-${index}`} style={style}></div>
          ))}
          {circleStyles.map((style, index) => (
            <div key={`circle-${index}`} style={style}></div>
          ))}
        </div>
        
        {/* Reset Password Card */}
        <div style={cardStyle}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #10B0D7, #1BB08C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem',
                margin: 0
              }}>
                Envio Masivo
              </h1>
              <div style={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(135deg, #10B0D7, #1BB08C)',
                margin: '0 auto',
                borderRadius: '9999px'
              }}></div>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
              {i18n.t("passwordReset.title")}
            </h2>
            <p style={{ color: '#e5e7eb', fontSize: '0.875rem', margin: 0 }}>
              Recupere sua senha de acesso
            </p>
          </div>
          
          {/* Reset Password Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Email/WhatsApp Field */}
            {showEmailInput && (
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                  {i18n.t("Whatsapp cadastrado")}
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    placeholder="Seu WhatsApp"
                  />
                </div>
              </div>
            )}

            {/* Send Verification Code Button */}
            {showEmailInput && (
              <button
                onClick={handleResetPass}
                disabled={loading || !email.trim()}
                style={{
                  ...buttonStyle,
                  opacity: (loading || !email.trim()) ? 0.6 : 1,
                  cursor: (loading || !email.trim()) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <div style={{ border: '2px solid rgba(255, 255, 255, 0.3)', borderTop: '2px solid white', borderRadius: '50%', width: '18px', height: '18px', animation: 'spin 1s linear infinite' }}></div>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {i18n.t("Enviar código de verificação")}
                  </>
                )}
              </button>
            )}

            {/* Back to Login Link */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#10B0D7', cursor: 'pointer', transition: 'color 0.2s ease', fontSize: '0.875rem' }}
                onClick={() => history.push("/login")}
              >
                {i18n.t("passwordReset.voltar")}
              </button>
            </div>

            {/* Verification Code Section */}
            {userFound && (
              <div>
                {/* Verification Code Input */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                    Código de verificación
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      style={inputStyle}
                      placeholder="Digite o código recebido"
                    />
                  </div>
                </div>

                {/* Verify Code Button */}
                {showVerifyButton && (
                  <button
                    onClick={handleVerifyCode}
                    disabled={loading || !verificationCode.trim()}
                    style={{
                      ...buttonStyle,
                      opacity: (loading || !verificationCode.trim()) ? 0.6 : 1,
                      cursor: (loading || !verificationCode.trim()) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? (
                      <div style={{ border: '2px solid rgba(255, 255, 255, 0.3)', borderTop: '2px solid white', borderRadius: '50%', width: '18px', height: '18px', animation: 'spin 1s linear infinite' }}></div>
                    ) : (
                      <>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {i18n.t("passwordReset.buttons.verify")}
                      </>
                    )}
                  </button>
                )}

                {/* Success Message */}
                {showSuccessMessage && (
                  <div style={{ 
                    padding: '12px', 
                    background: 'rgba(34, 197, 94, 0.1)', 
                    border: '1px solid rgba(34, 197, 94, 0.3)', 
                    borderRadius: '8px', 
                    color: '#22c55e',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    ✓ Código validado correctamente
                  </div>
                )}

                {/* New Password Section */}
                {codeVerified && (
                  <>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                        Nueva contraseña
                      </label>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          style={inputStyle}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px', transition: 'color 0.2s ease' }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Save Password Button */}
                    <button
                      onClick={handleSavePassword}
                      disabled={loading || !newPassword.trim()}
                      style={{
                        ...buttonStyle,
                        opacity: (loading || !newPassword.trim()) ? 0.6 : 1,
                        cursor: (loading || !newPassword.trim()) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? (
                        <div style={{ border: '2px solid rgba(255, 255, 255, 0.3)', borderTop: '2px solid white', borderRadius: '50%', width: '18px', height: '18px', animation: 'spin 1s linear infinite' }}></div>
                      ) : (
                        <>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                          </svg>
                          Guardar contraseña
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;