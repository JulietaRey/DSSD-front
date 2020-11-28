const url = 'http://localhost:8080/bonita';

//los valores para el auth con bonita
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export const signIn = async () => {
  const res = await fetch(`${url}/loginservice`, {
    method: 'POST',
    body: new URLSearchParams({
      'username': 'walter.bates',
      'password': 'Prueba.123',
      'redirect': 'false'
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: 'include',
  });

  return res;
};

export const startProcess = async () => {
  const processId = await getProcessId('Testeo de medicamentos');

  const res = await doTheRequest('POST', `${url}/API/bpm/process/${processId}/instantiation`);
  const caseId = res.caseId;

  await updateProcessCaseVariable(caseId, 'caseId', 'java.lang.Integer', caseId);

  return caseId;

}

export const getProcessId = async (processName) => {
  const res = await doTheRequest('GET', `${url}/API/bpm/process?s=${processName}`);

  return res[0].id
}


export const finishHumanTask = async (caseId) => {
  const res = await doTheRequest('GET', `${url}/API/bpm/humanTask?f=rootCaseId=${caseId}`);

  const humanTaskId = res[0].id;

  await doTheRequest('PUT', `${url}/API/bpm/humanTask/${humanTaskId}`, JSON.stringify({
    //al body le tengo que hacer JSON.stringify()??? SI <3 !
    "assigned_id": "1",
    "state": "completed"
  }));
}

export const getProcessVariable = async (caseId, variableName) => {
  const res = await doTheRequest('GET', `${url}/API/bpm/caseVariable/${caseId}/${variableName}`);
  return {
    name: res.name,
    value: res.value,
    case_id: res.case_id,
    type: res.type
  }
}

export const projectStarting = async (caseId, protocolCount) => {
  await updateProcessCaseVariable(caseId, 'protocolCount', 'java.lang.Integer', protocolCount);
  await updateProcessCaseVariable(caseId, 'protocolNumber', 'java.lang.Integer', 1);
  await finishHumanTask(caseId);
}

export const updateProcessCaseVariable = async (caseId, variableName, javaTypeName, newValue) => {
  await doTheRequest('PUT', `${url}/API/bpm/caseVariable/${caseId}/${variableName}`, JSON.stringify({
    "type": javaTypeName,
    "value": newValue
  }));

}

export const getAllProcess = async () => {
  const res = await doTheRequest('GET', `${url}/API/bpm/process?p=0&c=1000`);

  return res.data;
}

export const getActiveCases = async () => {
  const res = await doTheRequest('GET', `${url}/API/bpm/case?p=0&c=1000`);

  return res.data;
}

export const getArchivedCases = async () => {
  const res = await doTheRequest('GET', `${url}/API/bpm/archivedCase?p=0&c=1000`);

  return res.data;
}

export const getCountCases = async () => {
  const res = await doTheRequest('GET', `${url}/API/bpm/case?p=0&c=1000`);

  return (res.data.length);
}

export const getTasks = async () => {

  return doTheRequest('GET', `${url}/API/bpm/humanTask?p=0&c=1000`);

}

export const getTasksForProjects = async (projects, rolId) => {
  const cases = projects.map(project => project.caseId);
  const tasks = await getTasks();
  return tasks.filter(task => cases.includes(+task.caseId) && task.actorId == rolId );
}

export const getTasksForProtocols = async (protocols, rolId) => {
  const cases = protocols.map(protocol => protocol.project.caseId);
  const tasks = await getTasks();
  return tasks.filter(task => cases.includes(+task.caseId) && task.actorId == rolId );
}

export const getArchivedTasks = async () => {
  const res = await doTheRequest('GET', `${url}/API/bpm/archivedTask?p=0&c=1000`);

  return (res.data);
}


export const doTheRequest = async (method, url, body = null) => {
  const bonitaToken = getCookie('X-Bonita-API-Token');
  if (method === 'PUT') {
    return fetch(url, {
      method,
      headers: {
        //'Cookie': `JSESSIONID=${bonitaJSESSIONID}; X-Bonita-API-Token=${bonitaToken}`,
        'X-Bonita-API-Token': bonitaToken,
        'Content-type': 'application/json; charset=UTF-8',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      credentials: 'include'
    });
  } else {
    return fetch(url, {
      method,
      headers: {
        // 'Cookie': `JSESSIONID=${bonitaJSESSIONID}; X-Bonita-API-Token=${bonitaToken}`,
        'X-Bonita-API-Token': bonitaToken,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      credentials: 'include'
    }).then(res => res.json());
  }
}



