import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import { Link, useHistory } from 'react-router-dom';
import { getProjects, lanzamientoDeProtocolo } from '../../api/project';
import { getTasksForProjects } from '../../api/bonita';
import {ADMIN_ROL} from '../../common/constants';
import { SessionContext } from '../../context/Session';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks ] = useState([]);
  let history = useHistory();
  const {userId,  clearUser, rolId } = useContext(SessionContext);

  const loadTasks = async() => {
    if (!userId) {
      return null;
    }

    if (rolId == ADMIN_ROL) {
      const projectList = await getProjects(userId);
      setProjects(projectList);
      const taskList = await getTasksForProjects(projectList, ADMIN_ROL);
      console.log("🚀 ~ file: index.jsx ~ line 25 ~ loadTasks ~ taskList", taskList)
      setProjectTasks(taskList);
    }
    
  }
  
  useEffect(() => {loadTasks()}, []);
  const goToProjectConfig = () => {
    history.push('/project/config')
  }

  const logout = () => {
    clearUser();
  }

  const handleAction = async (project, task) => {
    await lanzamientoDeProtocolo(project, task);
  }

  const renderAction = projectItem => {
    const task = projectTasks.find(projectTask => projectTask.caseId == projectItem.caseId);
    if (!task ) {
      return null;
    }
     
    return <Button onClick={()=>handleAction(projectItem, task)} variant="contained" color="secondary">{task.displayName}</Button>;
  }

  return <div>
    home
     <Button variant="contained" color="primary" onClick={goToProjectConfig}>Agregar Proyecto</Button>
     <Link to="signin"> Ingresar </Link>
     <Button onClick={logout}>Logout</Button>

     <hr/>

    <div>
      {projects.length  ? <>
         <h2>Proyectos</h2>
         <div>
           {
             projects.map(projectItem => (
               <div key={projectItem.id}>
                {projectItem.nombre}
                <br></br>
                {format(parseISO(projectItem.fecha_inicio), 'dd/MM/yyyy')} - {format(parseISO(projectItem.fecha_fin), 'dd/MM/yyyy') }
                <br></br>
                {renderAction(projectItem)}
                </div>
             ))
           }
         </div>
      </>  : null}
    </div>
  </div>
};

export default Home;