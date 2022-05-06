import {
  PERMISSION_GALLERY_DELETE,
  PERMISSION_GALLERY_UPLOAD,
  PERMISSION_PROJECT_CREATE,
  PERMISSION_PROJECT_DELETE,
  PERMISSION_STEP_CREATE,
  PERMISSION_STEP_DELETE,
} from '../data/permissions';

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
      PERMISSION_GALLERY_UPLOAD,
      PERMISSION_GALLERY_DELETE,
    ],
  },
  {
    id: 'user',
    name: 'User',
    permissions: [PERMISSION_PROJECT_CREATE, PERMISSION_STEP_CREATE, PERMISSION_GALLERY_UPLOAD],
  },
];
