import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row, Dropdown, Spinner, Figure, Stack } from "react-bootstrap";
import axios from "axios";
import { nanoid } from "nanoid";
import { Buffer } from "buffer";
import useImageAsset from "../hook/useImageAsset";
import alignStyles from "../style/align.module.css";
import sizeStyles from "../style/size.module.css";
import spaceStyles from "../style/space.module.css";
import overflowStyles from "../style/overflow.module.css";

const ImageGenUI: React.FC = () => {
  const [prompt, setPrompt] = useState("Astronaut riding a horse");
  const { setImageAsset, getAllImageAsset } = useImageAsset();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [seed, setSeed] = useState(93);
  const [numImages, setNumImages] = useState<string>("1");
  const [base64Images, setBase64Images] = useState<string[]>([]);

  const [seedInvalid, setSeedInvalid] = useState<boolean>(false);
  const [seedErrorMessage, setSeedErrorMessage] = useState<string>("");

  const [promptInvalid, setPromptInvalid] = useState<boolean>(false);
  const [promptErrorMessage, setPromptErrorMessage] = useState<string>("");

  useEffect(() => {
    console.log(base64Images.length);
  }, [base64Images]);

  const checkPromptInvalid = (prompt: string) => {
    if (prompt.length > 100) {
      setPromptErrorMessage("Prompt cannot be greater than 100 characters");
      setPromptInvalid(true);
      return true;
    } else if (prompt.length === 0) {
      setPrompt("Astronaut riding a horse");
    } else {
      setPromptInvalid(false);
      return false;
    }
  };
  const changePrompt = (e: React.BaseSyntheticEvent) => {
    if (checkPromptInvalid(e.currentTarget.value) === false) {
      setPrompt(e.currentTarget.value as string);
    }
  };

  const checkIfSeedInvalid = (seed: number) => {
    const _ = seed.toString();
    if (seed > 2 ** 31 || seed < 0 - 2 ** 31 || seed % 1 !== 0) {
      if (seed % 1 !== 0) {
        setSeedErrorMessage("Integer only.");
      } else {
        setSeedErrorMessage("Max/Min size exceeded.");
      }
      setSeedInvalid(true);
      return true;
    } else if (_.length === 0) {
      setSeed(93);
    } else {
      setSeedInvalid(false);
      return false;
    }
  };
  const changeSeed = (e: React.BaseSyntheticEvent) => {
    if (checkIfSeedInvalid(e.currentTarget.value) === false) {
      setSeed(e.currentTarget.value);
    }
  };

  const handleDropdownSelect = (eventKey: string | null) => {
    // Update the state when a new option is selected
    if (eventKey !== null) {
      setNumImages(eventKey);
    }
  };

  const handleSubmit = () => {
    stableDiffusionAPI(prompt, seed.toString(), numImages);
  };

  const addToProjectHandler = (event: React.MouseEvent) => {
    const imageId = parseInt(event.currentTarget.id);
    const imageString = base64Images[imageId];
    const result = [
      {
        type: "image",
        id: nanoid(),
        name: `ai-gen-${imageId}`,
        src: imageString,
      },
    ];
    setImageAsset(result);
    setSeedErrorMessage("Image added to Asset List.");
  };

  function base64ToImageObjectURL(base64String: string) {
    // Convert base64 string to ArrayBuffer
    // base64String = "data:image/png;base64," + base64String;
    const binaryString = atob(base64String);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create Blob from ArrayBuffer
    const blob = new Blob([bytes], { type: "image/png" }); // Adjust the type based on your image format

    // Create object URL from Blob
    const objectURL = URL.createObjectURL(blob);

    // const link = document.createElement("a");
    // link.download = "output.png";
    // link.href = objectURL;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(objectURL);
    return objectURL;
  }

  const stableDiffusionAPI = async (prompt: string, seed: string, numImages: string) => {
    console.log(prompt);
    console.log(seed);
    console.log(numImages);
    setIsLoading(true);
    console.log(isLoading);
    try {
      const serverEndpoint = "http://localhost:8080/stableDiffuse";
      const serverResponse = await axios.post(serverEndpoint, { prompt, seed, numImages });
      const base64Images = serverResponse.data;
      base64Images.map((image: string) => {
        setBase64Images((oldArray) => [...oldArray, `data:image/png;base64,${image}`]);
      });
      // const base64Result = serverResponse.data[0];
      const base64SRC = "data:image/png;base64," + base64Images[0];
      // base64ToImageObjectURL(base64Result);
      setIsLoading(false);
      return base64SRC;
    } catch (error) {
      console.log("Error when using stable diffusion API: ", error);
      setIsLoading(false);
      return null;
    }
  };

  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="iconKeyword">
          {/* <Form.Label>{}</Form.Label> */}
          <Row>
            <Col xs={8}>
              <Form.Label>Prompt</Form.Label>
              <Form.Control onChange={changePrompt} type="text" placeholder={prompt} isInvalid={promptInvalid} />
              {promptInvalid && <Form.Text className="text-danger">{promptErrorMessage}</Form.Text>}
            </Col>
            <Col>
              <Form.Label>Seed</Form.Label>
              <Form.Control onChange={changeSeed} type="text" placeholder={seed.toString()} isInvalid={seedInvalid} />
              {seedInvalid && <Form.Text className="text-danger">{seedErrorMessage}</Form.Text>}
            </Col>
          </Row>
        </Form.Group>
        <Row>
          <Col>
            <Dropdown onSelect={handleDropdownSelect}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Images: {numImages}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey={1}>1</Dropdown.Item>
                <Dropdown.Item eventKey={2}>2</Dropdown.Item>
                <Dropdown.Item eventKey={3}>3</Dropdown.Item>
                <Dropdown.Item eventKey={4}>4</Dropdown.Item>
                <Dropdown.Item eventKey={5}>5</Dropdown.Item>
                <Dropdown.Item eventKey={6}>6</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col align="end">
            <Button onClick={handleSubmit} disabled={isLoading || seedInvalid || promptInvalid}>
              Generate Image
            </Button>
          </Col>
          {isLoading && (
            <Col xs={2}>
              <Spinner animation="border" variant="primary" />
            </Col>
          )}
        </Row>
      </Form>
      <div className={[alignStyles.absoluteCenter, sizeStyles["min-h-55vh"]].join(" ")}>
        <Stack className={[spaceStyles["mt2rem"], overflowStyles.scroll].join(" ")}>
          {base64Images.map((item, index) => (
            <Figure className={alignStyles.absoluteCenter} key={index}>
              <Figure.Image width={200} height={200} alt="171x180" src={item} />
              <div className={[spaceStyles["ml1rem"]].join(" ")}>
                <Button id={`${index}`} onClick={addToProjectHandler}>
                  Add to Asset List
                </Button>
              </div>
            </Figure>
          ))}
        </Stack>
      </div>
    </div>
  );
};
export default ImageGenUI;
