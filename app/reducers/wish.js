import * as actionTypes from '@actions/actionTypes';
const initialState = {
  wishlist: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_WISHLIST:
      return {
        ...state,
        wishlist: [...state.wishlist, action.data],
      };
    case actionTypes.REMOVE_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter(wish => wish._id !== action.id)
      }
    case actionTypes.REMOVE_ALL_WISHLIST:
      return {
        ...state,
        wishlist: []
      }
    default:
      return state;
  }
};
