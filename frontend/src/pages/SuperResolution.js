import React, { useState, useEffect } from "react";
import RoundedDarkButton from "../components/ui/RoundedDarkButton";
import RoundedLightButton from "../components/ui/RoundedLightButton";
import RoundedImageBox from "../components/ui/RoundedImageBox";
import FileUploadButton from "../components/ui/FileUploadButton";
import Navbar from "../components/Navbar";
import { Buffer } from "buffer";
import { serverAddress } from "../Constants";
import { base64ToImageObjectURL } from "../helpers";
import axios from "axios";

function SuperResolution() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [returnImage, SetReturnImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, [selectedImage]);

  useEffect(() => {}, [returnImage]);

  useEffect(() => {}, [isLoading]);

  async function convertAndSend(objectURL, serverEndpoint) {
    try {
      // Fetch the image from the object URL
      const response = await fetch(objectURL);
      const blob = await response.blob();

      // Convert the blob to base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result.split(",")[1]);
        };
        reader.onerror = reject;

        reader.readAsDataURL(blob);
      });
      setIsLoading(true);
      const options = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const serverResponse = await axios.post(serverEndpoint, { image: base64Data }, options);
      SetReturnImage(base64ToImageObjectURL(serverResponse.data[0]));
      setIsLoading(false);
    } catch (error) {
      console.error("Error when sending image to server:    ", error);
    }
  }
  // function base64ToImageObjectURL(base64String) {
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

  //   // const link = document.createElement("a");
  //   // link.download = "output.jpg";
  //   // link.href = objectURL;
  //   // document.body.appendChild(link);
  //   // link.click();
  //   // document.body.removeChild(link);
  //   // URL.revokeObjectURL(objectURL);
  //   return objectURL;
  // }

  function uploadHander() {
    const endpoint = serverAddress.servers.coreml + serverAddress.routes.superResolution;
    convertAndSend(selectedImage, endpoint);
  }

  return (
    <div class="h-dvh">
      <Navbar name="Super Resolution" />
      <div class="flex flex-row space-x-20 justify-center px-10 w-100vw h-4/6">
        <div class="flex flex-col justify-center w-3/6 h-full">
          <RoundedImageBox selectedImage={selectedImage} />
          <div class="flex flex-row">
            <FileUploadButton setSelectedImage={setSelectedImage} selectedImage={selectedImage} />
            <RoundedDarkButton text="Upload" onClick={uploadHander} />
          </div>
        </div>
        <div class="flex flex-col justify-center w-3/6 h-full">
          <RoundedImageBox selectedImage={returnImage} loadState={isLoading} />
          <RoundedLightButton text="Super Resolution" />
        </div>
      </div>
    </div>
  );
}

export default SuperResolution;
