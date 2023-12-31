import axios from "axios";
const path = "https://api.cloudinary.com/v1_1/dwgcr1rbq/upload";

const imageUpload = async (img) => {
  const data = new FormData();
  data.append("file", img);
  data.append("upload_preset", "foodweb");
  data.append("clould_name", "dwgcr1rbq");
  const image = await axios.post(path, data);
  return image.data.url;
};

export default imageUpload;
