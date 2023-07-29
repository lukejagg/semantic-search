import os
from sentence_transformers import SentenceTransformer
from docarray import BaseDoc
from docarray.typing import NdArray
from docarray import DocList
import numpy as np
from vectordb import InMemoryExactNNVectorDB, HNSWVectorDB
from sklearn.feature_extraction.text import TfidfVectorizer
from attrs import define

class ToyDoc(BaseDoc):
  text: str = ''
  file: str = ''
  embedding: NdArray[768]


db = InMemoryExactNNVectorDB[ToyDoc](workspace='./workspace_path')

# model = SentenceTransformer('all-MiniLM-L6-v2')
model = SentenceTransformer('all-mpnet-base-v2')

db_list = []
class Document:
    def __init__(self, name, raw):
        self.name = name
        self.raw = raw
        self.content = []
        
        # Create chunks iteratively until max word size is reached, but 1 line at a time
        current_chunk = ""
        for line in raw.split("\n"):
            if len(current_chunk.split(" ")) > 15 and len(current_chunk.strip()) > 0:
                self.content.append(current_chunk)
                current_chunk = ""
            current_chunk += line + " "

        # Add the last chunk
        if len(current_chunk.strip()) > 0:
            self.content.append(current_chunk)
        self.embeddings = [model.encode(chunk) for chunk in self.content]
        
        for chunk, embedding in zip(self.content, self.embeddings):
            db_list.append(ToyDoc(text=chunk, file=name, embedding=embedding))

    def __repr__(self):
        return self.content[0]

    def keyword_match(self, keywords):
        # Simple check for keyword in content
        if any(keyword.lower() in chunk.lower() for keyword in keywords for chunk in self.name.split("_")):
            return True
        return any(keyword.lower() in chunk.lower() for keyword in keywords for chunk in self.content)

documents = []
vectorizer = TfidfVectorizer()
def read_text_files_in_folder(folder_path):
    if not os.path.exists(folder_path):
        folder_path = "backend/" + folder_path
    for filename in os.listdir(folder_path):
        print(filename)
        with open(os.path.join(folder_path, filename), 'r') as f:
            documents.append(Document(filename, f.read()))

    docs_content = [' '.join(doc.content) for doc in documents]
    vectorizer.fit_transform(docs_content)

read_text_files_in_folder('documents')

db.index(inputs=DocList[ToyDoc](db_list))

@define
class Result:
    content1: str | None = None
    content2: str | None = None
    cosine_similarity: float | None = None
    tf_idf_similarity: float | None = None
    score: float = 0

def search(query: str):
    keywords = query.split()
    keyword_results = [doc for doc in documents if doc.keyword_match(keywords)]

    # Use document embeddings for semantic search with ScanN
    query_embedding = model.encode(query)
    query_doc = ToyDoc(text='query', embedding=query_embedding)
    results = db.search(inputs=DocList[ToyDoc]([query_doc]), limit=10)

    combined_results = {}
    for m in results[0].matches:
        cosine_similarity = np.dot(query_embedding, m.embedding) / (np.linalg.norm(query_embedding) * np.linalg.norm(m.embedding))
        if m.file not in combined_results or cosine_similarity > combined_results[m.file].cosine_similarity:
            combined_results[m.file] = Result(content1=m.text, cosine_similarity=cosine_similarity)

    for doc in keyword_results:
        doc_vec = vectorizer.transform([' '.join(doc.content)])
        query_vec = vectorizer.transform([query])
        cosine_similarity = (doc_vec * query_vec.T).A[0][0]

        if doc.name not in combined_results:
            combined_results[doc.name] = Result(content2=doc.content[0], tf_idf_similarity=cosine_similarity)
        elif cosine_similarity > (combined_results[doc.name].tf_idf_similarity or 0):
            combined_results[doc.name].content2 = doc.content[0]
            combined_results[doc.name].tf_idf_similarity = cosine_similarity

    # Set scores
    for file, (doc) in combined_results.items():
        doc.score = (doc.cosine_similarity or 0) + (doc.tf_idf_similarity or 0)
    combined_results = sorted(combined_results.items(), key=lambda x: x[1].score, reverse=True)  # Sort by cosine similarity

    #for file, (doc) in combined_results:
    #    print(file, doc.cosine_similarity, doc.tf_idf_similarity)

    return [{'link': doc[0], 'description': doc[1].content1 or doc[1].content2} for doc in combined_results[:50]]

def autocomplete(*args, **kwargs):
    return ['test']


print("\n\nSEARCHING!!\n")
search("How to make a cake")