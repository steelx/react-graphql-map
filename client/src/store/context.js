import {createContext} from "react";


const Context = createContext({
    currentUser: null,
    isAuth: false,
    draftPosition: null,
    pins: []
});

export default Context;
