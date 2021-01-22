import { createMuiTheme } from '@material-ui/core/styles'

export const colors = {
  default: {
    primary: '#1A78B3',
    secondary: '#33B49E',
    error: '#CE2630',
    branding: '#7430B8'
  },
  light: {
    textPrimary: '#333333',
    textSecondary: '#8E8E8E',
    background: '#FFFFFF',
    actionActive: '#737373',
    divider: '#D7D7D7',
    fieldBackground: 'rgba(26, 120, 179, 0.05)',
    fieldHoverBackground: 'rgba(26, 120, 179, 0.1)',
    fieldFocusedBackground: 'rgba(26, 120, 179, 0.2)'
  },
  dark: {
    textPrimary: '#D7D7D7',
    textSecondary: '#8E8E8E',
    background: '#333333',
    actionActive: '#D7D7D7',
    divider: '#737373',
    fieldBackground: 'rgba(255, 255, 255, 0.03)',
    fieldHoverBackground: 'rgba(255, 255, 255, 0.05)',
    fieldFocusedBackground: 'rgba(255, 255, 255, 0.08)'
  }
}

const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.default.primary
    },
    secondary: {
      main: colors.default.secondary
    },
    error: {
      main: colors.default.error
    },
    branding: colors.default.branding,
    text: {
      primary: colors.light.textPrimary,
      secondary: colors.light.textSecondary
    },
    background: {
      paper: colors.light.background
    },
    action: {
      active: colors.light.actionActive
    },
    divider: colors.light.divider
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          margin: 0,
          fontFamily: '"Montserrat", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothingg: 'grayscale',
          overflowY: 'hidden'
        },
        '.full-height-component': {
          height: 'calc(100% - 64px)',
          overflow: 'hidden'
        },
        '.error-message': {
          color: colors.default.error,
          margin: 0,
          paddingBottom: '1rem'
        },
        '.app-wrapper': {
          minHeight: '100vh'
        },
        '.snackbar-box': {
          padding: '0.5em 1rem',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          '& svg': {
            marginRight: '0.5rem'
          },
          '&.error': {
            backgroundColor: colors.default.error
          },
          '&.warning': {
            backgroundColor: '#ff9800'
          },
          '&.success': {
            backgroundColor: '#4caf50'
          }
        }
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: colors.light.fieldBackground,
        borderTopLeftRadius: '2px',
        borderTopRightRadius: '2px',
        '&:hover': {
          backgroundColor: colors.light.fieldHoverBackground
        },
        '&.Mui-focused': {
          backgroundColor: colors.light.fieldFocusedBackground
        }
      }
    },
    MuiCheckbox: {
      root: {
        '& .MuiSvgIcon-root': {
          width: 32,
          height: 32
        }
      }
    },
    MuiButton: {
      root: {
        paddingTop: '10px',
        paddingBottom: '10px',
        borderRadius: '3px'
      },
      label: {
        fontSize: '14px',
        lineHeight: '16px',
        letterSpacing: '1px',
        fontWeight: 500
      },
      containedPrimary: {
        color: colors.light.background
      }
    },
  }
})

const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.default.primary
    },
    secondary: {
      main: colors.default.secondary
    },
    error: {
      main: colors.default.error
    },
    branding: colors.default.branding,
    text: {
      primary: colors.dark.textPrimary,
      secondary: colors.dark.textSecondary
    },
    background: {
      paper: colors.dark.background
    },
    action: {
      active: colors.dark.actionActive
    },
    divider: colors.dark.divider
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          margin: 0,
          fontFamily: '"Montserrat", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothingg: 'grayscale',
          overflowY: 'hidden'
        },
        '.full-height-component': {
          height: 'calc(100% - 64px)',
          overflow: 'hidden'
        },
        '.error-message': {
          color: colors.default.error,
          margin: 0,
          paddingBottom: '1rem'
        },
        '.app-wrapper': {
          minHeight: '100vh'
        },
        '.snackbar-box': {
          padding: '0.5em 1rem',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          '& svg': {
            marginRight: '0.5rem'
          },
          '&.error': {
            backgroundColor: colors.default.error
          },
          '&.warning': {
            backgroundColor: '#ff9800'
          },
          '&.success': {
            backgroundColor: '#4caf50'
          }
        }
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: colors.dark.fieldBackground,
        borderTopLeftRadius: '2px',
        borderTopRightRadius: '2px',
        '&:hover': {
          backgroundColor: colors.dark.fieldHoverBackground
        },
        '&.Mui-focused': {
          backgroundColor: colors.dark.fieldFocusedBackground
        }
      }
    },
    MuiCheckbox: {
      root: {
        '& .MuiSvgIcon-root': {
          width: 32,
          height: 32
        }
      }
    },
    MuiButton: {
      root: {
        paddingTop: '10px',
        paddingBottom: '10px',
        borderRadius: '3px'
      },
      label: {
        fontSize: '14px',
        lineHeight: '16px',
        letterSpacing: '1px',
        fontWeight: 500
      },
      containedPrimary: {
        color: colors.dark.background
      }
    },
  }
})

export const getTheme = (themeType) => (themeType === 'dark' ? darkTheme : lightTheme)


