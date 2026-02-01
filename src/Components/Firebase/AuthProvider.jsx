import React, { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, GoogleAuthProvider,onAuthStateChanged, GithubAuthProvider } from "firebase/auth";
import { auth, db } from "./Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";

export const AuthContext = createContext(null);
const provider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // register with email/password
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // login with email/password
  const userLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // google login/register
  const registerWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          name: currentUser.displayName || "No Name",
          email: currentUser.email,
          role: "user",
          disabled: false,
        });
        setUser({
          ...currentUser,
          name: currentUser.displayName,
          role: "user",
          disabled: false,
        });
      } else {
        const userData = snap.data();
        setUser({
          ...currentUser,
          name: userData.name,
          role: userData.role,
          disabled: userData.disabled || false,
        });
      }

      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // logout
  const logOut = () => signOut(auth);

  // Update profile
  const UpdateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData).then(() => {
      setUser({ ...auth.currentUser });
    });
  };

  
  // gitHub login
  const registerWithGithub = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  // listen for auth changes
  useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const response = await axios.get(`http://localhost:5000/users/${currentUser.email}`);
                    if (response.data) {
                        setUser({
                            ...currentUser,
                            role: response.data.role || "user",
                        });
                    } else {setUser(currentUser);}
                } catch (error) {
                    console.error("Error", error);
                    setUser(currentUser);
                }
            } else {setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribeAuth();
    }, []);

  const authInfo = {
    createUser,
    userLogin,
    logOut,
    registerWithGoogle,
    UpdateUser,
    registerWithGithub,
    user,
    loading,
    setLoading,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
