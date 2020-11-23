import React, { useState } from 'react';
import { Button, Container, TextField } from '@material-ui/core';

import './index.scss';
import { signInCall } from '../../api/auth';
import { useContext } from 'react';
import { SessionContext } from '../../context/Session';
import { useHistory } from 'react-router-dom';

const SignIn = props => {
  const { setUserId, userId } = useContext(SessionContext);
  const history = useHistory();
  if (userId) {
    history.push('/');
  }
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
 
  const handleSubmit = async () => {
    const userId = await signInCall({
      username: user , password
    });
    if (userId) {
      setUserId(userId);
    }
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