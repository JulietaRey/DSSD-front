import { finishHumanTask, getProcessVariable, projectStarting, startProcess, updateProcessCaseVariable } from "./bonita";
import { setProtocolReady } from './protocol';
import { getApiKey, url } from "./url";

const createProject = async (data, caseId) => {
  const res = await fetch(`${url}/project`, {
    method: 'POST',
    body: JSON.stringify({ ...data, caseId }),
    // credentials: 'omit',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${getApiKey()}`,
    }

  });
  return res.status === 201;
}
export const saveProject = async (data) => {
  try {
    const caseId = await startProcess();
    const success = await createProject(data, caseId);
    if (success) {
      await projectStarting(caseId, data.protocolList.length + 1);
      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }

}

export const getProjects = async (userId) => {
  try {
    const res = await fetch(`${url}/project?ownerId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${getApiKey()}`,
      }
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

const getProtocol = async (projectId, order) => {
  try {
    const res = await fetch(`${url}/project/${projectId}/protocol?order=${order}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${getApiKey()}`,
      }
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}

export const lanzamientoDeProtocolo = async (project, task) => {
  const protocolNumber = await getProcessVariable(project.caseId, 'protocolNumber');
  const protocol = await getProtocol(project.id, protocolNumber.value);
  await updateProcessCaseVariable(project.caseId, 'isLocal', 'java.lang.Boolean', protocol.local.toString());
  await finishHumanTask(project.caseId);
  await setProtocolReady(protocol.id);
  await updateProcessCaseVariable(project.caseId, 'cancelProject', 'java.lang.Boolean', false);
  await updateProcessCaseVariable(project.caseId, 'resetProtocol', 'java.lang.Boolean', false);
}

export const makeDecision = async (caseId, params) => {
  if (params.cancelProject) {
    await updateProcessCaseVariable(caseId, 'cancelProject', 'java.lang.Boolean', true);
    await fetch(`${url}/project/${caseId}/cancel`, {
      method: 'PUT', headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${getApiKey()}`,
      }
    })
  }
  if (params.resetProtocol) {
    await updateProcessCaseVariable(caseId, 'resetProtocol', 'java.lang.Boolean', true);
    const protocolNumber = await getProcessVariable(caseId, 'protocolNumber');
    await updateProcessCaseVariable(caseId, 'protocolNumber', 'java.lang.Integer', `${+protocolNumber.value - 1}`);
  }

  await finishHumanTask(caseId);
}
export const projectSeen = async projectId => {
  return fetch(`${url}/project/${projectId}/seen`, {
    method: 'PUT', headers: {
      'Content-type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${getApiKey()}`,
    }
  });
}