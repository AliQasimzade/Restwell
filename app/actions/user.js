import * as actionTypes from './actionTypes';

export const loginUser = (user) => {
    return {type: actionTypes.LOGIN_USER, user}
}

export const logOutUSer = () => {
    return {type: actionTypes.USER_LOGOUT}
}

export const changeUserInfo = (data) => {
    return {type: actionTypes.CHANGE_USER_INFO, data}
}