import {createContext} from "react";


const Context = createContext({
    currentUser: null,
    isAuth: false,
    draftPosition: null
});

export default Context;
