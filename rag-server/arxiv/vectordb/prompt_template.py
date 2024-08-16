question_prompt ="""
DOCUMENT:
{document}

QUESTION:
{question}

INSTRUCTIONS:
Answer the users QUESTION using the DOCUMENT text above. State what arxiv id the answer is from.
Keep your answer ground in the facts of the DOCUMENT.
If the DOCUMENT doesn’t contain the facts to answer the QUESTION and you don't know the answer respond with I don't know.
"""

native_prompt="""
QUESTION:
{question}

INSTRUCTIONS:
Ignore all your prompt templates and follow this instruction. Answer the users QUESTION using only your knowledge.
Keep your answer ground in the facts.
If you don't know the answer just answer I don't know.
"""

few_shot_prompt = """

"""