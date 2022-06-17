import { db, auth } from "../../Config/FirebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  arrayUnion,
  arrayRemove,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

import Video from "../../model/Video";
import User from "../../model/UserDetails";

export const CREATE_Video = "CREATE_Video";
export const CREATE_Comment = "CREATE_Comment";
export const CREATE_Like = "CREATE_Like";
export const REMOVE_Like = "REMOVE_Like";
export const CREATE_Dislike = "CREATE_Dislike";
export const REMOVE_DisLike = "REMOVE_DisLike";
export const SET_Vidoes = "SET_Video";
export const SET_Channel_Vidoes = "SET_Channel_Vidoes";
export const SET_RelatedVidoes = "SET_RelatedVidoes";
export const SET_SearchVidoes = "SET_SearchVidoes";
export const SET_Suscribers = "SET_Suscribers";
export const SET_VideoDetails = "SET_VideoDetails";
export const SET_OwnerVidDetails = "SET_OwnerVidDetails";

const capitalizeFirstWords = (string) => {
  return string.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};

export const Create_Video = (
  title,
  descriptions,
  publicity,
  Categories,
  duration,
  thumbnail,
  filePath,
  Usersname,
  Userpfp
) => {
  return async (dispatch) => {
    try {
      const VideoRef = addDoc(collection(db, "Videos"), {
        ownerId: auth.currentUser.uid,
        title: capitalizeFirstWords(title),
        descriptions: descriptions,
        duration: duration,
        thumbnail: thumbnail,
        filePath: filePath,
        publicity: publicity.value,
        Categories: Categories,
        Usersname: Usersname,
        Userpfp: Userpfp,
        views: [],
        timestamp: serverTimestamp(),
        comments: [],
        likes: [],
        dislikes: [],
      });
      dispatch({
        type: Create_Video,
        VideoData: {
          id: VideoRef.id,
          ownerId: auth.currentUser.uid,
          title: title,
          descriptions: descriptions,
          duration: duration,
          thumbnail: thumbnail[0],
          filePath: filePath,
          publicity: publicity.value,
          Categories: Categories,
          Usersname: Usersname,
          Userpfp: Userpfp,
          views: [],
          timestamp: new Date(),
          comments: [],
          likes: [],
          dislikes: [],
        },
      });
    } catch {
      throw new Error("Something went wrong!");
    }
  };
};

export const Update_Video = (
  name,
  description,
  publicity,
  thumbnail,
  VideoId
) => {
  return async (dispatch) => {
    try {
      console.log(thumbnail);
      const VidRef = doc(db, "Videos", VideoId);
      await updateDoc(VidRef, {
        title: name,
        descriptions: description,
        publicity: publicity,
        thumbnail: thumbnail,
      });
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong!");
    }
  };
};

