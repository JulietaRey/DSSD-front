import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Tabs, Tab, TabPanel, Card, CardContent, List, ListItem, Divider, Chip } from '@material-ui/core';
import { getMembersWithProtocols } from '../../api/protocol';
import { getProjects } from '../../api/project';
import { formatDistance, isBefore, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';


const getTotalDesaprobados = protocols => protocols.reduce((tot,current)=> current.ejecuciones > 1 ?  tot + current.ejecuciones - 1 : tot , 0);

const sortByDesaprobados = (a, b) => getTotalDesaprobados(a.protocols) <  getTotalDesaprobados(b.protocols) ? 1 : -1;

const getEveryProtocol = members => members.reduce((all, member) => [...all, ...member.protocols], []);

const getEveryProject = members => {
  const protocols = getEveryProtocol(members);
  return protocols.reduce((all,protocol) => {
    if (!all.some(existing => existing.id === protocol.project.id)) {
      return [...all, protocol.project];
    }
    return all;
  },[]);
}

const getProjectWithProtocols = members => {
  const protocols = getEveryProtocol(members);
  return getEveryProject(members).map(project => ({
    ...project,
    protocols: project.protocolIds.map(protocolId => protocols.find(p => p.id === protocolId)),
  }));
}

const Monitor = () => {
  const [projects, setProjects ]= useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [members, setMembers] = useState([]);

  const loadData= async () => {
   const data =  await getMembersWithProtocols();
   setMembers(data);
   const everyProject = await getProjects();
   setProjects(everyProject);
  }
  useEffect(()=>{
    loadData();
  },[])

  return (
    <Container>
      <Typography variant="h2">
        Monitor
      </Typography>
      <Grid container>
        <Grid item xs={12}>
          <Tabs value={selectedTab} onChange={(e, val) => setSelectedTab(val)}>
            <Tab label="Proyectos" value={0}/>
            <Tab label="Responsables de protocolo" value={1}/>
          </Tabs>
        </Grid>
        <Grid item xs={12}>

          <Grid container justify="flex-start" spacing={2}>
        {selectedTab === 0 ? projects.map(project => (
          <Grid item xs={7}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5">
                  {project.nombre} <Chip color="secondary" variant="outlined" label={project.result || 'En Progreso'}/>
                </Typography>
                <Typography variant="overline">
                  <b>Protocolos aprobados = </b> {project.protocols.reduce((tot,p) => p.estado === 'finalizado' ? tot + 1 : tot, 0)}/{project.protocols.length}
                </Typography>
                {!project.result ? (
                  <>
                    <Divider/>
                    {project.protocols
                      .filter(p => p.estado !== 'finalizado' && isBefore(parseISO(p.fecha_fin), new Date()) )
                      .map(p => (
                        <ListItem>
                          <Typography variant="caption">
                              {p.nombre}
                              <i>
                                - Atrasado por {formatDistance(parseISO(p.fecha_fin), new Date(), {locale: es})}
                              </i>
                          </Typography>
                        </ListItem>
                      ))}
                  </>
                ) : null }
                <Divider />
                
              </CardContent>
            </Card>
          </Grid>
        )) : 
            members.sort(sortByDesaprobados).map(member => (
            <Grid item xs={7} key={member.id}>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1">
                  {member.nombre}
                </Typography>
                {member.protocols.length ? (
                  <>
                  <List>
                    {member.protocols.map(protocol => protocol.ejecuciones > 1 ? (
                      
                      <ListItem>
                        <Typography variant="body2">

                        {protocol.nombre} - <span>Cantidad de veces desaprobado = {protocol.ejecuciones - 1 }</span>
                        </Typography>
                      </ListItem>

                    ): null)}
                  </List>
                  <Divider/>
                  <Typography variant="body1">
                    Desaprobados totales = {getTotalDesaprobados(member.protocols)}
                  </Typography>
                  </>
                ) : <Typography variant="body2">No tiene protocolos asignados</Typography>}
              </CardContent>
            </Card>
            </Grid>
          ))

        
      }
        </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Monitor;