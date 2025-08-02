# app/langchain_utils/chatbot.py

import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=groq_api_key
)

def query_groq(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",  # Or llama3-70b-8192 or mixtral
            messages=[
                {"role": "system", "content": "You are a helpful financial assistant. Format all responses using markdown (e.g., bullet points, bold, code blocks) to enhance clarity. Keep responses concise and friendly."},

                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"
