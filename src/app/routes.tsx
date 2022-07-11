export const HOME = '/';
export const LOGIN = '/login';
export const REGISTER = '/register';
export const PROJECTS_PAGE = '/projects';
export const HOUSES_PAGE = `${PROJECTS_PAGE}/:projectId/houses`;
export const STEPS_PAGE = '/houses/:houseId/steps';
export const GALLERY_PAGE = `${STEPS_PAGE}/:stepId/gallery`;
export const COMMENTS_PAGE = `${GALLERY_PAGE}/:imageId/comments`;

export function route(name: string, params = {}) {
  return Object.entries(params).reduce(
    (carry, [key, value]) => carry.replace(`:${key}`, String(value)),
    name,
  );
}
