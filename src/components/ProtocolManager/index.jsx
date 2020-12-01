import 'date-fns';
import { format, formatDistance } from 'date-fns';
import es from 'date-fns/locale/es';

import React, { useEffect, useState}  from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';
import { Button, 
  Card, 
  CardActions, 
  CardContent, 
  Chip, 
  FormControl, 
  FormControlLabel, 
  IconButton,  
  InputLabel,  
  MenuItem,  
  Select,  
  Switch, 
  TextField } from '@material-ui/core';
import { sortProtocols } from '../../helpers/protocolHelper';
import DeleteIcon from '@material-ui/icons/Delete';


import './index.scss'
import { getUserList } from '../../api/protocol';

const ProtocolManager = props => {
  const [newProtocol, setNewProtocol] = useState();
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await getUserList();
    setUsers(res);
  };

  useEffect(()=>{
    loadUsers();
  }, []);

  const { protocolList, updateList } = props;

  const handleAddProtocol = () => {
    setNewProtocol({
      nombre: '',
      local: false,
      orden: protocolList.length + 1, 
      startDate: new Date(),
      endDate: null,
      owner: null,
    });
  }

  const saveProtocol = () => {
    updateList([...protocolList, newProtocol]);
    setNewProtocol();
  }

  const handleRemove = protocol => {
  updateList(protocolList.filter(savedProtocol => !(savedProtocol.nombre === protocol.nombre && +savedProtocol.orden === +protocol.orden)));
  }

  return <div>
    <Button variant="outlined" color="secondary" onClick={handleAddProtocol}>Agregar Protocolo</Button>
    {newProtocol ? (
      <Card variant="outlined">
        <CardContent>
          <div className="fields-container">

            <TextField label="Nombre de Protocolo" value={newProtocol.nombre} onChange={({ target: { value } }) => setNewProtocol({
              ...newProtocol,
              nombre: value
            })} />
            <TextField type="number" label="Orden" value={newProtocol.orden} onChange={({ target: { value } }) => setNewProtocol({
              ...newProtocol,
              orden: value
            })} /> 
            <FormControl>
              <InputLabel>Responsable de protocolo</InputLabel>
              <Select value={newProtocol.owner} onChange={({target:{value}})=> setNewProtocol({
                ...newProtocol,
                owner: value,
              })}>
                {users.map(user=> (
                  <MenuItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormControlLabel control={
                <Switch checked={newProtocol.local} onChange={
                  ({ target: { checked } }) => setNewProtocol({
                    ...newProtocol,
                    local: checked
                  })
                } />
              } label="Es local?"/>
              
            </FormControl>
            <div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  disableToolbar
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Fecha de Inicio"
                  value={newProtocol.startDate}
                  onChange={(value) => setNewProtocol({
                    ...newProtocol,
                    startDate: value,
                  })}
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
                  value={newProtocol.endDate}
                  onChange={(value) => setNewProtocol({
                    ...newProtocol,
                    endDate: value,
                  })}       
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </CardContent>
        <CardActions>
          <Button onClick={()=>setNewProtocol()} variant="text">Cancelar</Button>
          <Button disabled={!newProtocol.endDate} onClick={saveProtocol} variant="contained">Guardar</Button>
        </CardActions>
      </Card>
    ) : null}
    <h4>Lista de protocolos</h4>
    {protocolList.sort(sortProtocols).map(protocol => (
      <div key={protocol.orden}>
        {protocol.nombre}
        <div>
        {format(protocol.startDate, 'dd/MM/yyyy')} - {format(protocol.endDate, 'dd/MM/yyyy')} /
    <b>{formatDistance(protocol.startDate, protocol.endDate, {locale: es})}</b>
          </div>
        <Chip label={protocol.orden} size="small" color="primary" />{
          protocol.local ? <Chip label={"Local"} size="small" color="primary"/> : null
        }
        <IconButton onClick={()=> handleRemove(protocol)}>
          <DeleteIcon  />
        </IconButton>
      </div>
    ))}
  </div>

}

export default ProtocolManager;