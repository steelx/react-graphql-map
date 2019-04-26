import React, {useState, useContext} from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear"; 
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import Context from "../../store/context";
import {DELETE_DRAFT_POSITION} from "../../store/reducer";

const CreatePin = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const [ title, setTitle ] = useState("");
  const [ image, setImage ] = useState("");
  const [ content, setContent ] = useState("");

  function resetForm() {
    setTitle("");
    setImage("");
    setContent("");
    dispatch({type: DELETE_DRAFT_POSITION});
  }

  async function onSubmit(e) {
    e.preventDefault();
    const imageUrl = await uploadImageAsync();
    console.log({
      title,
      imageUrl,
      content
    })
  }

  async function uploadImageAsync() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopins");
    data.append("cloud_name", "ajinkyax");

    const URL = "https://api.cloudinary.com/v1_1/ajinkyax/image/upload";
    let resp;
    try {
      resp = await axios.post(URL, data);
    } catch(e) {
      console.log("ERROR Uplaoding image, ", e);
    }
    return resp.data.url;
  }

  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <Typography className={classes.alignCenter} component="h2" variant="h6" color="secondary" align="center">
        <LandscapeIcon className={classes.iconLarge} /> Marker Location
      </Typography>
      <div>
        <TextField
          name="title"
          label="Title"
          placeholder="Insert title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input accept="image/*" id="image" type="file" className={classes.input}
          onChange={(e) => setImage(e.target.files[0])} />
        <label htmlFor="image">
          <Button className={classes.button} style={{color: image && "green"}} component="span" size="small">
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField name="content" label="Content" multiline rows="6" margin="normal" fullWidth variant="outlined"
          onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        <Button className={classes.button} variant="contained" color="primary" onClick={() => resetForm()}>
          <ClearIcon className={classes.leftIcon} /> Discard
        </Button>
        <Button className={classes.button} type="submit" variant="contained" color="primary"
          disabled={!title.trim() || !content.trim() || !image}
        >
          <SaveIcon className={classes.rightIcon} /> Save
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
