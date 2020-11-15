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

  console.log(await res.json());
};