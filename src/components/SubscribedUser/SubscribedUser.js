import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";

import "./_SubscribedUser.scss";

const SubscribedUser = ({
  UserPfp,
  Usersname,
  description,
  ownerId,
  scrollPosition,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/channel/${ownerId}`);
  };

  return (
    <Row
      className="py-2 m-1 UserHorizontal align-items-center"
      onClick={handleClick}
    >
      <Col className="UserHorizontal__left">
        <LazyLoadImage
          className={"UserHorizontal__ChannelPfp"}
          src={UserPfp}
          alt="Channel_pfp"
          effect="blur"
          scrollPosition={scrollPosition}
        />
      </Col>
      <Col className="p-0">
        <p className="mb-1 UserHorizontal__title">{Usersname}</p>

        {description && (
          <p className="mt-1 UserHorizontal__desc">{description}</p>
        )}
      </Col>
    </Row>
  );
};

export default trackWindowScroll(SubscribedUser);
