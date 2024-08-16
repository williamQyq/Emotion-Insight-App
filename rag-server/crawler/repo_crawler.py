from crawl4ai import WebCrawler
from crawl4ai.extraction_strategy import LLMExtractionStrategy
from pydantic import BaseModel, Field
from .config import openai_api_key


class GithubRepoGraphRAG(BaseModel):
    repo_name: str = Field(..., description="Name of the repo.")
    description: str = Field(..., description="project description.")
    stars: str = Field(..., description="number of stars.")


def crawl_github_repo_graphrag():
    url = "https://github.com/search?q=graphrag&type=repositories"
    crawler = WebCrawler()
    crawler.warmup()

    result = crawler.run(
        url=url,
        word_count_threshold=1,
        extraction_strategy=LLMExtractionStrategy(
            provider="openai/gpt-4o-mini",
            api_token=openai_api_key,
            schema=GithubRepoGraphRAG.model_json_schema(),
            extraction_type="schema",
            instruction=(
                "From the crawled content, extract all mentioned repository "
                "names along with their stars and repo description. "
                "Do not miss any repo in the entire content. "
                "One extracted model JSON format should look like this: "
                "{'repo_name': 'microsoft/graphrag', 'stars': '14,600', "
                "'description':'A modular graph-based Retrieval-Augmented "
                "Generation (RAG) system'}."
            ),
        ),
        bypass_cache=True,
    )

    return result.extracted_content
