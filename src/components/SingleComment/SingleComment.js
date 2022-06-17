import React from "react";
import "./_singleComment.scss";
import moment from "moment";

function SingleComment({ userId, userPfp, name, comment, timestamp }) {
  return (
    <div className="comment p-2 d-flex">
      <img src={userPfp} className="rounded-circle mr-3" />
      <div className="comment__body">
        <p className="comment__header mb-1">
          {name} •{" "}
          {timestamp.nanoseconds
            ? moment(new Date(timestamp.toDate()).toUTCString()).fromNow()
            : moment(timestamp).fromNow()}
        </p>
        <p className="mb-0">{comment}</p>
      </div>
    </div>
  );
}

export default SingleComment;
