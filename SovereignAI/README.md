
---

# SovereignAI: Agentic AI System using Autogen and Mistral 7B Instruct v0.2

## 🚀 Project Overview

**SovereignAI** is a fully autonomous, agentic AI system built using the **Autogen framework** and powered by the **Mistral 7B Instruct v0.2** open-source model.
This project showcases how a lean, cost-efficient agentic architecture can be implemented **entirely using free and publicly available resources**, including model weights and Google Colab’s free tier for development and deployment.

---

## 🧩 Core Technology Stack

* **Framework:** [Autogen](https://github.com/microsoft/autogen)
* **Language Model:** [Mistral 7B Instruct v0.2](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)
* **Development Environment:** Google Colab (Free Tier)

---

## 🎯 Key Features

* **Agentic Architecture:**
  Implements **multi-agent collaboration** to complete tasks autonomously with minimal human intervention.

* **Mistral 7B Instruct v0.2:**
  Utilized as the primary language model to power all agent communications, task completions, and decision-making pipelines.

* **Cost-Efficient Build:**
  Developed and deployed entirely using **free-tier resources** with no external funding or paid APIs, demonstrating a scalable and accessible approach to building agentic systems.

* **Lean Workflow:**
  Emphasizes modularity and efficient agent communication leveraging the Autogen framework’s native capabilities.

---

## ⚙️ System Architecture

* **Agents:**
  Each agent is instantiated through Autogen and is powered by Mistral 7B Instruct v0.2.
  Agents are capable of:

  * Task planning
  * Autonomous decision-making
  * Multi-agent coordination

* **Core Model:**
  The Mistral 7B Instruct v0.2 model is loaded using the Hugging Face `transformers` library and serves as the backbone for all natural language processing tasks.

* **Execution Environment:**
  Google Colab was used for:

  * Model loading
  * System simulation
  * Agent interactions
    (All accomplished on the **Colab free-tier** without specialized hardware.)

---

## 📂 Repository Structure

```plaintext
sovereignAI/
├── notebooks/
│   ├── sovereignAI_final.ipynb   # Final agentic system implementation
│   └── ...                       # Other experimental notebooks
├── README.md                     # Project documentation
└── requirements.txt              # Python dependencies
```

---

## 📝 How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/sovereignAI.git
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the notebook in Google Colab (recommended):

   * Open `sovereignAI_final.ipynb` in Google Colab.
   * Follow the notebook instructions to initialize agents and run the system.

---

## 🔍 Notes & Disclaimers

* The **initial file upload** was an incomplete version. The **final and correct notebook** has been pushed and confirmed to be the intended version, with no changes made after the submission deadline. See the [Update Log](#sovereignai-update-log) below.

---

## 🗒️ SovereignAI Update Log

* **Initial Upload:**
  An outdated version of the notebook was mistakenly pushed to the repository.

* **Final Upload:**
  The correct, completed notebook was later added. No changes were made after the official submission deadline.

We apologize for any confusion and appreciate your understanding.

---

## 📚 References

* [Autogen by Microsoft](https://github.com/microsoft/autogen)
* [Mistral 7B Instruct v0.2 on Hugging Face](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)

---

## 📩 Contact

For questions or contributions, please open an issue or contact the project maintainer directly.

---


