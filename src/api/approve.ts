import { response } from 'cfw-easy-utils';
import { Project } from '../types/project';

export default async ({ request }: { request: Request }) => {
  const body = await request.formData();

  const projectId = body.get('id');
  const approve = body.get('approve');

  if (!projectId) {
    throw 'Must send id in the boddy of the request';
  }

  if (!approve) {
    throw 'Must send approve in the boddy of the request';
  }

  let project: Project;
  let value: Project | null = await VOTES.get(`project:${projectId}`, {
    type: 'json',
  });

  if (!value) {
    project = {
      score: 0,
      approval_count: approve ? 1 : 0,
      disapproval_count: approve ? 0 : 1,
      id: projectId as string,
    };
  } else {
    project = {
      score: value.score,
      approval_count: approve ? value.approval_count + 1 : 0,
      disapproval_count: approve ? 0 : value.disapproval_count,
      id: value.id,
    };
  }

  await VOTES.put(`project:${projectId}`, JSON.stringify(project), {
    metadata: project,
  });

  return response.json(
    {
      success: true,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=2419200',
      },
    }
  );
};
