import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, {NavigationControl, Marker, Popup} from "react-map-gl";
import difference_in_minutes from "date-fns/difference_in_minutes";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import PinIcon from "./PinIcon";
import Blog from "./Blog";
import Context from "../store/context";
import { CREATE_DRAFT_POSITION, UPDATE_DRAFT_POSITION, GET_PINS, DELETE_PIN } from "../store/reducer";
import { useClient } from "./Auth/client";
import { GET_PINS_QUERY } from "../graphql/queries";
import { DELETE_PIN_MUTATION } from "../graphql/mutations";

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
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    getUserPosition();
    getPinsAsync();
  }, []);

  function getUserPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setViewport({...viewport, latitude, longitude});
          setUserPosition({latitude, longitude});
        },
        (failure) => {
          if (failure.message.startsWith('Only secure origins are allowed')) {
            // Secure Origin issue.
            console.log(failure.message);
          }
          setViewport({...viewport, ...FAKE_USER_POSITION});
          setUserPosition({...FAKE_USER_POSITION});
        },
        {timeout: 10000}
      );
    }
  }

  function handleMapClick({lngLat, leftButton}) {
    if (!leftButton) {return;}
    if (!state.draftPosition) {
      dispatch({type: CREATE_DRAFT_POSITION});
    }

    const [longitude, latitude] = lngLat;
    dispatch({
      type: UPDATE_DRAFT_POSITION, payload: {latitude, longitude}
    });
  }

  async function getPinsAsync() {
    const {getPins} = await client.request(GET_PINS_QUERY);
    dispatch({type: GET_PINS, payload: getPins});
  }

  function newlyCreatedPin(pin) {
    const pinDate = new Date(pin.createdAt);
    const isNewPin = difference_in_minutes(Date.now(), pinDate.getTime()) <= 30;
    return isNewPin ? "limegreen" : "darkblue";
  }

  function handleMarkerClick(pin) {
    setPopup(pin);
  }

  function isAuthUser(pin) {
    return state.currentUser._id === pin.author._id;
  }

  async function deletePin(pinId) {
    const {deletePin} = await client.request(DELETE_PIN_MUTATION, {pinId});
    setPopup(null);
    dispatch({type: DELETE_PIN, payload: deletePin});
  }

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiYWppbmt5YXgiLCJhIjoiY2p1cXNlamUwMTEydTRlcWx4N3l1emVjNCJ9.XweBmtxb1E9YvCxQNa60TQ"
        onViewportChange={(v) => setViewport(v)}
        onDblClick={handleMapClick}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl onViewportChange={(v) => setViewport(v)} />
        </div>

        {/* current user geo pin */}
        {userPosition !== null ? (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        ) : null}

        {/* current user draft pin */}
        {state.draftPosition !== null ? (
          <Marker
            latitude={parseFloat(state.draftPosition.latitude)}
            longitude={parseFloat(state.draftPosition.longitude)}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        ) : null}

        {/* get pins */}
        {state.pins.map((pin) => (
          <Marker key={pin._id}
            latitude={parseFloat(pin.latitude)}
            longitude={parseFloat(pin.longitude)}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color={newlyCreatedPin(pin)} onClick={
              () => handleMarkerClick(pin)
            } />
          </Marker>
        ))}

        {/* selected marker display in Popup dialog */}
        { popup && (
            <Popup
              latitude={popup.latitude} longitude={popup.longitude}
              onClose={() => setPopup(null)}
              closeButton={true} closeOnClick={false} anchor="top">
              <img src={popup.image} className={classes.popupImage} alt={popup.title} />
              <div className={classes.popupTab}>
                <Typography>
                  {popup.content}
                </Typography>
                { isAuthUser(popup) && (
                    <Button>
                      <DeleteIcon className={classes.deleteIcon} onClick={() => deletePin(popup._id)} />
                    </Button>
                  )
                }
              </div>
            </Popup>
          )
        }

      </ReactMapGL>

      <Blog />
      
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
