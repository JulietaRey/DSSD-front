import { projectStarting, startProcess } from "./bonita";
import { getApiKey, url } from "./url";

const createProject = async (data, caseId) => { 
  const res = await fetch(`${url}/project`, {
    method: 'POST',
    body: JSON.stringify({...data, caseId}),
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
      await projectStarting(caseId, data.protocolList.length);
      return true;
    } 
    return false;
  } catch(e) {
    console.error(e);
    return false;
  }
  
}