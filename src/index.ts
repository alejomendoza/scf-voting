export { DurableProjects } from './durable/projects';
import { response } from 'cfw-easy-utils';

export default {
  async fetch(request: Request, env: Env) {
    try {
      return await handleRequest(request, env);
    } catch (e) {
      return new Response(e.message);
    }
  },
};

async function handleRequest(request: Request, env: Env) {
  const { method, url } = request;

  if (method === 'OPTIONS') return response.cors();

  let id = env.PROJECTS.idFromName('A');
  let obj = env.PROJECTS.get(id);
  let resp = await obj.fetch(url);

  return resp;
}

interface Env {
  PROJECTS: DurableObjectNamespace;
}
