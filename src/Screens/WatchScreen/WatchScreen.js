import React, { useState, useEffect, useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";
import { Helmet } from "react-helmet";

import VideoMetaData from "../../components/VideoMetaData/VideoMetaData";
import VideoHorizontal from "../../components/VideoHorizontal/VideoHorizontal";
import Comments from "../../components/comments/Comments";
import Videoplayer from "../../components/VideoPlayer/Videoplayer";
import * as VideoActions from "../../Store/actions/Videos";

function WatchScreen() {
  const [error, seterror] = useState();
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const videoDetails = useSelector((state) => state.Vidoes.video);

  const centeredItem = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const loadVideoDetails = useCallback(async () => {
    seterror(null);
    try {
      await dispatch(VideoActions.fetchvideo(id));
    } catch (error) {
      seterror(error.message);
      console.log(error.message);
    }
  }, [dispatch, seterror]);

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error", 10000);
    }
  }, [error]);

  useEffect(() => {
    setloading(true);
    loadVideoDetails().then(() => {
      setloading(false);
    });
  }, [dispatch, loadVideoDetails, setloading]);

  const SetViews = useCallback(async () => {
    axios
      .get("https://api.ipify.org/?format=json")
      .then(async (res) => {
        seterror(null);
        VideoActions.SetView(id, res.data).catch((error) => {
          seterror(error.message);
        });
      })
      .catch((error) => {
        seterror(error);
        console.log(error);
      });
  }, [dispatch, seterror, videoDetails]);

  useEffect(() => {
    SetViews();
  }, []);

  if (loading) {
    return (
      <div style={centeredItem}>
        <SpinnerCircular color="#00BFFF" size={30} />
      </div>
    );
  }

  if (!loading && videoDetails === null) {
    return <div style={centeredItem}>We Cannot Get the Video Sorry</div>;
  }

  if (error) {
    return (
      <div style={centeredItem}>
        An Error occured!
        <button onClick={loadVideoDetails}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{videoDetails.name}</title>
      </Helmet>
      <Videoplayer
        vidsrc={videoDetails.filepath}
        duration={videoDetails.duration}
      />
      <Row>
        <Col lg={8}>
          <VideoMetaData
            views={videoDetails.views}
            title={videoDetails.name}
            description={videoDetails.description}
            OwnerId={videoDetails.OwnerId}
            timestamp={new Date(videoDetails.timestamp.toDate()).toUTCString()}
            VideoId={id}
          />
          <Comments
            VideoId={id}
            userPfp={videoDetails.Userpfp}
            name={videoDetails.Usersname}
          />
        </Col>
        <Col lg={4}>
          <VideoHorizontal category={videoDetails.category} VideoId={id} />
        </Col>
      </Row>
    </div>
  );
}

export default WatchScreen;
