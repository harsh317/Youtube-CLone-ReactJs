import React, { useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { db, auth } from "../Config/FirebaseConfig";

const AuthContext = React.createContext();

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return { ...auth, isAuthenticated: auth.CurrentUser != null };
};

export function AuthProvider({ children }) {
  const [CurrentUser, setCurrentUser] = useState();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      setCurrentUser(user);
      setloading(false);
    });

    return unsuscribe;
  }, []);

  const SignupUser = (email, password, name) => {
    return createUserWithEmailAndPassword(auth, email, password).then(
      (resp) => {
        if (resp.user) {
          CreateFireStoreUser(
            resp.user,
            name,
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          );
        }
      }
    );
  };

  const CreateFireStoreUser = (user, name, profileImage) => {
    const UsersRef = doc(db, "Users", user.uid);
    setDoc(UsersRef, {
      name: name,
      profileImage: profileImage,
      initials: name[0] + name[name.length - 1],
      Suscribers: [],
    }).then(() => {
      console.log("added User");
    });
  };

  const LogInUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const SendEmailVerification = () => {
    const actionCodeSettings = {
      url: "http://localhost:3000",
      handleCodeInApp: true,
    };
    return sendSignInLinkToEmail(auth, CurrentUser.email, actionCodeSettings);
  };

  const VerifyEmailLink = () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      return signInWithEmailLink(auth, CurrentUser.email);
    }
  };

  const SignInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const forgotPassword = (email) => {
    // This function is not used in any files till YET
    return sendPasswordResetEmail(auth, email, {
      url: "http://localhost:3000/login",
    });
  };

  const ResetPassword = (oobcode, newPasword) => {
    return confirmPasswordReset(auth, oobcode, newPasword);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    CurrentUser,
    SignupUser,
    LogInUser,
    logout,
    SignInWithGoogle,
    forgotPassword,
    ResetPassword,
    CreateFireStoreUser,
    SendEmailVerification,
    VerifyEmailLink,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
