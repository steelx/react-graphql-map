export const LOGIN_USER = "LOGIN_USER";
export function UserReducer(state, action) {
    switch(action.type) {
        case LOGIN_USER:
            return {
                ...state,
                currentUser: action.payload
            };
        default:
            return state;
    }
}