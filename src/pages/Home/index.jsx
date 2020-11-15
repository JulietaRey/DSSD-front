import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';

const Home = () => {
  let history = useHistory();
  const goToProjectConfig = () => {
    history.push('/project/config')
  }
  return <div>
    home
     <Button variant="contained" color="primary" onClick={goToProjectConfig}>Agregar Proyecto</Button>
  </div>
};

export default Home;