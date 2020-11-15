import React, { useState } from 'react';
import { Button, Container, TextField } from '@material-ui/core';

import './index.scss';
import { signInCall } from '../../api/auth';

const SignIn = props => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
 
  const handleSubmit = () => {
    signInCall({
      username: user , password
    })
  }
  return <Container>
    
    <div className="sign-in-container">
      <TextField label="Usuario" value={user} onChange={({target: {value}})=> setUser(value)}/>
      <TextField type="password" label="Contraseña"
        onChange={({target: {value}})=> setPassword(value)}
        value={password} />

      <Button onClick={handleSubmit}>Ingresar</Button>
    </div>
  </Container>
};

export default SignIn;