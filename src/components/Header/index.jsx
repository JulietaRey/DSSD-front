import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';

import './index.scss';
import { SessionContext } from '../../context/Session';

const Header = props => {
  const { userId, clearUser } = useContext(SessionContext);
  let history = useHistory();

  if (!userId) {
    history.push('/');
  }

  const goToLogin = () => {
    history.push('/signin');
  }

  

  return <AppBar>
    <Toolbar className="header-menu">
    <Typography onClick={()=>history.push('/')} style={{ cursor: 'pointer'}} variant="h6" >
      Sistema de prueba de medicamentos
    </Typography>
    {
      userId ? (
        <Button  style={{color: 'white'}} onClick={clearUser}>Logout</Button>
      ) : (

        <Button style={{color: 'white'}} onClick={goToLogin}>Login</Button>
      )
    }
    </Toolbar>
  </AppBar>
};

export default Header;