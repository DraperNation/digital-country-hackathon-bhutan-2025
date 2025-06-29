import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mic, MicOff, Globe, MessageCircle, Settings, HelpCircle, Bot, Send, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

// Message interface
interface Message {
  sender: "user" | "bot";
  text: string;
  isAudio?: boolean;
  audioUrl?: string;
  englishTranslation?: string;
  ttsAudioUrl?: string;
}

const LANGUAGES = [
  { code: "dz", name: "Dzongkha", flag: "🇧🇹" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ne", name: "Nepali", flag: "🇳🇵" },
  { code: "sh", name: "Sharchop", flag: "🇧🇹" },
];

// Modern typing animation
const TypingIndicator = () => (
  <div className="flex items-center gap-2 p-4">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce" style={{ animationDuration: '0.8s' }}></div>
      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-blue-500 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.4s' }}></div>
    </div>
    <span className="text-sm text-gray-500 font-medium">BhutanAI is typing...</span>
  </div>
);

// Modern voice animation
const VoiceIndicator = ({ isActive }: { isActive: boolean }) => (
  <div className={`fixed top-6 right-6 z-50 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl p-4 shadow-2xl animate-pulse border-2 border-white/20">
      <div className="flex items-center gap-3">
        <Mic className="w-6 h-6" />
        <span className="font-semibold">Recording...</span>
      </div>
    </div>
  </div>
);

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTTSProcessing, setIsTTSProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("dz");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const OPENAI_API_KEY = "";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // TTS function to convert English text to speech
  const convertTextToSpeech = async (text: string): Promise<string | null> => {
    setIsTTSProcessing(true);
    try {
      const response = await fetch('http://localhost:3000/tools/TTS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      console.log('TTS response:', response);
      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('TTS data:', data);
      
      // Handle the new response structure
      if (data.success && data.data && data.data.audio_url) {
        console.log('✅ TTS Audio generated successfully:', data.data.audio_url);
        return data.data.audio_url;
      } else if (data.audio_url) {
        // Fallback for old format
        console.log('✅ TTS Audio generated successfully (fallback):', data.audio_url);
        return data.audio_url;
      }
      
      console.warn('⚠️ No audio URL found in TTS response');
      return null;
    } catch (error) {
      console.error('Error calling TTS API:', error);
      return null;
    } finally {
      setIsTTSProcessing(false);
    }
  };

  const sendMessageToOpenAI = async (userMessage: string) => {
    setIsLoading(true);
    try {
      const languageNames = {
        dz: "Dzongkha",
        en: "English", 
        ne: "Nepali",
        sh: "Sharchop"
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are BhutanAI, a helpful AI assistant for Bhutan. Always respond in ${languageNames[selectedLanguage as keyof typeof languageNames]} language. Be culturally appropriate and helpful. Keep responses concise and friendly.`
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        const botResponse = data.choices[0].message.content;
        
        // Check if the response contains English text and convert to speech
        let ttsAudioUrl = null;
        if (selectedLanguage === "en" || botResponse.includes("English:")) {
          // Extract English text if it's in the response
          const englishMatch = botResponse.match(/English:\s*(.+)/);
          const textToConvert = englishMatch ? englishMatch[1] : botResponse;
          ttsAudioUrl = await convertTextToSpeech(textToConvert);
        }
        
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: botResponse,
          ttsAudioUrl: ttsAudioUrl
        }]);
      } else {
        throw new Error('No response from OpenAI');
      }
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      setMessages(prev => [...prev, { sender: "bot", text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setAudioChunks(chunks);
        setIsRecording(false);
        setIsVoiceActive(false);
        
        // Process the recorded audio
        await processAudioRecording(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setIsVoiceActive(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to use voice features.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  };

  const toggleVoice = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const processAudioRecording = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      // Create a timestamped filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `recording_${timestamp}.webm`;
      
      // Create file for API
      const file = new File([audioBlob], fileName, { type: 'audio/webm' });
      
      // First, save the recording locally to our server
      const localFormData = new FormData();
      localFormData.append('audio', file, fileName);
      
      try {
        const localResponse = await fetch('http://localhost:3001/api/save-recording', {
          method: 'POST',
          body: localFormData,
        });
        
        if (localResponse.ok) {
          const localData = await localResponse.json();
          console.log('Recording saved locally:', localData.file);
        } else {
          console.warn('Failed to save recording locally');
        }
      } catch (localError) {
        console.warn('Local server not running, skipping local save:', localError);
      }

      // Send to translation API
      const formData = new FormData();
      formData.append('audio', file, fileName);

      const response = await fetch('https://cors-anywhere-d4lv.onrender.com/https://b9af-106-51-68-85.ngrok-free.app/api/translate_audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.dzongkha) {
        // Add the recorded audio as a user message (showing it was sent)
        setMessages(prev => [...prev, { 
          sender: "user", 
          text: "🎤 Voice Message", 
          isAudio: true,
          audioUrl: `http://localhost:3001/recordings/${fileName}`
        }]);
        
        // Convert English translation to speech if available
        let ttsAudioUrl = null;
        if (data.gemini_english) {
          ttsAudioUrl = await convertTextToSpeech(data.gemini_english);
        }
        
        // Add the Dzongkha translation as a bot response
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: data.dzongkha,
          englishTranslation: data.gemini_english,
          ttsAudioUrl: ttsAudioUrl
        }]);
        
        console.log('Translated Dzongkha:', data.dzongkha);
        console.log('English translation:', data.gemini_english);
        console.log('TTS Audio URL:', ttsAudioUrl);
        console.log('Audio file:', data.audio_file);
        console.log('Audio URL:', data.audio_url);
        
        // Store metadata in localStorage
        try {
          const recordings = JSON.parse(localStorage.getItem('voiceRecordings') || '[]');
          recordings.push({
            id: timestamp,
            fileName: fileName,
            timestamp: new Date().toISOString(),
            size: audioBlob.size,
            localUrl: `http://localhost:3001/recordings/${fileName}`,
            apiResponse: data
          });
          localStorage.setItem('voiceRecordings', JSON.stringify(recordings));
        } catch (e) {
          console.warn('Could not save metadata:', e);
        }
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      
      // Check if it's a CORS error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: "Voice translation failed due to CORS restrictions. The API server needs to allow requests from this domain. Please use text input for now." 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: "Sorry, I couldn't process your voice message. Please try again." 
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
      setInput("");
      await sendMessageToOpenAI(userMessage);
    }
  };

  const viewLaws = () => {
    navigate('/laws');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl flex flex-col">
        {/* Sidebar Header */}
        <div className="p-8 border-b border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BhutanAI
              </h1>
              <p className="text-sm text-gray-600 font-medium">Your AI Companion</p>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-gray-600" size={18} />
            <span className="text-sm font-semibold text-gray-700">Language</span>
          </div>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full bg-white/50 border-white/30 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-3">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 p-6">
          <nav className="space-y-3">
            <button className="w-full flex items-center gap-4 px-4 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Chat</span>
            </button>
            <button 
              onClick={viewLaws}
              className="w-full flex items-center gap-4 px-4 py-3 text-left text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <span className="font-semibold">Laws</span>
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-left text-gray-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 rounded-xl transition-all duration-300 group">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Settings</span>
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-3 text-left text-gray-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 rounded-xl transition-all duration-300 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Help</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700">Powered by BhutanAI</span>
            </div>
            <p className="text-xs text-gray-500">Experience the future of AI</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm">
        {/* Chat Header */}
        <div className="p-8 border-b border-white/20 bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Chat with BhutanAI</h2>
              <p className="text-gray-600 font-medium">Ask me anything about Bhutan's culture, history, or language</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Bot className="w-12 h-12 text-white" />
              </div>
              <div className="max-w-md space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Welcome to BhutanAI!</h3>
                <p className="text-gray-600 leading-relaxed">
                  I'm your AI assistant for all things Bhutan. Ask me about the culture, 
                  language, history, or start a conversation in Dzongkha.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Ready to help you explore Bhutan</span>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-4 duration-500`}
              >
                <div
                  className={`px-6 py-4 rounded-3xl max-w-[75%] shadow-lg backdrop-blur-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-xl"
                      : "bg-white/80 text-gray-900 rounded-bl-xl border border-white/20"
                  }`}
                >
                  {msg.isAudio ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-xl">🎤</span>
                        </div>
                        <span className="font-semibold">{msg.text}</span>
                      </div>
                      <audio 
                        controls 
                        className="w-48 h-10 rounded-xl bg-white/10 border border-white/20"
                        style={{ 
                          filter: msg.sender === "user" ? "invert(1)" : "none"
                        }}
                      >
                        <source src={msg.audioUrl} type="audio/webm" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm leading-relaxed">{msg.text}</div>
                      {msg.englishTranslation && (
                        <div className="pt-2 border-t border-white/20">
                          <div className="text-xs text-black italic mb-2">
                            English: {msg.englishTranslation}
                          </div>
                          {msg.ttsAudioUrl && (
                            <div className="flex items-center gap-3 p-2 bg-white/20 rounded-lg">
                              <span className="text-sm">🔊</span>
                              <span className="text-xs text-gray-700 font-medium">Listen to English:</span>
                              <audio 
                                controls 
                                className="w-48 h-10 rounded-lg bg-white/30 border border-white/40"
                                style={{ 
                                  filter: msg.sender === "user" ? "invert(1)" : "none"
                                }}
                              >
                                <source src={msg.ttsAudioUrl} type="audio/wav" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}
                        </div>
                      )}
                      {!msg.englishTranslation && msg.ttsAudioUrl && (
                        <div className="pt-2 border-t border-white/20">
                          <div className="flex items-center gap-3 p-2 bg-white/20 rounded-lg">
                            <span className="text-sm">🔊</span>
                            <span className="text-xs text-gray-700 font-medium">Listen:</span>
                            <audio 
                              controls 
                              className="w-48 h-10 rounded-lg bg-white/30 border border-white/40"
                              style={{ 
                                filter: msg.sender === "user" ? "invert(1)" : "none"
                              }}
                            >
                              <source src={msg.ttsAudioUrl} type="audio/wav" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start animate-in slide-in-from-bottom-4 duration-500">
              <div className="px-6 py-4 rounded-3xl bg-white/80 text-gray-900 rounded-bl-xl border border-white/20 shadow-lg backdrop-blur-sm">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-white/20 bg-white/40 backdrop-blur-sm">
          <form
            className="flex items-center gap-4"
            onSubmit={handleSubmit}
          >
            <div className="flex-1 relative">
              <Input
                className="w-full bg-white/80 border-white/30 focus:border-blue-500 focus:ring-blue-500/20 rounded-2xl px-6 py-4 text-base shadow-lg backdrop-blur-sm"
                placeholder="Type your message or ask about Bhutan..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading || isRecording}
                autoFocus
              />
            </div>
            
            {/* Voice Recording Button */}
            <Button
              type="button"
              onClick={toggleVoice}
              disabled={isLoading}
              variant="outline"
              size="icon"
              className={`w-14 h-14 rounded-2xl transition-all duration-300 shadow-lg backdrop-blur-sm ${
                isRecording
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500 hover:from-red-600 hover:to-pink-600 animate-pulse'
                  : 'bg-white/80 border-white/30 hover:bg-white hover:border-blue-500 hover:scale-105'
              }`}
              title="Click to record voice message"
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </Button>

            {/* Recording Timer */}
            {isRecording && (
              <div className="text-lg text-red-500 font-mono font-bold bg-white/80 px-4 py-2 rounded-xl shadow-lg">
                {formatTime(recordingTime)}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !input.trim() || isRecording}
              className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send size={20} />
            </Button>
          </form>
          
          {/* Recording Status */}
          {isRecording && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-2xl text-sm font-semibold shadow-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                Recording... Click microphone to stop
              </div>
            </div>
          )}
          
          {/* Processing Status */}
          {isLoading && !isRecording && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-2xl text-sm font-semibold shadow-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                {isTTSProcessing ? "Generating speech..." : "Translating voice message to Dzongkha..."}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voice Indicator */}
      <VoiceIndicator isActive={isVoiceActive} />
    </div>
  );
};

export default ChatbotPage; 