import React, { useReducer, useEffect } from "react";
import "./_inputStyles.scss";
const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  // Our Input reducer
  switch (action.type) {
    case INPUT_CHANGE: // When Input Value Changes
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR: // When Input is not in Focus (we move to the next input)
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialvalue ? props.initialvalue : "", // The initial Value that we passed
    isValid: props.initiallyvalid,
    touched: false,
  });

  const { inputchange, id, Icon } = props; // Destructore out our id and OnInputChange so that the we dont pass props in useEffect

  useEffect(() => {
    if (inputState.touched) {
      inputchange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, inputchange, id]);

  const textChangeHandler = (chnageprop) => {
    const text = chnageprop.target.value;

    // Do all the validation work
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // Email formatt is correct or not
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      // If input is required but the input value is null
      isValid = false; // then error
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      // If its a email input but email is invalid
      isValid = false; // then error
    }
    if (props.max != null && +text > props.max) {
      // In input value is greater than the maximum value we specified
      isValid = false; // then error
    }
    if (props.minLength != null && text.length < props.minLength) {
      // In input value is less than the minimum value we specified
      isValid = false; // then error
    }
    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {
    // When Input losts its focus or becomes blur
    dispatch({ type: INPUT_BLUR }); // dispactch this action
  };

  return (
    <>
      <div className="Custom_Input">
        <div className="icon">
          <Icon size={18} />
        </div>
        {props.textarea ? (
          <textarea
            required
            autoFocus
            placeholder={props.label}
            value={inputState.value}
            onBlur={lostFocusHandler}
            onChange={textChangeHandler}
            className="flex-grow-1"
          />
        ) : (
          <input
            required
            value={inputState.value}
            onChange={textChangeHandler}
            onBlur={lostFocusHandler}
            placeholder={props.label}
          />
        )}
      </div>
      {!inputState.isValid && inputState.touched && (
        <div className="errorContainer">
          <strong>Please Enter a Valid {id}</strong>
        </div>
      )}
    </>
  );
};

export default Input;
