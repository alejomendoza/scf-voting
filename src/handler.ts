import { Method } from 'tiny-request-router';
import { response } from 'cfw-easy-utils';
import { parseError } from './utils/parse';
import { router } from './api';

export async function handleRequest(
  request: Request,
  env?: any,
  ctx?: any
): Promise<Response> {
  try {
    const cache = caches.default;
    const { method, url } = request;
    const { href, pathname } = new URL(url);

    if (method === 'OPTIONS') return response.cors();

    const routerMatch = router.match(method as Method, pathname);

    if (routerMatch) {
      const routerResponse = await routerMatch.handler({
        ...routerMatch,
        cache,
        request,
        env,
        ctx,
      });

      if (
        method === 'GET' &&
        routerResponse.status >= 200 &&
        routerResponse.status <= 299
      )
        return routerResponse;
    }

    throw { status: 404 };
  } catch (err) {
    return parseError(err);
  }
}
