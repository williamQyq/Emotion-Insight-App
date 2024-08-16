import os
import openai
from dataclasses import dataclass
from typing import List

import src.milvus_utils as mu
from pymilvus import Collection
from src.prompt_template import question_prompt,native_prompt 

# openai api key
openai.api_key = os.getenv('OPENAI_API_KEY')

# DB schema
@dataclass
class Paper:
    arxiv_id:str
    abstract:str
    category:str
    embedding:List[float]   #Metric embedding

class MilvusManager:
    def __init__(self,collection_name) -> None:
        mu.create_connection()
        mu.list_collections()
        if not mu.has_collection(collection_name):
            mu.create_collection(collection_name)
        else:
            self.collection = Collection(collection_name)
            mu.set_properties(self.collection)
       
    async def get_naive_rag(self, inputs:str, rag_enable=True)->str:
        #search similarities
        search_embeddings = mu.get_embedding([inputs])
        
        results = mu.search(self.collection, mu._VECTOR_FIELD, search_embeddings)
        
        documents = []
        for i, hits in enumerate(results):
            print(f"Document {i} has a similarity score")
            for i,hit in enumerate(hits):
                doc_str = f"ID: {hit.entity.get(mu._ARXIV_ID_FIELD)}, Abstract: {hit.entity.get(mu._ABSTRACT_FIELD)}, Category: {hit.entity.get(mu._CATEGORY_FIELD)}"
                print("Document:"+"-"*20,doc_str)
                documents.append(doc_str)
                if(i==0):
                    break
        
        combined_document = "\n".join(documents)
        if rag_enable:
            rag_prompt = question_prompt.format(
                document = combined_document,
                question = inputs
            )
        else:
            rag_prompt = native_prompt.format(
                question = inputs
            )
        
        response = await self.prompt_llm(rag_prompt)
        return response
        
    async def prompt_llm(self, prompt:str)->str:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            n=1,
            stop=None,
            temperature=0.5
        )
        return response.choices[0].message.content.strip()
    
    def get_graph_rag(self, input:str)->str:
        # 
        return 
    
    def save_arxiv_documents(self, limit, file_path=mu._JSON_FILE_PATH):
        assert mu.has_collection(self.collection_name), "Collection does not exist"
        
        for docs in mu.read_json(file_path, limit=limit):
            assert len(docs) > 0, "No documents found"
            try: 
                embeddings = mu.get_embedding([paper['abstract'] for paper in docs])
                data = [ Paper(
                    paper['id'], 
                    paper['abstract'], 
                    paper['categories'], 
                    embeddings[i]) for i,paper in enumerate(docs)]
                
                mu.insert(self.collection, data)
                print('-'*50)
                print("Documents saved:",data)
                
            except Exception as e:
                print("Error in saving documents", e)
                print('*'*50+"Skipping Chunk")
        
        # consistency collection to disk
        self.collection.flush()
        mu.create_index(self.collection, mu._VECTOR_FIELD)
        
    
    def __del__(self):
        # clean up
        mu.close_connection()