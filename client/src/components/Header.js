import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Context from "../store/context";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Map from "@material-ui/icons/Map";
import Typography from "@material-ui/core/Typography";
import Signout from "./Auth/Signout";

const Header = ({ classes }) => {
  const { state } = useContext(Context);
  const { currentUser } = state;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/* title & logo will come here */}
          <div className={classes.grow}>
            <Map className={classes.icon} />
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
            >
              Map Pins
            </Typography>
          </div>

          {
            currentUser && (
              <div className={classes.grow}>
                <img className={classes.picture} src={currentUser.picture} alt={currentUser.name} />
                <Typography
                  variant="h5"
                  color="inherit"
                  noWrap
                >
                  {currentUser.name}
                </Typography>
                <Signout />
              </div>
            )
          }
        </Toolbar>
      </AppBar>
    </div>
  );
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing.unit,
    color: "green",
    fontSize: 45
  },
  mobile: {
    display: "none"
  },
  picture: {
    height: "50px",
    borderRadius: "90%",
    marginRight: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(Header);
