import React, { useContext } from "react";
import Context from "../store/context";
import { Route, Redirect } from "react-router-dom";


export default function ProtectedRoute({component: Component, ...rest}) {
    const { state } = useContext(Context)

    return (
        <Route render={props => 
            state.isAuth ? <Component {...props} /> : <Redirect to="/login" />
        } {...rest} />
    );
}
