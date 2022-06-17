import { SET_UserDetails } from "../actions/Auth";

const initialState = {
  userInfo: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_UserDetails:
      return {
        userInfo: action.Userdata,
      };
    default:
      return state;
  }
};
