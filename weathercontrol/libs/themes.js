import { createMuiTheme } from '@material-ui/core/styles';

// Main Theme
const maintheme = createMuiTheme({
  button: {
    borderRadius: 5
  },
  palette: {
    primary: {
      dark: '#0366d6',
      main: '#0070f3',
      light: '#3291ff'
    },
    secondary: {
      main: '#19857b'
    },
    background: {
      default: '#fff',
      paper: '#fff'
    },
    success: {
      light: '#81c784',
      main: '#4caf50',
      dark: '#388e3c'
    },
    warning: {
      light: '#ffb74d',
      main: '#ff9800',
      dark: '#f57c00'
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f'
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1080,
      xl: 1720
    }
  }
});

// Light Theme
const lighttheme = createMuiTheme({
  ...maintheme
});

// Dark Theme
const darktheme = createMuiTheme({
  ...maintheme,
  palette: {
    type: 'dark',
    background: {
      paper: '#121212',
      default: '#121212'
    }
  }
});

export {
  maintheme,
  darktheme,
  lighttheme
};
