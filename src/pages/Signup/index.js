import React, { useState, useEffect, useContext } from "react";
import qs from "query-string";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";

import usePlans from "../../hooks/usePlans";
import { i18n } from "../../translate/i18n";
import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import ColorModeContext from "../../layout/themeContext";

const UserSchema = Yup.object().shape({
  name: Yup.string().min(2).max(50).required("Obrigatório"),
  companyName: Yup.string().min(2).max(50).required("Obrigatório"),
  password: Yup.string().min(5).max(50),
  email: Yup.string().email("Email inválido").required("Obrigatório"),
  phone: Yup.string().required("Obrigatório"),
  planId: Yup.string().required("Selecione um plano"),
});

function SignUp() {
  const { colorMode } = useContext(ColorModeContext);
  const { logo } = colorMode;
  const history = useHistory();
  const { getPlanList } = usePlans();
  
  const [plans, setPlans] = useState([]);
  const [openPlans, setOpenPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    text: '',
    color: '',
    percentage: 0
  });
  const [whatsappPopupActive, setWhatsappPopupActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formikHelpers, setFormikHelpers] = useState(null);

  const params = qs.parse(window.location.search);
  const companyId = params.companyId || null;

  const initialState = {
    name: "",
    email: "",
    password: "",
    phone: "",
    companyId,
    companyName: "",
    planId: "",
  };

  useEffect(() => {
    document.title = "Cadastro - Whaticket Pro";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const planList = await getPlanList({ listPublic: "false" });
        setPlans(planList);
      } catch (error) {
        toastError(error);
      }
    };
    fetchData();
  }, [getPlanList]);

  // Calcular força da senha
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const updatePasswordStrength = (password) => {
    const strength = calculatePasswordStrength(password);
    const percentage = (strength / 5) * 100;
    
    let text = '';
    let color = '';
    
    if (strength <= 2) {
      color = '#EF4445';
      text = 'Senha fraca';
    } else if (strength <= 4) {
      color = '#fbd38d';
      text = 'Senha média';
    } else {
      color = '#10B0D7';
      text = 'Senha forte';
    }
    
    setPasswordStrength({ strength, text, color, percentage });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignUp = async (values) => {
    setLoading(true);
    try {
      await openApi.post("/auth/signup", values);
      
      // Show success modal and wait 8 seconds before redirect
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        setLoading(false);
        history.push("/login");
      }, 8000);
      
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  const handleClosePlans = () => setOpenPlans(false);

  const toggleWhatsappPopup = () => {
    setWhatsappPopupActive(!whatsappPopupActive);
  };
  
  const startWhatsappChat = () => {
    const phoneNumber = '554198239551';
    const message = 'Olá! Preciso de ajuda com o cadastro.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    if (formikHelpers) {
      formikHelpers.setFieldValue("planId", planId);
    }
    handleClosePlans();
  };

  const handleGoToLogin = () => {
    setShowSuccessModal(false);
    setLoading(false);
    history.push("/login");
  };

  // Estilos
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
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
    }
  ];

  const cardStyle = {
    background: 'rgba(30, 30, 50, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '600px',
    position: 'relative',
    zIndex: 10,
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
    animation: 'fadeIn 0.8s ease-out',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '3rem',
    paddingRight: '1rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.75rem',
    color: 'white',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none'
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
    gap: '0.5rem'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(5, 10, 27, 0.9)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    opacity: openPlans ? 1 : 0,
    pointerEvents: openPlans ? 'auto' : 'none',
    transition: 'all 0.3s ease'
  };

  const modalContentStyle = {
    background: 'rgba(30, 30, 50, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '30px',
    maxWidth: '700px',
    maxHeight: '80vh',
    overflowY: 'auto',
    margin: '20px',
    width: '100%',
    transform: openPlans ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
    transition: 'all 0.3s ease'
  };

  const whatsappWidgetStyle = {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    zIndex: 1000
  };

  const whatsappButtonStyle = {
    width: '55px',
    height: '55px',
    background: 'linear-gradient(135deg, #25d366 0%, #20b358 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(37, 211, 102, 0.3)',
    transition: 'all 0.3s ease',
    animation: 'whatsappPulse 3s infinite',
    border: 'none'
  };

  const whatsappPopupStyle = {
    position: 'absolute',
    bottom: '65px',
    right: '0',
    width: '280px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
    opacity: whatsappPopupActive ? 1 : 0,
    transform: whatsappPopupActive ? 'translateY(0) scale(1)' : 'translateY(15px) scale(0.9)',
    transition: 'all 0.3s ease',
    pointerEvents: whatsappPopupActive ? 'auto' : 'none'
  };

  const successModalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(5, 10, 27, 0.95)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    opacity: showSuccessModal ? 1 : 0,
    pointerEvents: showSuccessModal ? 'auto' : 'none',
    transition: 'all 0.3s ease'
  };

  const successContentStyle = {
    textAlign: 'center',
    maxWidth: '450px',
    padding: '40px',
    background: 'rgba(30, 30, 50, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
    animation: showSuccessModal ? 'successSlideUp 0.5s ease-out' : 'none',
    margin: '20px'
  };

  const loadingModalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(5, 10, 27, 0.95)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  };

  return (
    <>
      <style jsx>{`
        @keyframes float1 { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-20px) translateX(10px); } 50% { transform: translateY(-10px) translateX(-10px); } 75% { transform: translateY(-30px) translateX(5px); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-15px) translateX(8px); } 50% { transform: translateY(-8px) translateX(-8px); } 75% { transform: translateY(-25px) translateX(4px); } }
        @keyframes float3 { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-18px) translateX(12px); } 50% { transform: translateY(-12px) translateX(-12px); } 75% { transform: translateY(-28px) translateX(6px); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.3); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes whatsappPulse { 0%, 100% { box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3); } 50% { box-shadow: 0 0 0 8px rgba(37, 211, 102, 0.2), 0 6px 20px rgba(37, 211, 102, 0.3); } }
        @keyframes successSlideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        body { background: #050A1B !important; margin: 0; padding: 0; }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }

        .plan-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .plan-card:hover {
          transform: translateY(-5px);
          border-color: #10B0D7;
          box-shadow: 0 10px 30px rgba(16, 176, 215, 0.2);
        }

        .plan-card.selected {
          border-color: #10B0D7;
          background: rgba(16, 176, 215, 0.1);
        }

        .plan-card.popular::before {
          content: 'RECOMENDADO';
          position: absolute;
          top: -8px;
          right: 15px;
          background: linear-gradient(135deg, #10B0D7, #1BB08C);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
        }
      `}</style>

      <div style={containerStyle}>
        {/* Animated Lights Background */}
        <div style={lightsBgStyle}>
          {lightStyles.map((style, index) => (
            <div key={index} style={style}></div>
          ))}
        </div>
        
        {/* Geometric Shapes */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <div style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            background: 'transparent',
            animation: 'spin 12s linear infinite',
            filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))',
            top: '15%',
            left: '8%'
          }}></div>
          <div style={{
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
          }}></div>
        </div>

        {/* Signup Card */}
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>Criar Conta</h2>
            <p style={{ color: '#e5e7eb', fontSize: '0.875rem', margin: 0 }}>Preencha os dados para começar</p>
          </div>

          <Formik
            initialValues={initialState}
            validationSchema={UserSchema}
            onSubmit={handleSignUp}
          >
            {({ touched, errors, isSubmitting, setFieldValue, values }) => {
              // Store formik helpers for use outside of render
              if (!formikHelpers) {
                setFormikHelpers({ setFieldValue });
              }
              
              return (
                <Form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Nome da Empresa */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                      Nome da Empresa
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <Field
                        type="text"
                        name="companyName"
                        style={inputStyle}
                        placeholder="Sua empresa"
                      />
                    </div>
                    {touched.companyName && errors.companyName && (
                      <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.companyName}</div>
                    )}
                  </div>

                  {/* Nome e Telefone */}
                  <div className="form-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                        Nome Completo
                      </label>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <Field
                          type="text"
                          name="name"
                          style={inputStyle}
                          placeholder="Seu nome"
                        />
                      </div>
                      {touched.name && errors.name && (
                        <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                        Telefone
                      </label>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <Field
                          type="tel"
                          name="phone"
                          style={inputStyle}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      {touched.phone && errors.phone && (
                        <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.phone}</div>
                      )}
                    </div>
                  </div>

                  {/* Email e Senha */}
                  <div className="form-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                        E-mail
                      </label>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                        <Field
                          type="email"
                          name="email"
                          style={inputStyle}
                          placeholder="seu@email.com"
                        />
                      </div>
                      {touched.email && errors.email && (
                        <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                        Senha
                      </label>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <Field
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          style={{ ...inputStyle, paddingRight: '3rem' }}
                          placeholder="••••••••"
                          onChange={(e) => {
                            setFieldValue("password", e.target.value);
                            updatePasswordStrength(e.target.value);
                          }}
                        />
                        <button
                          type="button"
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px', transition: 'color 0.2s ease' }}
                          onClick={togglePasswordVisibility}
                        >
                          {passwordVisible ? (
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
                      {values.password && (
                        <>
                          <div style={{ marginTop: '0.5rem', height: '4px', background: '#4b5563', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div 
                              style={{ 
                                height: '100%',
                                width: `${passwordStrength.percentage}%`,
                                background: passwordStrength.color,
                                borderRadius: '9999px',
                                transition: 'all 0.3s ease'
                              }}
                            />
                          </div>
                          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: passwordStrength.color }}>
                            {passwordStrength.text}
                          </div>
                        </>
                      )}
                      {touched.password && errors.password && (
                        <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</div>
                      )}
                    </div>
                  </div>

                  {/* Seletor de Plano */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                      Plano
                    </label>
                    <div 
                      style={{
                        width: '100%',
                        paddingLeft: '3rem',
                        paddingRight: '1rem',
                        paddingTop: '0.75rem',
                        paddingBottom: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '0.75rem',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative'
                      }}
                      onClick={() => setOpenPlans(true)}
                    >
                      <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                      </div>
                      <span style={{ color: selectedPlan ? 'white' : '#9ca3af' }}>
                        {selectedPlan
                          ? plans.find((p) => p.id === selectedPlan)?.name || "Plano"
                          : "Escolher Plano"}
                      </span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#9ca3af' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {touched.planId && errors.planId && (
                      <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.planId}</div>
                    )}
                  </div>

                  {/* Botões */}
                  <button 
                    type="submit" 
                    disabled={loading || isSubmitting}
                    style={{
                      ...buttonStyle,
                      opacity: (loading || isSubmitting) ? 0.6 : 1,
                      cursor: (loading || isSubmitting) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading || isSubmitting ? (
                      <div style={{ border: '2px solid rgba(255, 255, 255, 0.3)', borderTop: '2px solid white', borderRadius: '50%', width: '18px', height: '18px', animation: 'spin 1s linear infinite' }}></div>
                    ) : (
                      <>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        {i18n.t("signup.buttons.submit") || "Criar Conta"}
                      </>
                    )}
                  </button>

                  <button 
                    type="button" 
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={() => history.push("/login")}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {i18n.t("signup.buttons.login") || "Já tenho conta"}
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>

        {/* Modal de Planos */}
        {openPlans && (
          <div style={modalOverlayStyle} onClick={handleClosePlans}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>Escolha seu Plano</h2>
                <p style={{ color: '#9ca3af', margin: 0 }}>Selecione o plano ideal para sua empresa</p>
              </div>
              
              <div className="plans-grid">
                {plans.map((plan) => {
                  const isPopular =
                    plan.name.toLowerCase().includes("pro") ||
                    plan.name.toLowerCase().includes("recomendado");
                  const isFree =
                    plan.amount === 0 ||
                    plan.amount === "0" ||
                    plan.name.toLowerCase().includes("gratuito");
                  const isSelected = plan.id === selectedPlan;

                  return (
                    <div
                      key={plan.id}
                      className={`plan-card ${isPopular ? 'popular' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '1rem', margin: '0 0 1rem 0' }}>{plan.name}</h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10B0D7' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{plan.users} Asistentes</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10B0D7' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{plan.connections} Conexiones</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#10B0D7' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          <span>{plan.queues} Filas</span>
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#10B0D7' }}>
                        {isFree ? "Gratuito" : `R$ ${plan.amount}`}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button 
                  style={{
                    padding: '0.5rem 1.5rem',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }}
                  onClick={handleClosePlans}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Widget */}
        <div style={whatsappWidgetStyle}>
          <button style={whatsappButtonStyle} onClick={toggleWhatsappPopup}>
            <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
            </svg>
          </button>

          <div style={whatsappPopupStyle}>
            <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #25d366, #20b358)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontWeight: '600', fontSize: '0.875rem', margin: 0 }}>Servicio en línea</h3>
                <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: 0 }}>Disponible ahora</p>
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#050A1B' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', color: 'white' }}>
                👋 Hola! Necesita ayuda con el registro?
              </div>
              <button 
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #25d366, #20b358)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onClick={startWhatsappChat}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
                Iniciar conversación
              </button>
            </div>
          </div>
        </div>

        {/* Loading Modal */}
        {loading && !showSuccessModal && (
          <div style={loadingModalStyle}>
            <div style={{
              textAlign: 'center',
              maxWidth: '400px',
              padding: '40px',
              background: 'rgba(30, 30, 50, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              margin: '20px'
            }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem' }}>
                <div style={{ width: '100%', height: '100%', border: '4px solid #4b5563', borderTop: '4px solid #10B0D7', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Criando sua conta...</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
                Espere mientras configuramos todo por usted. Esto sólo te llevará unos segundos.
              </p>
            </div>
          </div>
        )}

        {/* Success Modal */}
        <div style={successModalStyle}>
          <div style={successContentStyle}>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #10B0D7, #1BB08C)', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10B0D7', marginBottom: '1rem', margin: '0 0 1rem 0' }}>Conta criada com sucesso!</h3>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              ¡Felicidades! Su cuenta ha sido creada exitosamente. Ya puedes iniciar sesión y comenzar a utilizar nuestra plataforma.
            </p>
            <button 
              style={{
                background: 'linear-gradient(135deg, #10B0D7, #1BB08C)',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: 'translateY(0)',
                boxShadow: 'none'
              }}
              onClick={handleGoToLogin}
            >
              Ir a Iniciar sesión
            </button>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '1rem', margin: '1rem 0 0 0' }}>
              Redirigiendo automáticamente en unos segundos...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;