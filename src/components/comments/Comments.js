import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerCircular } from "spinners-react";
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";

import SingleComment from "../SingleComment/SingleComment";
import * as VideoActions from "../../Store/actions/Videos";
import * as UserAuthActions from "../../Store/actions/Auth";
import "./_comments.scss";

function Comments({ userPfp, VideoId, name, scrollPosition }) {
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [Comment, setComment] = useState("");
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.Vidoes.video.comments);
  const Userinfo = useSelector((state) => state.auth.userInfo);
  console.log(Userinfo);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setloading(null);
    seterror(false);
    try {
      await dispatch(
        VideoActions.Create_Comment(
          VideoId,
          Comment,
          Userinfo.profileImage,
          Userinfo.name
        )
      );
      setComment("");
    } catch (err) {
      seterror(err.message);
    }
    setloading(false);
  };

  useEffect(() => {
    const FetchUserdetails = async () => {
      await dispatch(UserAuthActions.fetchUserDetails());
    };
    FetchUserdetails();
  }, [dispatch]);

  return (
    <div className="comments">
      <p>{comments.length} Comments</p>
      <div className="comments_form d-flex w-100 my-2">
        {Userinfo && (
          <LazyLoadImage
            src={Userinfo.profileImage}
            effect="blur"
            scrollPosition={scrollPosition}
            alt="userPfp"
          />
        )}
        <form onSubmit={handleCommentSubmit} className="d-flex flex-grow-1">
          <textarea
            autoFocus
            className="flex-grow-1"
            required
            placeholder="Add a comment..."
            value={Comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {!loading ? (
            <button className="border-0 p-2">Comment</button>
          ) : (
            <SpinnerCircular color="#00BFFF" />
          )}
        </form>
      </div>
      <div className="comments__list">
        {comments.map((comment) => (
          <SingleComment
            userId={comment.userId}
            userPfp={comment.userPfp}
            name={comment.name}
            comment={comment.Comment}
            timestamp={comment.timestamp}
          />
        ))}
      </div>
    </div>
  );
}

export default trackWindowScroll(Comments);
