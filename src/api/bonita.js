const url = 'http://localhost:8080/bonita/';

//los valores para el auth con bonita
const bonitaToken = 'c9fe99c5-f1a3-47d8-bac7-94e8a96c88ce';
const bonitaCookie = 'JSESSIONID='+'DC0B75A5188CF79A3049A182BF0811A9'+'; '+
'X-Bonita-API-Token='+bonitaToken;



export const signIn = async () => {
  const res = await doTheRequest('POST',`${url}/loginservice`,
    new URLSearchParams({
      'username': 'walter.bates',
      'password': 'Prueba.123',
      'redirect': 'false'
    }));    
  
  const token = res.headers['set-cookie'].find(cookie => cookie.startsWith('X-Bonita-API'));
  const sessionId = res.headers['set-cookie'].find(cookie => cookie.startsWith('JSESSION'));
  
  return {
    bonitaToken: (token.split('=')[1]).split(';')[0],
    JSESSIONID: (sessionId.split('=')[1]).split(';')[0],
  }
};

export const startProcess = async () => {
  const processId = await getProcessId('Testeo de medicamentos');
    
  const res = await doTheRequest('POST', `${url}/API/bpm/process/${processId}/instantiation`);

  return res.data.caseId;

}

export const getProcessId = async(processName) => {
  const res = await doTheRequest('GET',`${url}/API/bpm/process?s=${processName}`);

  return res.data[0].id
}


export const finishHumanTask = async(caseId) => {
  const res = await doTheRequest('GET',`${url}/API/bpm/humanTask?f=rootCaseId=${caseId}`);

  const humanTaskId = res.data[0].id;

  await doTheRequest('PUT',`${url}/API/bpm/humanTask/${humanTaskId}`, {
    //al body le tengo que hacer JSON.stringify()???
    "assigned_id": "1",
    "state": "completed"
  }); 
}

export const getProcessVariable = async(caseId, variableName) => {
  const res = await doTheRequest('GET', `${url}/API/bpm/caseVariable/${caseId}/${variableName}`);
  return {
    name: res.data.name,
    value: res.data.value,
    case_id: res.data.case_id,
    type: res.data.type
  }
}

export const updateProcessCaseVariable = async(caseId, variableName, javaTypeName, newValue) => {
  await doTheRequest('PUT', `${url}/API/bpm/caseVariable/${caseId}/${variableName}`, {
    //misma duda con JSON.stringify()???
    "type": javaTypeName,
    "value": newValue
  });
  
}

export const getAllProcess = async() => {
  const res = await doTheRequest('GET', `${url}/API/bpm/process?p=0&c=1000`);

  return res.data;
}

export const getActiveCases = async() => {
  const res = await doTheRequest('GET', `${url}/API/bpm/case?p=0&c=1000`);

  return res.data;
}

export const getArchivedCases = async() => {
  const res = await doTheRequest('GET', `${url}/API/bpm/archivedCase?p=0&c=1000`);

  return res.data;
}

export const getCountCases = async() => {
  const res = await doTheRequest('GET', 'API/bpm/case?p=0&c=1000');

  return count(res.data);
}

export const getTasks = async() => {
  const res = await doTheRequest('GET', 'API/bpm/humanTask?p=0&c=1000');
  
  return count(res.data);
}

export const getArchivedTasks = async() => {
  const res = await doTheRequest('GET', 'API/bpm/archivedTask?p=0&c=1000');
  
  return count(res.data);
}

export const doTheRequest = async(method, url, body=null) => {
  if (method === 'PUT') {
    return fetch(url, {
      method: method,
      headers: {
        'Cookie': bonitaCookie,
        'X-Bonita-API-Token': bonitaToken,
        'Content-type': 'application/json; charset=UTF-8'  
      },
      body: body
    }).then(res => {
      return res;
    })
  } else {
    return fetch(url, {
      method: method,
      headers: {
        'Cookie': bonitaCookie,
        'X-Bonita-API-Token': bonitaToken,
      },
      body: body
    }).then(res => {
      return res;
    })
  }
}

