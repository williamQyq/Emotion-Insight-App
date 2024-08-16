## What is RAGNewsBoy 📆

RAGNewsBoy aims to develop a new type of recommendation systems that provide users with relevant technology news, articles, videos, and academic papers based on their search prompts. This system will offer high-level insights by intelligently curating and presenting content that aligns with the user's interests and queries.

## Project Overview

- **Arxiv RAG Server**: Located in `rag-server/`, this module handles related works for the RAG server.
- **Front-End UI**: The user interface is in `arxiv-qa/`.
- **Audio Transcribe Demo**: Found in `audio-transcribe/`, this demo app leverages Hugging Face's Transformer models for audio transcription.

## To Begin With

### arXiv RAG QA

1. Prepare the dataset contains arXiv papers info.

   > Install the required packages:
   >
   > ```bash
   > #cwd: rag-server/
   > pip install -r requirements.txt
   > ```

- Or use the `environment.yaml` to create a conda environment.

   > Prepare the `arxiv-metadata-oai-snapshot.json`, which contains 2.5M rows of arxiv data:
   >
   > ```bash
   > bash setup.sh
   > ```

2. Milvus vector database

   > Using Docker:
   >
   > ```bash
   > # start docker
   > bash rag-server/docker/standalone_embed.sh start
   > 
   > # to stop
   > bash rag-server/milvus_server/standalone_embed.sh stop
   >
   > # to delete volumes
   > bash rag-server/milvus_server/standalone_embed.sh delete
   >
   > ```

3. Load data
   > ```bash
   > python -m arxiv.data.data_loader --limit {DATA_LIMIT}
   > ```

4. Demo
   > ```bash
   > python -m arxiv_app
   > ```

## Launch web 

```bash
# cwd: arxiv-qa/
npm run dev
```

### References

- [How to setup ESLint and Prettier for your React apps](https://dev.to/thomaslombart/how-to-setup-eslint-and-prettier-for-your-react-apps-1n42)
