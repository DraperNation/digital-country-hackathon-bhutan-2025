from flask import Flask, render_template, request, jsonify, send_file, Response
import speech_recognition as sr
import pyttsx3
import requests
import os
import uuid
import threading
from datetime import datetime
import json
import wave
import subprocess
import struct
import math
import google.generativeai as genai

app = Flask(__name__)

# Create directories
UPLOAD_FOLDER = 'audio_files'
OUTPUT_FOLDER = 'output_audio'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs('templates', exist_ok=True)

class SpeechTranslator:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.tts = pyttsx3.init()
        self.tts.setProperty('rate', 150)
        self.tts_lock = threading.Lock()
        self.api_url = "https://nlp.cst.edu.bt/nmt/api/"
        
        # Adjust recognizer settings
        self.recognizer.energy_threshold = 300
        self.recognizer.dynamic_energy_threshold = True
        self.recognizer.pause_threshold = 0.8
        self.recognizer.phrase_threshold = 0.3
    
    def convert_audio_to_wav(self, input_path, output_path):
        """Convert any audio format to WAV using ffmpeg"""
        try:
            cmd = [
                'ffmpeg', '-i', input_path,
                '-acodec', 'pcm_s16le',
                '-ar', '16000',
                '-ac', '1',
                '-y',  # Overwrite output file
                output_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                return True
            else:
                print(f"FFmpeg error: {result.stderr}")
                return False
                
        except FileNotFoundError:
            print("FFmpeg not found. Install it for better audio support.")
            return False
        except Exception as e:
            print(f"Audio conversion error: {e}")
            return False
    
    def simple_audio_conversion(self, input_path, output_path):
        """Fallback audio conversion without ffmpeg"""
        try:
            # Try to copy and rename if it's already a compatible format
            import shutil
            shutil.copy2(input_path, output_path)
            return True
        except Exception as e:
            print(f"Simple conversion error: {e}")
            return False
    
    def speech_to_text(self, audio_file_path):
        """Convert audio file to text with multiple attempts"""
        wav_path = audio_file_path
        converted = False
        
        try:
            # If not WAV, try to convert
            if not audio_file_path.lower().endswith('.wav'):
                wav_path = audio_file_path.replace(os.path.splitext(audio_file_path)[1], '.wav')
                
                # Try ffmpeg first
                if self.convert_audio_to_wav(audio_file_path, wav_path):
                    converted = True
                    print(f"Converted audio to: {wav_path}")
                else:
                    # Fallback to simple copy
                    wav_path = audio_file_path  # Use original file
                    
            # Try to recognize speech
            print(f"Processing audio file: {wav_path}")
            
            with sr.AudioFile(wav_path) as source:
                # Adjust for ambient noise
                self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                
                # Record the audio
                audio = self.recognizer.record(source)
                
                # Recognize speech
                text = self.recognizer.recognize_google(audio, language='en-US')
                print(f"Recognized text: {text}")
                
                # Clean up converted file
                if converted and os.path.exists(wav_path) and wav_path != audio_file_path:
                    os.remove(wav_path)
                
                return text
                
        except sr.UnknownValueError:
            print("Could not understand the audio")
            return None
        except sr.RequestError as e:
            print(f"Google Speech Recognition error: {e}")
            return None
        except Exception as e:
            print(f"Speech recognition error: {e}")
            return None
        finally:
            # Clean up any temporary files
            if converted and os.path.exists(wav_path) and wav_path != audio_file_path:
                try:
                    os.remove(wav_path)
                except:
                    pass
    
    def translate_text(self, english_text):
        """Translate English text to Dzongkha"""
        try:
            csrf_token = "BChulbIs1Zw11osRYuxCr2MddSDJqMT9nf909XMqlKG1PDVg7sO82EkmZAbqeuwQ"
            
            payload = {
                "src_lang": "eng_Latn",
                "tgt_lang": "dzo_Tibt",
                "text": english_text,
                "csrfmiddlewaretoken": csrf_token
            }
            
            headers = {
                "Content-Type": "application/json",
                "X-CSRFToken": csrf_token,
                "Referer": "https://nlp.cst.edu.bt/nmt/"
            }
            
            print(f"Translating: {english_text}")
            response = requests.post(self.api_url, json=payload, headers=headers, timeout=15)
            
            if response.status_code == 200:
                result = response.json()
                translated_text = result.get('translated_text', result.get('text', ''))
                print(f"Translated: {translated_text}")
                return translated_text
            else:
                print(f"Translation API error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"Translation error: {e}")
            return None
    
    def text_to_speech(self, text, output_path):
        """Convert text to speech - simple and reliable method"""
        try:
            print(f"🔊 TTS Request: '{text[:50]}...' -> {output_path}")
            
            # Ensure output directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Method 1: Use macOS say command (most reliable on Mac)
            success = self.tts_with_macos_say(text, output_path)
            if success:
                print(f"✅ macOS say TTS successful")
                return True
            
            # Method 2: Try pyttsx3 with better settings
            success = self.tts_with_pyttsx3_simple(text, output_path)
            if success:
                print(f"✅ pyttsx3 TTS successful")
                return True
            
            # Method 3: Create a simple test beep
            print("⚠️ Creating test beep...")
            success = self.create_simple_beep(output_path)
            if success:
                print(f"✅ Test beep created")
                return True
            
            print("❌ All TTS methods failed")
            return False
            
        except Exception as e:
            print(f"❌ TTS error: {e}")
            return False
    
    def tts_with_macos_say(self, text, output_path):
        """Use macOS say command - most reliable"""
        try:
            import platform
            if platform.system() != "Darwin":
                return False
            
            print(f"🍎 Using macOS say command for: {text[:30]}...")
            
            # First create AIFF file, then convert to WAV
            aiff_path = output_path.replace('.wav', '.aiff')
            
            # Use macOS say command to create AIFF file
            cmd = ['say', '-o', aiff_path, text]
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0 and os.path.exists(aiff_path):
                print(f"✅ AIFF created: {os.path.getsize(aiff_path)} bytes")
                
                # Convert AIFF to WAV using afconvert (built into macOS)
                conv_cmd = ['afconvert', '-f', 'WAVE', '-d', 'LEI16@22050', aiff_path, output_path]
                conv_result = subprocess.run(conv_cmd, capture_output=True, text=True)
                
                if conv_result.returncode == 0 and os.path.exists(output_path):
                    file_size = os.path.getsize(output_path)
                    print(f"✅ WAV converted: {file_size} bytes")
                    
                    # Clean up AIFF file
                    os.remove(aiff_path)
                    return file_size > 1000
                else:
                    print(f"❌ afconvert failed: {conv_result.stderr}")
                    # Fallback: try to use the AIFF file directly
                    if os.path.exists(aiff_path):
                        os.rename(aiff_path, output_path)
                        print(f"⚠️ Using AIFF as fallback")
                        return True
                    return False
            else:
                print(f"❌ macOS say failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ macOS say error: {e}")
            return False
    
    def tts_with_pyttsx3_simple(self, text, output_path):
        """Simplified pyttsx3 TTS"""
        try:
            with self.tts_lock:
                print(f"🎵 Attempting pyttsx3 TTS...")
                
                # Configure TTS
                self.tts.setProperty('rate', 150)
                self.tts.setProperty('volume', 0.9)
                
                # Save to file
                self.tts.save_to_file(text, output_path)
                self.tts.runAndWait()
                
                # Check if file was created
                if os.path.exists(output_path):
                    file_size = os.path.getsize(output_path)
                    print(f"📁 File created: {file_size} bytes")
                    
                    if file_size > 100:  # Reasonable minimum size
                        return True
                    else:
                        print(f"⚠️ File too small: {file_size} bytes")
                        return False
                else:
                    print("❌ No file created")
                    return False
                    
        except Exception as e:
            print(f"❌ pyttsx3 error: {e}")
            return False
    
    def create_simple_beep(self, output_path):
        """Create a simple beep that definitely works"""
        try:
            print(f"🔊 Creating simple beep audio file...")
            
            # Audio parameters - most compatible settings
            sample_rate = 22050  # Standard sample rate
            duration = 1.5  # 1.5 seconds
            frequency = 880  # A5 note (higher pitch, easier to hear)
            amplitude = 0.3  # Not too loud
            
            # Generate sine wave with envelope
            frames = []
            for i in range(int(sample_rate * duration)):
                t = i / sample_rate
                
                # Create envelope (fade in/out to avoid clicks)
                if t < 0.1:  # Fade in
                    envelope = t / 0.1
                elif t > duration - 0.1:  # Fade out
                    envelope = (duration - t) / 0.1
                else:
                    envelope = 1.0
                
                # Generate sine wave
                sample = amplitude * envelope * math.sin(2 * math.pi * frequency * t)
                
                # Convert to 16-bit signed integer
                sample_int = int(sample * 32767)
                sample_int = max(-32768, min(32767, sample_int))  # Clamp to 16-bit range
                
                # Pack as little-endian 16-bit signed integer
                frames.append(struct.pack('<h', sample_int))
            
            # Write WAV file with proper headers
            with wave.open(output_path, 'wb') as wav_file:
                wav_file.setnchannels(1)      # Mono
                wav_file.setsampwidth(2)      # 16-bit samples
                wav_file.setframerate(sample_rate)  # Sample rate
                
                # Write all frames at once
                wav_file.writeframes(b''.join(frames))
            
            if os.path.exists(output_path):
                file_size = os.path.getsize(output_path)
                print(f"✅ Simple beep created: {file_size} bytes")
                
                # Verify the file is a valid WAV
                try:
                    with wave.open(output_path, 'rb') as test_wav:
                        test_frames = test_wav.getnframes()
                        test_rate = test_wav.getframerate()
                        print(f"✅ WAV verified: {test_frames} frames at {test_rate} Hz")
                        return test_frames > 1000
                except Exception as verify_error:
                    print(f"❌ WAV verification failed: {verify_error}")
                    return False
            
            return False
            
        except Exception as e:
            print(f"❌ Beep creation error: {e}")
            return False

# Initialize translator
translator = SpeechTranslator()

@app.route('/')
def index():
    """Serve the main HTML page"""
    return render_template('index.html')

@app.route('/translate_text', methods=['POST'])
def translate_text():
    """API endpoint for text translation (now uses Gemini for English response)"""
    try:
        data = request.get_json()
        user_input = data.get('text', '').strip()
        
        if not user_input:
            return jsonify({'error': 'No text provided'}), 400
        
        print(f"Text translation request (user input): {user_input}")
        
        # 1. Get Gemini response for the user input
        gemini_api_key = "AIzaSyCEIROfUQirqNtK4Np2Gls-qrYIcQqqFdo"
        if not gemini_api_key:
            return jsonify({'error': 'Gemini API key not set in environment'}), 500
        
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        gemini_response = model.generate_content(user_input)
        
        # Extract the text from Gemini's response
        english_text = gemini_response.text.strip() if hasattr(gemini_response, 'text') else str(gemini_response)
        print(f"Gemini response: {english_text}")
        
        # 2. Translate Gemini's response to Dzongkha
        dzongkha_text = translator.translate_text(english_text)
        
        if dzongkha_text:
            # Generate unique filename for audio
            audio_filename = f"tts_{uuid.uuid4().hex[:8]}.wav"
            audio_path = os.path.join(OUTPUT_FOLDER, audio_filename)
            
            # Generate audio
            audio_generated = translator.text_to_speech(dzongkha_text, audio_path)
            
            # Check what file was actually created
            actual_audio_file = None
            if audio_generated:
                base_name = os.path.splitext(audio_filename)[0]
                possible_files = [
                    audio_filename,
                    base_name + '.mp3',
                    base_name + '.aiff'
                ]
                
                for filename in possible_files:
                    file_path = os.path.join(OUTPUT_FOLDER, filename)
                    if os.path.exists(file_path) and os.path.getsize(file_path) > 100:
                        actual_audio_file = filename
                        print(f"Audio file created: {filename} ({os.path.getsize(file_path)} bytes)")
                        break
            
            response_data = {
                'english': english_text,
                'dzongkha': dzongkha_text,
                'timestamp': datetime.now().strftime('%H:%M:%S'),
                'audio_file': actual_audio_file,
                'audio_generated': audio_generated,
                'debug_info': f"TTS attempted, file: {actual_audio_file or 'None'}"
            }
            
            return jsonify(response_data)
        else:
            return jsonify({'error': 'Translation failed'}), 500
            
    except Exception as e:
        print(f"Text translation error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/translate_audio', methods=['POST'])
def translate_audio():
    """API endpoint for audio translation (speech -> Gemini -> Dzongkha)"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        if audio_file.filename == '':
            return jsonify({'error': 'No audio file selected'}), 400
        
        # Generate unique filename
        file_extension = '.webm'  # Default for browser recordings
        if audio_file.filename and '.' in audio_file.filename:
            file_extension = os.path.splitext(audio_file.filename)[1]
        
        filename = f"recording_{uuid.uuid4().hex[:8]}{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        # Save the uploaded file
        audio_file.save(file_path)
        print(f"Saved audio file: {file_path} (size: {os.path.getsize(file_path)} bytes)")
        
        # Convert speech to text
        recognized_text = translator.speech_to_text(file_path)
        
        if not recognized_text:
            # Keep the file for debugging
            print(f"Speech recognition failed for file: {file_path}")
            return jsonify({'error': 'Could not understand audio. Please speak clearly and try again.'}), 400
        
        print(f"Recognized speech: {recognized_text}")
        
        # 1. Get Gemini response for the recognized text
        gemini_api_key = "AIzaSyCEIROfUQirqNtK4Np2Gls-qrYIcQqqFdo"
        if not gemini_api_key:
            return jsonify({'error': 'Gemini API key not set in environment'}), 500
        
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        gemini_response = model.generate_content(recognized_text)
        
        # Extract the text from Gemini's response
        english_text = gemini_response.text.strip() if hasattr(gemini_response, 'text') else str(gemini_response)
        print(f"Gemini response: {english_text}")
        
        # 2. Translate Gemini's response to Dzongkha
        dzongkha_text = translator.translate_text(english_text)
        
        if dzongkha_text:
            # Generate audio for Dzongkha
            audio_filename = f"tts_{uuid.uuid4().hex[:8]}.wav"
            audio_path = os.path.join(OUTPUT_FOLDER, audio_filename)
            audio_generated = translator.text_to_speech(dzongkha_text, audio_path)
            
            # Check what file was actually created
            actual_audio_file = None
            if audio_generated:
                base_name = os.path.splitext(audio_filename)[0]
                possible_files = [
                    audio_filename,
                    base_name + '.mp3',
                    base_name + '.aiff'
                ]
                
                for filename in possible_files:
                    file_path = os.path.join(OUTPUT_FOLDER, filename)
                    if os.path.exists(file_path) and os.path.getsize(file_path) > 100:
                        actual_audio_file = filename
                        print(f"Audio file created: {filename} ({os.path.getsize(file_path)} bytes)")
                        break
            
            # Clean up uploaded file (optional - keep for debugging)
            # os.remove(file_path)
            
            response_data = {
                'english': english_text,
                'dzongkha': dzongkha_text,
                'timestamp': datetime.now().strftime('%H:%M:%S'),
                'audio_file': actual_audio_file,
                'audio_generated': audio_generated,
                'debug_info': f"TTS attempted, file: {actual_audio_file or 'None'}"
            }
            
            return jsonify(response_data)
        else:
            return jsonify({'error': 'Translation failed'}), 500
            
    except Exception as e:
        print(f"Audio translation error: {e}")
        return jsonify({'error': f'Processing error: {str(e)}'}), 500

@app.route('/play_audio/<filename>')
def play_audio(filename):
    """Serve audio files with proper headers"""
    try:
        # Check for different file extensions
        base_name = os.path.splitext(filename)[0]
        possible_files = [
            os.path.join(OUTPUT_FOLDER, filename),
            os.path.join(OUTPUT_FOLDER, base_name + '.wav'),
            os.path.join(OUTPUT_FOLDER, base_name + '.mp3'),
            os.path.join(OUTPUT_FOLDER, base_name + '.aiff')
        ]
        
        file_path = None
        mime_type = 'audio/wav'
        
        for path in possible_files:
            if os.path.exists(path):
                file_path = path
                if path.endswith('.mp3'):
                    mime_type = 'audio/mpeg'
                elif path.endswith('.aiff'):
                    mime_type = 'audio/aiff'
                elif path.endswith('.wav'):
                    mime_type = 'audio/wav'
                break
        
        if file_path and os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            print(f"Serving audio file: {file_path} ({file_size} bytes, {mime_type})")
            
            def generate():
                with open(file_path, 'rb') as f:
                    data = f.read(1024)
                    while data:
                        yield data
                        data = f.read(1024)
            
            return Response(
                generate(),
                mimetype=mime_type,
                headers={
                    'Content-Length': str(file_size),
                    'Accept-Ranges': 'bytes',
                    'Cache-Control': 'no-cache',
                    'Access-Control-Allow-Origin': '*'
                }
            )
        else:
            print(f"Audio file not found: {filename}")
            print(f"Checked paths: {possible_files}")
            return jsonify({'error': 'Audio file not found'}), 404
            
    except Exception as e:
        print(f"Audio serving error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/cleanup', methods=['POST'])
def cleanup_files():
    """Clean up old audio files"""
    try:
        import glob
        import time
        
        # Remove files older than 1 hour
        current_time = time.time()
        
        for folder in [UPLOAD_FOLDER, OUTPUT_FOLDER]:
            for file_path in glob.glob(os.path.join(folder, '*')):
                if os.path.isfile(file_path):
                    file_age = current_time - os.path.getctime(file_path)
                    if file_age > 3600:  # 1 hour
                        os.remove(file_path)
        
        return jsonify({'status': 'Cleanup completed'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/test_tts')
def test_tts():
    """Test TTS functionality"""
    try:
        test_text = "Hello, this is a test."
        test_filename = f"test_{uuid.uuid4().hex[:8]}.wav"
        test_path = os.path.join(OUTPUT_FOLDER, test_filename)
        
        print(f"Testing TTS with text: {test_text}")
        print(f"Test file path: {test_path}")
        
        # Make sure output folder exists
        os.makedirs(OUTPUT_FOLDER, exist_ok=True)
        
        # Test TTS
        success = False
        error_msg = None
        
        try:
            success = translator.text_to_speech(test_text, test_path)
        except Exception as tts_error:
            error_msg = str(tts_error)
            print(f"TTS Error: {error_msg}")
        
        # Check what files exist
        files_info = []
        try:
            if os.path.exists(OUTPUT_FOLDER):
                for file in os.listdir(OUTPUT_FOLDER):
                    file_path = os.path.join(OUTPUT_FOLDER, file)
                    if os.path.isfile(file_path):
                        size = os.path.getsize(file_path)
                        files_info.append(f"{file} ({size} bytes)")
        except Exception as list_error:
            files_info.append(f"Error listing files: {str(list_error)}")
        
        # Check if test file was created
        test_file_exists = os.path.exists(test_path)
        test_file_size = os.path.getsize(test_path) if test_file_exists else 0
        
        return jsonify({
            'tts_success': success,
            'test_file': test_filename if success and test_file_exists else None,
            'test_file_exists': test_file_exists,
            'test_file_size': test_file_size,
            'files_in_output': files_info,
            'output_folder': os.path.abspath(OUTPUT_FOLDER),
            'error_msg': error_msg,
            'folder_exists': os.path.exists(OUTPUT_FOLDER)
        })
        
    except Exception as e:
        print(f"Test TTS endpoint error: {e}")
        return jsonify({
            'error': str(e),
            'tts_success': False,
            'test_file': None,
            'files_in_output': [],
            'output_folder': os.path.abspath(OUTPUT_FOLDER) if 'OUTPUT_FOLDER' in globals() else 'Unknown'
        }), 200  # Return 200 to ensure JSON is returned

@app.route('/list_audio_files')
def list_audio_files():
    """List all audio files in output directory"""
    try:
        files = []
        folder_exists = os.path.exists(OUTPUT_FOLDER)
        
        if folder_exists:
            try:
                for file in os.listdir(OUTPUT_FOLDER):
                    file_path = os.path.join(OUTPUT_FOLDER, file)
                    if os.path.isfile(file_path):
                        size = os.path.getsize(file_path)
                        files.append({
                            'name': file,
                            'size': size,
                            'path': file_path
                        })
            except Exception as list_error:
                print(f"Error listing files: {list_error}")
                return jsonify({
                    'error': f"Error listing files: {str(list_error)}",
                    'files': [],
                    'folder': os.path.abspath(OUTPUT_FOLDER),
                    'folder_exists': folder_exists
                }), 200
        
        return jsonify({
            'files': files,
            'folder': os.path.abspath(OUTPUT_FOLDER),
            'folder_exists': folder_exists,
            'file_count': len(files)
        })
        
    except Exception as e:
        print(f"List audio files endpoint error: {e}")
        return jsonify({
            'error': str(e),
            'files': [],
            'folder': os.path.abspath(OUTPUT_FOLDER) if 'OUTPUT_FOLDER' in globals() else 'Unknown',
            'folder_exists': False
        }), 200  # Return 200 to ensure JSON is returned

@app.route('/debug_audio/<filename>')
def debug_audio(filename):
    """Debug audio serving with detailed information"""
    try:
        # Check for different file extensions
        base_name = os.path.splitext(filename)[0]
        possible_files = [
            os.path.join(OUTPUT_FOLDER, filename),
            os.path.join(OUTPUT_FOLDER, base_name + '.wav'),
            os.path.join(OUTPUT_FOLDER, base_name + '.mp3'),
            os.path.join(OUTPUT_FOLDER, base_name + '.aiff')
        ]
        
        debug_info = {
            'requested_file': filename,
            'base_name': base_name,
            'output_folder': os.path.abspath(OUTPUT_FOLDER),
            'possible_files': [],
            'found_file': None,
            'file_info': {}
        }
        
        for path in possible_files:
            file_exists = os.path.exists(path)
            file_size = os.path.getsize(path) if file_exists else 0
            
            debug_info['possible_files'].append({
                'path': path,
                'exists': file_exists,
                'size': file_size
            })
            
            if file_exists and file_size > 0:
                debug_info['found_file'] = path
                debug_info['file_info'] = {
                    'name': os.path.basename(path),
                    'size': file_size,
                    'extension': os.path.splitext(path)[1],
                    'full_path': os.path.abspath(path)
                }
                break
        
        return jsonify(debug_info)
        
    except Exception as e:
        return jsonify({'error': str(e), 'debug_info': debug_info}), 500

@app.route('/simple_audio/<filename>')
def simple_audio(filename):
    """Simple audio serving for testing"""
    try:
        file_path = os.path.join(OUTPUT_FOLDER, filename)
        
        if not os.path.exists(file_path):
            return jsonify({'error': f'File not found: {filename}'}), 404
        
        print(f"🎵 Serving simple audio: {file_path}")
        
        # Use send_file with explicit mimetype
        return send_file(
            file_path,
            mimetype='audio/wav',
            as_attachment=False,
            download_name=filename
        )
        
    except Exception as e:
        print(f"❌ Simple audio error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/audio/<filename>')
def serve_audio_direct(filename):
    """Direct audio serving - simple and reliable"""
    try:
        file_path = os.path.join(OUTPUT_FOLDER, filename)
        
        print(f"🎵 Direct audio request: {filename}")
        print(f"🎵 File path: {file_path}")
        print(f"🎵 File exists: {os.path.exists(file_path)}")
        
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            print(f"🎵 File size: {file_size} bytes")
            
            # Simple direct file serving
            return send_file(file_path, mimetype='audio/wav')
        else:
            print(f"❌ Audio file not found: {file_path}")
            return "Audio file not found", 404
            
    except Exception as e:
        print(f"❌ Direct audio error: {e}")
        return f"Audio error: {str(e)}", 500

@app.route('/test_audio_file')
def create_test_audio():
    """Create and serve a simple test audio file"""
    try:
        test_filename = "test_beep.wav"
        test_path = os.path.join(OUTPUT_FOLDER, test_filename)
        
        print(f"🔊 Creating test audio file: {test_path}")
        
        # Create the test audio file
        success = translator.create_simple_beep(test_path)
        
        if success and os.path.exists(test_path):
            file_size = os.path.getsize(test_path)
            print(f"✅ Test audio created: {file_size} bytes")
            
            return jsonify({
                'success': True,
                'filename': test_filename,
                'size': file_size,
                'url': f'/audio/{test_filename}',
                'path': test_path
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to create test audio file'
            }), 500
            
    except Exception as e:
        print(f"❌ Test audio creation error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/translate_audio', methods=['POST'])
def api_translate_audio():
    """API endpoint for external audio upload: returns Gemini English, Dzongkha, and audio URL"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': 'No audio file selected'}), 400
        
        # Generate unique filename
        file_extension = '.webm'
        if audio_file.filename and '.' in audio_file.filename:
            file_extension = os.path.splitext(audio_file.filename)[1]
        filename = f"api_{uuid.uuid4().hex[:8]}{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        audio_file.save(file_path)
        print(f"[API] Saved audio file: {file_path} (size: {os.path.getsize(file_path)} bytes)")
        
        # Speech to text
        recognized_text = translator.speech_to_text(file_path)
        if not recognized_text:
            print(f"[API] Speech recognition failed for file: {file_path}")
            return jsonify({'error': 'Could not understand audio.'}), 400
        print(f"[API] Recognized speech: {recognized_text}")
        
        # Gemini
        gemini_api_key = "AIzaSyCEIROfUQirqNtK4Np2Gls-qrYIcQqqFdo"
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        gemini_response = model.generate_content(recognized_text)
        english_text = gemini_response.text.strip() if hasattr(gemini_response, 'text') else str(gemini_response)
        print(f"[API] Gemini response: {english_text}")
        
        # Dzongkha
        dzongkha_text = translator.translate_text(english_text)
        if not dzongkha_text:
            return jsonify({'error': 'Dzongkha translation failed'}), 500
        
        # TTS
        audio_filename = f"tts_{uuid.uuid4().hex[:8]}.wav"
        audio_path = os.path.join(OUTPUT_FOLDER, audio_filename)
        audio_generated = translator.text_to_speech(dzongkha_text, audio_path)
        actual_audio_file = None
        if audio_generated:
            base_name = os.path.splitext(audio_filename)[0]
            possible_files = [audio_filename, base_name + '.mp3', base_name + '.aiff']
            for fname in possible_files:
                fpath = os.path.join(OUTPUT_FOLDER, fname)
                if os.path.exists(fpath) and os.path.getsize(fpath) > 100:
                    actual_audio_file = fname
                    break
        audio_url = f"/audio/{actual_audio_file}" if actual_audio_file else None
        
        return jsonify({
            'gemini_english': english_text,
            'dzongkha': dzongkha_text,
            'audio_url': audio_url,
            'audio_file': actual_audio_file,
            'success': True
        })
    except Exception as e:
        print(f"[API] Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Enhanced Flask Speech Translator...")
    print("=" * 50)
    print("📦 Required packages:")
    print("   pip install flask speechrecognition pyttsx3 requests pyaudio")
    print("   pip install gtts  # For better text-to-speech quality")
    print()
    
    # Check optional packages
    try:
        import gtts
        print("✅ gTTS is installed (high-quality TTS)")
    except ImportError:
        print("⚠️  gTTS not installed (install for better audio quality)")
        print("   pip install gtts")
    
    try:
        import subprocess
        result = subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ FFmpeg is installed (audio conversion)")
        else:
            print("⚠️  FFmpeg not found (install for better audio support)")
    except:
        print("⚠️  FFmpeg not found (install for better audio support)")
    
    print()
    print("📂 Audio files will be saved in:")
    print(f"   Input:  {os.path.abspath(UPLOAD_FOLDER)}")
    print(f"   Output: {os.path.abspath(OUTPUT_FOLDER)}")
    print()
    print("💡 For better audio support, install FFmpeg:")
    print("   Mac:     brew install ffmpeg")
    print("   Ubuntu:  sudo apt install ffmpeg")
    print("   Windows: Download from https://ffmpeg.org")
    print()
    print("🌐 Open your browser to: http://localhost:5000")
    print("🎤 Make sure to allow microphone access!")
    print("🔧 Check the debug console (F12) for troubleshooting info")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)