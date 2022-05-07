export const PERMISSION_PROJECT_CREATE = 'project.create';
export const PERMISSION_PROJECT_DELETE = 'project.delete';
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
      PERMISSION_STEP_CREATE,
      PERMISSION_STEP_DELETE,
      PERMISSION_STEP_REORDER,
      PERMISSION_GALLERY_UPLOAD,
      PERMISSION_GALLERY_DELETE,
      PERMISSION_GALLERY_UPDATE_STATUS,
    ],
  },
  {
    id: 'user',
    name: 'User',
    permissions: [],
  },
];
