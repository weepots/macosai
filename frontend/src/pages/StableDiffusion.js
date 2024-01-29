import Navbar from "../components/Navbar";
import Searchbar from "../components/ui/Searchbar";
import RoundedImageBox from "../components/ui/RoundedImageBox";
import {serverAddress} from "../Constants"

import React, { useState, useEffect } from "react";
import { Buffer } from "buffer";

function StableDiffusion() {
  const [searchText, setSearchText] = useState("");
  const [returnImage, SetReturnImage] = useState(null);

  function searchHandler() {
    const endpoint = serverAddress.servers.coreml+serverAddress.routes.stableDiffusion
    text2image(searchText,endpoint);
  }

  function onChangeHandler(text) {
    setSearchText(text);
  }
  useEffect(() => {}, [returnImage]);

  async function text2image(prompt, serverEndpoint) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    };
    try {
      const serverResponse = await fetch(serverEndpoint, requestOptions);
      const buffer = await serverResponse.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");
      console.log(base64Image);
      SetReturnImage(base64ToImageObjectURL(base64Image));
      console.log(serverResponse.body);
    } catch (error) {
      console.log("Something wrong happened when requesting for text2image: " + error);
    }
  }
  function base64ToImageObjectURL(base64String) {
    // Convert base64 string to ArrayBuffer
    // base64String = "data:image/png;base64," + base64String;
    const binaryString = atob(base64String);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create Blob from ArrayBuffer
    const blob = new Blob([bytes], { type: "image/jpeg" }); // Adjust the type based on your image format

    // Create object URL from Blob
    const objectURL = URL.createObjectURL(blob);

    // const link = document.createElement("a");
    // link.download = "output.jpg";
    // link.href = objectURL;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(objectURL);
    return objectURL;
  }

  return (
    <div>
      <Navbar name="Stable Diffusion" />
      <div class="flex justify-center h-screen">
        <div class="w-4/6 flex-col">
          <Searchbar onSearch={searchHandler} onChange={onChangeHandler} />

          <div class="mt-8 h-4/6">
            <RoundedImageBox selectedImage={returnImage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StableDiffusion;
