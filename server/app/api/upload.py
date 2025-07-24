from fastapi import APIRouter, File, UploadFile
import pandas as pd
import pdfplumber
import os

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename.lower()
    contents = await file.read()

    if filename.endswith(".csv"):
        df = pd.read_csv(pd.compat.StringIO(contents.decode()))
        return {"status": "parsed", "columns": df.columns.tolist()}
    
    elif filename.endswith(".pdf"):
        with open("temp.pdf", "wb") as f:
            f.write(contents)

        data = []
        with pdfplumber.open("temp.pdf") as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                data.append(text)
        
        os.remove("temp.pdf")
        return {"status": "parsed", "pages": len(data), "sample": data[0][:300]}
    
    return {"error": "Unsupported file type"}
