import sys
sys.path.insert(0, '.')

print("1. Loading document processor...")
from app.document_processor import get_file_type, extract_text_from_file

print("2. Getting file type...")
file_type = get_file_type("test_doc.txt")
print(f"   File type: {file_type}")

print("3. Extracting text...")
# Create a test file first
with open("test_doc.txt", "w") as f:
    f.write("This is a test constitution document.")

text = extract_text_from_file("test_doc.txt", file_type)
print(f"   Text length: {len(text)}")

print("4. Chunking text...")
from app.document_processor import chunk_text
chunks = chunk_text(text)
print(f"   Chunks: {chunks}")

print("5. Generating embeddings...")
from app.vector_store import generate_embeddings
embedding = generate_embeddings("test")
print(f"   Embedding length: {len(embedding)}")

print("6. Creating vector store...")
from app.vector_store import FAISSVectorStore
vs = FAISSVectorStore("test_user")
print("   Vector store created")

print("7. Adding vectors...")
vs.add_vectors([embedding], [{"chunk_id": "1", "document_id": "doc1", "filename": "test.txt", "text": "test", "chunk_index": 0}])
print("   Vectors added")

print("SUCCESS!")
