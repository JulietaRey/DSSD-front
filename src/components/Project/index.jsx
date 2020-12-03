import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button, Card, CardContent, CardHeader, Chip, Grid, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { getProtocolResult } from '../../api/protocol';
import { lanzamientoDeProtocolo } from '../../api/project';


const Project = props => {
  const { project } = props; 
  let history = useHistory();

  const handleAction = async (project, task) => {
    const { actionsAfterFailure } = props;
    switch (task.displayName) {
      case 'Toma de decisión por falla':
        const res = await getProtocolResult(project.caseId);
        actionsAfterFailure(res, project);
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


  const renderAction = projectItem => {
    const { projectTasks } = props; 
    const task = projectTasks.find(projectTask => projectTask.caseId == projectItem.caseId);
    if (!task) {
      return null;
    }
     
    return <Button onClick={()=>handleAction(projectItem, task)} variant="contained" color="secondary">{task.displayName}</Button>;
  }

  return (
    <Grid xs={12} md={6} lg={4} item key={project.id}>
      <Card variant="outlined">
        <CardHeader title={project.nombre}/>
        <CardContent>
          <Grid container>
            {project.result ? <Grid item xs={12}>
              <Chip variant="outlined" color="secondary" label={project.result} />
            </Grid>: null}
            <Grid item xs={6}>
              <Typography variant="overline"><b>Fecha inicio</b>: {format(parseISO(project.fecha_inicio), 'dd/MM/yyyy')}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="overline"><b>Fecha fin</b>: {format(parseISO(project.fecha_fin), 'dd/MM/yyyy')}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="overline">Cantidad de protocolos: {project.protocolIds.length}</Typography>
            </Grid>
          </Grid>
          {renderAction(project)}
        </CardContent>
      </Card>
    </Grid>
  );
}

export default Project;