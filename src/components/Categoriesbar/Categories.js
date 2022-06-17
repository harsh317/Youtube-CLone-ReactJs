import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { NotificationManager } from "react-notifications";

import * as VideoActions from "../../Store/actions/Videos";
import "./_categoriesbar.scss";
import { categories } from "../../categories";

let Category = categories.map((category) => category["label"]);

function Categories() {
  const [activeElement, setActiveElement] = useState("All");
  const [error, seterror] = useState();
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  const loadVideosByCategory = useCallback(
    async (value) => {
      seterror(null);
      try {
        await dispatch(VideoActions.fetchvidoes(value));
      } catch (error) {
        seterror(error.message);
      }
    },
    [dispatch, seterror]
  );

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error", 10000);
    }
  }, [error]);

  const handleClick = (value) => {
    setActiveElement(value);
    setloading(true);
    loadVideosByCategory(value).then(() => {
      setloading(false);
    });
  };

  return (
    <div className="CategoriesBar">
      {Category.map((value, index) => (
        <span
          key={index}
          onClick={() => {
            handleClick(value);
          }}
          className={activeElement === value ? "active" : ""}
        >
          {value}
        </span>
      ))}
    </div>
  );
}

export default Categories;
