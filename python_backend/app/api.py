from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from bardapi import BardCookies

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

cookie_dict = {
    "__Secure-1PSID": "awj5L2QnJD76tAC22YboOxZxPf45BWtAFzrvqQHMp16wp5hMyuAraFDqTRaHo_oLLZZFcg.",
    "__Secure-1PSIDTS": "sidts-CjIB3e41hTU67T1y9KT34kcsiEnApq-ZiV-u6oVjuKWZGm75AGSc7zEwqhNJMBZNT9aAVRAA",
    # Any cookie values you want to pass as a session object.
}

bard = BardCookies(cookie_dict=cookie_dict)

@app.options("/answer", include_in_schema=False)
async def options_answer():
    return {}

@app.post("/answer")
async def get_answer(request :Request):
    body=await request.json()
    print(body['messages'][-1]['content'])
    prompt = f"""
    Your task is to act as a Scientific Bot. Answer the following question with scientifically correct information.
    {body['messages'][-1]['content']}
    """
    answer = bard.get_answer(prompt)
    return {"answer": answer["content"]}
