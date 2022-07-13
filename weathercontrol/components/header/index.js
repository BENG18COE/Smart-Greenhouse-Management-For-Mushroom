/* eslint-disable no-unused-vars */
import React from 'react';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
// Header sub components
import HeaderLogoBlock from './headerlogoblock';
import HeaderDatepickerBlock from './headerdatepicker';

const useStyles = makeStyles(theme => ({
  appbar: {
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  container: {
    padding: theme.spacing(0)
  },
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

const Header = ({ toggleTheme }) => {
  const classes = useStyles();
  return (
    <AppBar color="inherit" elevation={0} className={classes.appbar} >
      <Toolbar>
        <Container fixed={true} maxWidth="lg" className={classes.container} >
          <Box className={classes.root} >
            <HeaderLogoBlock toggleTheme={toggleTheme} />
            <HeaderDatepickerBlock/>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
