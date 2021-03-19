import { getManager, getRepository } from 'typeorm';
import Project from '../../models/Project';
import { NextFunction, Request, Response } from 'express';
import User from '../../models/User';

/**
 *
 * @param req
 * @param res
 * @param next
 */
export const checkProjectsWithPublicPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const projectRepository = getRepository(Project);

  await projectRepository.find({
    where: {
      publicStatus: true,
    },
  });

  next();
};

/**
 * Find project with team permissions or public
 * @param req
 * @param res
 * @param next
 */
export const checkProjectWithPermissionOfTeamOrPublic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { projectId } = req.params;

  const project = await getManager()
    .createQueryBuilder(Project, 'project')
    .where('project.id = :projectId', { projectId: +projectId })
    .leftJoin('project.members', 'members')
    .andWhere('(members.id = :id OR project.publicStatus = true)', { id: (req.user as User).id })
    .getOne();

  if (project) {
    next();
  } else {
    return res.status(403).json({
      error: 'No permission',
    });
  }
};

/**
 * Find project with only team member
 * @param req
 * @param res
 * @param next
 */
export const checkProjectWithPermissionOfTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const { projectId } = req.params;

  const project = await getManager()
    .createQueryBuilder(Project, 'project')
    .where('project.id = :projectId', { projectId })
    .leftJoin('project.members', 'members')
    .andWhere('members.id = :id', { id: (req.user as User).id })
    .getOne();

  if (project) {
    next();
  } else {
    return res.status(403).json({
      error: 'No permission',
    });
  }
};
