# Soverign AI

![Version](https://img.shields.io/badge/Version-1.0-blue)
![PRD Date](https://img.shields.io/badge/Date-June_29,_2025-green)

"AI is not just a tool—it is the new digital labor force. Bhutan must build its own to protect its sovereignty."  

📃 Problem Statement

Sovereign AI enables Bhutan to:
Preserve cultural and policy autonomy
Prevent digital colonialism
Deploy AI agents as digital civil servants
Train local talent in next-gen technologies
Become a leader in ethical, nation-specific AI

**Vision:** Establish Bhutan as a premier global hub for digital innovation and international business  
**Inspiration:** Estonia, Singapore, and Delaware's e-governance models  
**Alignment:** Supports Bhutan's "Digital Bhutan" agenda and Gross National Happiness philosophy  

📌 Overview

## Watch A Turorial By Clicking On This Link
[![Soverign AI Demo Video](../images/SoverignAIDemo.png)](https://www.loom.com/share/8a345cab07934830972bf932ff6d058b?sid=324947ce-df0f-43ff-a620-12198fcdb99e "Soverign AI Demo Video")

🚀 Technical Focus
Core Pillars

* **Bhutanese-Focused LLMs:** Fine-tuned open-source models for legal, cultural, and linguistic context
* **Dzongkha Intelligence:** Native multilingual support (Dzongkha + 19 local dialects)
* **Public Service Agents:**	AI tools for government operations and citizen services
* **Ethical AI Framework:**	Transparent, auditable systems aligned with Gross National Happiness

## Setup

1. Create Environment: `python -m venv ebhutan`
2. Install dependencies: `pip install -r requirements.txt`
3. Set up `config.env` with your Google API key
```
# Gemini API Configuration
GOOGLE_API_KEY="AIzaSyCnbik8iwtfKnZxpcn_nNGJSZ4Z73jFBGs"

# ChromaDB Configuration
CHROMA_COLLECTION_NAME=bhutan_document_embeddings

# Application Configuration
RAW_DATA_PATH=./data/raw
PROCESSED_DATA_PATH=./data/processed 
```
4. Set up `.env` in translator folder with your Google API key
``` 
export GOOGLE_CLOUD_PROJECT_ID=bhutan-464321
export GOOGLE_APPLICATION_CREDENTIALS=bhutan-key.json
```
5. Run: `chainlit run chainlit_app.py`