/* eslint-disable no-unused-vars */
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
// Components
import SwitchesComponent from '../components/switches';
import Header from '../components/header';
import DataTable from '../components/datatable';
import DataLoader from '../components/dataloader';
import DataNotFound from '../components/datanotfound';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 96,
    padding: theme.spacing(0),
    [theme.breakpoints.down('sm')]: {
      marginTop: 64,
      padding: theme.spacing(2)
    }
  }
}));

const Index = ({ toggleTheme }) => {
  const classes = useStyles();
  const router = useRouter();
  const [data, setData] = React.useState('loading');
  const [switches, setSwitches] = React.useState(false);

  React.useEffect(() => {
    var date = router.query.date ? new Date(router.query.date).toISOString() : new Date().toISOString();
    fetch('/api/viewdata?date=' + date)
      .then(res => res.json())
      .then(data => {
        if (data.length < 1) {
          setData('DataNotFound');
        } else {
          setData(data);
        }
      });
    fetch('/api/viewcontrols')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSwitches(data);
        }
      }).catch(() => {
        return null;
      });
    setInterval(() => {
      fetch('/api/viewdata?date=' + date)
        .then(res => res.json())
        .then(data => {
          if (data.length < 1) {
            setData('DataNotFound');
          } else {
            setData(data);
          }
        }).catch(() => {
          return null;
        });
      fetch('/api/viewcontrols')
        .then(res => res.json())
        .then(data => {
          if (data) {
            setSwitches(data);
          }
        }).catch(() => {
          return null;
        });
    }, 5000);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Jay Linenyambea - Interactive Greenhouse.</title>
      </Head>
      <Header toggleTheme={toggleTheme} />
      <Container fixed={true} maxWidth="lg" className={classes.root} >
        <SwitchesComponent switches={switches} />
        {
          data === 'loading'
            ? <DataLoader />
            : data === 'DataNotFound'
              ? <DataNotFound />
              : <DataTable rows={data} />
        }
      </Container>
    </React.Fragment>
  );
};

export default Index;
