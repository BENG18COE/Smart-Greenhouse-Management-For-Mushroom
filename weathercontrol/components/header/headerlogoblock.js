/* eslint-disable no-unused-vars */
import React from 'react';
import Link from 'next/link';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
// Context API
import { ThemeContext } from '../../context';

const useStyles = makeStyles(theme => ({
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitTapHighlightColor: 'transparent',
    '& img': {
      width: 40,
      height: 40,
      cursor: 'pointer'
    },
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
      '& img': {
        width: 32,
        height: 32
      }
    }
  }
}));

const HeaderLogoBlock = ({ toggleTheme }) => {
  const classes = useStyles();
  return (
    <ThemeContext.Consumer>
      {
        value =>
          <Box className={classes.logo} onClick={() => toggleTheme()} >
            <Link href="/" >
              <img src={value === 'light' ? '/dark.svg' : '/light.svg'} />
            </Link>
          </Box>
      }
    </ThemeContext.Consumer>
  );
};

export default HeaderLogoBlock;
