/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  head: {
    fontWeight: 'bold'
  },
  mark: {
    width: 24,
    height: 24,
    borderRadius: 24,
    float: 'right'
  },
  normal: {
    backgroundColor: '#4caf50'
  },
  warning: {
    backgroundColor: '#ff9800'
  },
  danger: {
    backgroundColor: '#f44336'
  }
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover
    }
  }
}))(TableRow);

const DataTable = ({ rows }) => {
  const classes = useStyles();
  return (
    <>
      <TableContainer >
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell className={classes.head} align="left">Time</StyledTableCell>
              <StyledTableCell className={classes.head} align="right">Level&nbsp;</StyledTableCell>
              <StyledTableCell className={classes.head} align="right">Moisture&nbsp;(%)</StyledTableCell>
              <StyledTableCell className={classes.head} align="right">Temperature&nbsp;(°C)</StyledTableCell>
              <StyledTableCell className={classes.head} align="right">Humidify&nbsp;(%)</StyledTableCell>
              {/* <StyledTableCell className={classes.head} align="right">Sign</StyledTableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.name}>
                <TableCell align="left" component="th" scope="row">
                  {moment(row.time).format('LT')}
                </TableCell>
                <TableCell align="right">{row.level}</TableCell>
                <TableCell align="right">{row.moisture}</TableCell>
                <TableCell align="right">{row.temperature}</TableCell>
                <TableCell align="right">{row.humidity}</TableCell>
                {/* <TableCell align="right">{
                row.temperature < 8
                  ? <div className={Clsx(classes.mark, classes.normal)} />
                  : row.temperature < 13
                    ? <div className={Clsx(classes.mark, classes.warning)} />
                    : <div className={Clsx(classes.mark, classes.danger)} />
              }</TableCell> */}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DataTable;
