import { Camera } from '@capacitor/camera';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useStorage } from 'reactfire';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { roles } from '../data/roles';
import { getCurrentUserData } from '../features/auth/authSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Taking Photo Hook
export const usePhotoGallery = () => {
  const storage = useStorage();

  const getPhotos = async () => {
    const { photos } = await Camera.pickImages({
      quality: 100, // 0 - 100
      limit: 5, // 0: unlimited
    });

    const images: { name: string; photoURL: string }[] = [];

    if (photos.length > 0) {
      photos.forEach(async (photo) => {
        const fileName = new Date().getTime() + '.jpeg';
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();
        const newRef = ref(storage, `images/${fileName}`);
        const uploadTask = await uploadBytesResumable(newRef, blob);
        const photoURL = await getDownloadURL(uploadTask.ref);

        images.push({
          name: fileName,
          photoURL: photoURL,
        });
      });
    }

    return images;
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
