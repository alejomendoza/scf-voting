import { response } from 'cfw-easy-utils';
import { Project } from '../types/project';

export default async () => {
  let { keys } = await VOTES.list({ prefix: 'project:' });

  let results = keys.map(({ metadata }) => metadata as Project);

  const orderedResults = Array.from(results).sort((a, b) => {
    return b.score - a.score;
  });

  return response.json(
    {
      results: orderedResults,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=2419200', // 28 days
      },
    }
  );
};
