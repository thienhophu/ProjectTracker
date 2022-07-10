export const PERMISSION_PROJECT_CREATE = 'project.create';
export const PERMISSION_PROJECT_DELETE = 'project.delete';
export const PERMISSION_PROJECT_UPDATE_PROGRESS = 'project.update-progress';
export const PERMISSION_HOUSE_CREATE = 'house.create';
export const PERMISSION_HOUSE_DELETE = 'house.delete';
export const PERMISSION_HOUSE_ASSIGNED_USERS = 'house.assgined';
export const PERMISSION_STEP_CREATE = 'step.create';
export const PERMISSION_STEP_DELETE = 'step.delete';
export const PERMISSION_STEP_REORDER = 'step.reorder';
export const PERMISSION_GALLERY_UPLOAD = 'gallery.upload';
export const PERMISSION_GALLERY_UPDATE_STATUS = 'gallery.update-status';
export const PERMISSION_GALLERY_DELETE = 'gallery.delete';

export interface Role {
  id: string;
  name: string;
  permissions: Array<string>;
}

export const roles: Array<Role> = [
  {
    id: 'admin',
    name: 'Admin',
    permissions: [],
  },
  {
    id: 'manager',
    name: 'Manager',
    permissions: [
      PERMISSION_PROJECT_CREATE,
      PERMISSION_PROJECT_DELETE,
      PERMISSION_PROJECT_UPDATE_PROGRESS,
      PERMISSION_STEP_CREATE,
      PERMISSION_STEP_DELETE,
      PERMISSION_STEP_REORDER,
      PERMISSION_GALLERY_UPLOAD,
      PERMISSION_GALLERY_DELETE,
      PERMISSION_GALLERY_UPDATE_STATUS,
      PERMISSION_HOUSE_CREATE,
      PERMISSION_HOUSE_DELETE,
      PERMISSION_HOUSE_ASSIGNED_USERS,
    ],
  },
  {
    id: 'user',
    name: 'User',
    permissions: [],
  },
];
