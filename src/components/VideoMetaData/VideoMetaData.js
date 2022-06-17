import React, { useState } from "react";
import { MdThumbUp, MdThumbDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import numeral from "numeral";
import moment from "moment";

import "./_VideoMetaData.scss";
import * as VideoActions from "../../Store/actions/Videos";
import Suscribe from "../Suscribe/Suscribe";
import { auth } from "../../Config/FirebaseConfig";
import HelmetCustom from "../HelmetCustom";

function VideoMetaData({
  title,
  description,
  OwnerId,
  views,
  timestamp,
  VideoId,
}) {
  const [showMore, setShowMore] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const dispatch = useDispatch();
  const Likes = useSelector((state) => state.Vidoes.video.likes);
  const disLikes = useSelector((state) => state.Vidoes.video.dislikes);
  const IsLiked = Likes.includes(auth.currentUser.uid);
  const Isdisliked = disLikes.includes(auth.currentUser.uid);

  const handleLike = async () => {
    setloading(null);
    seterror(false);
    try {
      if (!IsLiked && !Isdisliked) {
        await dispatch(VideoActions.Create_Like(VideoId));
      } else if (IsLiked) {
        await dispatch(VideoActions.Remove_Like(VideoId));
      } else if (Isdisliked && !IsLiked) {
        await dispatch(VideoActions.Create_Like(VideoId));
        await dispatch(VideoActions.Remove_DisLike(VideoId));
      }
      setloading(false);
    } catch (err) {
      seterror(err.message);
    }
  };

  const handleDisLike = async () => {
    setloading(null);
    seterror(false);
    try {
      if (!Isdisliked && !IsLiked) {
        await dispatch(VideoActions.Create_DisLike(VideoId));
      } else if (Isdisliked) {
        await dispatch(VideoActions.Remove_DisLike(VideoId));
      } else if (IsLiked && !Isdisliked) {
        await dispatch(VideoActions.Create_DisLike(VideoId));
        await dispatch(VideoActions.Remove_Like(VideoId));
      }
      setloading(false);
    } catch (err) {
      seterror(err.message);
    }
  };

  return (
    <div className="videoMetadata py-2">
      <HelmetCustom title={title} description={description} />
      <div className="videoMetadata__top">
        <h5>{title}</h5>
        <div className="d-flex justify-content-between align-items-center py-1">
          <span>
            {numeral(views.length).format("0.a")} Views •{" "}
            {moment(timestamp).fromNow()}
          </span>
          <div>
            <span className="mr-3 LikeDislike">
              <MdThumbUp
                className={IsLiked && "Liked"}
                onClick={handleLike}
                size={26}
              />
              {numeral(Likes.length).format("0.a")}
            </span>
            <span className="mr-3 LikeDislike">
              <MdThumbDown
                className={Isdisliked && "disliked"}
                onClick={handleDisLike}
                size={26}
              />{" "}
              {numeral(disLikes.length).format("0.a")}
            </span>
          </div>
        </div>
      </div>
      <Suscribe OwnerId={OwnerId} />
      <div className="videoMetadata__description">
        <h6>
          {showMore ? description : `${description.substring(0, 150)}`}
          <br />
          <button
            className="btn Showmoreless"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show less" : "Show more ..."}
          </button>
        </h6>
      </div>
    </div>
  );
}

export default VideoMetaData;
