export function base64ToImageObjectURL(base64String) {
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
  // link.download = "output.jpg";
  // link.href = objectURL;
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
  // URL.revokeObjectURL(objectURL);
  return objectURL;
}