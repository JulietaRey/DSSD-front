import { createContext, useState } from 'react';


export const SessionContext = createContext();

export const UseSession = (props) => {
  const [userId, setId] = useState(window.localStorage.getItem('userId') || undefined);
  
  const setUserId = (id) => {
    const local = window.localStorage.getItem('userId');
    if (!local) {
      window.localStorage.setItem('userId', id);
    }
    setId(id);
  }

  const clearUser = () => {
    setId(undefined);
    window.localStorage.removeItem('userId')
  }

  return <SessionContext.Provider value={{ userId, setUserId, clearUser }}>
    {props.children}
  </SessionContext.Provider>

}