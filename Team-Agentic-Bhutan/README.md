# Dzongkha Language Agents

A comprehensive AI-powered system designed to bridge language barriers and improve government service accessibility for Dzongkha speakers. This project consists of two specialized agents that facilitate communication and provide service information in both Dzongkha and English.

## 🌟 Features

### Agent 1: Issue Analysis & Department Routing
- **Multilingual Input Processing**: Accepts problems and complaints in Dzongkha
- **Intelligent Issue Analysis**: Uses AI to understand and categorize citizen concerns
- **Automated Email Routing**: Automatically forwards issues to the appropriate government department
- **Context-Aware Classification**: Identifies the nature of problems for proper departmental assignment

### Agent 2: Bilingual Service Information Assistant
- **Service Inquiry Support**: Responds to questions about government services in Dzongkha
- **Dual-Language Responses**: Provides information in both Dzongkha and English
- **Comprehensive Service Database**: Covers various government services including:
  - Birth certificate applications
  - Document processing procedures
  - Government service requirements
  - Step-by-step guidance

## 🏗️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Input    │───▶│   Agent Router   │───▶│  Issue Analysis │
│   (Dzongkha)    │    │                  │    │     Agent 1     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                │                        ▼
                                │               ┌─────────────────┐
                                │               │ Email Routing   │
                                │               │    System       │
                                │               └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Service Info    │
                       │    Agent 2      │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Bilingual       │
                       │   Response      │
                       └─────────────────┘
```


## 🎯 Use Cases

### Citizen Support Scenarios
- **Healthcare Issues**: Citizens can report medical service problems in Dzongkha
- **Education Concerns**: Parents can inquire about school-related services
- **Administrative Queries**: Getting information about various government procedures
- **Document Processing**: Step-by-step guidance for official document applications

### Government Benefits
- **Improved Accessibility**: Better service delivery to Dzongkha-speaking citizens
- **Efficient Routing**: Automatic categorization reduces manual sorting
- **Language Preservation**: Promotes use of Dzongkha in digital government services
- **Citizen Satisfaction**: Faster response times and clearer communication

## 🔧 Technical Details

### Supported Services
- Birth Certificate Applications
- Citizenship Documentation
- Marriage Registration
- Land Registration
- Business Licensing
- Passport Applications
- Driving License Procedures

### Language Processing
- **Input Languages**: Dzongkha (primary), English (secondary)
- **Output Languages**: Bilingual responses (Dzongkha + English)
- **Text Processing**: Advanced NLP for Dzongkha language understanding
- **Translation Quality**: High-accuracy translation between Dzongkha and English

### Department Routing Logic
The system categorizes issues based on keywords and context:
- **Health**: Medical services, hospital complaints, healthcare access
- **Education**: School issues, educational services, student concerns
- **Transport**: Vehicle registration, driving licenses, road issues
- **Civil Services**: Documentation, certificates, administrative procedures

- [ ] Service status tracking
- [ ] Multi-regional dialect support

---

**Making government services accessible to every Dzongkha speaker**
