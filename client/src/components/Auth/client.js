import {useState, useEffect} from "react";
import { GraphQLClient } from "graphql-request";

export const BASE_API_URL = "http://localhost:4000/graphql";
export function useClient() {
    const [idToken, setIdToken] = useState(null);

    useEffect(() => {
        const idToken = window.gapi.auth2.getAuthInstance()
        .currentUser.get().getAuthResponse().id_token;
        setIdToken(idToken);
    }, []);

    return new GraphQLClient(BASE_API_URL, {
        headers: {authorization: idToken}
    });
}
