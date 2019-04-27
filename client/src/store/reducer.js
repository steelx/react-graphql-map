export const LOGIN_USER = "LOGIN_USER";
export const SIGNOUT_USER = "SIGNOUT_USER";
export const IS_LOGGED_IN = "IS_LOGGED_IN";
export const CREATE_DRAFT_POSITION = "CREATE_DRAFT_POSITION";
export const UPDATE_DRAFT_POSITION = "UPDATE_DRAFT_POSITION";
export const DELETE_DRAFT_POSITION = "DELETE_DRAFT_POSITION";
export const GET_PINS = "GET_PINS";
export const CREATE_PIN = "CREATE_PIN";

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

        case CREATE_DRAFT_POSITION:
            return {
                ...state,
                draftPosition: {
                    latitude: 0,
                    longitude: 0
                }
            };
        
        case DELETE_DRAFT_POSITION:
            return {
                ...state,
                draftPosition: null
            };

        case UPDATE_DRAFT_POSITION:
            return {
                ...state,
                draftPosition: action.payload
            };

        case GET_PINS:
            return {
                ...state,
                pins: action.payload
            };

        case CREATE_PIN:
            const newPin = action.payload;
            const prevPins = state.pins.filter(p => p._id !== newPin._id);
            return {
                ...state,
                pins: [...prevPins, newPin]
            };

        default:
            return state;
    }
}