import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export async function register(username: string, password: string) {
  createUserWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

export function login(username: string, password: string) {
  signInWithEmailAndPassword(auth, username, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("🚀 ~ file: auth.ts ~ line 23 ~ user", user);
    // ...
  })
  .catch((error) => {
    console.log("🚀 ~ file: auth.ts ~ line 27 ~ error", error);
    const errorCode = error.code;
    const errorMessage = error.message;
  });

}