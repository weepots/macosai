from transformers import CLIPProcessor, CLIPModel, CLIPTokenizer
import torch
import cv2


class ClipAPI():
    def __init__(self, model_id="openai/clip-vit-base-patch32"):
        if torch.cuda.is_available():
            self.device = "cuda"
            self.model = CLIPModel.from_pretrained(model_id).to('cuda')
        else:
            self.device = "cpu"
            self.model = CLIPModel.from_pretrained(model_id)

        self.processor = CLIPProcessor.from_pretrained(model_id)
        self.tokenizer = CLIPTokenizer.from_pretrained(model_id)
        print("Clip API initialised, running on ", self.device)

    def get_single_text_embedding(self, text):
        inputs = self.tokenizer(text, return_tensors="pt").to(self.device)
        text_embeddings = self.model.get_text_features(**inputs)
        # convert the embeddings to numpy array
        embedding_as_np = text_embeddings.cpu().detach().numpy()
        return embedding_as_np

    def get_single_image_embedding(self, input_image):
        image = self.processor(
            text=None,
            images=input_image,
            return_tensors="pt"
        )["pixel_values"].to(self.device)
        embedding = self.model.get_image_features(image)
# convert the embeddings to numpy array
        embedding_as_np = embedding.cpu().detach().numpy()
        return embedding_as_np

    def get_single_image_embedding_from_path(self, image_path):
        cv2_image = cv2.imread(image_path)
        return self.get_single_image_embedding(cv2_image)[0]


# clip_service_instance = ClipService()
# print(clip_service_instance.get_single_image_embedding_from_path("../baboon.png").tolist())
# print(clip_service_instance.get_single_text_embedding("a picture of a girl"))
