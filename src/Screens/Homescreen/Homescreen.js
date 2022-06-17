import React, { useState, useEffect, useCallback } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { SpinnerCircular } from "spinners-react";
import { NotificationManager } from "react-notifications";

import Categories from "../../components/Categoriesbar/Categories";
import Video from "../../components/Video/Video";
import * as VideoActions from "../../Store/actions/Videos";

function Homescreen() {
  const [error, seterror] = useState();
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.Vidoes.availableVideos);

  const centeredItem = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const loadVideos = useCallback(async () => {
    seterror(null);
    try {
      await dispatch(VideoActions.fetchvidoes());
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
    loadVideos().then(() => {
      setloading(false);
    });
  }, [dispatch, loadVideos]);

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
        <button onClick={loadVideos}>Try Again</button>
      </div>
    );
  }

  if (!loading && videos.length === 0) {
    return (
      <Container className="container">
        <Categories />
        <div style={centeredItem}>
          No Videos Available...Maybe you should start adding some! :)
        </div>
      </Container>
    );
  }

  return (
    <Container className="container">
      <Categories />
      <Row>
        {videos.map((video) => (
          <Col lg={3} md={4}>
            <Video
              id={video.id}
              title={video.name}
              thumbnail={video.thumbnail}
              description={video.description}
              duration={video.duration}
              Usersname={video.Usersname}
              Userspfp={video.Userpfp}
              views={video.views}
              timestamp={video.timestamp}
              ownerId={video.OwnerId}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Homescreen;
