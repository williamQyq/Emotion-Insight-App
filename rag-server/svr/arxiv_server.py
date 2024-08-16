from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import arxiv.vectordb.milvus_manager as mm
import os

_PORT = os.getenv("SERVER_PORT")

app = FastAPI()
manager = mm.MilvusManager()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/papers/prompt/{grahrag}")
async def get_prompt_rag_response(graphrag: bool, input: str):
    """
    Get RAG response to questions
    """
    if graphrag:
        response = manager.get_graph_rag(input)
    else:
        response = await manager.get_naive_rag(input)
    return response


@app.get("/papers/paper/{paper_id}")
async def get_paper(paper_id: str):
    """
    Get papers
    """
    response = await manager.get_paper(paper_id)
    return response


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=_PORT)
