


import axios, { AxiosResponse } from "axios";
import { Buffer } from "buffer";

function removeBackgroundAPI() {


  // function base64ToImageObjectURL(base64String: string) {
  //   // Convert base64 string to ArrayBuffer
  //   // base64String = "data:image/png;base64," + base64String;
  //   const binaryString = atob(base64String);
  //   const length = binaryString.length;
  //   const bytes = new Uint8Array(length);
  //   for (let i = 0; i < length; i++) {
  //     bytes[i] = binaryString.charCodeAt(i);
  //   }

  //   // Create Blob from ArrayBuffer
  //   const blob = new Blob([bytes], { type: "image/png" }); // Adjust the type based on your image format

  //   // Create object URL from Blob
  //   const objectURL = URL.createObjectURL(blob);

  //   const link = document.createElement("a");
  //   link.download = "output.png";
  //   link.href = objectURL;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(objectURL);
  //   return objectURL;
  // }

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