import ujson
from pymilvus import (
    connections,
    FieldSchema, CollectionSchema, DataType,
    Collection,
    utility,
    model
)
from tqdm.auto import tqdm

# Milvus server address
_HOST = '127.0.0.1'
_PORT = '19530'

# Collection parameters
_COLLECTION_NAME = 'demo'
_ARXIV_ID_FIELD = 'arxiv_id'
_VECTOR_FIELD = 'embedding'
_ABSTRACT_FIELD = 'abstract'
_CATEGORY_FIELD = 'category'
_JSON_FILE_PATH = 'arxiv-metadata-oai-snapshot.json'

# Vector parameters
_DIM = 768
_INDEX_FILE_SIZE = 32  # max file size of stored index

# Index parameters
_METRIC_TYPE = 'L2'
_INDEX_TYPE = 'IVF_FLAT'
_NLIST = 1024
_NPROBE = 10
_TOPK = 2


# Create a Milvus connection
def create_connection(alias="default"):
    print(f"\nCreate connection...")
    connections.connect(alias =alias, host=_HOST, port=_PORT)
    print(f"\nList connections:")
    print(connections.list_connections())

def close_connection():
    connections.disconnect("default")

# Create a collection named 'demo'
def create_collection(name):
    fields = [
        FieldSchema(name='id',dtype=DataType.INT64,is_primary=True,auto_id=True),
        FieldSchema(name=_ARXIV_ID_FIELD, dtype=DataType.VARCHAR, max_length=30, description="arxiv_id", is_primary=False),
        FieldSchema(name=_VECTOR_FIELD, dtype=DataType.FLOAT_VECTOR, description="embedding", dim=_DIM, is_primary=False),
        FieldSchema(name=_ABSTRACT_FIELD, dtype=DataType.VARCHAR, max_length=2000, description="abstract"),
        FieldSchema(name=_CATEGORY_FIELD, dtype=DataType.VARCHAR, max_length=128, description="category")
    ]
    schema = CollectionSchema(fields=fields, description="arxiv papers collection")
    collection = Collection(name=name, schema=schema)
    print("\nCollection created:", name)
    return collection


def has_collection(name):
    return utility.has_collection(name)


# Drop a collection in Milvus
def drop_collection(name):
    collection = Collection(name)
    collection.drop()
    print("\nDrop collection: {}".format(name))

# List all collections in Milvus
def list_collections():
    print("\nList collections:")
    print(utility.list_collections())


def insert(collection, data):
    arxiv_ids = [item['arxiv_id'] for item in data]
    embeddings = [item['embedding'] for item in data]
    abstracts = [item['abstract'] for item in data]
    categories = [item['category'] for item in data]
    entities = [arxiv_ids, embeddings, abstracts, categories]
    collection.insert(entities)
    return embeddings


def get_entity_num(collection):
    print("\nThe number of entity:")
    print(collection.num_entities)


def create_index(collection, field_name):
    index_param = {
        "index_type": _INDEX_TYPE, #Embedding index
        "params": {"nlist": _NLIST},
        "metric_type": _METRIC_TYPE} # L2 distance
    collection.create_index(field_name, index_param)
    print("\nCreated index:\n{}".format(collection.index().params))


def drop_index(collection):
    collection.drop_index()
    print("\nDrop index successfully")


def load_collection(collection):
    collection.load()


def release_collection(collection):
    collection.release()


def search(collection, vector_field, search_vectors):
    # load to memory
    load_collection(collection)
    
    # results = collection.search(**search_param)
    results = collection.search(
        data=search_vectors,
        anns_field=vector_field,
        param={"metric_type": _METRIC_TYPE, "params": {"nprobe": _NPROBE}},
        limit=_TOPK,
        output_fields=[_ARXIV_ID_FIELD, _ABSTRACT_FIELD]
    )
    
    for i, result in enumerate(results):
        print("\nSearch result for {}th vector: ".format(i))
        for j, res in enumerate(result):
            print("Top {}: {}".format(j, res))
    
    # release memory
    release_collection(collection)
    
    return results

def set_properties(collection):
    collection.set_properties(properties={"collection.ttl.seconds": 18000})


def read_json(file_path, chunk_size = 100, limit = 20000):
    """
        Handle large JSON files by reading in chunks
    """
    num_rows = sum(1 for _ in open(file_path))
    
    buffer = []
    
    with open(file_path, 'r') as f:
        for i, line in enumerate(tqdm(f, total= limit if limit else num_rows,desc="Processing JSON lines")):
            # break if limit is set and reached
            if limit and i>=limit:
                break
            
            buffer.append(line.strip())
            if len(buffer) >= chunk_size:
                try:
                    yield [ujson.loads(item) for item in buffer]
                except ujson.JSONDecodeError as e:
                    print(f"Error in line {i}: {e}")
                buffer = []
        if buffer:
            try:
                yield [ujson.loads(item) for item in buffer]
            except ujson.JSONDecodeError as e:
                    print(f"Error in line {i}: {e}")
            buffer = []

def get_embedding(inputs):
    embeddings = model.DefaultEmbeddingFunction().encode_documents(inputs)
    return embeddings

def main():
    # create a connection
    create_connection()

    # drop collection if the collection exists
    if has_collection(_COLLECTION_NAME):
        drop_collection(_COLLECTION_NAME)

    # create collection
    if not has_collection(_COLLECTION_NAME):
        collection = create_collection(_COLLECTION_NAME)
    else:
        collection = Collection(_COLLECTION_NAME)
        
    # alter ttl properties of collection level
    set_properties(collection)

    # show collections
    list_collections()

    # read data from arxiv.json
    arxiv_data = read_json(_JSON_FILE_PATH)

    embeddings = model.DefaultEmbeddingFunction().encode_documents([paper['abstract'] for paper in arxiv_data])
    # prepare data for insertion
    data = [{
        'arxiv_id': paper['id'],
        'embedding': embeddings[i],
        'abstract': paper['abstract'],
        'category': paper['categories']
    } for i,paper in enumerate(arxiv_data)]

    # insert data
    embeddings = insert(collection, data)

    collection.flush()

    # get the number of entities
    get_entity_num(collection)

    # create index
    create_index(collection, _VECTOR_FIELD)

    # load data to memory
    load_collection(collection)

    question = ["what are the articles about perturbative quantum?"]
    embeddings = model.DefaultEmbeddingFunction().encode_queries(question)
    # search
    search(collection, _VECTOR_FIELD, embeddings)

    # release memory
    release_collection(collection)

    # drop collection index
    drop_index(collection)

    # drop collection
    drop_collection(_COLLECTION_NAME)


if __name__ == '__main__':
    main()
