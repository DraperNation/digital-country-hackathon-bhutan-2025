import { BaseErrorResponseDto } from '@/types/agent.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '@/config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Bhutan Service
 * Handles Bhutan-specific API calls like Text-to-Speech and Speech-to-Text
 */
export class BhutanService {
  private readonly ttsUrl = 'https://nlp.cst.edu.bt/tts/';
  private readonly sttUrl = 'https://nlp.cst.edu.bt/asr/transcribe_audio_withLM';
  private readonly uploadsDir = path.join(__dirname, '../../uploads/audio');

  /**
   * Generate a unique filename using timestamp and random number
   */
  private generateUniqueFileName(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `audio_${timestamp}_${random}.wav`;
  }

  /**
   * Generate a unique request ID
   */
  private generateRequestId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${random}`;
  }

  /**
   * Convert text to speech using Bhutan TTS API
   */
  async textToSpeech(inputText: string): Promise<any> {
    console.log("Starting TTS request");
    try {
      const response = await fetch(this.ttsUrl, {
        method: 'POST',
        headers: {
          'Referer': 'https://nlp.cst.edu.bt/',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputText: inputText
        })
      });
      
      console.log("TTS request completed");
      
      if (!response.ok) {
        throw new BaseErrorResponseDto(
          `TTS API error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      console.log("Processing TTS response");
      
      // The API returns audio/wav content, not JSON
      if (response.headers.get('content-type')?.includes('audio/wav')) {
        // Get the audio buffer
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);
        
        // Generate unique filename
        const fileName = this.generateUniqueFileName();
        const filePath = path.join(this.uploadsDir, fileName);
        
        // Ensure uploads directory exists
        await fs.mkdir(this.uploadsDir, { recursive: true });
        
        // Save the audio file
        await fs.writeFile(filePath, audioBuffer);
        
        // Get file stats for metadata
        const stats = await fs.stat(filePath);
        
        // Construct the audio URL
        const audioUrl = `${config.baseUrl}/uploads/audio/${fileName}`;
        
        return {
          success: true,
          data: {
            message: `Generated speech for: ${inputText}`,
            audio_url: audioUrl,
            content_type: "audio/wav",
            metadata: {
              requestId: this.generateRequestId(),
              voice_used: "Bhutan TTS (Dzongkha)",
              duration: this.estimateDuration(audioBuffer),
              fileName: fileName,
              fileSize: stats.size
            }
          }
        };
      } else {
        // Fallback for JSON response if API changes
        const result = await response.json();
        console.log("TTS JSON response:", result);
        
        return {
          success: true,
          data: {
            message: `Generated speech for: ${inputText}`,
            audio_url: result.audio_url || null,
            content_type: result.content_type || "audio/wav",
            metadata: {
              requestId: this.generateRequestId(),
              voice_used: "Bhutan TTS (Dzongkha)",
              duration: null,
              fileName: null,
              fileSize: null
            }
          }
        };
      }
    } catch (error: any) {
      if (error instanceof BaseErrorResponseDto) {
        throw error;
      }
      throw new BaseErrorResponseDto(
        `Failed to process text to speech: ${error.message}`,
        500
      );
    }
  }

  /**
   * Convert speech to text using Bhutan STT API
   */
  async speechToText(audioFilePath: string, csrfToken?: string): Promise<any> {
    try {
      console.log("Starting STT request for file:", audioFilePath);
      
      // Check if file exists
      try {
        await fs.access(audioFilePath);
      } catch (error) {
        throw new BaseErrorResponseDto(
          `Audio file not found: ${audioFilePath}`,
          404
        );
      }

      // Read the audio file
      const audioBuffer = await fs.readFile(audioFilePath);
      const fileName = path.basename(audioFilePath);
      
      // Create a Blob from the buffer (Node.js equivalent)
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      
      // Prepare form data
      const formData = new FormData();
      formData.append('csrfmiddlewaretoken', csrfToken || 'eeVezdwNhh7uIQDrjK02DsMN2MdgHSctlYhzNKNOQJnTOb8xj6YemW93vms4POEJ');
      formData.append('audio_input', audioBlob, fileName);
      formData.append('selectmodel', '2');

      console.log("Form data prepared, sending STT request");

      const response = await fetch(this.sttUrl, {
        method: 'POST',
        headers: {
          'Origin': 'https://nlp.cst.edu.bt',
          'Referer': 'https://nlp.cst.edu.bt/asr/'
          // Do not set 'Content-Type' header; fetch will set it automatically for FormData
        },
        body: formData
      });
      
      console.log("STT request completed, status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("STT API error response:", errorText);
        throw new BaseErrorResponseDto(
          `STT API error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      // Get file stats for metadata
      const stats = await fs.stat(audioFilePath);
      
      // Try to parse as JSON, fallback to text if needed
      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        result = await response.json();
        console.log("STT JSON response:", result);
      } else {
        const textResult = await response.text();
        console.log("STT text response:", textResult);
        // Try to extract transcription from HTML or text response
        result = { transcribed_text: textResult };
      }
      
      return {
        success: true,
        data: {
          message: `Transcribed speech from: ${fileName}`,
          transcribed_text: result.transcribed_text || result.text || result.transcription || null,
          metadata: {
            requestId: this.generateRequestId(),
            model_used: "Bhutan STT Model 2 (Dzongkha)",
            duration: result.duration || null,
            fileName: fileName,
            fileSize: stats.size,
            confidence: result.confidence || null
          }
        }
      };
    } catch (error: any) {
      console.error("STT Error:", error);
      if (error instanceof BaseErrorResponseDto) {
        throw error;
      }
      throw new BaseErrorResponseDto(
        `Failed to process speech to text: ${error.message}`,
        500
      );
    }
  }

  /**
   * Get a fresh CSRF token from the STT page (optional enhancement)
   */
  async getCsrfToken(): Promise<string | null> {
    try {
      const response = await fetch('https://nlp.cst.edu.bt/asr/', {
        method: 'GET',
        headers: {
          'Referer': 'https://nlp.cst.edu.bt/'
        }
      });
      
      if (!response.ok) {
        console.warn("Failed to fetch CSRF token");
        return null;
      }
      
      const html = await response.text();
      const csrfMatch = html.match(/name="csrfmiddlewaretoken" value="([^"]+)"/);
      
      return csrfMatch ? csrfMatch[1] : null;
    } catch (error) {
      console.warn("Error fetching CSRF token:", error);
      return null;
    }
  }

  // async gemini

  /**
   * Estimate audio duration based on file size and format
   */
  private estimateDuration(audioBuffer: Buffer): number {
    // Rough estimation for WAV files
    // WAV header is typically 44 bytes, and we assume 16-bit, 22.05kHz, mono
    const audioDataSize = audioBuffer.length - 44;
    const bytesPerSecond = 22050 * 2; // 22.05kHz * 2 bytes per sample
    return audioDataSize / bytesPerSecond;
  }
}