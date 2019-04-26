import React, { useContext } from "react";
import { GoogleLogout } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import Context from "../../store/context";
import { SIGNOUT_USER } from "../../store/reducer";

const Signout = ({ classes }) => {
  const {dispatch} = useContext(Context);

  function onLogoutSuccess() {
    dispatch({type: SIGNOUT_USER})
  }
  return (
    <GoogleLogout
      onLogoutSuccess={onLogoutSuccess}
      render={({onClick}) => (
        <span className={classes.root} onClick={onClick}>
          <Typography
            variant="body1"
            className={classes.buttonText}
          >
            Logout
            <ExitToAppIcon className={classes.buttonIcon} />
          </Typography>
        </span>
      )}
    />
  );
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    color: "white",
    display: "flex"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "white"
  }
};

export default withStyles(styles)(Signout);
