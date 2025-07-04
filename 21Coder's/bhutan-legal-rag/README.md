# 🇧🇹 Bhutan Legal Document Downloader - Flask Backend

A Flask-based REST API for downloading and managing Bhutan's legal documents with a modern web interface.

## Features

- **RESTful API** - Clean API endpoints for all operations
- **Background Downloads** - Non-blocking document downloads with progress tracking
- **Real-time Status** - Live progress updates and logging
- **Document Management** - View, download, and delete documents
- **Storage Analytics** - Track storage usage and document counts
- **Web Interface** - Beautiful HTML frontend for easy interaction
- **AI Legal Assistant** - Chat with RAG-powered AI about Bhutan's laws
- **Intelligent Search** - Semantic search through legal documents
- **CORS Support** - Cross-origin requests enabled
- **Error Handling** - Comprehensive error handling and logging

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start the Flask Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 3. Open the Web Interface

Open `frontend.html` in your browser to access the web interface, or use the API endpoints directly.

## API Endpoints

### Health & Info
- `GET /api/health` - Health check
- `GET /api/storage/info` - Get storage information

### Documents
- `GET /api/documents` - List all available documents
- `GET /api/documents/<name>/download` - Download a specific document file
- `DELETE /api/documents/<name>` - Delete a specific document

### Download Management
- `POST /api/download/start` - Start downloading all documents
- `GET /api/download/status` - Get current download status
- `POST /api/download/retry` - Retry failed downloads
- `GET /api/download/logs` - Get download logs

### AI Legal Assistant
- `POST /api/rag/setup` - Setup the RAG system for AI chat
- `GET /api/rag/status` - Get RAG system setup status
- `POST /api/chat` - Chat with the legal AI assistant
- `GET /api/chat/suggestions` - Get suggested questions

## API Examples

### Check Health
```bash
curl http://localhost:5000/api/health
```

### List Documents
```bash
curl http://localhost:5000/api/documents
```

### Start Download
```bash
curl -X POST http://localhost:5000/api/download/start
```

### Check Download Status
```bash
curl http://localhost:5000/api/download/status
```

### Download a Specific Document
```bash
curl -O http://localhost:5000/api/documents/Constitution_2008/download
```

### Setup AI Chat System
```bash
curl -X POST http://localhost:5000/api/rag/setup
```

### Chat with Legal AI
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the fundamental rights in Bhutan?"}'
```

### Get Chat Suggestions
```bash
curl http://localhost:5000/api/chat/suggestions
```

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "data": {...},          // Present on success
  "error": "message",     // Present on error
  "status": {...}         // Additional status info
}
```

## Web Interface

The included `frontend.html` provides:

- **Document Grid** - Visual overview of all documents
- **Download Progress** - Real-time progress bars and status
- **Storage Statistics** - File counts and storage usage
- **Live Logs** - Real-time download logs
- **Document Actions** - Download or delete individual documents
- **AI Chat Interface** - Interactive chat with legal AI assistant
- **Smart Suggestions** - Clickable question suggestions
- **RAG Setup** - One-click AI system initialization

## Configuration

### Environment Variables

- `FLASK_ENV` - Set to `development` for debug mode
- `FLASK_PORT` - Change the port (default: 5000)

### Data Directory

Documents are saved to `bhutan_legal_data/documents/` by default. This can be changed in the `EnhancedBhutanDownloader` constructor.

## File Structure

```
├── app.py                 # Flask backend
├── download.py           # Document downloader class
├── frontend.html         # Web interface
├── requirements.txt      # Python dependencies
├── README.md            # This file
└── bhutan_legal_data/   # Data directory
    └── documents/       # Downloaded PDFs
```

## Available Documents

The system downloads 20+ legal documents including:

- 🏛️ **Constitution of Bhutan 2008**
- ⚖️ **Penal Code 2004**
- 📋 **Civil and Criminal Procedure Code 2001**
- 🚫 **Anti-Corruption Act 2011**
- 🏞️ **Land Act 2007**
- 💼 **Labour and Employment Act 2007**
- 🏛️ **Civil Service Act 2010**
- 💰 **Tax Act 2022**
- 🌍 **Environment Protection Act 2007**
- 🗳️ **Election Act 2008**
- And 10+ more legal documents...

## Development

### Running in Development Mode

```bash
export FLASK_ENV=development
python app.py
```

### Adding New Documents

Edit the `legal_urls` dictionary in `download.py` to add new documents:

```python
"New_Document_Name": [
    "https://primary-url.pdf",
    "https://backup-url.pdf"
]
```

### Customizing the Frontend

Modify `frontend.html` to customize the web interface. The CSS uses modern design principles with:

- CSS Grid for responsive layouts
- Gradient backgrounds
- Smooth animations
- Mobile-friendly design

## Error Handling

The API includes comprehensive error handling:

- **404** - Endpoint or document not found
- **400** - Bad request (e.g., download already in progress)
- **500** - Server errors with detailed messages

## Logging

All download activities are logged with timestamps and can be viewed via:
- API endpoint: `GET /api/download/logs`
- Web interface: Click "View Logs" button

## Security

- CORS enabled for cross-origin requests
- File validation for PDF downloads
- Path sanitization for file operations
- Request timeout protection

## Performance

- Background threading for non-blocking downloads
- Progress tracking with real-time updates
- Efficient file streaming for large downloads
- Retry logic with exponential backoff

## Browser Compatibility

The web interface supports all modern browsers:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## Troubleshooting

### Download Failures
- Check your internet connection
- Some government servers may be temporarily unavailable
- The system will automatically retry failed downloads

### CORS Issues
- Ensure you're accessing the frontend via a web server
- For local testing, you can disable browser security or use a local server

### Port Already in Use
```bash
# Check what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

---

**Made with ❤️ for Bhutan's Legal Community**

This tool helps make Bhutan's legal documents more accessible to researchers, lawyers, and citizens. 