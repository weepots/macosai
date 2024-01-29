export default function FileUploadButton(props) {
  function changeHandler(event) {
    if (event.target.files.length > 0) {
      props.setSelectedImage(URL.createObjectURL(event.target.files[0]));
    }
  }

  return (
    <div class="space-y-8 max-w-md ml-5 py-3">
      <input
        type="file"
        class="w-full text-black text-base bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded"
        onChange={changeHandler}
      />
    </div>
  );
}
