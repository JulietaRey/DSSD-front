import { Button } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getTasks } from '../../api/bonita';
import { SessionContext } from '../../context/Session';

const Home = () => {
  let history = useHistory();
  const { clearUser } = useContext(SessionContext);

  const loadTasks = async() => {
    const tareas = await getTasks();
    console.log(tareas);
  }
  
  useEffect(() => {loadTasks()}, []);
  const goToProjectConfig = () => {
    history.push('/project/config')
  }

  const logout = () => {
    clearUser();
  }

  return <div>
    home
     <Button variant="contained" color="primary" onClick={goToProjectConfig}>Agregar Proyecto</Button>
     <Link to="signin"> Ingresar </Link>
     <Button onClick={logout}>Logout</Button>
  </div>
};

export default Home;