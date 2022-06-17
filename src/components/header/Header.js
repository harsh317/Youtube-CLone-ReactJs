import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { MdNotifications, MdApps, MdVideoCameraFront } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";

import * as UserAuthActions from "../../Store/actions/Auth";
import "./_header.scss";

function Header({ handleToggleSidebar }) {
  const [Input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Userinfo = useSelector((state) => state.auth.userInfo);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/search/${Input}`;
  };

  useEffect(() => {
    const FetchUserdetails = async () => {
      await dispatch(UserAuthActions.fetchUserDetails());
    };
    FetchUserdetails();
  }, [dispatch]);

  return (
    <div className="header">
      <FaBars
        className="header_menu"
        size="26"
        onClick={() => {
          handleToggleSidebar();
        }}
      />
      <img
        src="https://pngimg.com/uploads/youtube/youtube_PNG2.png"
        alt=""
        className="header_logo"
        onClick={() => {
          navigate("/");
        }}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search"
          value={Input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button type="submit">
          <AiOutlineSearch size={22} />
        </button>
      </form>

      <div className="header_User_icons">
        <MdVideoCameraFront
          size={28}
          className="icon"
          onClick={() => {
            navigate("/Upload", { state: { from: window.location.pathname } });
          }}
        />
        <MdNotifications size={28} className="icon" />
        <MdApps size={28} className="icon" />
        {Userinfo && (
          <img src={Userinfo.profileImage} alt="avatar" className="" />
        )}
      </div>
    </div>
  );
}

export default Header;
