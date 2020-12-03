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
    const data = await signInCall({
      username: user , password
    });
    if (data.userId) {
      if (data.rolId !== 0) {
        history.push('/');
      } else {
        history.push('/monitoreo');
      }
      setUserId(data.userId, data.rolId);
    }
  }
  return <Container>
    
    <div className="sign-in-container">
      <TextField label="Usuario" value={user} onChange={({target: {value}})=> setUser(value)}/>
      <TextField type="password" label="Contraseña"
        onChange={({target: {value}})=> setPassword(value)}
        value={password} />

      <Button 
        style={{ marginTop: '10px' }}
        variant="contained"
        color="secondary"
        onClick={handleSubmit}>Ingresar</Button>
    </div>
  </Container>
};

export default SignIn;