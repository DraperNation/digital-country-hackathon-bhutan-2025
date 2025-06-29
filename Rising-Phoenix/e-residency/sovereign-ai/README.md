# 🇧🇹 Bhutan E-Residency Agent

**An AI-powered documentation agent for Bhutan's Digital Drukyul e-residency program**

Supporting Bhutan's digital transformation while preserving sovereign values and Gross National Happiness principles.

## 🌟 Overview

The Bhutan E-Residency Agent is an intelligent documentation system that provides comprehensive guidance for e-residents navigating Bhutan's digital government services. Built as part of the Digital Drukyul initiative, it indexes and intelligently queries multiple Bhutan government websites to provide accurate, up-to-date information about:

- **Immigration & Visa Services** - Entry requirements, permits, and residency procedures
- **Business Registration** - Company formation and licensing through G2B portal  
- **Regulatory Compliance** - Environmental clearances, building permits, and sectoral regulations
- **Citizen Services** - Government-to-citizen services and utilities
- **Digital Infrastructure** - Technology services and digital identity verification

## 🏛️ Supported Government Services

The system is designed to work with key Bhutan government websites:

| Service | URL | Purpose |
|---------|-----|---------|
| **Citizen Services** | citizenservices.gov.bt | Core G2C services, clearances, licenses |
| **Business Portal** | g2b.gov.bt | Business registration, sectoral permits |
| **Immigration** | immi.gov.bt | Visa, permit, and immigration processing |
| **eRegulations** | bhutan.eregulations.org | Regulatory procedures, step-by-step guides |
| **Government News** | bbs.bt | Official updates and announcements |
| **Digital Infrastructure** | moic.gov.bt | Digital Drukyul policies and services |
| **Central Portal** | bhutan.gov.bt | Main government information hub |

## 🚀 Key Features

### Multi-Service Intelligence
- **Parallel Processing**: Simultaneously indexes multiple government websites
- **Intelligent Routing**: AI-powered query routing to relevant government services
- **Cross-Service Integration**: Understands how different government services work together

### E-Residency Focused
- **Tailored for E-Residents**: Specialized guidance for digital residents and entrepreneurs
- **Business Setup Support**: Complete workflows for foreign investment and company formation
- **Compliance Guidance**: Regulatory requirements and approval processes

### AI-Powered Analysis
- **Service Summaries**: AI-generated summaries of each government service's capabilities
- **Collection Overviews**: Comprehensive analysis of how services support e-residency
- **Contextual Responses**: Answers tailored to Bhutan's unique digital sovereignty approach

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.9+
- Required API keys:
  - `OPENAI_API_KEY` - For government service analysis
  - `GOOGLE_API_KEY` or `GEMINI_API_KEY` - For the e-residency agent

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd sovereign-ai
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Playwright browsers:**
   ```bash
   playwright install
   ```

4. **Set up environment variables:**
   ```bash
   # Create .env file
   echo "OPENAI_API_KEY=your_openai_key" > .env
   echo "GOOGLE_API_KEY=your_gemini_key" >> .env
   ```

5. **Run the Bhutan E-Residency Agent:**
   ```bash
   python bhutan_eresidency_agent.py
   ```

## 📖 Usage Guide

### 1. Initialize Demo Services
Start with a demo collection of core Bhutan government services:

```python
await initialize_bhutan_eresidency_demo()
```

### 2. Create Custom Service Collection
Add specific government services for your e-residency needs:

```python
await create_eresidency_service_collection(
    name="My E-Residency Services",
    description="Custom collection for business setup in Bhutan",
    service_urls=[
        "https://g2b.gov.bt",
        "https://immi.gov.bt", 
        "https://bhutan.eregulations.org"
    ]
)
```

### 3. Query the E-Residency Agent
Ask questions about Bhutan's e-residency procedures:

```python
response = await ask_eresidency_agent(
    "What are the steps to register a technology company in Bhutan as a foreign investor?"
)
```

### 4. List Available Services
View all configured government service collections:

```python
services = await list_eresidency_services()
```

## 🎯 Use Cases

### For E-Residents
- **Immigration Guidance**: Visa requirements, permit applications, renewal procedures
- **Business Setup**: Complete company registration workflows
- **Compliance**: Environmental clearances, licensing requirements
- **Digital Services**: Access to online government platforms

### For Entrepreneurs
- **FDI Procedures**: Foreign Direct Investment application processes
- **Sector Permits**: Industry-specific licensing and approvals
- **Tax Registration**: Business tax and compliance requirements
- **Operational Permits**: Building permits, utilities, and infrastructure

### For Government Agencies
- **Service Integration**: Understanding cross-departmental workflows
- **Digital Transformation**: Supporting Digital Drukyul initiatives
- **Citizen Support**: Comprehensive guidance for government services

## 🔧 Technical Architecture

### Core Components
- **BhutanGovernmentService**: Represents individual government services
- **EResidencyServiceCollection**: Groups related services for comprehensive guidance
- **AI Summarization**: OpenAI-powered analysis of government documentation
- **Intelligent Agent**: Gemini-powered conversational interface

### Data Flow
1. **Service Indexing**: Scrapes government websites and processes content
2. **AI Analysis**: Generates summaries and categorizes services
3. **Query Processing**: Routes questions to relevant government services
4. **Response Generation**: Provides comprehensive, cited answers

### Security Features
- **Path Traversal Protection**: Prevents unauthorized file access
- **Content Validation**: Ensures government content integrity
- **Rate Limiting**: Respectful scraping of government websites

## 🌍 Alignment with Digital Drukyul

This system supports Bhutan's Digital Drukyul vision by:

- **Digital Sovereignty**: Maintaining control over government data and services
- **Citizen-Centric Design**: Prioritizing user experience in government interactions
- **Innovation with Values**: Balancing technological advancement with cultural preservation
- **Sustainable Development**: Supporting Gross National Happiness through digital tools

## 🤝 Contributing

We welcome contributions that align with Bhutan's values and e-residency goals:

1. **Service Integration**: Add support for additional government websites
2. **Language Support**: Contribute Dzongkha language capabilities
3. **Feature Enhancement**: Improve e-residency workflows and guidance
4. **Documentation**: Enhance user guides and technical documentation

## 📄 License

This project supports Bhutan's digital transformation efforts and follows open-source principles while respecting government data policies.

## 🔗 Resources

- [Digital Drukyul Master Plan](https://www.moic.gov.bt/digital-drukyul/)
- [Bhutan Government Portal](https://www.bhutan.gov.bt/)
- [eRegulations Bhutan](https://bhutan.eregulations.org/)
- [Immigration Services](https://www.immi.gov.bt/)

---

**🇧🇹 "Gross National Happiness through Digital Innovation" - Supporting Bhutan's E-Residency Program** 