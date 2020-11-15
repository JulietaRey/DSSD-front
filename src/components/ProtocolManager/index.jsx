import React, { useState}  from 'react';
import {  Button, Card, CardActions, CardContent, Chip, FormControl, FormControlLabel, IconButton,  Switch, TextField } from '@material-ui/core';
import { sortProtocols } from '../../helpers/protocolHelper';
import DeleteIcon from '@material-ui/icons/Delete';


import './index.scss'

const ProtocolManager = props => {
  const [newProtocol, setNewProtocol] = useState();

  const { protocolList, updateList } = props;

  const handleAddProtocol = () => {
    setNewProtocol({
      name: '',
      local: false,
      orden: protocolList.length + 1, 
    });
  }

  const saveProtocol = () => {
    updateList([...protocolList, newProtocol]);
    setNewProtocol();
  }

  const handleRemove = protocol => {
  updateList(protocolList.filter(savedProtocol => !(savedProtocol.name === protocol.name && +savedProtocol.orden === +protocol.orden)));
  }

  return <div>
    <Button variant="outlined" color="secondary" onClick={handleAddProtocol}>Agregar Protocolo</Button>
    {newProtocol ? (
      <Card variant="outlined">
        <CardContent>
          <div className="fields-container">

            <TextField label="Nombre de Protocolo" value={newProtocol.name} onChange={({ target: { value } }) => setNewProtocol({
              ...newProtocol,
              name: value
            })} />
            <TextField type="number" label="Orden" value={newProtocol.orden} onChange={({ target: { value } }) => setNewProtocol({
              ...newProtocol,
              orden: value
            })} /> 
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
          </div>
        </CardContent>
        <CardActions>
          <Button onClick={()=>setNewProtocol()} variant="text">Cancelar</Button>
          <Button onClick={saveProtocol} variant="contained">Guardar</Button>
        </CardActions>
      </Card>
    ) : null}
    <h4>Lista de protocolos</h4>
    {protocolList.sort(sortProtocols).map(protocol => (
      <div key={protocol.orden}>
        {protocol.name}
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