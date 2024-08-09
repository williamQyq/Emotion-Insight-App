import gradio as gr
import requests
import src.milvus_manager as mm
import src.milvus_utils as mu
import asyncio

manager = mm.MilvusManager()

# Function to get response from the first processing block
def process_input_1(user_input):
    response = asyncio.run(manager.get_naive_rag(user_input,rag_enable=True))
    print("process input 1:", response)
    return response

# Function to get response from the second processing block
def process_input_2(user_input):
    response = asyncio.run(manager.get_naive_rag(user_input,rag_enable=False))
    return response


# Gradio interface
def interface():
    with gr.Blocks() as demo:
        gr.Markdown("### Arxiv Search Engine demo")

        with gr.Row():
            with gr.Column(scale=7):
                input_box = gr.Textbox(label="Question", placeholder="Enter your questions here...",lines= 3)
            with gr.Column(scale=1):
                send_button = gr.Button("Send")
            
        with gr.Row():
            output_box_1 = gr.Textbox(label="RAG",lines= 10)
            output_box_2 = gr.Textbox(label="Without RAG",lines = 10)

        send_button.click(fn=process_input_1, inputs=input_box, outputs=output_box_1)
        send_button.click(fn=process_input_2, inputs=input_box, outputs=output_box_2)
    
    return demo

demo = interface()
demo.launch(share=True)
