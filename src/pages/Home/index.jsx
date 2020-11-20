import { Button } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getTasks } from '../../api/bonita';

const Home = () => {
  let history = useHistory();
  const loadTasks = async() => {
    const tareas = await getTasks();
    console.log(tareas);
  }
  
  useEffect(() => {loadTasks()}, []);
  const goToProjectConfig = () => {
    history.push('/project/config')
  }
  return <div>
    home
     <Button variant="contained" color="primary" onClick={goToProjectConfig}>Agregar Proyecto</Button>
  </div>
};

export default Home;