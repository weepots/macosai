import React, {useEffect, useState} from "react"
import axios from "axios"

import Navbar from "../components/Navbar"
import RoundedDarkButton from "../components/ui/RoundedDarkButton"
import RoundedImageBox from "../components/ui/RoundedImageBox"
import RoundedLightButton from "../components/ui/RoundedLightButton"
import FileUploadButton from "../components/ui/FileUploadButton"
import { Buffer } from "buffer"
import { serverAddress } from "../Constants"
import { base64ToImageObjectURL } from "../helpers"

function BackgroundRemover () {
  const [selectedImage, setSelectedImage] = useState(null);
  const [returnImage, SetReturnImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect (()=>{}, [selectedImage])
  useEffect (()=>{}, [returnImage])
  useEffect(()=>{},[isLoading])

  async function convertAndSend(objectURL, serverEndpoint){
    const response = await fetch(objectURL);
    const blob = await response.blob();

    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
    setIsLoading(true)
    try{
      const options = {
        headers:{
          "Content-Type":"application/json"
        },
        responseType:"arraybuffer"
      }
      // const requestOptions = {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     image: base64Data,
      //   }),
      // };
      const serverResponse = await axios.post(serverEndpoint,{image:base64Data}, options)
      // const serverResponse = await fetch(serverEndpoint, requestOptions);
      // const buffer =await serverResponse.arrayBuffer()
      const base64Image = Buffer.from(serverResponse.data).toString("base64");
      SetReturnImage(base64ToImageObjectURL(base64Image))
      setIsLoading(false)
    } catch (error){
      console.log("Error when sending image to background Remove: " + error)
    }
  }

  function uploadHander(){
    const endpoint = serverAddress.servers.coreml+serverAddress.routes.backgroundRemove
    convertAndSend(selectedImage, endpoint)
  }



  return(
    <div class="h-dvh">
      <Navbar name="Background Remover"/>
      <div class="flex flex-row space-x-20 justify-center px-10 w-100vw h-4/6">
        <div class="flex flex-col justify-center w-3/6 h-full">
          <RoundedImageBox selectedImage={selectedImage} />
          <div class="flex flex-row">
            <FileUploadButton setSelectedImage={setSelectedImage} selectedImage={selectedImage} />
            <RoundedDarkButton text="Upload" onClick={uploadHander} />
          </div>
        </div>
        <div class="flex flex-col justify-center w-3/6 h-full">
          <RoundedImageBox selectedImage={returnImage} loadState = {isLoading} />
          <RoundedLightButton text="Super Resolution" />
        </div>
      </div>
    </div>

  )
}

export default BackgroundRemover