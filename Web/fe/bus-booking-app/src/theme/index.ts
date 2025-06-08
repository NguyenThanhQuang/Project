import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0077be', // Ocean blue
      light: '#42a5f5',
      dark: '#004c8b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffa726', // Warm orange/yellow
      light: '#ffcc02',
      dark: '#ff8f00',
      contrastText: '#000000',
    },
    background: {
      default: '#f8fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2332',
      secondary: '#4a5568',
    },
    success: {
      main: '#48bb78',
      light: '#68d391',
      dark: '#38a169',
    },
    warning: {
      main: '#ed8936',
      light: '#f6ad55',
      dark: '#dd6b20',
    },
    error: {
      main: '#f56565',
      light: '#fc8181',
      dark: '#e53e3e',
    },
    info: {
      main: '#4299e1',
      light: '#63b3ed',
      dark: '#3182ce',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 119, 190, 0.05)',
    '0px 4px 8px rgba(0, 119, 190, 0.08)',
    '0px 8px 16px rgba(0, 119, 190, 0.1)',
    '0px 12px 24px rgba(0, 119, 190, 0.12)',
    '0px 16px 32px rgba(0, 119, 190, 0.14)',
    '0px 20px 40px rgba(0, 119, 190, 0.16)',
    '0px 24px 48px rgba(0, 119, 190, 0.18)',
    '0px 28px 56px rgba(0, 119, 190, 0.2)',
    '0px 32px 64px rgba(0, 119, 190, 0.22)',
    '0px 36px 72px rgba(0, 119, 190, 0.24)',
    '0px 40px 80px rgba(0, 119, 190, 0.26)',
    '0px 44px 88px rgba(0, 119, 190, 0.28)',
    '0px 48px 96px rgba(0, 119, 190, 0.3)',
    '0px 52px 104px rgba(0, 119, 190, 0.32)',
    '0px 56px 112px rgba(0, 119, 190, 0.34)',
    '0px 60px 120px rgba(0, 119, 190, 0.36)',
    '0px 64px 128px rgba(0, 119, 190, 0.38)',
    '0px 68px 136px rgba(0, 119, 190, 0.4)',
    '0px 72px 144px rgba(0, 119, 190, 0.42)',
    '0px 76px 152px rgba(0, 119, 190, 0.44)',
    '0px 80px 160px rgba(0, 119, 190, 0.46)',
    '0px 84px 168px rgba(0, 119, 190, 0.48)',
    '0px 88px 176px rgba(0, 119, 190, 0.5)',
    '0px 92px 184px rgba(0, 119, 190, 0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 119, 190, 0.2)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1.1rem',
          borderRadius: 16,
        },
        contained: {
          background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #004c8b 0%, #003366 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(0, 119, 190, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 119, 190, 0.08)',
          borderRadius: 20,
          border: '1px solid rgba(0, 119, 190, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(0, 119, 190, 0.15)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#ffffff',
            transition: 'all 0.3s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0077be',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0077be',
                borderWidth: 2,
              },
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: '#0077be',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 119, 190, 0.08)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(0, 119, 190, 0.1)',
        },
        elevation3: {
          boxShadow: '0px 6px 16px rgba(0, 119, 190, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.85rem',
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #0077be 0%, #004c8b 100%)',
          color: 'white',
        },
        colorSecondary: {
          background: 'linear-gradient(135deg, #ffa726 0%, #ff8f00 100%)',
          color: 'white',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 12px rgba(0, 119, 190, 0.1)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
  },
}); 