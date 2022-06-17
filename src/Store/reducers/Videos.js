import Video from "../../model/Video";
import Comment from "../../model/Comment";
import {
  CREATE_Video,
  SET_Vidoes,
  SET_VideoDetails,
  SET_Channel_Vidoes,
  SET_OwnerVidDetails,
  SET_RelatedVidoes,
  SET_Suscribers,
  SET_SearchVidoes,
  CREATE_Comment,
  CREATE_Like,
  CREATE_Dislike,
  REMOVE_Like,
  REMOVE_DisLike,
} from "../actions/Videos";

const initialState = {
  availableVideos: [],
  UserVidoes: [],
  relatedVids: [],
  SearchVids: [],
  Suscribers: [],
  video: null,
  VideoOwnerDetails: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_Video:
      const NewVideo = new Video(
        action.VideoData.id,
        action.VideoData.ownerId,
        action.VideoData.title,
        action.VideoData.thumbnail,
        action.VideoData.descriptions,
        action.VideoData.duration,
        action.VideoData.views,
        action.VideoData.Categories,
        action.VideoData.publicity,
        action.VideoData.filePath,
        action.VideoData.Usersname,
        action.VideoData.Userpfp,
        action.VideoData.timestamp,
        action.VideoData.comments,
        [],
        []
      );
      return {
        ...state,
        availableVideos: state.availableVideos.concat(NewVideo),
        UserVidoes: state.UserVidoes.concat(NewVideo),
      };
    case SET_Vidoes:
      return {
        ...state,
        availableVideos: action.videos,
        UserVidoes: action.userVidoes,
      };
    case SET_Channel_Vidoes:
      return {
        ...state,
        UserVidoes: action.userVidoes,
      };
    case SET_VideoDetails:
      return {
        ...state,
        video: action.video,
      };
    case SET_OwnerVidDetails:
      return {
        ...state,
        VideoOwnerDetails: action.Userdata,
      };
    case SET_RelatedVidoes:
      return {
        ...state,
        relatedVids: action.relatedvideos,
      };
    case SET_SearchVidoes:
      return {
        ...state,
        SearchVids: action.Searchvideos,
      };

    case SET_Suscribers:
      return {
        ...state,
        Suscribers: action.Suscribers,
      };

    case CREATE_Comment:
      const newComment = new Comment(
        action.CommentData.VideoId,
        action.CommentData.userId,
        action.CommentData.name,
        action.CommentData.userPfp,
        action.CommentData.Comment,
        action.CommentData.timestamp
      );

      const updatedVideo = {
        ...state.video,
        comments: state.video.comments.concat(newComment),
      };
      return {
        ...state,
        video: updatedVideo,
      };
    case CREATE_Like:
      const updatedLikes = {
        ...state.video,
        likes: state.video.likes.concat(action.userId),
      };
      return {
        ...state,
        video: updatedLikes,
      };
    case REMOVE_Like:
      const newlikesArr = [...state.video.likes];
      newlikesArr.splice(newlikesArr.indexOf(action.userId), 1);

      const updatedremovedLikes = {
        ...state.video,
        likes: newlikesArr,
      };

      return {
        ...state,
        video: updatedremovedLikes,
      };
    case REMOVE_DisLike:
      const newdislikesArr = [...state.video.dislikes];
      newdislikesArr.splice(newdislikesArr.indexOf(action.userId), 1);

      const updatedremovedDisLikes = {
        ...state.video,
        dislikes: newdislikesArr,
      };

      return {
        ...state,
        video: updatedremovedDisLikes,
      };
    case CREATE_Dislike:
      const updatedisLikes = {
        ...state.video,
        dislikes: state.video.dislikes.concat(action.userId),
      };
      return {
        ...state,
        video: updatedisLikes,
      };

    default:
      return state;
  }
};
