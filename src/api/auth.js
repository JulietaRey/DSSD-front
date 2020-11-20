import { signIn } from "./bonita";

const url = 'https://dssd-2020-ytj.herokuapp.com';
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

  const bonitaRes = await signIn();
  //window.localStorage.setItem('bonitaToken', bonitaRes.bonitaToken);
  //window.localStorage.setItem('JSESSIONID', bonitaRes.JSESSIONID);

  
};