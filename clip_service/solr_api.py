import requests
import json
from datasets import load_dataset
import urllib
import PIL.Image
import pandas as pd
import requests
from datasets.utils.file_utils import get_datasets_user_agent
import io

class SolrAPI():
  def __init__(self, solr_url="http://localhost:8983/solr", core_name = "/images"):
    self.solr_url = solr_url
    self.core_name = core_name
    self.check_connection()

  def check_connection(self):
    try:
      response = requests.get(self.solr_url)
      print("SOLR Server Connection Success:" ,response.status_code)
    except Exception as e:
      print("Connection check failed, Error Code: ", e)
  
  def create_document(self, json_object):
    endpoint = self.solr_url+self.core_name+"/update/json/docs?commit=true"
    # print(endpoint)
    headers = {
      'Content-Type': 'application/json'
    }
    try:
      response = requests.request("POST", endpoint, headers=headers, data=json_object)
      # print(response)
      # print("Data Successfully added: "+ str(response.status_code))
    except Exception as e:
      print("Failed to add document: ", e)
  
  def delete_document_id(self, id):
    endpoint = self.solr_url+self.core_name+"/update?commit=true"
    json_object = json.dumps({
      "delete": {"id": id}
    })
    headers = {
      'Content-Type': 'application/json'
    }
    try:
      response = requests.request("POST", endpoint, headers=headers, data=json_object)
      print("Data Successfully deleted: "+ str(response.status_code))
    except Exception as e:
      print("Failed to add document: ", e)
  
  def read_document_knn(self, knn_vector, no_images):
    endpoint = self.solr_url + self.core_name + "/select?fl=url"
    headers = {
      'Content-Type': 'application/json'
    }
    vector_string = ",".join(str(x) for x in knn_vector)
    json_object = json.dumps({
      "query": "{!knn f=vector_512 topK="+str(no_images)+"}["+vector_string+"]"
    })
    try:
      response = requests.request("GET", endpoint, headers=headers, data=json_object)
      response_data = response.json()['response']
      return response_data
      
    except Exception as e:
      print("Error when querying for document: ", e)

    
    




# solrapi_instance.delete_document_id("2dfc307e-9dee-4d7f-84e7-f5dbf0a5d4c5")


