/* eslint-disable no-unused-vars */
import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    height: 360,
    width: '100%',
    marginTop: 96,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      height: 120
    }
  }
}));

const DataNotFound = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Typography variant='h6' align='center' >
        - Data not Found -
      </Typography>
    </Box>
  );
};

export default DataNotFound;
