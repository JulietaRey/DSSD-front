import React from 'react';
import { Container, Grid } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { projectSeen } from '../../api/project';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Notifications = props=> {
  const { projects, updateProjectList } = props;

  const markAsSeen = async (projectId) => {
    await projectSeen(projectId);
    updateProjectList();
  }

  return <Container>
    <Grid container spacing={1}>
      {projects.filter(project=> !!project.result && !project.seen).map(project => 
        <Grid item xs={12}> 
          {project.result === 'Cancelado' ? 
            <Alert severity="error" onClose={()=>markAsSeen(project.id)} >Proyecto {project.nombre} fue cancelado</Alert>
            : <Alert severity="success" onClose={()=>markAsSeen(project.id)}>Proyecto {project.nombre} terminó exitosamente</Alert> }
        </Grid>
      )}
    </Grid>
  </Container>
}

export default Notifications;