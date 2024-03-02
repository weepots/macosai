import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row, Dropdown, Spinner, Figure, Stack, Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import { nanoid } from "nanoid";
import useImageAsset from "../hook/useImageAsset";
import ImageSearchTextComponent from "./ImageSearchTextComponent";
import ImageSearchImageComponent from "./ImageSearchImageComponent";
import alignStyles from "../style/align.module.css";
import sizeStyles from "../style/size.module.css";
import spaceStyles from "../style/space.module.css";
import overflowStyles from "../style/overflow.module.css";
import fontStyles from "../style/font.module.css";

const ImageSearchUI: React.FC = () => {
  const [searchText, setSearchText] = useState("Astronaut riding a horse");
  const { setImageAsset, getAllImageAsset } = useImageAsset();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [numImages, setNumImages] = useState<string>("1");
  const [base64Images, setBase64Images] = useState<string[]>([]);

  useEffect(() => {
    console.log(base64Images.length);
  }, [base64Images]);
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

  const addToProjectHandler = (event: React.MouseEvent) => {
    const imageId = parseInt(event.currentTarget.id);
    const imageString = base64Images[imageId];
    const result = [
      {
        type: "image",
        id: nanoid(),
        name: `knn-search-${imageId}`,
        src: imageString,
      },
    ];
    setImageAsset(result);
  };

  const imageSearchTextAPI = async (searchText: string, numImages: string) => {
    console.log(searchText);
    console.log(numImages);
    setIsLoading(true);
    console.log(isLoading);
    try {
      const serverEndpoint = "http://localhost:8000/search/text2image";
      const serverResponse = await axios.post(serverEndpoint, { params: { q: searchText, images: numImages } });
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
    <Tabs defaultActiveKey="textSearch" id="uncontrolled-tab-example" className="mb-3">
      <Tab eventKey="textSearch" title="Search with Text">
        <ImageSearchTextComponent />
      </Tab>
      <Tab eventKey="imageSearch" title="Search with Image">
        <ImageSearchImageComponent />
      </Tab>
    </Tabs>

    // <div>
    //   <Form>
    //     <Form.Group className="mb-3" controlId="iconKeyword">
    //       <Row>
    //         <Col>
    //           <Form.Label>Search Image with Text</Form.Label>
    //           <Form.Control onChange={changeSearchText} type="text" placeholder={searchText} />
    //         </Col>
    //       </Row>
    //       <Row>
    //         <div className="mt-3"></div>
    //         <div className={fontStyles.font1rem}>Search Image with Image</div>
    //       </Row>
    //     </Form.Group>
    //     <Row>
    //       <Col>
    //         <Dropdown onSelect={handleDropdownSelect}>
    //           <Dropdown.Toggle variant="success" id="dropdown-basic">
    //             Images: {numImages}
    //           </Dropdown.Toggle>
    //           <Dropdown.Menu>
    //             <Dropdown.Item eventKey={1}>1</Dropdown.Item>
    //             <Dropdown.Item eventKey={2}>2</Dropdown.Item>
    //             <Dropdown.Item eventKey={3}>3</Dropdown.Item>
    //             <Dropdown.Item eventKey={4}>4</Dropdown.Item>
    //             <Dropdown.Item eventKey={5}>5</Dropdown.Item>
    //             <Dropdown.Item eventKey={6}>6</Dropdown.Item>
    //           </Dropdown.Menu>
    //         </Dropdown>
    //       </Col>
    //       <Col align="end">
    //         <Button onClick={handleSubmit} disabled={isLoading}>
    //           Submit Query
    //         </Button>
    //       </Col>
    //       {isLoading && (
    //         <Col xs={2}>
    //           <Spinner animation="border" variant="primary" />
    //         </Col>
    //       )}
    //     </Row>
    //   </Form>
    //   <div className={[alignStyles.absoluteCenter, sizeStyles["min-h-55vh"]].join(" ")}>
    //     <Stack className={[spaceStyles["mt2rem"], overflowStyles.scroll].join(" ")}>
    //       {base64Images.map((item, index) => (
    //         <Figure className={alignStyles.absoluteCenter} key={index}>
    //           <Figure.Image width={200} height={200} alt="171x180" src={item} />
    //           <div className={[spaceStyles["ml1rem"]].join(" ")}>
    //             <Button id={`${index}`} onClick={addToProjectHandler}>
    //               Add to Project
    //             </Button>
    //           </div>
    //         </Figure>
    //       ))}
    //     </Stack>
    //   </div>
    // </div>
  );
};
export default ImageSearchUI;
