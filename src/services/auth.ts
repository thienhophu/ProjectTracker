import { auth, firestore } from '../app/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  SET_INITIALIZED,
  SET_USER_DATA,
} from '../features/auth/authSlice';

export const setAuthListener = () => (dispatch: any, state: any) => {
  onAuthStateChanged(auth, (user) => {
    if (user && !state().auth.initialized) {
      dispatch(LOGIN({ user: auth?.currentUser?.toJSON() }));
      dispatch(getCurrentUserData());
    }

    !state().auth.initialized && dispatch(SET_INITIALIZED(true));
  });
};

export const login = (username: string, password: string) => async (dispatch: any, state: any) => {
  await signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Signed in
      dispatch(LOGIN({ user: userCredential.user.toJSON() }));
      dispatch(getCurrentUserData());
    })
    .catch((error) => {
      console.error('🚀 ~ file: auth.ts ~ login ~ error', error);
    });

  return state().auth.userData;
};

export const logout = () => async (dispatch: any) => {
  try {
    await signOut(auth);
    dispatch(LOGOUT());
  } catch (error) {
    console.error('🚀 ~ file: auth.ts ~ logout ~ error', error);
  }
};

export const register =
  (username: string, password: string, role: string) => async (dispatch: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);

      if (userCredential) {
        const uid = userCredential.user.uid;
        const userRef = doc(firestore, 'users', uid);
        await setDoc(userRef, {
          id: uid,
          role: role,
        });
        dispatch(REGISTER({ user: userCredential.user.toJSON() }));
      }
    } catch (error) {
      throw error;
    }
  };

export const getCurrentUserData = () => async (dispatch: any, state: any) => {
  let userData = null;
  const currentUserUid = auth.currentUser?.uid;
  const userRef = doc(firestore, 'users', `${currentUserUid}`);

  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    userData = {
      id: userSnap.id,
      ...userSnap.data(),
    };
  }

  dispatch(SET_USER_DATA({ userData }));

  return state().auth.userData;
};
