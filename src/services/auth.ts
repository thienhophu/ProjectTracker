import { useAuth as auth } from "reactfire";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { LOGIN, LOGOUT, REGISTER, SET_INITIALIZED } from "../features/auth/authSlice";

export const setAuthListener = () => (dispatch: any, state: any) => {
  onAuthStateChanged(auth(), (user) => {
    if (user && !state().auth.initialized) {
      dispatch(LOGIN({ user: auth()?.currentUser?.toJSON() }))
    }

    !state().auth.initialized && dispatch(SET_INITIALIZED(true));
  });
}

export const login = ({ username, password }: any) => async (dispatch: any, state: any) => {
  await signInWithEmailAndPassword(auth(), username, password)
  .then((userCredential) => {
    // Signed in 
    dispatch(LOGIN({ user: userCredential.user.toJSON() }));
  })
  .catch((error) => {
    console.error("🚀 ~ file: auth.ts ~ login ~ error", error);
  });

  return state().auth.userData;
}

export const logout = () => async (dispatch: any) => {
  await signOut(auth()).then(() => {
    // Sign-out successful.
    dispatch(LOGOUT())
  }).catch((error) => {
    // An error happened.
    console.error("🚀 ~ file: auth.ts ~ logout ~ error", error);
  });
}

export const register = (username: string, password: string) => async (dispatch: any) =>  {
  await createUserWithEmailAndPassword(auth(), username, password)
    .then((userCredential) => {
      dispatch(REGISTER({ user: userCredential.user.toJSON() }));
    })
    .catch((error) => {
      // An error happened.
      console.error("🚀 ~ file: auth.ts ~ register ~ error", error);
    });
}

