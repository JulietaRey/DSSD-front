import { createContext, useState } from 'react';


export const SessionContext = createContext();

export const UseSession = (props) => {
  const [userId, setId] = useState(window.localStorage.getItem('userId') || undefined);
  const [rolId, setRolId ] = useState(window.localStorage.getItem('rolId') || undefined)
  const setUserId = (id, rolId) => {
    const local = window.localStorage.getItem('userId');
    if (!local) {
      window.localStorage.setItem('userId', id);
      window.localStorage.setItem('rolId', rolId);
    }
    setId(id);
    setRolId(rolId)
  }

  const clearUser = () => {
    setId(undefined);
    window.localStorage.removeItem('userId')
  }

  return <SessionContext.Provider value={{ userId, setUserId, clearUser, rolId }}>
    {props.children}
  </SessionContext.Provider>

}