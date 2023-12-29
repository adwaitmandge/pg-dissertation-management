from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as palm
import requests

from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.embeddings import GooglePalmEmbeddings
from langchain.llms import GooglePalm


def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text


def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks


def get_vectorstore(text_chunks):
    embeddings = GooglePalmEmbeddings()
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore


def get_conversation_chain(vectorstore):
    llm = GooglePalm(temperature=0.1, max_output_tokens=2048)
    memory = ConversationBufferMemory(
        memory_key='chat_history', return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )

    return conversation_chain


def handle_userinput(user_question, conversation):
    response = conversation({"question": user_question})
    chat_history = response['chat_history']

    return chat_history[1].content


def main(user_question):
    load_dotenv()
    pdf_docs = [r'app/uploaded_file.pdf']
    raw_text = get_pdf_text(pdf_docs)
    text_chunks = get_text_chunks(raw_text)
    vectorstore = get_vectorstore(text_chunks)
    conversation = get_conversation_chain(vectorstore)
    if user_question:
        return handle_userinput(user_question, conversation)


palm.configure(api_key="AIzaSyAb7bJOlZHuux5i7OpDr8X7zf2J2pMlv5A")
models = [
    m for m in palm.list_models() if "generateText" in m.supported_generation_methods
]

for m in models:
    print(f"Model Name: {m.name}")
model = models[0].name


app = FastAPI()

origins = [
    "http://localhost:3002",
    "http://localhost:3002",  # Add both with and without trailing slash
]

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


@app.options("/answer", include_in_schema=False)
async def options_answer():
    return {}


@app.post("/answer")
async def get_answer(request: Request):
    body = await request.json()
    print(body['messages'][-1]['content'])
    prompt = f"""
    Your task is to act as a Scientific Bot. Answer the following question with scientifically correct information.
    {body['messages'][-1]['content']}
    """
    answer = palm.generate_text(
        model=model,
        prompt=prompt,
        temperature=0.3,
        # The maximum length of the response
        max_output_tokens=800,
    )
    return {"answer": answer.result}


@app.post("/pdfupload")
async def upload_pdf(request: Request):
    body = await request.json()
    cloudinary_url = body['url']
    response = requests.get(cloudinary_url)
    if response.status_code == 200:
        file_content = response.content
        with open('app/uploaded_file.pdf', 'wb') as file:
            file.write(file_content)
        return {"status": response.status_code}
    else:
        print(f'Failed to fetch the file. Status code: {response.status_code}')
        return {"status": response.status_code}


@app.post("/getanswer")
async def get_pdf_answer(request: Request):
    body = await request.json()
    print(body)
    user_question = body['question'][-1]['content']
    # user_question = body['question']
    result = main(user_question)
    print(f"result: {result}")
    return {"answer": result}
