# 🤖 Researchatron

**Researchatron** is a specialized, full-stack AI assistant designed exclusively for Machine Learning project planning and research. At its core, it leverages a domain-specific transformer model to provide expert guidance, architectural decisions, and step-by-step project blueprints for data scientists and ML engineers.

## 🧠 The Domain-Specific Transformer Assistant

The core intelligence behind Researchatron is powered by **[Xen0pp/SmolLM-ML-Planner-500-V3](https://huggingface.co/Xen0pp/SmolLM-ML-Planner-500-V3)**, a highly specialized, 360-million parameter Small Language Model (SLM) architected explicitly for Machine Learning engineering and system design.

Unlike generic, all-purpose Large Language Models (LLMs) that often hallucinate or provide overly broad advice, Researchatron operates as a **Domain-Specific Expert System**. It is highly optimized to provide deep, accurate, and actionable blueprints specifically for data science workflows.

### 🔬 Architecture & Fine-Tuning Pipeline

1. **Base Foundation (SmolLM-360M)**
   The model is built on top of the highly efficient SmolLM architecture. At 360 million parameters, it strikes a perfect balance—small enough to be hosted locally on consumer hardware or directly within edge applications, yet complex enough to understand intricate software engineering logic.

2. **Parameter-Efficient Fine-Tuning (PEFT) via LoRA**
   Rather than retraining the entire model from scratch (Full Fine-Tuning), the model utilizes **Low-Rank Adaptation (LoRA)**. LoRA freezes the pre-trained model weights and injects trainable rank decomposition matrices into the Transformer architecture. This drastically reduces the number of trainable parameters, preventing "catastrophic forgetting" of the base model's general language capabilities while effectively teaching it a highly specialized new domain.

3. **Accelerated Training with Unsloth**
   The training pipeline was aggressively optimized using **Unsloth**, a library that custom-writes PyTorch autograd functions and Triton kernels for mathematical operations. This allowed the LoRA adapters to be trained up to 2x faster with significantly lower VRAM requirements, enabling rapid, iterative super-fine-tuning.

4. **The "Super-Fine-Tuning" Dataset**
   The model's behavioral weights were shifted using a rigorously curated, instruction-based dataset consisting exclusively of Machine Learning problems. The dataset encompasses:
   - **Data Engineering Pipelines**: ETL processes, advanced feature engineering, and data cleaning strategies.
   - **Model Selection & Architecture**: Deep learning topology design, algorithm benchmarking (e.g., XGBoost vs. Neural Networks).
   - **Evaluation Metrics**: Strategic alignment of mathematical metrics (F1-score, AUC-ROC, RMSE) to real-world business goals.
   - **MLOps & Deployment**: CI/CD for ML, Docker/Kubernetes deployment, Data/Model drift monitoring, and serving infrastructure.

### 🎯 Why a Domain-Specific Assistant?
By restricting the training space purely to ML system design, the model achieves a high "token density" for relevant technical jargon. When a user asks, *"How do I plan a recommendation system project?"*, the model bypasses generic textbook definitions. Instead, it natively outputs a rigorous, phased architectural plan—spanning from implicit/explicit data collection and matrix factorization, straight through to real-time inference latency optimizations.

## 📸 UI Showcase

*(Note: Replace the image paths below with the actual paths to your attached screenshots!)*

### Landing & Authentication
![Landing Page Screenshot](screenshots/landing_page.png)

### Expert ML Planning Interface
![Chat Interface Screenshot](screenshots/chat_interface.png)

### Beautiful Markdown Formatting
![Markdown Output Screenshot](screenshots/markdown_output.png)

---

## 🏗️ Tech Stack

### Frontend (User Interface)
- **Framework**: Next.js 16 (App Router) & React 19
- **Styling**: Tailwind CSS v4 & Lucide React for iconography.
- **Rendering**: `react-markdown` and `remark-gfm` for beautiful, syntax-highlighted code blocks, tables, and lists.

### Backend (API & Model Inference)
- **Framework**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens) & bcrypt password hashing
- **ML Engine**: Hugging Face `transformers`, `torch`, and `accelerate`.

---

## 📂 Project File Structure

```text
researchotron/
├── backend/                        # FastAPI Backend Application
│   ├── main.py                     # Entry point & CORS configuration
│   ├── database.py                 # SQLite database connection & SessionLocal
│   ├── models.py                   # SQLAlchemy database schemas (User, Chat, Message)
│   ├── schemas.py                  # Pydantic models for API validation
│   ├── auth.py                     # JWT token generation & password hashing
│   ├── requirements.txt            # Python dependencies
│   ├── sql_app.db                  # Local SQLite Database
│   ├── routers/                    # API Route Handlers
│   │   ├── auth.py                 # /auth/login and /auth/register endpoints
│   │   └── chat.py                 # /chat endpoints for managing history and generation
│   └── services/                   
│       └── model.py                # Core ML inference engine (Loads SmolLM and generates text)
│
├── frontend/                       # Next.js Frontend Application
│   ├── package.json                # NPM dependencies
│   ├── next.config.ts              # Next.js configuration
│   ├── src/
│   │   ├── app/                    # Next.js App Router Pages
│   │   │   ├── page.tsx            # Beautiful Landing Page
│   │   │   ├── layout.tsx          # Root Layout & Fonts (Geist)
│   │   │   ├── globals.css         # Global Tailwind styles
│   │   │   ├── login/              # Login Page
│   │   │   ├── register/           # Registration Page
│   │   │   └── chat/               # Main Application UI (Chat interface)
│   │   ├── components/             # Reusable UI Components
│   │   │   ├── ChatArea.tsx        # Chat window with Markdown rendering
│   │   │   └── Sidebar.tsx         # Navigation & Chat history sidebar
│   │   └── lib/
│   │       └── api.ts              # Axios instance configured with JWT interceptors
```

---

## 🚀 Getting Started

### 1. Start the Backend API
The backend requires Python and runs the Hugging Face transformer model. Open a terminal:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
pip install torch transformers accelerate email-validator sentencepiece protobuf

# Run the FastAPI server from the project root
cd ..
uvicorn backend.main:app --reload --port 8000
```
*Note: The ML model will download automatically into memory the very first time a chat message is sent.*

### 2. Start the Frontend Website
The frontend requires Node.js. Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application
Open your web browser and navigate to **[http://localhost:3000](http://localhost:3000)**. Register a new account, log in, and start planning your next machine learning architecture!
