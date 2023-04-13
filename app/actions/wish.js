import * as actionTypes from './actionTypes';

export const addWish = (data) => {
    return {type: actionTypes.ADD_WISHLIST, data}
}

export const removeWish = (id) => {
  return {type: actionTypes.REMOVE_WISHLIST, id}
}
export const removeAllWish = () => {
    return {type: actionTypes.REMOVE_ALL_WISHLIST}
}