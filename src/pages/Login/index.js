import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../context/Auth/AuthContext";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastState, setToastState] = useState({ show: false, message: '', type: '' });

  const { handleLogin } = useContext(AuthContext);

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleChangeInput = (e, field) => {
    if (field === 'email') {
      setEmail(e.target.value);
      if (rememberMe) {
        localStorage.setItem("email", e.target.value);
      }
    } else if (field === 'password') {
      setPassword(e.target.value);
      if (rememberMe) {
        localStorage.setItem("password", e.target.value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await handleLogin({ email, password });
      showToast('Login realizado com sucesso!', 'success');
    } catch (err) {
      const errorMsg = err?.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToastState({ show: true, message, type });
    setTimeout(() => {
      setToastState({ show: false, message: '', type: '' });
    }, 4000);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleToggleRemember = () => {
    const newRememberMe = !rememberMe;
    setRememberMe(newRememberMe);

    if (newRememberMe) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
  };

  const handleForgotPassword = () => {
    window.location.href = '/recovery-password';
  };

  const handleSignUp = () => {
    window.location.href = '/signup';
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: `
    radial-gradient(circle at 20% 20%, rgba(16,176,215,0.15), transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(27,176,140,0.15), transparent 40%),
    linear-gradient(135deg, #0B1120, #111827)
  `,
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
    background: 'rgba(17, 24, 39, 0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: `
    0 20px 40px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255,255,255,0.05)
  `,
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '28rem'
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '3rem',
    paddingRight: '3rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
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
    padding: '0.85rem 1rem',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: '0 10px 20px rgba(16,176,215,0.25)'
  };

  const toggleStyle = {
    position: 'relative',
    width: '44px',
    height: '24px',
    background: rememberMe ? 'linear-gradient(135deg, #10B0D7, #1BB08C)' : 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '12px'
  };

  const sliderStyle = {
    position: 'absolute',
    top: '2px',
    left: rememberMe ? '22px' : '2px',
    width: '20px',
    height: '20px',
    background: 'white',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  };

  const toastStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    minWidth: '300px',
    padding: '16px 20px',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '500',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    transform: toastState.show ? 'translateX(0)' : 'translateX(400px)',
    transition: 'all 0.3s ease',
    borderLeft: `4px solid ${toastState.type === 'success' ? '#22c55e' : '#ef4444'}`,
    background: toastState.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'
  };

  return (
    <>
      <style>{`
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
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #10B0D7, #1BB08C)",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px"
        }} />

        {/* Login Card */}
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

              </h1>
              <div style={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(135deg, #10B0D7, #1BB08C)',
                margin: '0 auto',
                borderRadius: '9999px'
              }}></div>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>Bienvenido</h2>
            <p style={{ color: '#e5e7eb', fontSize: '0.875rem', margin: 0 }}>Entre con su contraseña para continuar</p>
          </div>

          {/* Login Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChangeInput(e, 'email')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  style={inputStyle}
                  placeholder="seu@email.com"
                  onFocus={(e) => e.target.style.border = '1px solid #10B0D7'}
                  onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e5e7eb', marginBottom: '0.5rem' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => handleChangeInput(e, 'password')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  style={inputStyle}
                  placeholder="••••••••"
                  onFocus={(e) => e.target.style.border = '1px solid #10B0D7'}
                  onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', color: '#e5e7eb', cursor: 'pointer' }} onClick={handleToggleRemember}>
                <div style={toggleStyle}>
                  <div style={sliderStyle}></div>
                </div>
                <span>Acuérdate de mí</span>
              </label>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#10B0D7', cursor: 'pointer', transition: 'color 0.2s ease', fontSize: '0.875rem' }}
                onClick={handleForgotPassword}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !email.trim() || !password.trim()}
              style={{
                ...buttonStyle,
                opacity: (loading || !email.trim() || !password.trim()) ? 0.6 : 1,
                cursor: (loading || !email.trim() || !password.trim()) ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(16,176,215,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(16,176,215,0.25)";
              }}
            >
              {loading ? (
                <div style={{ border: '2px solid rgba(255, 255, 255, 0.3)', borderTop: '2px solid white', borderRadius: '50%', width: '18px', height: '18px', animation: 'spin 1s linear infinite' }}></div>
              ) : (
                <>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Entrar
                </>
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>
              ¿No tienes una cuenta?
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#10B0D7', fontWeight: '500', cursor: 'pointer', transition: 'color 0.2s ease', marginLeft: '4px', fontSize: '0.875rem' }}
                onClick={handleSignUp}
              >
                Registro
              </button>
            </p>
          </div>
        </div>

        {/* Toast Notification */}
        {toastState.show && (
          <div style={toastStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {toastState.type === 'success' ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span>{toastState.message}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;