import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NotificationManager } from "react-notifications";
import { auth } from "../../Config/FirebaseConfig";

import * as VideoActions from "../../Store/actions/Videos";

function Suscribe({ OwnerId }) {
  const [error, seterror] = useState();
  const subscribeRef = useRef(null);
  const dispatch = useDispatch();
  const Userinfo = useSelector((state) => state.Vidoes.VideoOwnerDetails);

  const onSuscribeClick = () => {
    if (
      Userinfo?.Suscribers.length == 0 ||
      Userinfo?.Suscribers.indexOf(auth.currentUser.uid) !== 0
    ) {
      VideoActions.Subscribe(OwnerId)
        .then(() => {
          Userinfo.Suscribers.push(auth.currentUser.uid);
          subscribeRef.current.innerText = "Subscribed";
          subscribeRef.current.classList.add("Subscribed");
        })
        .catch((error) => {
          seterror(error.message);
        });
    } else {
      VideoActions.UnSubscribe(OwnerId)
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

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error", 10000);
    }
  }, [error]);

  useEffect(() => {
    const FetchUserdetails = async () => {
      try {
        await dispatch(VideoActions.fetchUserDetails(OwnerId));
      } catch (error) {
        seterror(error.message);
        NotificationManager.error(
          error.message,
          "Unable to get Owner Info :<",
          10000
        );
      }
    };
    FetchUserdetails();
  }, [dispatch]);

  return (
    <div className="videoMetadata__channel d-flex justify-content-between align-items-center my-2 py-3">
      <div className="d-flex">
        {Userinfo && (
          <img
            src={Userinfo.profileImage}
            alt="avatar"
            className="rounder-circle mr-3 "
          />
        )}
        <div className="d-flex flex-column">
          <span>{Userinfo && Userinfo.name}</span>
          {Userinfo && <span>{Userinfo.Suscribers.length} Suscribers</span>}
        </div>
      </div>

      <button
        disabled={OwnerId === auth.currentUser.uid}
        ref={subscribeRef}
        onClick={onSuscribeClick}
        className={
          Userinfo?.Suscribers.includes(auth.currentUser.uid)
            ? "Subscribed btn border-0 p-2 m-2"
            : "btn border-0 p-2 m-2"
        }
      >
        {Userinfo?.Suscribers.length == 0 ||
        Userinfo?.Suscribers.indexOf(auth.currentUser.uid) === -1
          ? "Subscribe"
          : "Subscribed"}
      </button>
    </div>
  );
}

export default Suscribe;
