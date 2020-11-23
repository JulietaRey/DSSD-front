import React, { useState,useContext } from 'react';
import { Button, Container, TextField } from '@material-ui/core'; 
import { useHistory } from 'react-router-dom';

import ProtocolManager from '../../components/ProtocolManager';
import {saveProject} from '../../api/project';
import './index.scss';
import { SessionContext } from '../../context/Session';

const ProjectConfig = props => {
  const [projectName, setProjectName] = useState('');
  const [protocolList, setProtocolList] = useState([]);
  const { userId } = useContext(SessionContext);

  let history = useHistory();

  const handleSubmit = async () => {
    const res = await saveProject({
      name: projectName,
      startDate: '2020-10-10 00:00:00',
      endDate: '2021-01-01 00:00:00',
      protocolList,
      ownerId: userId,
    });
    if (res) {
      history.push('/')
    }
  }
  return (<div>
    <Container>
      <h2>Configurar Proyecto</h2>
      <div className="form-container">
        <div>
          <TextField fullWidth label={'Nombre de Proyecto'} value={projectName} onChange={({target: { value }})=> setProjectName(value)} />
        </div>
      </div>
      <ProtocolManager protocolList={protocolList} updateList={setProtocolList} />
      <hr />

      <Button variant="text" onClick={()=>history.push('/')}> Cancelar </Button>
      <Button variant="contained" color="primary" onClick={handleSubmit}> Guardar Proyecto </Button>
    </Container>
  </div>)

}

export default ProjectConfig;