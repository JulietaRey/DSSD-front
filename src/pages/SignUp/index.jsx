import React, { useState} from 'react';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import { signUpCall } from '../../api/auth';

const SignUp = props => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rolId, setRolId] = useState('');

  let history = useHistory();

  const createUser = async () => {
    const res = await signUpCall({
      firstName,
      lastName,
      password,
      email,
      rolId,
      username,
    });
    if (res.status === 201) {
      history.push('/')
    }
  }

  return (<Grid container justify="center" spacing={1}>
    <Grid item xs={7}>
      <Typography variant="h2">
        Crear usuario  
      </Typography>  
    </Grid> 
    <Grid item xs={7}>
      <TextField fullWidth label="Nombre" value={firstName} onChange={({target: {value}})=>setFirstName(value)} />
    </Grid>
    <Grid item xs={7}>
      <TextField fullWidth label="Apellido" value={lastName} onChange={({target: {value}})=>setLastName(value)} />
    </Grid>
    <Grid item xs={7}>
      <TextField fullWidth label="Username" value={username} onChange={({target: {value}})=>setUsername(value)} />
    </Grid>
    <Grid item xs={7}>
      <TextField fullWidth label="Email" value={email} onChange={({target: {value}})=>setEmail(value)} />
    </Grid>
    <Grid item xs={7}>
      <TextField fullWidth label="Contraseña" type="password" value={password} onChange={({target: {value}})=>setPassword(value)} />
    </Grid>
    <Grid item xs={7}>
      <TextField fullWidth label="Bonita Rol" value={rolId} onChange={({target: {value}})=>setRolId(value)} />
    </Grid>
    <Grid item xs={7}>
      <Button onClick={createUser} variant="contained" color="primary" fullWidth>Guardar</Button>
    </Grid>

  </Grid>);

};


export default SignUp;