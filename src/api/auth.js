import { signIn } from "./bonita";
import { url } from './url';

export const signInCall = async (data) => {
  const res = await fetch(`${url}/auth/signin`, {
    method: 'POST',
    body: new URLSearchParams({
      'username': data.username,
      'password': data.password
    }),
    credentials: 'omit',
  });

  const datos = await res.json();
  window.localStorage.setItem('apiKey', datos.accessToken);

  await signIn();
  // window.localStorage.setItem('bonitaToken', bonitaRes.bonitaToken);
  //window.localStorage.setItem('JSESSIONID', bonitaRes.JSESSIONID);
  return {userId: datos.userId, rolId: datos.rolId};

};

export const signUpCall = async (data) => {
  const res = await fetch(`${url}/auth/signup`, {
    method: 'POST',
    body: new URLSearchParams(data),
    credentials: 'omit',
  });
  return res;

}