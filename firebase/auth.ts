import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    return user;
  } catch (error: unknown) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    throw error;
  }
};

const getToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("User is not authenticated");
    return null;
  }

  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error getting Firebase token:", error);
    return null;
  }
};

export default getToken;
