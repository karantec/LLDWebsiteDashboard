// src/sections/login/LoginView.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
// eslint-disable-next-line perfectionist/sort-imports
import { adminLogin } from 'src/services/authService';
// eslint-disable-next-line perfectionist/sort-imports
import { setToken, getToken } from 'src/utils/auth';
// eslint-disable-next-line perfectionist/sort-imports
import Iconify from 'src/components/iconify';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const DEEP      = '#0f1117';
const SURFACE   = '#161b27';
const CARD      = '#1c2235';
const VIOLET    = '#7c6ff7';
const VIOLET_LT = '#a89eff';
const TEAL      = '#38d9c0';
const WARM      = '#f5f0e8';
const MUTED     = '#6b7280';
const BORDER    = '#252d42';

export default function LoginView() {
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [focused, setFocused]           = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(email, password);
      if (!data?.token || data?.user?.role !== 'ADMIN') {
        setError('Unauthorized access');
        return;
      }
      setToken(data.token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { value: '12,400+', label: 'Students Enrolled' },
    { value: '340',     label: 'Active Courses' },
    { value: '98%',     label: 'Completion Rate' },
  ];

  const modules = [
    { icon: '📚', title: 'Course Builder',  desc: 'Create & manage curriculum' },
    { icon: '👥', title: 'Student Roster',  desc: 'Track enrolments & progress' },
    { icon: '📊', title: 'Analytics',       desc: 'Performance & engagement' },
    { icon: '🎓', title: 'Certifications',  desc: 'Issue & verify credentials' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;1,400;1,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes floatA {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-14px) rotate(3deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(10px) rotate(-4deg); }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }

        .form-card   { animation: slideUp 0.5s cubic-bezier(.22,.68,0,1.15) 0.1s both; }
        .stat-card   { animation: slideUp 0.5s cubic-bezier(.22,.68,0,1.15) both; }
        .stat-card:nth-child(2) { animation-delay: 0.07s; }
        .stat-card:nth-child(3) { animation-delay: 0.14s; }

        .module-pill:hover { background: rgba(124,111,247,0.12) !important; border-color: rgba(124,111,247,0.35) !important; }
        .module-pill:hover .module-title { color: ${VIOLET_LT} !important; }

        .submit-btn::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          background-size: 400px 100%; opacity:0; transition: opacity 0.2s;
        }
        .submit-btn:hover::after { opacity:1; animation: shimmer 1.2s infinite; }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 40px ${CARD} inset !important;
          -webkit-text-fill-color: ${WARM} !important;
          caret-color: ${WARM};
        }
      `}</style>

      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          background: DEEP,
          overflow: 'hidden',
        }}
      >
        {/* ══════════════════════════ LEFT PANEL ══════════════════════════ */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            width: '50%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: '40px 48px',
            position: 'relative',
            overflow: 'hidden',
            background: SURFACE,
            borderRight: `1px solid ${BORDER}`,
          }}
        >
          {/* Ambient blobs */}
          <Box sx={{
            position:'absolute', top:-80, left:-80,
            width:340, height:340, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(124,111,247,0.14) 0%, transparent 70%)',
            animation:'floatA 7s ease-in-out infinite', pointerEvents:'none',
          }}/>
          <Box sx={{
            position:'absolute', bottom:60, right:-60,
            width:260, height:260, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(56,217,192,0.10) 0%, transparent 70%)',
            animation:'floatB 9s ease-in-out infinite', pointerEvents:'none',
          }}/>

          {/* Dot grid */}
          <Box sx={{
            position:'absolute', inset:0, pointerEvents:'none', opacity:0.3,
            backgroundImage:`radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)`,
            backgroundSize:'28px 28px',
          }}/>

          {/* Brand */}
          <Box sx={{ display:'flex', alignItems:'center', gap:1.5, zIndex:1 }}>
            <Box sx={{
              width:38, height:38, borderRadius:'10px',
              background:`linear-gradient(135deg, ${VIOLET} 0%, ${TEAL} 100%)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, flexShrink:0,
              boxShadow:`0 0 20px rgba(124,111,247,0.4)`,
            }}>
              🎓
            </Box>
            <Box>
              <Typography sx={{
                fontFamily:"'Plus Jakarta Sans', sans-serif",
                fontWeight:700, fontSize:15, color:WARM, letterSpacing:0.3,
              }}>
                LearnHub
              </Typography>
              <Typography sx={{ fontSize:10, color:MUTED, letterSpacing:2, textTransform:'uppercase' }}>
                Admin Portal
              </Typography>
            </Box>
          </Box>

          {/* Hero copy */}
          <Box sx={{ zIndex:1 }}>
            <Box sx={{
              display:'inline-flex', alignItems:'center', gap:1,
              background:'rgba(56,217,192,0.1)',
              border:'1px solid rgba(56,217,192,0.25)',
              borderRadius:'20px', px:1.5, py:0.5, mb:3,
            }}>
              <Box sx={{ width:6, height:6, borderRadius:'50%', background:TEAL }} />
              <Typography sx={{ fontSize:10, color:TEAL, letterSpacing:2, textTransform:'uppercase', fontWeight:600 }}>
                Platform Online
              </Typography>
            </Box>

            <Typography sx={{
              fontFamily:"'Lora', serif",
              fontStyle:'italic',
              fontSize:'clamp(28px, 3.2vw, 42px)',
              fontWeight:400,
              color:'rgba(245,240,232,0.5)',
              lineHeight:1.15,
              mb:0.5,
            }}>
              Empower every
            </Typography>
            <Typography sx={{
              fontFamily:"'Plus Jakarta Sans', sans-serif",
              fontWeight:800,
              fontSize:'clamp(28px, 3.2vw, 42px)',
              lineHeight:1.1,
              letterSpacing:'-1px',
              mb:3,
              background:`linear-gradient(90deg, ${WARM} 0%, ${VIOLET_LT} 100%)`,
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
            }}>
              Student&apos;s Journey
            </Typography>

            <Typography sx={{ fontSize:14, color:MUTED, lineHeight:1.8, maxWidth:360, fontWeight:400 }}>
              Your command center for courses, learners, and outcomes — everything you need to run a world-class learning experience.
            </Typography>

            {/* Module pills */}
            <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1.5, mt:3.5 }}>
              {modules.map((m) => (
                <Box
                  key={m.title}
                  className="module-pill"
                  sx={{
                    display:'flex', alignItems:'center', gap:1.25,
                    background:'rgba(255,255,255,0.03)',
                    border:`1px solid ${BORDER}`,
                    borderRadius:'10px',
                    p:'10px 12px',
                    cursor:'default',
                    transition:'all 0.2s',
                  }}
                >
                  <Box sx={{ fontSize:18, lineHeight:1, flexShrink:0 }}>{m.icon}</Box>
                  <Box>
                    <Typography className="module-title" sx={{
                      fontSize:12, fontWeight:600, color:WARM,
                      transition:'color 0.2s', lineHeight:1.3,
                    }}>
                      {m.title}
                    </Typography>
                    <Typography sx={{ fontSize:10, color:MUTED, mt:0.25 }}>{m.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1.5, zIndex:1 }}>
            {stats.map((s, i) => (
              <Box
                key={i}
                className="stat-card"
                sx={{
                  background:'rgba(255,255,255,0.03)',
                  border:`1px solid ${BORDER}`,
                  borderRadius:'12px',
                  p:'14px 16px',
                }}
              >
                <Typography sx={{
                  fontFamily:"'Plus Jakarta Sans', sans-serif",
                  fontWeight:800, fontSize:20, color:WARM,
                  letterSpacing:'-0.5px', lineHeight:1,
                }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize:10, color:MUTED, mt:0.75, lineHeight:1.4 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ══════════════════════════ RIGHT PANEL ══════════════════════════ */}
        <Box
          sx={{
            flex:1,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            p:{ xs:3, md:5 },
            position:'relative',
            background: DEEP,
          }}
        >
          {/* Glow */}
          <Box sx={{
            position:'absolute',
            top:'20%', left:'50%', transform:'translateX(-50%)',
            width:500, height:300,
            background:`radial-gradient(ellipse, rgba(124,111,247,0.08) 0%, transparent 70%)`,
            pointerEvents:'none',
          }}/>

          <Box className="form-card" sx={{ width:'100%', maxWidth:380, zIndex:1 }}>

            {/* Mobile brand */}
            <Box sx={{ display:{ xs:'flex', lg:'none' }, alignItems:'center', gap:1.5, mb:4 }}>
              <Box sx={{
                width:32, height:32, borderRadius:'8px',
                background:`linear-gradient(135deg, ${VIOLET} 0%, ${TEAL} 100%)`,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
              }}>🎓</Box>
              <Typography sx={{ fontWeight:700, fontSize:15, color:WARM, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>
                LearnHub Admin
              </Typography>
            </Box>

            {/* Heading */}
            <Box sx={{ mb:4 }}>
              <Typography sx={{
                fontSize:11, fontWeight:600, letterSpacing:3,
                textTransform:'uppercase', color:VIOLET_LT, mb:1.5,
              }}>
                Admin Access
              </Typography>
              <Typography sx={{
                fontFamily:"'Plus Jakarta Sans', sans-serif",
                fontWeight:800, fontSize:32, color:WARM,
                letterSpacing:'-0.8px', lineHeight:1.15, mb:0.75,
              }}>
                Sign in to your<br />dashboard
              </Typography>
              <Typography sx={{ fontSize:13, color:MUTED, fontWeight:400 }}>
                Manage courses, students, and more.
              </Typography>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>

                {/* Email */}
                <Box>
                  <Typography component="label" sx={{
                    display:'block', fontSize:11, fontWeight:600,
                    letterSpacing:1.5, textTransform:'uppercase',
                    color: focused==='email' ? VIOLET_LT : MUTED,
                    mb:0.875, transition:'color 0.2s',
                  }}>
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="admin@learnhub.com"
                    value={email}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: CARD, borderRadius:'10px',
                        fontFamily:"'Plus Jakarta Sans', sans-serif",
                        fontSize:14, color:WARM,
                        '& fieldset': { borderColor:BORDER, borderWidth:1.5, transition:'border-color 0.2s' },
                        '&:hover fieldset': { borderColor:'#3a4260' },
                        '&.Mui-focused fieldset': { borderColor:VIOLET, borderWidth:2 },
                      },
                      '& .MuiOutlinedInput-input': {
                        py:1.5, px:1.75,
                        '&::placeholder':{ color:MUTED, opacity:1, fontSize:13 },
                      },
                    }}
                  />
                </Box>

                {/* Password */}
                <Box>
                  <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.875 }}>
                    <Typography component="label" sx={{
                      fontSize:11, fontWeight:600, letterSpacing:1.5,
                      textTransform:'uppercase',
                      color: focused==='password' ? VIOLET_LT : MUTED,
                      transition:'color 0.2s',
                    }}>
                      Password
                    </Typography>
                    <Typography sx={{
                      fontSize:11, color:VIOLET_LT, fontWeight:500, cursor:'pointer',
                      '&:hover':{ textDecoration:'underline' },
                    }}>
                      Forgot password?
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      endAdornment:(
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end" size="small" disableRipple
                            sx={{ color:MUTED, '&:hover':{ color:VIOLET_LT } }}
                          >
                            <Iconify
                              icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                              sx={{ fontSize:17 }}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background:CARD, borderRadius:'10px',
                        fontFamily:"'Plus Jakarta Sans', sans-serif",
                        fontSize:14, color:WARM,
                        '& fieldset': { borderColor:BORDER, borderWidth:1.5, transition:'border-color 0.2s' },
                        '&:hover fieldset': { borderColor:'#3a4260' },
                        '&.Mui-focused fieldset': { borderColor:VIOLET, borderWidth:2 },
                      },
                      '& .MuiOutlinedInput-input': {
                        py:1.5, px:1.75,
                        '&::placeholder':{ color:MUTED, opacity:1, fontSize:13 },
                      },
                    }}
                  />
                </Box>

                {/* Error */}
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      background:'rgba(239,68,68,0.08)',
                      border:'1px solid rgba(239,68,68,0.25)',
                      borderRadius:'10px',
                      fontSize:12, color:'#f87171',
                      fontFamily:"'Plus Jakarta Sans', sans-serif",
                      '& .MuiAlert-icon':{ color:'#f87171' },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Submit */}
                <LoadingButton
                  fullWidth
                  type="submit"
                  loading={loading}
                  className="submit-btn"
                  sx={{
                    mt:0.5, py:1.65,
                    background:`linear-gradient(135deg, ${VIOLET} 0%, #5b52e0 100%)`,
                    color:'#fff',
                    fontFamily:"'Plus Jakarta Sans', sans-serif",
                    fontSize:14, fontWeight:700,
                    letterSpacing:0.5,
                    borderRadius:'10px',
                    textTransform:'none',
                    position:'relative', overflow:'hidden',
                    boxShadow:`0 4px 24px rgba(124,111,247,0.35)`,
                    '&:hover': {
                      background:`linear-gradient(135deg, #8c82f8 0%, ${VIOLET} 100%)`,
                      boxShadow:`0 6px 32px rgba(124,111,247,0.5)`,
                    },
                    '&:active':{ transform:'scale(0.98)' },
                    '&.MuiLoadingButton-loading':{ background:`linear-gradient(135deg, ${VIOLET} 0%, #5b52e0 100%)`, opacity:0.7 },
                    '& .MuiLoadingButton-loadingIndicator':{ color:'#fff' },
                    transition:'all 0.2s',
                  }}
                >
                  Access Dashboard →
                </LoadingButton>

              </Stack>
            </form>

            {/* Footer rule */}
            <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mt:3.5 }}>
              <Box sx={{ flex:1, height:'1px', background:BORDER }} />
              <Typography sx={{ fontSize:10, color:MUTED, letterSpacing:2, textTransform:'uppercase' }}>
                Authorized Personnel Only
              </Typography>
              <Box sx={{ flex:1, height:'1px', background:BORDER }} />
            </Box>

          </Box>
        </Box>
      </Box>
    </>
  );
}