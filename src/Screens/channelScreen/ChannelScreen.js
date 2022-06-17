import React, { useState, useEffect, useCallback, useRef } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";
import numeral from "numeral";
import { NotificationManager } from "react-notifications";

import Video from "../../components/Video/Video";
import { auth } from "../../Config/FirebaseConfig";
import * as VideoActions from "../../Store/actions/Videos";
import "./_channelscreen.scss";

function ChannelScreen() {
  const [error, seterror] = useState();
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const subscribeRef = useRef(null);
  const { channelId } = useParams();
  const UserVidoes = useSelector((state) => state.Vidoes.UserVidoes);
  const Userinfo = useSelector((state) => state.Vidoes.VideoOwnerDetails);

  const loadChannelVideos = useCallback(async () => {
    seterror(null);
    try {
      await dispatch(VideoActions.fetchChannelVideos(channelId));
      await dispatch(VideoActions.fetchUserDetails(channelId));
    } catch (error) {
      seterror(error.message);
      console.log(error.message);
    }
  }, [dispatch, seterror]);

  useEffect(() => {
    setloading(true);
    loadChannelVideos().then(() => {
      setloading(false);
    });
  }, [dispatch, loadChannelVideos, setloading]);

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error", 10000);
    }
  }, [error]);

  const onSuscribeClick = () => {
    if (
      Userinfo?.Suscribers.length == 0 ||
      Userinfo?.Suscribers.indexOf(auth.currentUser.uid) !== 0
    ) {
      VideoActions.Subscribe(channelId)
        .then(() => {
          Userinfo.Suscribers.push(auth.currentUser.uid);
          subscribeRef.current.innerText = "Subscribed";
          subscribeRef.current.classList.add("Subscribed");
        })
        .catch((error) => {
          seterror(error.message);
        });
    } else {
      VideoActions.UnSubscribe(channelId)
        .then(() => {
          subscribeRef.current.innerText = "Subscribe";
          subscribeRef.current.classList.remove("Subscribed");
          Userinfo.Suscribers.pop(-1);
        })
        .catch((error) => {
          seterror(error.message);
        });
    }
  };

  if (!loading && UserVidoes.length === 0) {
    return <div>This Lazy user dont have any content Lmao</div>;
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
        <button onClick={loadChannelVideos}>Try Again</button>
      </div>
    );
  }

  return (
    <>
      <div className="px-5 py-2 my-2 d-flex justify-content-between align-items-center channelHeader">
        <div className="d-flex align-items-center">
          <img src={Userinfo && Userinfo.profileImage} alt="" />

          <div className="ml-3 channelHeader__details">
            <h3>{Userinfo && Userinfo.name}</h3>
            <span>
              {Userinfo && numeral(Userinfo.Suscribers.length).format("0.a")}{" "}
              Suscribers
            </span>
          </div>
        </div>

        <button
          onClick={onSuscribeClick}
          disabled={channelId === auth.currentUser.uid}
          ref={subscribeRef}
          className={
            Userinfo?.Suscribers.includes(auth.currentUser.uid)
              ? "Subscribed btn border-0 p-2 m-2"
              : "btn border-0 p-2 m-2"
          }
        >
          {Userinfo?.Suscribers.includes(auth.currentUser.uid)
            ? "Subscribed"
            : "Subscribe"}
        </button>
      </div>

      <Container className="container">
        <Row>
          {UserVidoes.map((video) => (
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
                channelId={channelId}
                channelScreen
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default ChannelScreen;
