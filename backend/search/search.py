import copy
import os
import pickle
from collections import Counter

from sentence_transformers import SentenceTransformer
from docarray import BaseDoc
from docarray.typing import NdArray
from docarray import DocList
import numpy as np
from vectordb import InMemoryExactNNVectorDB, HNSWVectorDB
from sklearn.feature_extraction.text import TfidfVectorizer
from attrs import define
from typing import Any, Dict
import torch
from .rank_net import RankNet


# Load LTR model
ltr_model = RankNet(1539)  # 768 * 2 + 3
ltr_model.load_state_dict(torch.load('search/model.pt'))
ltr_model.eval()

class ToyDoc(BaseDoc):
  text: str = ''
  file: str = ''
  embedding: NdArray[768]

db = InMemoryExactNNVectorDB[ToyDoc](workspace='./workspace_path')

# model = SentenceTransformer('all-MiniLM-L6-v2')
model = SentenceTransformer('all-mpnet-base-v2')

every_word = set()
db_list = []
class Document:
    def __init__(self, name, raw):
        # set name to first line of file
        name = raw.split("\n")[0]
        # Remove first line from file
        raw = "\n".join(raw.split("\n")[1:])

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

documents = {}
vectorizer = TfidfVectorizer()
def read_text_files_in_folder(folder_path):
    if not os.path.exists(folder_path):
        folder_path = "backend/" + folder_path
    for filename in os.listdir(folder_path):
        print(filename)
        with open(os.path.join(folder_path, filename), 'r') as f:
            doc = Document(filename, f.read())
            documents[doc.name] = doc

    docs_content = [' '.join(doc.content) for doc in documents.values()]
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
    embedding: Any = None


# Logging
logging = {}
latest_search = None
# Get highest index in logging folder
logging_index = 0
for filename in os.listdir('logging/clicks'):
    logging_index = max(logging_index, int(filename.split('.')[0]))
logging_index += 1

def log_search(link: str):
    # Add a new line to logging/searches.txt
    with open('logging/searches.txt', 'a') as file:
        file.write(link + '\n')

def log_click(link: str):
    global latest_search, logging_index
    # Save click logs to file
    if latest_search is not None:
        log = copy.deepcopy(latest_search)
        log['link'] = link
        path = 'logging/clicks/' + str(logging_index) + '.pickle'
        with open(path, 'wb') as file:
            pickle.dump(log, file)
    logging_index += 1

def cosine(query_embedding, word):
    return np.dot(query_embedding, word) / (np.linalg.norm(query_embedding) * np.linalg.norm(word))

def apply_bold(result, query, query_embedding):
    # Only bold words that are in the query
    # Ignore grammar and capitalization for bolding
    # Also ignore filler words, like and, a, the, that, etc.
    desc = result['description']

    # Get each sentence in desc
    sentences = desc.split('.')
    sentence_cosine_similarities = {sentence: cosine(query_embedding, model.encode(sentence)) for sentence in sentences}
    # Sort sentences by cosine similarity
    sentences = sorted(sentences, key=lambda x: sentence_cosine_similarities[x], reverse=True)
    # Bold the first sentence
    if sentence_cosine_similarities[sentences[0]] > 0.2:
        sentences[0] = '<b>' + sentences[0] + '</b>'
    result['description'] = '.'.join(sentences)
    return result

def search(query: str):
    log_search(query)
    keywords = query.split()
    keyword_results = [doc for doc in documents.values() if doc.keyword_match(keywords)]

    # Use document embeddings for semantic search with ScanN
    query_embedding = model.encode(query)
    query_doc = ToyDoc(text='query', embedding=query_embedding)
    results = db.search(inputs=DocList[ToyDoc]([query_doc]), limit=10)

    combined_results = {}
    for m in results[0].matches:
        cosine_similarity = np.dot(query_embedding, m.embedding) / (np.linalg.norm(query_embedding) * np.linalg.norm(m.embedding))
        if m.file not in combined_results or cosine_similarity > combined_results[m.file].cosine_similarity:
            combined_results[m.file] = Result(content1=m.text, cosine_similarity=cosine_similarity, embedding=m.embedding)

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

    results = [{'link': doc[0], 'description': doc[1].content1 or doc[1].content2, 'embedding': doc[1].embedding} for doc in combined_results[:50]]

    # Internal logging
    global logging, latest_search
    latest_search = {'query': query, 'query_embedding': query_embedding, 'results': [{'link': doc[0], 'description': doc[1].content1 or doc[1].content2, 'embedding': doc[1].embedding, 'cosine_score': doc[1].cosine_similarity, 'tf_idf_score': doc[1].tf_idf_similarity, 'score': doc[1].score} for doc in combined_results[:10]]}
    logging[query] = latest_search['results']

    results = copy.deepcopy(latest_search)['results']

    # Apply bolding
    results = [apply_bold(result, query, query_embedding) if index < 5 else result for index, result in enumerate(results)]

    # Put results through LTR model
    for result in results:
        if result['embedding'] is None:
            result['embedding'] = np.zeros(768)
    values = []
    for result in results:
        values.append([torch.tensor(query_embedding), torch.tensor(result['embedding']), torch.tensor([result['score']]), torch.tensor([result['tf_idf_score'] or 0]), torch.tensor([result['cosine_score'] or 0])])
    values = [torch.cat(value).float() for value in values]
    values = torch.stack(values)
    scores = ltr_model.inference(values)
    scores = scores.detach().numpy()

    # Sort results by LTR score
    results = sorted(results, key=lambda x: scores[results.index(x)], reverse=True)

    # Remove embedding
    for result in results:
        del result['embedding']

    return results

# Read from logging/searches.txt
with open('logging/searches.txt', 'r') as file:
    previous_searches = file.read().split('\n')
    # Use Counter
    previous_searches = Counter(previous_searches)

def autocomplete(query):
    searches = [c for c in previous_searches if c.startswith(query)]
    return searches[:10]

print("\n\nSEARCHING!!\n")
search("How to make a cake")