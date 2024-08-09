import src.milvus_utils as mu

def drop_collection():
    mu.create_connection()
    collection = mu.Collection(mu._COLLECTION_NAME)
    mu.list_collections()
    collection.drop()
  
  
  
def create_index():
    mu.create_connection()
    collection = mu.Collection(mu._COLLECTION_NAME)
    collection.flush()
    mu.create_index(collection, mu._VECTOR_FIELD)
if __name__ == '__main__':
    drop_collection()