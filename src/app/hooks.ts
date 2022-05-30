import { Camera } from '@capacitor/camera';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { roles } from '../data/roles';
import { getCurrentUserData } from '../features/auth/authSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Taking Photo Hook
export const usePhotoGallery = () => {
  const getPhotos = async () => {
    const { photos } = await Camera.pickImages({
      quality: 100, // 0 - 100
      limit: 5, // 0: unlimited
    });

    return photos;
  };

  return {
    getPhotos,
  };
};

export const usePermissions = ({ permission, user }: any) => {
  const accessPermissions = (user && roles.find((r) => r.id === user.role)?.permissions) || [];

  if (accessPermissions.length > 0) {
    return accessPermissions.includes(permission);
  }

  return false;
};

export const useCurrentUserPermission = ({ permission }: any) => {
  const user = useAppSelector(getCurrentUserData);

  return usePermissions({ permission, user });
};
