import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row, Dropdown, Spinner, Figure, Stack, Image } from "react-bootstrap";
import axios from "axios";
import { nanoid } from "nanoid";
import { Buffer } from "buffer";
import useImageAsset from "../hook/useImageAsset";
import alignStyles from "../style/align.module.css";
import sizeStyles from "../style/size.module.css";
import spaceStyles from "../style/space.module.css";
import overflowStyles from "../style/overflow.module.css";
import colourStyles from "../style/color.module.css";
import borderStyles from "../style/border.module.css";

type urlObject = {
  url: string;
};

type http_options = {
  responseType: string;
  headers: object;
};
// type blobObject = {
//   blob
// }

const ImageSearchImageComponent: React.FC = () => {
  const [searchImage, setSearchImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [base64Images, setBase64Images] = useState<string[]>([]);
  const [imageURLList, setImageURLList] = useState<string[]>([]);
  const [numImages, setNumImages] = useState<string>("1");
  const { setImageAsset } = useImageAsset();
  // useEffect(() => {}, [base64Images]);
  useEffect(() => {
    console.log(searchImage);
  }, [searchImage]);
  useEffect(() => {}, [imageURLList]);
  const handleDropdownSelect = (eventKey: string | null) => {
    // Update the state when a new option is selected
    if (eventKey !== null) {
      setNumImages(eventKey);
    }
  };

  const handleChooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSearchImage(URL.createObjectURL(event.target.files[0]));
    }
  };
  // function blobToBase64(blob) {
  //   return new Promise((resolve, _) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result);
  //     reader.readAsDataURL(blob);
  //   });
  // const blobToBase64 = (blob: Blob) => {
  //   return new Promise((resolve, _) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => resolve(reader.result);
  //     reader.readAsDataURL(blob);
  //   });
  // };
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (event) => {
        reject(new Error(`Error reading blob: ${event}`));
      };
      reader.readAsDataURL(blob);
    });
  }
  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await fetch(searchImage);
    const blob = await response.blob();
    const base64Image = await blobToBase64(blob);
    imageSearchImageAPI(base64Image, numImages);
    setIsLoading(false);

    // imageSearchTextAPI(searchImage, numImages);
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
  const imageSearchImageAPI = async (searchImage: string, numImages: string) => {
    try {
      const serverEndpoint = "http://localhost:8000/search/image2image";

      const options = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const serverResponse = await axios.post(
        serverEndpoint,
        {
          searchImage: searchImage,
          numImages: numImages,
        },
        options
      );

      const urlList = serverResponse.data.docs.map((item: urlObject) => {
        return item.url[0];
      });
      setImageURLList(urlList);
      setIsLoading(false);
      // return base64SRC;
    } catch (error) {
      console.log("Error when using Image Search Text API: ", error);
      setIsLoading(false);
      return null;
    }
  };

  return (
    <div>
      <div
        className={[
          colourStyles.greyTheme,
          borderStyles.roundSM,
          sizeStyles["min-h-25vh"],
          alignStyles.absoluteCenter,
        ].join(" ")}
      >
        {!searchImage && <i className={["bi-image"].join(" ")} />}
        {searchImage && <Image src={searchImage} className={sizeStyles["mx-h-30vh"]} />}
      </div>
      <Row>
        <Col className="mt-3">
          {/* <Button className={[colourStyles.darkTheme].join(" ")}>Choose Image</Button> */}
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control type="file" onChange={handleChooseFile} accept=".png,.jpg,.jpeg" />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
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
          <Button onClick={handleSubmit} disabled={isLoading || !searchImage}>
            Search Image from Image
          </Button>
        </Col>
      </Row>
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
export default ImageSearchImageComponent;
