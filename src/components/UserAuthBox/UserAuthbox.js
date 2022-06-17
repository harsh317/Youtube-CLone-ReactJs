import React, { useReducer, useCallback, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AiOutlineGoogle,
  AiOutlineGithub,
  AiOutlineFacebook,
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineUser,
} from "react-icons/ai";
import { motion } from "framer-motion";
import { SpinnerCircular } from "spinners-react";
import { getAdditionalUserInfo } from "firebase/auth";
import { NotificationManager } from "react-notifications";

import { useAuth } from "../../Context/UserAuthContext";
import Input from "../../components/Input/Input";
import "./_UserAuthBox.scss";

const formReducer = (state, action) => {
  // It's just just like a redux reducer but not not connected to redux at all
  if (action.type === "FORM_INPUT_UPDATE") {
    // when we change any input
    const updatedValues = {
      // Change our inputValues state
      ...state.inputValues, // Return all other inputs values
      [action.input]: action.value, // But change the value of that specific input
    };
    const updateValidities = {
      // Change our inputValidities state
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let FormisValid = false; // Initiallt its false
    for (const key in updateValidities) {
      //  If all inputs are valid then change it to true
      FormisValid = FormisValid && updateValidities[key];
    }
    return {
      formIsValid: FormisValid,
      inputValidities: updateValidities,
      inputValues: updatedValues,
    };
  }
  return state; // return our state
};

function UserAuthbox({ containerAuth, handleContainerLogin }) {
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [SignUp, setSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    SignupUser,
    LogInUser,
    isAuthenticated,
    SignInWithGoogle,
    CreateFireStoreUser,
  } = useAuth();

  if (isAuthenticated) {
    navigate(location.state?.from ?? "/");
  }

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error", 10000);
    }
  }, [error]);

  const AuthHandler = async () => {
    seterror(null);
    setloading(true);
    try {
      if (SignUp) {
        await SignupUser(
          formState.inputValues.email,
          formState.inputValues.password,
          formState.inputValues.name
        );
      } else {
        await LogInUser(
          formState.inputValues.email,
          formState.inputValues.password
        );
      }
      setloading(false);
    } catch (e) {
      seterror(e.message);
      setloading(false);
    }
  };

  const [formState, dispatchformState] = useReducer(formReducer, {
    // Our useReducer describing all our states
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  const inputChangeHandler = useCallback(
    // Our inputChangeHandler func
    (inputIdentifier, inputvalue, inputisValid) => {
      dispatchformState({
        type: "FORM_INPUT_UPDATE",
        value: inputvalue,
        isValid: inputisValid,
        input: inputIdentifier,
      });
    },
    [dispatchformState]
  );

  const LeftSidevariants = (Side) => {
    return {
      hidden: { opacity: 0, x: Side == "Left" ? -700 : 700 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          delay: 0.15,
          duration: 0.95,
          type: "spring",
        },
      },
    };
  };

  const SignIn_Button_Varient = {
    hover: {
      scale: 1.2,
      transition: {
        yoyo: Infinity,
      },
    },
    pressed: {
      scale: 0.9,
    },
  };

  const onclickHandler = () => {
    handleContainerLogin();
  };

  return (
    <div className="mainboxContainer">
      {containerAuth ? (
        <>
          <motion.div
            variants={LeftSidevariants("Left")}
            initial="hidden"
            animate="visible"
            className="mainboxContainer_LeftSide"
          >
            <h1>Welcome Back</h1>
            <p>
              To try the app
              <br></br>
              Login with credentials
            </p>
            <motion.button
              variants={SignIn_Button_Varient}
              whileHover="hover"
              whileTap="pressed"
              type="button"
              className="SignIn_Button"
              onClick={onclickHandler}
            >
              Authenticate
            </motion.button>
          </motion.div>
          <motion.div
            variants={LeftSidevariants()}
            initial="hidden"
            animate="visible"
            className="mainboxContainer_RightSide"
          >
            <img
              src="https://pngimg.com/uploads/youtube/youtube_PNG2.png"
              alt=":)"
            />
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            variants={LeftSidevariants("Left")}
            initial="hidden"
            whileInView="visible"
            className="mainboxContainer_Form"
          >
            <h1>Sign in Using</h1>
            <div className="mainboxContainer_Form_signin-icons">
              <div className="mainboxContainer_Form_signin-icons_icon facebook">
                <AiOutlineFacebook size={25} />
              </div>
              <div
                className="mainboxContainer_Form_signin-icons_icon google"
                onClick={() => {
                  SignInWithGoogle()
                    .then((result) => {
                      if (getAdditionalUserInfo(result).isNewUser) {
                        const user = result.user;
                        CreateFireStoreUser(
                          result.user,
                          user.displayName,
                          user.photoURL
                        );
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
              >
                <AiOutlineGoogle size={23} />
              </div>
              <div className="mainboxContainer_Form_signin-icons_icon Github">
                <AiOutlineGithub size={23} />
              </div>
            </div>
            <p>Or Use Your Email Address</p>
            <form autoComplete="off">
              <Input
                id="email" // field Id
                type="email"
                label="Email" // Label for our Input
                initialvalue="" // Initial Value for our input. i.e ""
                required // It is a required field
                email="true" // Our custom email validation
                inputchange={inputChangeHandler} // Do this when text inout value changes
                initiallyvalid="false"
                Icon={AiOutlineMail}
              />

              <Input
                id="password" // field Id
                label="Password" // Label for our Input
                initialvalue="" // I    nitial Value for our input. i.e ""
                minLength={5} // A minimum length of 5 or else error
                required // It is a required field
                inputchange={inputChangeHandler} // // Do this when text inout value changes
                initiallyvalid="false"
                Icon={AiOutlineLock}
              />

              {SignUp && (
                <Input
                  id="name"
                  label="Your Name"
                  inputchange={inputChangeHandler} // // Do this when text inout value changes
                  initialvalue="" // Initial Value for our input. i.e ""
                  initiallyvalid="false"
                  required
                  minLength={3}
                  Icon={AiOutlineUser}
                />
              )}

              <div className="SignUp">
                <p>
                  {SignUp
                    ? "Already Have an Account?"
                    : "Don't Have an Account?"}
                </p>
                <Link
                  className="link"
                  to="#"
                  onClick={() => {
                    setSignUp(!SignUp);
                  }}
                >
                  {SignUp ? "Login" : "Sign Up"}
                </Link>
              </div>
              {!SignUp && (
                <motion.div
                  variants={{
                    hover: {
                      scale: 1.1,
                    },
                  }}
                  whileHover="hover"
                  className="forgor_passw"
                >
                  <Link to="/forgot-password" className="forgor_passw_link">
                    Forgot Password?
                  </Link>
                </motion.div>
              )}

              <br></br>
              {!loading ? (
                <motion.button
                  variants={SignIn_Button_Varient}
                  whileHover="hover"
                  whileTap="pressed"
                  type="button"
                  className="SignIn_Button"
                  onClick={() => {
                    AuthHandler();
                  }}
                >
                  SIGN IN
                </motion.button>
              ) : (
                <SpinnerCircular color="#00BFFF" />
              )}
            </form>
          </motion.div>
          <motion.div
            variants={LeftSidevariants()}
            initial="hidden"
            whileInView="visible"
            className="mainboxContainer_FormRightside"
          >
            <h1>Hello Mates !</h1>
            <p>Try the Youtube CLone :)</p>
            <div className="mainboxContainer_FormRightside_img">
              <img
                src="https://pngimg.com/uploads/youtube/youtube_PNG2.png"
                alt=""
              />
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default UserAuthbox;
