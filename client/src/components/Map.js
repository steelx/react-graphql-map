import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, {NavigationControl, Marker} from "react-map-gl";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import PinIcon from "./PinIcon";

const INITIAL_VIEWPORT = {
  latitude: 19.1703,
  longitude: 72.8684,
  zoom: 13
};

const FAKE_USER_POSITION = {
  latitude: 19.1690,
  longitude: 72.8686
};

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    getUserPosition()
  }, []);

  function getUserPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setViewport({...viewport, latitude, longitude});
          setUserPosition({latitude, longitude});
          console.info("userPosition : ", userPosition);
        },
        (failure) => {
          if (failure.message.startsWith('Only secure origins are allowed')) {
            // Secure Origin issue.
            console.log(failure);
          }
          setViewport({...viewport, ...FAKE_USER_POSITION});
          setUserPosition({...FAKE_USER_POSITION});
        },
        {timeout: 10000}
      );
    }
  }

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiYWppbmt5YXgiLCJhIjoiY2p1cXNlamUwMTEydTRlcWx4N3l1emVjNCJ9.XweBmtxb1E9YvCxQNa60TQ"
        onViewportChange={(v) => setViewport(v)}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl onViewportChange={(v) => setViewport(v)} />
        </div>
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}
      </ReactMapGL>
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
