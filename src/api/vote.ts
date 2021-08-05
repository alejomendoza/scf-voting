import { response } from 'cfw-easy-utils';
import { Project } from '../types/project';

export default async ({ request }: { request: Request }) => {
  const body = await request.formData();

  const topProjectsIds = body.get('top_projects');

  if (!topProjectsIds) {
    throw 'Must send top_projects in the boddy of the request';
  }

  let projectsIds: { id: string }[] = JSON.parse(topProjectsIds as string);
  let projectsPromises = projectsIds.map(
    async ({ id }): Promise<Project> => {
      return (await VOTES.get(`project:${id}`, {
        type: 'json',
      })) as Project;
    }
  );

  let projects = await Promise.all(projectsPromises);

  let ballot = projects.reverse().map(async (project, index) => {
    let score = index + 1;
    let updatedProject: Project = {
      score: project.score + score,
      approval_count: project.approval_count,
      disapproval_count: project.disapproval_count,
      id: project.id,
    };

    return await VOTES.put(
      `project:${project.id}`,
      JSON.stringify(updatedProject),
      {
        metadata: updatedProject,
      }
    );
  });

  await Promise.all(ballot);

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
