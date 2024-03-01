from clip_service import ClipAPI
from solr_api import SolrAPI
import json
from datasets import load_dataset
import urllib
import PIL.Image
import pandas as pd
from datasets.utils.file_utils import get_datasets_user_agent
import io
from tqdm import tqdm
from flask import Flask, request

app = Flask(__name__)
clipapi_instance = ClipAPI()
solrapi_instance = SolrAPI()
tqdm.pandas()


@app.route("/")
def home():
    return "Hello, World!"

@app.route("/search/text2image", methods = ['GET'])
def text2image_query():
  args = request.args
  text = args.get("q")
  no_images = args.get("images")
  text_embedding_vector = clipapi_instance.get_single_text_embedding(text)[0].tolist()
  return solrapi_instance.read_document_knn(knn_vector =text_embedding_vector, no_images=no_images)

@app.route("/search/image2image", methods=['POST'])
def image2image_query():
  return {image2image_query}

@app.route("/add_data_db", methods = ['GET'])
def data_loader():
  args = request.args
  start = int(args.get("start"))
  stop = int(args.get("stop"))
  USER_AGENT = get_datasets_user_agent()
  def fetch_single_image(image_url, timeout=None, retries=0):
    for _ in range(retries + 1):
        try:
            request = urllib.request.Request(
                image_url,
                data=None,
                headers={"user-agent": USER_AGENT},
            )
            with urllib.request.urlopen(request, timeout=timeout) as req:
                image = PIL.Image.open(io.BytesIO(req.read())).convert("RGB")
            break
        except Exception as e:
            # print(str(e))
            image = "None"
    return image
  def row_wise_create_doc (row):
    retrieved_image = fetch_single_image(row['image_url'])
    if retrieved_image != "None":
      vector_512 =  clipapi_instance.get_single_image_embedding(retrieved_image)[0].tolist()
      json_object = json.dumps({
        "url":str(row['image_url']),
        "id":"CC"+str(row["id"]),
        "caption": str(row['caption']),
        "vector_512": vector_512
      })
    #  "vector_512": clipapi_instance.get_single_image_embedding(row['PIL_Image'])
      solrapi_instance.create_document(json_object)

  image_data = load_dataset("conceptual_captions", split="train")
  image_data_df = pd.DataFrame()
  image_data_df['image_url'] = image_data['image_url'][start:stop]
  image_data_df['caption'] = image_data['caption'][start:stop]
  image_data_df['id'] = image_data_df.index
  image_data_df['id'] += start
  # image_data_df['PIL_Image'] = image_data_df['image_url'].apply(fetch_single_image)
  # image_data_df = image_data_df[image_data_df['PIL_Image'] != "None"]
  image_data_df.progress_apply(row_wise_create_doc, axis=1)
  return {"message":"success add from dataset to DB"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

# text = "A girl"
# text_embedding_vector = clipapi_instance.get_single_text_embedding(text)[0].tolist()
# print(solrapi_instance.read_document_knn(text_embedding_vector))
