import { BhutanService } from '@/services/bhutanService.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock fetch globally
global.fetch = jest.fn();

describe('BhutanService', () => {
  let bhutanService: BhutanService;
  const mockAudioBuffer = Buffer.from('mock audio data');

  beforeEach(() => {
    bhutanService = new BhutanService();
    jest.clearAllMocks();
  });

  describe('textToSpeech', () => {
    it('should process text to speech and return audio URL', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('audio/wav')
        },
        arrayBuffer: jest.fn().mockResolvedValue(mockAudioBuffer.buffer)
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Mock file system operations
      jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined);
      jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);
      jest.spyOn(fs, 'stat').mockResolvedValue({
        size: 1024
      } as any);

      const result = await bhutanService.textToSpeech('Hello, world!');

      expect(result).toEqual({
        success: true,
        data: {
          message: 'Generated speech for: Hello, world!',
          audio_url: expect.stringMatching(/^http:\/\/localhost:3000\/uploads\/audio\/audio_\d+_\d+\.wav$/),
          content_type: 'audio/wav',
          metadata: {
            requestId: expect.stringMatching(/^\d+-\d+$/),
            voice_used: 'Bhutan TTS (Dzongkha)',
            duration: expect.any(Number),
            fileName: expect.stringMatching(/^audio_\d+_\d+\.wav$/),
            fileSize: 1024
          }
        }
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://nlp.cst.edu.bt/tts/',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Referer': 'https://nlp.cst.edu.bt/',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputText: 'Hello, world!'
          })
        })
      );
    });

    it('should handle API errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(bhutanService.textToSpeech('Hello')).rejects.toThrow('TTS API error: 500 Internal Server Error');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(bhutanService.textToSpeech('Hello')).rejects.toThrow('Failed to process text to speech: Network error');
    });
  });

  describe('speechToText', () => {
    it('should return simulated speech to text result', async () => {
      const result = await bhutanService.speechToText('mock audio data');

      expect(result).toEqual({
        success: true,
        transcribed_text: 'Transcribed text from audio: mock audio data',
        message: 'Speech to Text processed successfully (simulated)'
      });
    });
  });
}); 