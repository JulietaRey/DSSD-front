import 'date-fns';

import React, { useState,useContext } from 'react';
import { Button, Container, TextField } from '@material-ui/core'; 
import { useHistory } from 'react-router-dom';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

import ProtocolManager from '../../components/ProtocolManager';
import {saveProject} from '../../api/project';
import './index.scss';
import { SessionContext } from '../../context/Session';


const inTenDays = date => {
  const dateInSeconds = date.getTime();
  return new Date(dateInSeconds + 1000 * 60 * 60 * 24 * 10);
}

const ProjectConfig = props => {
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(inTenDays(new Date()));
  const [protocolList, setProtocolList] = useState([]);
  const { userId } = useContext(SessionContext);

  let history = useHistory();

  const handleSubmit = async () => {
    const res = await saveProject({
      name: projectName,
      startDate,
      endDate,
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
        <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Fecha de Inicio"
            value={startDate}
            onChange={setStartDate}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
           <DatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Fecha de Fin"
            value={endDate}
            onChange={setEndDate}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
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