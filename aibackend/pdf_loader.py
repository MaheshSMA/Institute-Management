from pypdf import PdfReader
import os

def load_all_pdfs(folder="syllabus"):
    documents = []

    for file in os.listdir(folder):
        if file.endswith(".pdf"):
            path = os.path.join(folder, file)
            reader = PdfReader(path)

            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    documents.append({
                        "source": file,
                        "page": i + 1,
                        "text": text
                    })

    return documents
