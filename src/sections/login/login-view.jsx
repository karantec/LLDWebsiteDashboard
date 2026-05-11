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
const INK       = '#0d0f0e';
const PAPER     = '#f5f2ec';
const ACCENT    = '#e8c547';
const ACCENT2   = '#c45c2a';
const STEEL     = '#3a3d38';
const MIST      = '#9a9990';
const RULE      = '#2a2d28';

export default function LoginView() {
  const navigate = useNavigate();

  useEffect(() => {
    if (getToken()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const [showPassword, setShowPassword]   = useState(false);
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [focused, setFocused]             = useState('');

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Syne:wght@400;500;600;700;800&display=swap');

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        .login-card  { animation: slideUp 0.55s cubic-bezier(.22,.68,0,1.2) both; }
        .login-left  { animation: fadeIn 0.7s ease both; }

        .field-wrap input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 40px ${INK} inset !important;
          -webkit-text-fill-color: ${PAPER} !important;
        }
      `}</style>

      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          fontFamily: "'Syne', sans-serif",
          background: INK,
        }}
      >
        {/* ── Left: decorative editorial panel ─────────────────────────── */}
        <Box
          className="login-left"
          sx={{
            display: { xs: 'none', lg: 'flex' },
            width: '52%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            borderRight: `1px solid ${RULE}`,
            p: 5,
          }}
        >
          {/* Noise texture overlay */}
          <Box
            sx={{
              position: 'absolute', inset: 0, zIndex: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              pointerEvents: 'none',
            }}
          />

          {/* Large background type */}
          <Typography
            sx={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -52%) rotate(-6deg)',
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(80px, 13vw, 160px)',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.03)',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              pointerEvents: 'none',
              zIndex: 0,
              letterSpacing: '-2px',
            }}
          >
            Print
          </Typography>

          {/* Grid lines accent */}
          {[0, 1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                left: `${18 + i * 22}%`,
                top: 0, bottom: 0,
                width: '1px',
                background: 'rgba(255,255,255,0.025)',
                zIndex: 0,
              }}
            />
          ))}

          {/* ── Top: logo mark ── */}
          <Box sx={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 36, height: 36,
                border: `1.5px solid ${ACCENT}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 10, height: 10,
                  background: ACCENT,
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: 15,
                  color: PAPER, letterSpacing: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                DLX Print
              </Typography>
              <Typography sx={{ fontSize: 10, color: MIST, letterSpacing: 3, textTransform: 'uppercase' }}>
                Administration
              </Typography>
            </Box>
          </Box>

          {/* ── Centre: headline ── */}
          <Box sx={{ zIndex: 1 }}>
            {/* Issue badge */}
            <Box
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 1,
                border: `1px solid ${RULE}`,
                px: 1.5, py: 0.5, mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: ACCENT,
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              <Typography sx={{ fontSize: 10, color: MIST, letterSpacing: 3, textTransform: 'uppercase' }}>
                Admin Portal — Active
              </Typography>
            </Box>

            <Typography
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300, fontStyle: 'italic',
                fontSize: 'clamp(36px, 4vw, 56px)',
                color: PAPER,
                lineHeight: 1.1,
                mb: 0.5,
              }}
            >
              Premium Print
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(36px, 4vw, 56px)',
                color: ACCENT,
                lineHeight: 1.1,
                textTransform: 'uppercase',
                letterSpacing: '-1px',
                mb: 3,
              }}
            >
              Management
            </Typography>

            <Box sx={{ width: 40, height: 2, background: ACCENT2, mb: 3 }} />

            <Typography
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 17, fontWeight: 300,
                color: MIST, lineHeight: 1.8,
                maxWidth: 360,
              }}
            >
              Oversee orders, clients, and production from one unified dashboard — built for operators who demand precision.
            </Typography>
          </Box>

          {/* ── Bottom: stat strip ── */}
          <Box
            sx={{
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0,
              borderTop: `1px solid ${RULE}`,
              pt: 3,
            }}
          >
            {[
              { n: '400gsm', l: 'Card Stock' },
              { n: '24 hr',  l: 'Turnaround' },
              { n: '100%',   l: 'UAE-local' },
            ].map((s, i) => (
              <Box
                key={i}
                sx={{
                  borderRight: i < 2 ? `1px solid ${RULE}` : 'none',
                  pr: 2.5, pl: i > 0 ? 2.5 : 0,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700, fontSize: 20,
                    color: PAPER, letterSpacing: '-0.5px',
                  }}
                >
                  {s.n}
                </Typography>
                <Typography sx={{ fontSize: 10, color: MIST, letterSpacing: 2, textTransform: 'uppercase', mt: 0.25 }}>
                  {s.l}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Marquee tape */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: 28,
              background: ACCENT,
              overflow: 'hidden',
              display: 'flex', alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                animation: 'marquee 18s linear infinite',
                whiteSpace: 'nowrap',
              }}
            >
              {Array(12).fill('✦  DELUXE PRINTING  ·  DUBAI  ·  EST. 2018  ').map((t, i) => (
                <Typography
                  key={i}
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: 2, color: INK,
                    textTransform: 'uppercase',
                    pr: 3,
                  }}
                >
                  {t}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── Right: login form ─────────────────────────────────────────── */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 3, md: 6 },
            position: 'relative',
            background: INK,
          }}
        >
          {/* Subtle radial glow */}
          <Box
            sx={{
              position: 'absolute',
              top: '30%', right: '10%',
              width: 320, height: 320,
              background: `radial-gradient(circle, rgba(232,197,71,0.06) 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          <Box className="login-card" sx={{ width: '100%', maxWidth: 360, position: 'relative', zIndex: 1 }}>

            {/* Mobile logo */}
            <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
              <Box
                sx={{
                  width: 28, height: 28,
                  border: `1.5px solid ${ACCENT}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Box sx={{ width: 8, height: 8, background: ACCENT }} />
              </Box>
              <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: PAPER, letterSpacing: 2, textTransform: 'uppercase' }}>
                DLX Print
              </Typography>
            </Box>

            {/* Step label */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3.5 }}>
              <Box sx={{ width: 24, height: 1, background: RULE }} />
              <Typography sx={{ fontSize: 10, color: MIST, letterSpacing: 3, textTransform: 'uppercase' }}>
                Secure Sign-In
              </Typography>
            </Box>

            {/* Heading */}
            <Typography
              sx={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 42,
                color: PAPER,
                lineHeight: 1,
                mb: 0.25,
              }}
            >
              Welcome
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 42,
                color: ACCENT,
                lineHeight: 1,
                textTransform: 'uppercase',
                letterSpacing: '-1px',
                mb: 4,
              }}
            >
              Back.
            </Typography>

            {/* Form */}
            <form onSubmit={handleSubmit} className="field-wrap">
              <Stack spacing={0} sx={{ gap: 0 }}>

                {/* Email field */}
                <Box sx={{ mb: 0, position: 'relative' }}>
                  <Typography
                    component="label"
                    sx={{
                      display: 'block',
                      fontSize: 9, fontWeight: 600,
                      letterSpacing: 3, textTransform: 'uppercase',
                      color: focused === 'email' ? ACCENT : MIST,
                      mb: 1,
                      transition: 'color 0.2s',
                    }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="admin@dlxprint.com"
                    value={email}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        background: 'transparent',
                        borderRadius: 0,
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 14,
                        color: PAPER,
                        '& fieldset': {
                          borderColor: RULE,
                          borderWidth: '0 0 1.5px 0',
                          borderRadius: 0,
                          transition: 'border-color 0.2s',
                        },
                        '&:hover fieldset': { borderColor: STEEL },
                        '&.Mui-focused fieldset': { borderColor: ACCENT, borderWidth: '0 0 1.5px 0' },
                      },
                      '& .MuiOutlinedInput-input': {
                        py: 1.25, px: 0,
                        '&::placeholder': { color: STEEL, opacity: 1, fontSize: 13 },
                      },
                    }}
                  />
                </Box>

                {/* Password field */}
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography
                      component="label"
                      sx={{
                        fontSize: 9, fontWeight: 600,
                        letterSpacing: 3, textTransform: 'uppercase',
                        color: focused === 'password' ? ACCENT : MIST,
                        transition: 'color 0.2s',
                      }}
                    >
                      Password
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 9, color: MIST,
                        letterSpacing: 1.5, textTransform: 'uppercase',
                        cursor: 'pointer', fontFamily: "'Syne', sans-serif",
                        '&:hover': { color: ACCENT },
                        transition: 'color 0.2s',
                      }}
                    >
                      Forgot?
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
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            disableRipple
                            sx={{ color: STEEL, '&:hover': { color: ACCENT } }}
                          >
                            <Iconify
                              icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                              sx={{ fontSize: 17, transition: 'color 0.2s' }}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3.5,
                      '& .MuiOutlinedInput-root': {
                        background: 'transparent',
                        borderRadius: 0,
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 14,
                        color: PAPER,
                        '& fieldset': {
                          borderColor: RULE,
                          borderWidth: '0 0 1.5px 0',
                          borderRadius: 0,
                          transition: 'border-color 0.2s',
                        },
                        '&:hover fieldset': { borderColor: STEEL },
                        '&.Mui-focused fieldset': { borderColor: ACCENT, borderWidth: '0 0 1.5px 0' },
                      },
                      '& .MuiOutlinedInput-input': {
                        py: 1.25, px: 0,
                        '&::placeholder': { color: STEEL, opacity: 1, fontSize: 13 },
                      },
                    }}
                  />
                </Box>

                {/* Error */}
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      background: 'rgba(196, 92, 42, 0.1)',
                      border: `1px solid rgba(196, 92, 42, 0.3)`,
                      borderRadius: 0,
                      fontSize: 12,
                      color: '#e88060',
                      fontFamily: "'Syne', sans-serif",
                      letterSpacing: 0.5,
                      '& .MuiAlert-icon': { color: ACCENT2 },
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
                  sx={{
                    py: 1.75,
                    background: ACCENT,
                    color: INK,
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 3,
                    borderRadius: 0,
                    textTransform: 'uppercase',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0, left: '-100%',
                      width: '100%', height: '100%',
                      background: 'rgba(255,255,255,0.15)',
                      transition: 'left 0.3s ease',
                    },
                    '&:hover::before': { left: '100%' },
                    '&:hover': {
                      background: '#f0cf5a',
                    },
                    '&:active': { transform: 'scale(0.985)' },
                    '&.MuiLoadingButton-loading': { background: ACCENT, opacity: 0.7 },
                    '& .MuiLoadingButton-loadingIndicator': { color: INK },
                    transition: 'background 0.2s, transform 0.1s',
                  }}
                >
                  Enter Dashboard
                </LoadingButton>

              </Stack>
            </form>

            {/* Footer tag */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 4 }}>
              <Box sx={{ flex: 1, height: '1px', background: RULE }} />
              <Typography sx={{ fontSize: 9, color: STEEL, letterSpacing: 3, textTransform: 'uppercase' }}>
                Authorized Only
              </Typography>
              <Box sx={{ flex: 1, height: '1px', background: RULE }} />
            </Box>

          </Box>
        </Box>

      </Box>
    </>
  );
}