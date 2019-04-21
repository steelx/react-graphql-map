export const LOGIN_USER = "LOGIN_USER";
export const SIGNOUT_USER = "SIGNOUT_USER";
export const IS_LOGGED_IN = "IS_LOGGED_IN";
export function UserReducer(state, action) {
    switch(action.type) {
        case LOGIN_USER:
            return {
                ...state,
                currentUser: action.payload
            };
        
        case IS_LOGGED_IN:
            return {
                ...state,
                isAuth: action.payload
            };

        case SIGNOUT_USER:
            return {
                ...state,
                isAuth: false,
                currentUser: null
            };

        default:
            return state;
    }
}