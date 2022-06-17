import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerCircular } from "spinners-react";

import * as VideoActions from "../../Store/actions/Videos";
import HorizontalVideo from "../horizontalVideocomponent/HorzonVidcomp";

function VideoHorizontal({ category, VideoId }) {
  const [error, seterror] = useState();
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const relatedVideos = useSelector((state) =>
    state.Vidoes.relatedVids.filter((vid) => vid.id !== VideoId)
  );

  const loadRelatedVideos = useCallback(async () => {
    seterror(null);
    try {
      await dispatch(VideoActions.fetchrelatedvideos(category));
    } catch (error) {
      seterror(error.message);
      console.log(error.message);
    }
  }, [dispatch, seterror]);

  useEffect(() => {
    setloading(true);
    loadRelatedVideos().then(() => {
      setloading(false);
    });
  }, [dispatch, loadRelatedVideos, setloading]);

  if (!loading && relatedVideos.length === 0) {
    return <div>No Related Videos Available ;(</div>;
  }

  if (loading) {
    return (
      <div>
        <SpinnerCircular color="#00BFFF" size={30} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        An Error occured!
        <button onClick={loadRelatedVideos}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      {relatedVideos.map((relatedVideo) => (
        <HorizontalVideo
          views={relatedVideo.views}
          title={relatedVideo.name}
          UserPfp={relatedVideo.Userpfp}
          timestamp={relatedVideo.timestamp}
          Usersname={relatedVideo.Usersname}
          thumbnail={relatedVideo.thumbnail}
          duration={relatedVideo.duration}
          VideoId={relatedVideo.id}
          ownerId={relatedVideo.OwnerId}
        />
      ))}
    </div>
  );
}

export default VideoHorizontal;