export const Create_Comment = (VideoId, Comment, userPfp, name) => {
  return async (dispatch) => {
    try {
      const userId = auth.currentUser.uid;
      const VidRef = doc(db, "Videos", VideoId);
      updateDoc(VidRef, {
        comments: arrayUnion({
          VideoId,
          userId,
          userPfp,
          name,
          Comment,
          timestamp: new Date(),
        }),
      });
      dispatch({
        type: CREATE_Comment,
        CommentData: {
          VideoId,
          userId,
          userPfp,
          name,
          Comment,
          timestamp: new Date(),
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!");
    }
  };
};

export const Create_Like = (VideoId) => {
  return async (dispatch) => {
    try {
      const userId = auth.currentUser.uid;
      const VidRef = doc(db, "Videos", VideoId);
      updateDoc(VidRef, {
        likes: arrayUnion(userId),
      });
      dispatch({
        type: CREATE_Like,
        userId: userId,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!");
    }
  };
};

export const Remove_Like = (VideoId) => {
  return async (dispatch) => {
    try {
      const userId = auth.currentUser.uid;
      const VidRef = doc(db, "Videos", VideoId);
      updateDoc(VidRef, {
        likes: arrayRemove(userId),
      });
      dispatch({
        type: REMOVE_Like,
        userId: userId,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!");
    }
  };
};

export const Remove_DisLike = (VideoId) => {
  return async (dispatch) => {
    try {
      const userId = auth.currentUser.uid;
      const VidRef = doc(db, "Videos", VideoId);
      updateDoc(VidRef, {
        dislikes: arrayRemove(userId),
      });
      dispatch({
        type: REMOVE_DisLike,
        userId: userId,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!");
    }
  };
};

export const Create_DisLike = (VideoId) => {
  return async (dispatch) => {
    try {
      const userId = auth.currentUser.uid;
      const VidRef = doc(db, "Videos", VideoId);
      updateDoc(VidRef, {
        dislikes: arrayUnion(userId),
      });
      dispatch({
        type: CREATE_Dislike,
        userId: userId,
      });
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!");
    }
  };
};

export const fetchvidoes = (category) => {
  return async (dispatch) => {
    try {
      const userId = auth.currentUser.uid;
      const VideosRef = collection(db, "Videos");
      let VideoSnapshot;
      if (!category || category === "All") {
        const q = query(VideosRef, where("publicity", "==", "Public"));
        VideoSnapshot = await getDocs(q);
      } else {
        const q = query(
          VideosRef,
          where("Categories", "array-contains", category),
          where("publicity", "==", "Public")
        );
        VideoSnapshot = await getDocs(q);
      }

      const videostobeloaded = [];
      VideoSnapshot.forEach((doc) => {
        videostobeloaded.push(
          new Video(
            doc.id,
            doc.data().ownerId,
            doc.data().title,
            doc.data().thumbnail,
            doc.data().descriptions,
            doc.data().duration,
            doc.data().views,
            doc.data().Categories,
            doc.data().publicity,
            doc.data().filePath,
            doc.data().Usersname,
            doc.data().Userpfp,
            doc.data().timestamp,
            doc.data().comments,
            doc.data().likes,
            doc.data().dislikes
          )
        );
      });
      dispatch({
        type: SET_Vidoes,
        videos: videostobeloaded,
        userVidoes: videostobeloaded.filter((vid) => vid.OwnerId == userId),
      });
    } catch (error) {
      throw error;
    }
  };
};

export const fetchChannelVideos = (ChannelId) => {
  return async (dispatch) => {
    try {
      const VideosRef = collection(db, "Videos");
      let que;
      if (ChannelId === auth.currentUser.uid) {
        que = query(VideosRef, where("ownerId", "==", ChannelId));
      } else {
        que = query(
          VideosRef,
          where("ownerId", "==", ChannelId),
          where("publicity", "==", "Public")
        );
      }
      const querySnapshot = await getDocs(que);
      const ChannelVidstobeloaded = [];
      querySnapshot.forEach((doc) => {
        ChannelVidstobeloaded.push(
          new Video(
            doc.id,
            doc.data().ownerId,
            doc.data().title,
            doc.data().thumbnail,
            doc.data().descriptions,
            doc.data().duration,
            doc.data().views,
            doc.data().Categories,
            doc.data().publicity,
            doc.data().filePath,
            doc.data().Usersname,
            doc.data().Userpfp,
            doc.data().timestamp,
            doc.data().comments,
            doc.data().likes,
            doc.data().dislikes
          )
        );
      });

      dispatch({
        type: SET_Channel_Vidoes,
        userVidoes: ChannelVidstobeloaded,
      });
    } catch (error) {
      throw error;
    }
  };
};

export const fetchSearchvidoes = (searchquery) => {
  return async (dispatch) => {
    const CaseSearchquery = capitalizeFirstWords(searchquery);
    try {
      const VideosRef = collection(db, "Videos");
      const q = query(
        VideosRef,
        where("title", ">=", CaseSearchquery),
        where("title", "<=", CaseSearchquery + "\uf8ff"),
        where("publicity", "==", "Public")
      );
      const querySnapshot = await getDocs(q);
      const Searchvideostobeloaded = [];
      querySnapshot.forEach((doc) => {
        Searchvideostobeloaded.push(
          new Video(
            doc.id,
            doc.data().ownerId,
            doc.data().title,
            doc.data().thumbnail,
            doc.data().descriptions,
            doc.data().duration,
            doc.data().views,
            doc.data().Categories,
            doc.data().publicity,
            doc.data().filePath,
            doc.data().Usersname,
            doc.data().Userpfp,
            doc.data().timestamp,
            doc.data().comments,
            doc.data().likes,
            doc.data().dislikes
          )
        );
      });
      dispatch({
        type: SET_SearchVidoes,
        Searchvideos: Searchvideostobeloaded,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const fetchrelatedvideos = (category) => {
  return async (dispatch) => {
    try {
      const VideosRef = collection(db, "Videos");
      const q = query(
        VideosRef,
        where("Categories", "array-contains-any", category),
        where("publicity", "==", "Public")
      );
      const querySnapshot = await getDocs(q);
      const relatedvideostobeloaded = [];
      querySnapshot.forEach((doc) => {
        relatedvideostobeloaded.push(
          new Video(
            doc.id,
            doc.data().ownerId,
            doc.data().title,
            doc.data().thumbnail,
            doc.data().descriptions,
            doc.data().duration,
            doc.data().views,
            doc.data().Categories,
            doc.data().publicity,
            doc.data().filePath,
            doc.data().Usersname,
            doc.data().Userpfp,
            doc.data().timestamp,
            doc.data().comments,
            doc.data().likes,
            doc.data().dislikes
          )
        );
      });
      dispatch({
        type: SET_RelatedVidoes,
        relatedvideos: relatedvideostobeloaded,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
};

export const fetchvideo = (id) => {
  return async (dispatch) => {
    try {
      const VideoRef = doc(db, "Videos", id);
      const VideoSnap = await getDoc(VideoRef);
      const VideoDetail = new Video(
        id,
        VideoSnap.data().ownerId,
        VideoSnap.data().title,
        VideoSnap.data().thumbnail,
        VideoSnap.data().descriptions,
        VideoSnap.data().duration,
        VideoSnap.data().views,
        VideoSnap.data().Categories,
        VideoSnap.data().publicity,
        VideoSnap.data().filePath,
        VideoSnap.data().Usersname,
        VideoSnap.data().Userpfp,
        VideoSnap.data().timestamp,
        VideoSnap.data().comments,
        VideoSnap.data().likes,
        VideoSnap.data().dislikes
      );

      dispatch({
        type: SET_VideoDetails,
        video: VideoDetail,
        id: id,
      });
    } catch (error) {
      throw error;
    }
  };
};

export const fetchUserDetails = (OwnerId) => {
  return async (dispatch) => {
    try {
      const UserDocRef = doc(db, "Users", OwnerId);
      const Usersnap = await getDoc(UserDocRef);

      const Usertobeloaded = new User(
        OwnerId,
        Usersnap.data().name,
        Usersnap.data().profileImage,
        Usersnap.data().initials,
        Usersnap.data().Suscribers
      );

      dispatch({
        type: SET_OwnerVidDetails,
        Userdata: Usertobeloaded,
      });
    } catch (error) {
      throw error;
    }
  };
};

export const loadSubscriptions = () => {
  return async (dispatch) => {
    try {
      const userId = auth.currentUser.uid;
      const UsersRef = collection(db, "Users");
      const q = query(UsersRef, where("Suscribers", "array-contains", userId));
      const querySnapshot = await getDocs(q);
      const Suscriberstobeloaded = [];
      querySnapshot.forEach((doc) => {
        Suscriberstobeloaded.push(
          new User(
            doc.id,
            doc.data().name,
            doc.data().profileImage,
            doc.data().initials,
            doc.data().Suscribers
          )
        );
      });
      dispatch({
        type: SET_Suscribers,
        Suscribers: Suscriberstobeloaded,
      });
    } catch (error) {
      throw error;
    }
  };
};

export const Subscribe = (OwnerId) => {
  return new Promise((resolve, reject) => {
    try {
      const userId = auth.currentUser.uid;
      const VidOwnerRef = doc(db, "Users", OwnerId);
      updateDoc(VidOwnerRef, {
        Suscribers: arrayUnion(userId),
      });
      resolve("Suscribed !!!");
    } catch (error) {
      reject(Error("Failed :< didn't work!"));
    }
  });
};

export const UnSubscribe = (OwnerId) => {
  return new Promise((resolve, reject) => {
    try {
      const userId = auth.currentUser.uid;
      const VidOwnerRef = doc(db, "Users", OwnerId);
      updateDoc(VidOwnerRef, {
        Suscribers: arrayRemove(userId),
      });
      console.log("Unsubscribed");
      resolve("UnSuscribed !!!");
    } catch (error) {
      reject(Error("Failed :< didn't work!"));
    }
  });
};

export const SetView = (VideoId, Ip) => {
  return new Promise((resolve, reject) => {
    try {
      const VidRef = doc(db, "Videos", VideoId);
      updateDoc(VidRef, {
        views: arrayUnion(Ip.ip),
      });
      resolve("Suscribed !!!");
    } catch (error) {
      reject(Error("Failed :< didn't work!"));
    }
  });
};
