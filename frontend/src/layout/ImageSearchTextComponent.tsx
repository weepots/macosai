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

type urlObject = {
  url: string;
};

const ImageSearchTextComponent: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("Astronaut Riding a horse");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [base64Images, setBase64Images] = useState<string[]>([]);
  const [imageURLList, setImageURLList] = useState<string[]>([]);
  const [numImages, setNumImages] = useState<string>("1");
  const { setImageAsset } = useImageAsset();
  // useEffect(() => {}, [base64Images]);
  useEffect(() => {}, [imageURLList]);
  const changeSearchText = (e: React.BaseSyntheticEvent) => {
    setSearchText(e.currentTarget.value as string);
  };
  const handleDropdownSelect = (eventKey: string | null) => {
    // Update the state when a new option is selected
    if (eventKey !== null) {
      setNumImages(eventKey);
    }
  };
  const handleSubmit = () => {
    imageSearchTextAPI(searchText, numImages);
  };
  const addToProjectHandler = async (event: React.MouseEvent) => {
    const imageId = parseInt(event.currentTarget.id);
    const imageUrl = imageURLList[imageId];
    const serverEndpoint = "http://localhost:8000/get_image_from_url";
    const imageSourceResponse = await axios.post(
      serverEndpoint,
      { image_url: imageUrl },
      {
        responseType: "arraybuffer",
      }
    );
    const imageString = Buffer.from(imageSourceResponse.data).toString("base64");
    const result = [
      {
        type: "image",
        id: nanoid(),
        name: `knn-search-${imageId}`,
        src: `data:image/png;base64,${imageString}`,
      },
    ];
    setImageAsset(result);
  };
  const imageSearchTextAPI = async (searchText: string, numImages: string) => {
    console.log(searchText);
    console.log(numImages);
    setIsLoading(true);
    try {
      const serverEndpoint = "http://localhost:8000/search/text2image";
      const serverResponse = await axios.get(serverEndpoint, { params: { q: searchText, images: numImages } });

      const urlList = serverResponse.data.docs.map((item: urlObject) => {
        return item.url[0];
      });
      setImageURLList(urlList);
      setIsLoading(false);
    } catch (error) {
      console.log("Error when using Image Search Text API: ", error);
      setIsLoading(false);
      return null;
    }
  };

  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="iconKeyword">
          <Row>
            <Col>
              <Form.Label>Search Image with Text</Form.Label>
              <Form.Control onChange={changeSearchText} type="text" placeholder={searchText} />
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
            <Button onClick={handleSubmit} disabled={isLoading}>
              Search Image from Text
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
          {imageURLList.map((item, index) => (
            <Figure className={alignStyles.absoluteCenter} key={index}>
              <Figure.Image width={200} height={200} alt="171x180" src={item} />
              <div className={[spaceStyles["ml1rem"]].join(" ")}>
                <Button id={`${index}`} onClick={addToProjectHandler}>
                  Add to Project
                </Button>
              </div>
            </Figure>
          ))}
        </Stack>
      </div>
    </div>
  );
};
export default ImageSearchTextComponent;
