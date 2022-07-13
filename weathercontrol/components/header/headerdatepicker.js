/* eslint-disable no-unused-vars */
import React from 'react';
import { useRouter } from 'next/router';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
  logo: {
    display: 'flex'
  }
}));

const HeaderDatepickerBlock = ({ toggleTheme }) => {
  const classes = useStyles();
  const router = useRouter();
  var date = router.query.date ? new Date(router.query.date) : new Date();
  const [selectedDate, setSelectedDate] = React.useState(date);
  const handleDateChange = (date) => {
    setSelectedDate(date);
    window.location.replace('/?date=' + new Date(date).toISOString());
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        id="date"
        label="Date"
        margin="normal"
        format="MM/dd/yyyy"
        value={selectedDate}
        KeyboardButtonProps={{
          'aria-label': 'changeDate'
        }}
        onChange={handleDateChange}
      />
    </MuiPickersUtilsProvider>
  );
};

export default HeaderDatepickerBlock;
