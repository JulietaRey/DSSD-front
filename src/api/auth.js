const url = 'https://dssd-2020-ytj.herokuapp.com';
export const signInCall = async (data) => {
  const res = await fetch(`${url}/auth/signin`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'omit',
    headers: {
      // 'Access-Control-Allow-Origin': true,
      // 'Content-Type': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  console.log(await res.json());
};