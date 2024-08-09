# Arxiv QA Agent
Author: Yuqing Qiao  
Date: 08/05/2024

## Project Overview

- **Arxiv RAG Server**: Located in `rag-server/`, this module handles related works for the RAG server.
- **Front-End UI**: The user interface is in `arxiv-qa/`.
- **Audio Transcribe Demo**: Found in `audio-transcribe/`, this demo app leverages Hugging Face's Transformer models for audio transcription.

## To Begin With

1. **Download the arxiv-metadata set from Kaggle**  
    cwd: rag-server/
   - Install the required packages using pip:
     ```bash
     pip install -r requirements.txt
     ```
   - Or use the `environment.yaml` to create a conda environment.

2. **Prepare the arxiv-metadata-oai-snapshot**  
    cwd: rag-server/
   - Run `setup.sh` to prepare the `arxiv-metadata-oai-snapshot.json`, which contains 2.5M rows of arxiv data:
     ```bash
     bash setup.sh
     ```

3. **Start the Milvus DB**  
    cwd: rag-server/
   - Start the Milvus database using Docker Compose:
     ```bash
     cd ./milvus_server && docker compose up
     ```
   - Or, to run the Docker container manually:
     ```bash
     bash rag-server/milvus_server/standalone_embed.sh start
     ```

   - To stop the volume:
     ```bash
     bash rag-server/milvus_server/standalone_embed.sh stop
     ```

   - To delete the volume:
     ```bash
     bash rag-server/milvus_server/standalone_embed.sh delete
     ```

4. **Initialize the Database and Load Data**  
    CWD: `rag-server/`
   - The database is now initialized with empty entities. You may set the data limit to limit the number of data to be loaded in the data_loader.py. To load the dataset from `.json`,  
    use the data loader:
     ```bash
     python -m src.data_loader
     ```

5. **Run the RAG Paper Demo**

   - To run the RAG paper demo, execute the following command in the `rag-server` directory:
     ```bash
     python -m app
     ```

## Project Files Overview

- **`server.py`**: Hosts the API to retrieve arxiv paper data and answer prompt questions.

- **`app.py`**: Handles the RAG model's response to user prompts, providing a UI and hosting through Gradio.

### React Front-end: `arxiv-qa/`

- **Prettier & ESLint Setup Reference**:  
  [How to setup ESLint and Prettier for your React apps](https://dev.to/thomaslombart/how-to-setup-eslint-and-prettier-for-your-react-apps-1n42)
