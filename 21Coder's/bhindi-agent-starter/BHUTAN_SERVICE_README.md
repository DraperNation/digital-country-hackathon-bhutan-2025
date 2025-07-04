# Bhutan Service - Text to Speech

## Overview

The Bhutan Service provides Text-to-Speech (TTS) functionality using the Bhutan TTS API. The service converts text input to audio files and returns a URL to access the generated audio.

## Features

- **Text to Speech**: Convert text to audio using Bhutan TTS API
- **Audio File Storage**: Automatically saves audio files to the uploads directory
- **URL Generation**: Returns accessible URLs for the generated audio files
- **Metadata**: Provides detailed metadata about the generated audio

## API Response Format

The service now returns responses in the following format:

```json
{
  "success": true,
  "data": {
    "message": "Generated speech for: [input text]",
    "audio_url": "http://localhost:3000/uploads/audio/audio_[timestamp]_[random].wav",
    "content_type": "audio/wav",
    "metadata": {
      "requestId": "[timestamp]-[random]",
      "voice_used": "Bhutan TTS (Dzongkha)",
      "duration": 1.234,
      "fileName": "audio_[timestamp]_[random].wav",
      "fileSize": 12345
    }
  }
}
```

## Usage

### Text to Speech (TTS)

**Endpoint**: `POST /tools`

**Parameters**:
- `tool`: `"TTS"`
- `text`: The text to convert to speech

**Example Request**:
```json
{
  "tool": "TTS",
  "text": "Hello, this is a test message."
}
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "message": "Generated speech for: Hello, this is a test message.",
    "audio_url": "http://localhost:3000/uploads/audio/audio_1703123456789_1234.wav",
    "content_type": "audio/wav",
    "metadata": {
      "requestId": "1703123456789-123456",
      "voice_used": "Bhutan TTS (Dzongkha)",
      "duration": 2.5,
      "fileName": "audio_1703123456789_1234.wav",
      "fileSize": 45000
    }
  },
  "tool_type": "bhutan"
}
```

## Configuration

The service uses the following configuration:

- **Base URL**: Configurable via `BASE_URL` environment variable (defaults to `http://localhost:3000`)
- **Upload Directory**: `uploads/audio/` (relative to project root)
- **File Format**: WAV audio files
- **Naming Convention**: `audio_[timestamp]_[random].wav`

## File Storage

- Audio files are automatically saved to the `uploads/audio/` directory
- Files are served statically via the `/uploads/audio/` endpoint
- Unique filenames prevent conflicts
- Files can be accessed directly via the returned `audio_url`

## Error Handling

The service handles various error scenarios:

- **API Errors**: Returns appropriate error messages for TTS API failures
- **Network Errors**: Handles connection issues gracefully
- **File System Errors**: Manages upload directory creation and file writing
- **Parameter Validation**: Validates required input parameters

## Testing

Run the tests to verify functionality:

```bash
npm test bhutanService.test.ts
```

## Dependencies

- `fs`: File system operations
- `path`: Path manipulation
- `url`: URL utilities
- Built-in `fetch`: HTTP requests
- Built-in `Buffer`: Binary data handling

## Notes

- The service estimates audio duration based on file size and format assumptions
- Audio files are stored locally and served via HTTP
- The service is designed to work with the Bhutan TTS API specifically
- All generated files are accessible via the returned URLs 