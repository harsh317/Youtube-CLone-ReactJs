import React from "react";
import { Col, Row } from "react-bootstrap";
import { AiFillEye } from "react-icons/ai";
import moment from "moment";
import numeral from "numeral";
import {
  LazyLoadImage,
  trackWindowScroll,
} from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";

import "./_videoHorizontal.scss";

const HorizontalVideo = ({
  views,
  title,
  UserPfp,
  timestamp,
  Usersname,
  description,
  thumbnail,
  duration,
  VideoId,
  ownerId,
  searchscreen,
  scrollPosition,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    window.location.href = `/watch/${VideoId}`;
  };

  return (
    <Row className="py-2 m-1 videoHorizontal align-items-center">
      <Col
        xs={6}
        md={searchscreen ? 4 : 6}
        className="videoHorizontal__left"
        onClick={handleClick}
      >
        <LazyLoadImage
          src={thumbnail}
          alt="Thumbnail"
          effect="blur"
          className={`videoHorizontal__thumbnail ${thumbnail} `}
          wrapperClassName="videoHorizontal__thumbnail-wrapper"
        />
        <span className="videoHorizontal__duration">{duration}</span>
      </Col>
      <Col
        xs={6}
        md={searchscreen ? 8 : 6}
        className="p-0 videoHorizontal__right"
        onClick={handleClick}
      >
        <p className="mb-1 videoHorizontal__title">{title}</p>

        <div className="videoHorizontal__details mb-2">
          <span>
            <AiFillEye /> {numeral(views.length).format("0.a")} Views •{" "}
          </span>
          {moment(new Date(timestamp.toDate()).toUTCString()).fromNow()}
        </div>

        {description && (
          <p className="mt-1 videoHorizontal__desc">{description}</p>
        )}

        <div
          className="my-1 videoHorizontal__channel d-flex align-items-center"
          onClick={() => {
            navigate(`/channel/${ownerId}`);
          }}
        >
          <LazyLoadImage
            src={UserPfp}
            alt="Thumbnail"
            effect="blur"
            scrollPosition={scrollPosition}
          />
          <p className="mb-0">{Usersname}</p>
        </div>
      </Col>
    </Row>
  );
};

export default trackWindowScroll(HorizontalVideo);
