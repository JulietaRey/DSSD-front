import { updateProcessCaseVariable, finishHumanTask } from "./bonita";
import { getApiKey, url } from "./url";

export const getProtocolList = async (ownerId) => {
  try {
    const res = await fetch(`${url}/protocol/list?ownerId=${ownerId}`, {
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

export const setProtocolReady = async (protocolId) => {
  try {
    const res = await fetch(`${url}/protocol/${protocolId}/ready`, {
      method: 'PUT',
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

export const saveProtocolResult = async (protocol, score, ownerId) => {
  try {
    await fetch(`${url}/protocol/${protocol.id}/finished`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${getApiKey()}`,
      },
      body: JSON.stringify({
        score,
        exec: protocol.ejecuciones,
        ownerId
      })
    });
    await updateProcessCaseVariable(protocol.project.caseId, 'protocolNumber', 'java.lang.Integer', protocol.orden + 1);
    await updateProcessCaseVariable(protocol.project.caseId, 'protocolResult', 'java.lang.Integer', score);
    await finishHumanTask(protocol.project.caseId);
  } catch (e) {
    console.error(e);
  }
}