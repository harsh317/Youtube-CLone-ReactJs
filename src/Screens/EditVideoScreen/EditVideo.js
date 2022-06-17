import React, {
  useEffect,
  useCallback,
  useReducer,
  useState,
  useRef,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { SpinnerCircular } from "spinners-react";
import Select from "react-select";
import { BiRename } from "react-icons/bi";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Input from "../../components/Input/Input";
import * as VideoActions from "../../Store/actions/Videos";
import { Button, Container, Form } from "react-bootstrap";

const formReducer = (state, action) => {
  if (action.type === "FORM_INPUT_UPDATE") {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updateValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let FormisValid = true;
    for (const key in updateValidities) {
      FormisValid = FormisValid && updateValidities[key];
    }
    return {
      formIsValid: FormisValid,
      inputValidities: updateValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

function EditVideo() {
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();
  const [Files, setFiles] = useState();
  const inputRef = useRef(null);
  const userInput = useRef("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const VideoToEdit = useSelector((state) => state.Vidoes.video);
  const [image, setImage] = useState();

  const loadVideoDetails = useCallback(async () => {
    seterror(null);
    try {
      await dispatch(VideoActions.fetchvideo(id));
    } catch (error) {
      seterror(error.message);
      console.log(error.message);
    }
  }, [dispatch, seterror]);

  useEffect(() => {
    setImage(VideoToEdit && VideoToEdit.thumbnail);
    userInput.current = VideoToEdit && VideoToEdit.publicity;
  }, [VideoToEdit]);

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error", 10000);
    }
  }, [error]);

  useEffect(() => {
    setloading(true);
    loadVideoDetails().then(() => {
      setloading(false);
    });
  }, [dispatch, loadVideoDetails, setloading]);

  const Private = [
    { value: "Public", label: "Public" },
    { value: "Private", label: "Private" },
  ];

  const [formState, dispatchformState] = useReducer(formReducer, {
    inputValues: {
      name: VideoToEdit?.name,
      description: VideoToEdit?.description,
    },
    inputValidities: {
      name: true,
      description: true,
    },
    formIsValid: true,
  });

  useEffect(() => {
    if (error) {
      NotificationManager.error(error, "Error", 10000);
    }
  }, [error]);

  const UplaodHandler = (e) => {
    e.preventDefault();
    if (Files) {
      let formData = new FormData();
      formData.append("file", Files);

      axios({
        method: "POST",
        url: "http://localhost:5000/api/video/uploadThumbnail",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      }).then((response) => {
        if (response.data.success) {
          NotificationManager.success(
            "Thumbnail uplaoded successfully ;)",
            "success"
          );
          onclickHandler(`http://localhost:5000/${response.data.filepath}`);
        }
      });
    } else {
      onclickHandler(image);
    }
  };

  const onclickHandler = useCallback(
    async (filepath) => {
      if (!formState.formIsValid) {
        alert("Please enter a Valid text in the form", [{ text: "Ok" }]);
        return;
      }
      setloading(null);
      seterror(false);
      try {
        await dispatch(
          VideoActions.Update_Video(
            formState.inputValues.name,
            formState.inputValues.description,
            userInput.current,
            filepath,
            id
          )
        );
        navigate("/", { replace: true });
      } catch (err) {
        seterror(err.message);
      }
      setloading(false);
    },
    [dispatch, id, formState]
  );

  const handleFileChange = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    setImage(URL.createObjectURL(event.target.files[0]));
    setFiles(fileObj);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputvalue, inputisValid) => {
      dispatchformState({
        type: "FORM_INPUT_UPDATE",
        value: inputvalue,
        isValid: inputisValid,
        input: inputIdentifier,
      });
    },
    [dispatchformState]
  );

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Change Thumbnail
    </Tooltip>
  );

  if (loading) {
    return (
      <div>
        <SpinnerCircular color="#00BFFF" size={30} />
      </div>
    );
  }

  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Input
            id="name"
            label="Name" // Label for our Input
            initialvalue={VideoToEdit ? VideoToEdit.name : ""} // Initial Value for our input. i.e ""
            required // It is a required field
            inputchange={inputChangeHandler} // Do this when text inout value changes
            initiallyvalid={true}
            Icon={BiRename}
            minLength={5}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Input
            id="description"
            label="Description" // Label for our Input
            initialvalue={VideoToEdit ? VideoToEdit.description : ""} // Initial Value for our input. i.e ""
            required // It is a required field
            inputchange={inputChangeHandler} // Do this when text inout value changes
            initiallyvalid={true}
            Icon={BiRename}
            minLength={15}
            textarea={true}
          />
        </Form.Group>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <Container
            className="mb-3"
            style={{ width: 300, cursor: "pointer" }}
            onClick={handleClick}
          >
            <h6>Thumbnail</h6>
            <img src={image} className="img-fluid img-thumbnail" />
          </Container>
        </OverlayTrigger>
        <input
          style={{ display: "none" }}
          ref={inputRef}
          accept="image/apng, image/avif, image/jpeg, image/png"
          type="file"
          onChange={handleFileChange}
        />
        <Form.Group className="mb-3">
          <Form.Label>Publicity</Form.Label>
          <Select
            options={Private}
            placeholder="Select publicity ..."
            onChange={(selectedoption) => {
              userInput.current = selectedoption.value;
            }}
          />
        </Form.Group>
        <Button onClick={UplaodHandler} variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </div>
  );
}

export default EditVideo;
