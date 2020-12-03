import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, Card, CardContent, CardHeader, Chip, Dialog, Grid, Paper, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { getProjects, makeDecision } from '../../api/project';
import { getTasksForProjects, getTasksForProtocols } from '../../api/bonita';
import { getProtocolList, saveProtocolResult } from '../../api/protocol'; 
import {ADMIN_ROL, USER_ROL} from '../../common/constants';
import { SessionContext } from '../../context/Session';
import Notifications from '../../components/Notifications';
import Project from '../../components/Project';

const colors = [
  '#d60000',
  '#d64500',
  '#d68000',
  '#d6b100',
  '#bfd600',
  '#00d6c2',
  '#009bd6',
  '#7a00d6',
  '#bf00d6',
  '#0060d6',
  '#00d606',
]

const Home = () => {
  const [ projects, setProjects ] = useState([]);
  const [ projectTasks, setProjectTasks ] = useState([]);
  const [ protocols, setProtocols] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ selectedProtocol, setSelectedProtocol] = useState(null);
  const [ protocolResult, setProtocolResult] = useState(0);
  const [ showFailModal, setShowFailModal ] = useState(false);
  const [ activeTab, setActiveTab ] = useState(0);

  let history = useHistory();
  const {userId , rolId } = useContext(SessionContext);

  const refreshProjects = async () => {
    const projectList = await getProjects(userId);
    setProjects(projectList);
  }

  const loadTasks = async () => {
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
  useEffect(() => {loadTasks()}, [userId, rolId]);

  const goToProjectConfig = () => {
    history.push('/project/config')
  }

  const handleFail =  async (params) => {
    await makeDecision(selectedProtocol.caseId, params);
    setSelectedProtocol(null);
    setShowFailModal(false);
  }

  const handleProtocolAction = async () => {
    await saveProtocolResult(selectedProtocol, protocolResult, userId);
    setSelectedProtocol(null);
    setShowModal(false);
    history.push('/');
  }

  const actionsAfterFailure = (res, project) =>{ 
    setProtocolResult(res); 
    setSelectedProtocol(project);
    setShowFailModal(true);}

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

  const filteredProjects = () => {
    if (activeTab === 0) {
      return projects.filter(project => project.result === null);
    }
    return projects.filter(project => project.result !== null);
  }

  const filteredProtocols = () => {
    switch (activeTab) {
      case 0:
        return protocols.filter(protocol => projectTasks.some(projectTask => 
          projectTask.caseId == protocol.project.caseId)
          && protocol.estado === 'listo');
      case 1:
        return protocols.filter(protocol => protocol.ejecuciones === 0)
      case 2: 
        return protocols.filter(protocol => protocol.estado === 'finalizado')
      case 3: 
      default:
        return protocols;

    }
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
      <Tabs value={activeTab} onChange={(e, value)=>setActiveTab(value)} >
        <Tab value={0} label="Activos"/>
        <Tab value={1} label="Archivados"/>
      </Tabs>
         <Grid container spacing={2} style={{padding: '10px 0'}}>
           {
             filteredProjects().map(projectItem => <Project 
              key={projectItem.id}
              actionsAfterFailure={actionsAfterFailure} 
              project={projectItem} 
              projectTasks={projectTasks}
              />)
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
      <Tabs value={activeTab} onChange={(e, value)=>setActiveTab(value)} >
        <Tab value={0} label="Activos"/>
        <Tab value={1} label="Próximos"/>
        <Tab value={2} label="Terminados"/>
        <Tab value={3} label="Todos"/>
      </Tabs>
         <Grid container spacing={2} style={{padding: '10px 0'}}>
           {filteredProtocols().length ?
             filteredProtocols().map(protocolItem => (
               <Grid xs={12} md={6} lg={4} item key={protocolItem.id}>
                 <Card variant="outlined">
                    <CardHeader 
                      avatar={
                        protocolItem.puntaje !== null ? 
                      <Avatar style={{
                        backgroundColor: colors[protocolItem.puntaje]
                      }} >{protocolItem.puntaje}</Avatar> : null
                      }
                    title={<>
                    {protocolItem.nombre}
                    {protocolItem.owner === null ? <Chip size="small" color="secondary" label="Sin Asignar" /> : null}
                    
                    </>} subheader={protocolItem.project.nombre} />
                   <CardContent>
                     <Grid container>
                     <Grid item xs={6}>
                        <Typography variant="overline"><b>Fecha inicio</b>: {format(parseISO(protocolItem.fecha_inicio), 'dd/MM/yyyy')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="overline"><b>Fecha fin</b>: {format(parseISO(protocolItem.fecha_fin), 'dd/MM/yyyy')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="overline">Numero de orden: {protocolItem.orden}</Typography>
                    </Grid> 
                    <Grid item xs={6}>
                      {
                        protocolItem.estado ? 
                        <Chip style={{
                          textTransform: 'capitalize'
                        }} color="primary" label={protocolItem.estado} />
                       : null}
                    </Grid>
                    
                     </Grid>
                      {renderProtocolAction(protocolItem)}
                   </CardContent>
                 </Card>
                </Grid>
             ))
           : <Paper style={{
            padding: '50px',
            maxWidth: '600px'
          }}>
            <Typography variant="h5">
                No hay protocolos bajo este filtro
            </Typography>
          </Paper> }
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