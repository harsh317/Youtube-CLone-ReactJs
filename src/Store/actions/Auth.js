import { db, auth } from "../../Config/FirebaseConfig";
import { getDoc, doc, setDoc } from "firebase/firestore";

import User from "../../model/UserDetails";

export const SET_UserDetails = "SET_UserDetails";
export const SET_Suscibers = "SET_Suscibers";

export const fetchUserDetails = () => {
  return async (dispatch) => {
    const userId = auth.currentUser.uid;
    const UserDocRef = doc(db, "Users", userId);
    const Usersnap = await getDoc(UserDocRef);
    if (Usersnap.exists()) {
      const Usertobeloaded = new User(
        userId,
        Usersnap.data().name,
        Usersnap.data().profileImage,
        Usersnap.data().initials,
        Usersnap.data().Suscribers
      );
      dispatch({
        type: SET_UserDetails,
        Userdata: Usertobeloaded,
      });
    } else {
      console.log("No such User!");
    }
  };
};
