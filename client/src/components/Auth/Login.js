import React, { useContext } from "react";
import { GoogleLogin} from "react-google-login";
import { GraphQLClient } from "graphql-request";
import { withStyles } from "@material-ui/core/styles";
import Context from "../../store/context";
import { LOGIN_USER } from "../../store/reducer";
// import Typography from "@material-ui/core/Typography";

const ME_QUERY = `
  {
    me {
      name
      email
      picture
    }
  }
`;

const Login = ({ classes }) => {
  const {dispatch} = useContext(Context);

  const onSuccess = async (googleUser) => {
    const idToken = googleUser.getAuthResponse().id_token;
    
    const client = new GraphQLClient("http://localhost:4000/graphql", {
      headers: {authorization: idToken}
    });

    const data = await client.request(ME_QUERY);
    dispatch({type: LOGIN_USER, payload: data.me});
  }; 
  return <GoogleLogin 
    clientId="156992429844-88tkja5l3l01meg1upcpf0u6i7nc5kct.apps.googleusercontent.com"
    onSuccess={onSuccess}
    isSignedIn={true}
    />;
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
