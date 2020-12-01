import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Chip, Dialog, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { getProjects, lanzamientoDeProtocolo, makeDecision } from '../../api/project';
import { getTasksForProjects, getTasksForProtocols } from '../../api/bonita';
import { getProtocolList, getProtocolResult, saveProtocolResult } from '../../api/protocol'; 
import {ADMIN_ROL, USER_ROL} from '../../common/constants';
import { SessionContext } from '../../context/Session';
import Notifications from '../../components/Notifications';

const Home = () => {
  const [ projects, setProjects ] = useState([]);
  const [ projectTasks, setProjectTasks ] = useState([]);
  const [ protocols, setProtocols] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ selectedProtocol, setSelectedProtocol] = useState(null);
  const [ protocolResult, setProtocolResult] = useState(0);
  const [ showFailModal, setShowFailModal ] = useState(false);

  let history = useHistory();
  const {userId , rolId } = useContext(SessionContext);

  const refreshProjects = async () => {
    const projectList = await getProjects(userId);
    setProjects(projectList);
  }

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
    switch (task.displayName) {
      case 'Toma de decisión por falla':
        const res = await getProtocolResult(project.caseId);
        setProtocolResult(res); 
        setSelectedProtocol(project);
        setShowFailModal(true);
        break;
      case 'Lanzamiento de protocolo':
        await lanzamientoDeProtocolo(project, task);
        history.push('/');
        break;
      default:
        console.error('Acción no soportada');
        break;
    }
  }

  const handleFail =  async (params) => {
    await makeDecision(selectedProtocol.caseId, params);
    setSelectedProtocol(null);
    setShowFailModal(false);
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
    <Grid item xs={12}>
        <Notifications projects={projects} updateProjectList={refreshProjects} />
    </Grid>
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
    <Dialog open={showFailModal}>
    <Grid style={{ 
      padding: '50px'
     }} container justify="center">
       <Grid item>
            <Typography variant="h5">
              Toma decisión por falla
            </Typography>
            <Typography variant="body1">
              El último resultado del protocolo fue: {protocolResult}
            </Typography>
           </Grid>
          <Grid container direction="column" spacing={1} item style={{ margin: '10px 0'}}>
            <Grid item>
              <Button style={{
                background: '#1f98d2',
              }} fullWidth onClick={()=> handleFail({ resetProtocol: true })} variant="contained" color="primary">Repetir Protocolo</Button>
            </Grid>
            <Grid item>
              <Button fullWidth onClick={()=> handleFail({})} variant="contained" color="secondary">Continuar de todas formas</Button>
            </Grid>
            <Grid item>
              <Button fullWidth onClick={()=> handleFail({
                cancelProject: true
              })} variant="contained" style={{ 
                background: '#c11010',
                color: 'white'
              }}>Cancelar Proyecto</Button>
            </Grid>
            <Grid item>
              <Button fullWidth onClick={()=>{setShowFailModal(false); setSelectedProtocol(null)}} variant="outlined">Decidir más tarde</Button>
            </Grid>
          </Grid>
       </Grid>
    </Dialog>
  </Grid>
};

export default Home;