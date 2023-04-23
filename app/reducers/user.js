import * as actionTypes from '@actions/actionTypes';
const initialState = {
  userInfo: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_USER:
      return {
        ...state,
        userInfo: action.user,
      };
  
    case actionTypes.USER_LOGOUT:
      return {
        ...state,
        userInfo: null,
      };
      case actionTypes.CHANGE_USER_INFO:
        return {
          ...state,
          userInfo: action.data
        }
    default:
      return state;
  }
};
