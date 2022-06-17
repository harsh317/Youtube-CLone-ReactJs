import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";
import { AiFillEye } from "react-icons/ai";

import "./_video.scss";
import { auth } from "../../Config/FirebaseConfig";

function Video({
  channelScreen,
  title,
  thumbnail,
  timestamp,
  duration,
  Usersname,
  Userspfp,
  id,
  channelId,
  views,
  ownerId,
  scrollPosition,
}) {
  const [isHovered, setHover] = useState(false);
  const navigate = useNavigate();
  if (channelId) {
    ownerId = channelId;
  }
  return (
    <div
      className="video"
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="video_top"
        onClick={() => {
          navigate(`/watch/${id}`);
        }}
      >
        <LazyLoadImage
          src={thumbnail}
          alt="Thumbnail"
          effect="blur"
          scrollPosition={scrollPosition}
        />

        <span className="video_top_duration">{duration}</span>
      </div>
      <div className="video_title">{title}</div>
      <div className="video_details">
        <span>
          <AiFillEye /> {views.length} Views •
        </span>
        <span>
          {timestamp
            ? moment(new Date(timestamp.toDate()).toUTCString()).fromNow()
            : moment(new Date()).fromNow()}
        </span>
      </div>
      <div
        className="video_channel"
        onClick={() => {
          if (!channelScreen) {
            navigate(`/channel/${ownerId}`);
          }
        }}
      >
        <LazyLoadImage
          src={Userspfp}
          effect="blur"
          scrollPosition={scrollPosition}
          alt="userPfp"
        />
        <p>{Usersname}</p>
      </div>
      {ownerId === auth.currentUser.uid && isHovered && (
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => {
            navigate(`/EditVideo/${id}`);
          }}
        >
          Edit
        </button>
      )}
    </div>
  );
}

export default trackWindowScroll(Video);
