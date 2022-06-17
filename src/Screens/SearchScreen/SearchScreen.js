import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { SpinnerCircular } from "spinners-react";

import * as VideoActions from "../../Store/actions/Videos";
import HorizontalVideo from "../../components/horizontalVideocomponent/HorzonVidcomp";

function SearchScreen() {
  const { query } = useParams();
  const dispatch = useDispatch();
  const [error, seterror] = useState();
  const [loading, setloading] = useState(false);
  const SearchVideos = useSelector((state) => state.Vidoes.SearchVids);

  const centeredItem = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const loadSearchVideos = useCallback(async () => {
    seterror(null);
    try {
      await dispatch(VideoActions.fetchSearchvidoes(query));
    } catch (error) {
      seterror(error.message);
    }
  }, [dispatch, seterror]);

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error", 10000);
    }
  }, [error]);

  useEffect(() => {
    setloading(true);
    loadSearchVideos().then(() => {
      setloading(false);
    });
  }, [dispatch, loadSearchVideos]);

  if (loading) {
    return (
      <div style={centeredItem}>
        <SpinnerCircular color="#00BFFF" size={30} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={centeredItem}>
        An Error occured!
        <button onClick={loadSearchVideos}>Try Again</button>
      </div>
    );
  }

  if (!loading && SearchVideos.length === 0) {
    return <div style={centeredItem}>No Video Found :(</div>;
  }

  return (
    <div>
      {SearchVideos.map((relatedVideo) => (
        <HorizontalVideo
          views={relatedVideo.views}
          title={relatedVideo.name}
          UserPfp={relatedVideo.Userpfp}
          timestamp={relatedVideo.timestamp}
          Usersname={relatedVideo.Usersname}
          thumbnail={relatedVideo.thumbnail}
          duration={relatedVideo.duration}
          VideoId={relatedVideo.id}
          description={relatedVideo.description}
          searchscreen
        />
      ))}
    </div>
  );
}

export default SearchScreen;
