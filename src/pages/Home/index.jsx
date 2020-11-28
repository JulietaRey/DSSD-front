import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Chip, Dialog, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { getProjects, lanzamientoDeProtocolo } from '../../api/project';
import { getTasksForProjects, getTasksForProtocols } from '../../api/bonita';
import { getProtocolList, saveProtocolResult } from '../../api/protocol'; 
import {ADMIN_ROL, USER_ROL} from '../../common/constants';
import { SessionContext } from '../../context/Session';

const Home = () => {
  const [ projects, setProjects ] = useState([]);
  const [ projectTasks, setProjectTasks ] = useState([]);
  const [ protocols, setProtocols] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ selectedProtocol, setSelectedProtocol] = useState(null);
  const [protocolResult, setProtocolResult] = useState(0);

  let history = useHistory();
  const {userId , rolId } = useContext(SessionContext);

  const loadTasks = async() => {
    if (!userId) {
      return null;
    }

    if (rolId == ADMIN_ROL) {
      const projectList = await getProjects(userId);
      setProjects(projectList);
      const taskList = await getTasksForProjects(projectList, ADMIN_ROL);
      setProjectTasks(taskList);
    } else {
      const protocolList = await getProtocolList(userId);
      setProtocols(protocolList);
      const taskList = await getTasksForProtocols(protocolList, USER_ROL);
      setProjectTasks(taskList);

    }
    
  }
  
  useEffect(() => {loadTasks()}, []);
  const goToProjectConfig = () => {
    history.push('/project/config')
  }



  const handleAction = async (project, task) => {
    await lanzamientoDeProtocolo(project, task);
    history.push('/');
  }

  const renderAction = projectItem => {
    const task = projectTasks.find(projectTask => projectTask.caseId == projectItem.caseId);
    if (!task ) {
      return null;
    }
     
    return <Button onClick={()=>handleAction(projectItem, task)} variant="contained" color="secondary">{task.displayName}</Button>;
  }

  const handleProtocolAction = async () => {
    await saveProtocolResult(selectedProtocol, protocolResult, userId);
    setSelectedProtocol(null);
    setShowModal(false);
    history.push('/');
  }

  const renderProtocolAction = protocolItem => {
    const task = projectTasks.find(projectTask => 
        projectTask.caseId == protocolItem.project.caseId 
        && protocolItem.estado === 'listo');
    if (!task) {
      return null;
    }
    return <Button onClick={()=>{setSelectedProtocol(protocolItem); setShowModal(true)}} variant="contained" color="secondary">
      {task.displayName}
    </Button>
  }

  if (!userId) {
    return <Paper style={{
      padding: '50px',
      maxWidth: '600px'
    }}>
      <Typography variant="h5">
          Inicie sesión para gestionar el sistema
      </Typography>
    </Paper>
  }

  return <Grid container justify="center">

    <Grid item xs={11}>
      {rolId == ADMIN_ROL  ? <> <Grid container 
        justify="space-between"
        alignItems="center"
        >
          <Grid item sm={8} md={10} >
            <Typography variant="h2">
              Proyectos
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={goToProjectConfig}>Agregar Proyecto</Button>
          </Grid>
      </Grid>
         <Grid container spacing={2} style={{padding: '10px 0'}}>
           {
             projects.map(projectItem => (
               <Grid xs={12} md={6} lg={4} item key={projectItem.id}>
                 <Card variant="outlined">
                    <CardHeader title={projectItem.nombre} />
                   <CardContent>
                      {format(parseISO(projectItem.fecha_inicio), 'dd/MM/yyyy')} - {format(parseISO(projectItem.fecha_fin), 'dd/MM/yyyy') }
                      <br></br>
                      {renderAction(projectItem)}
                   </CardContent>
                 </Card>
                </Grid>
             ))
           }
         </Grid>
      </>  : null}
      {rolId == USER_ROL  ? <> <Grid container 
        justify="space-between"
        alignItems="center"
        >
          <Grid item sm={8}>
            <Typography variant="h2">
              Protocolos
            </Typography>
          </Grid>
      </Grid>
         <Grid container spacing={2} style={{padding: '10px 0'}}>
           {
             protocols.map(protocolItem => (
               <Grid xs={12} md={6} lg={4} item key={protocolItem.id}>
                 <Card variant="outlined">
                    <CardHeader title={<>
                    {protocolItem.nombre}
                    {protocolItem.owner === null ? <Chip size="small" color="secondary" label="Sin Asignar" /> : null}

                    </>} />
                   <CardContent>
                      {format(parseISO(protocolItem.fecha_inicio), 'dd/MM/yyyy')} - {format(parseISO(protocolItem.fecha_fin), 'dd/MM/yyyy') }
                      <br></br>
                      {renderProtocolAction(protocolItem)}
                   </CardContent>
                 </Card>
                </Grid>
             ))
           }
         </Grid>
      </>  : null}
    </Grid>
    <Dialog  open={showModal}>
      <Grid style={{ 
      padding: '50px'
     }} container justify="center">
           <Grid item>
            <Typography variant="h5">
              Ingrese el resultado del protocolo
            </Typography>
           </Grid>
           <Grid item>
             <TextField label="Resultado" type="number" value={protocolResult} onChange={({target: { value }})=> setProtocolResult(value)} />
           </Grid>
          <Grid item style={{ margin: '10px 0'}}>
            <Button onClick={()=>{setShowModal(false); setSelectedProtocol(null)}} variant="text">Cancelar</Button>
            <Button onClick={()=>handleProtocolAction()} variant="contained" color="primary">Guardar</Button>
          </Grid>
      </Grid>
      
    </Dialog>
  </Grid>
};

export default Home;