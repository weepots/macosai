


import axios, { AxiosResponse } from "axios";
import { Buffer } from "buffer";

function removeBackgroundAPI() {

  async function removeBackgroundHandler(image: HTMLImageElement) {
    const splitArray = image.src.split(",");
    const base64Data = splitArray[1];
    const serverEndpoint = "http://localhost:8080/backgroundRemove";
    const serverResponse: AxiosResponse = await axios.post(serverEndpoint, { image: base64Data });
    const base64SRC = "data:image/png;base64," + serverResponse.data[0];
    return base64SRC;

  }
  return { removeBackgroundHandler, };



}

export default removeBackgroundAPI;