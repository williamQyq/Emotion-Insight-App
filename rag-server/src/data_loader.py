import src.milvus_manager as mm
import src.milvus_utils as mu

# Limit the number of papers to load
LIMIT = 5000

def reload_paper_data():
    """
    Reloads the paper data from the arxiv.json file
    """
    manager = mm.MilvusManager(mu._COLLECTION_NAME)
    # drop collection if the collection exists
    
    manager.save_arxiv_documents(limit=LIMIT)
    print("Arxiv documents saved")

if __name__ == '__main__':
     # clean up collection before reloading
    if mu.has_collection(mu._COLLECTION_NAME):
        mu.drop_collection(mu._COLLECTION_NAME)

    reload_paper_data()