#!/usr/bin/env python3
"""
Demo script for Bhutan Legal RAG Flask API
This demonstrates how to use the API programmatically
"""

import requests
import time
import json

API_BASE = "http://localhost:5000/api"

def demo_api():
    print("🇧🇹 Bhutan Legal RAG API Demo")
    print("=" * 50)
    
    # 1. Check health
    print("1. 🏥 Checking API health...")
    try:
        response = requests.get(f"{API_BASE}/health")
        if response.status_code == 200:
            print("✅ API is healthy!")
        else:
            print("❌ API health check failed")
            return
    except Exception as e:
        print(f"❌ Cannot connect to API: {e}")
        print("Make sure to run: python app.py")
        return
    
    # 2. Check documents
    print("\n2. 📚 Checking available documents...")
    response = requests.get(f"{API_BASE}/documents")
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            print(f"✅ Found {data['downloaded_count']}/{data['total_count']} documents")
            if data['downloaded_count'] == 0:
                print("⚠️ No documents downloaded. Starting download...")
                start_download()
        else:
            print(f"❌ Error: {data['error']}")
    
    # 3. Check RAG status
    print("\n3. 🤖 Checking AI system status...")
    response = requests.get(f"{API_BASE}/rag/status")
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            status = data['status']
            if status['is_setup']:
                print("✅ AI system is ready!")
                demo_chat()
            elif status['is_setting_up']:
                print("⏳ AI system is setting up...")
                wait_for_rag_setup()
            else:
                print("❌ AI system not setup. Starting setup...")
                setup_rag()
        else:
            print(f"❌ Error: {data['error']}")

def start_download():
    """Start document download"""
    print("📥 Starting document download...")
    response = requests.post(f"{API_BASE}/download/start")
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            print("✅ Download started!")
            wait_for_download()
        else:
            print(f"❌ Download failed: {data['error']}")
    else:
        print(f"❌ Download request failed: {response.status_code}")

def wait_for_download():
    """Wait for download to complete"""
    print("⏳ Waiting for downloads to complete...")
    while True:
        response = requests.get(f"{API_BASE}/download/status")
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                status = data['status']
                if not status['is_downloading']:
                    print(f"✅ Download complete! {status['successful_downloads']} documents")
                    break
                else:
                    print(f"📥 Progress: {status['progress']}% - {status['current_document']}")
            time.sleep(3)
        else:
            print("❌ Error checking download status")
            break

def setup_rag():
    """Setup RAG system"""
    print("🧠 Setting up AI system...")
    response = requests.post(f"{API_BASE}/rag/setup")
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            print("✅ AI setup started!")
            wait_for_rag_setup()
        else:
            print(f"❌ AI setup failed: {data['error']}")
    else:
        print(f"❌ AI setup request failed: {response.status_code}")

def wait_for_rag_setup():
    """Wait for RAG setup to complete"""
    print("⏳ Waiting for AI system setup...")
    while True:
        response = requests.get(f"{API_BASE}/rag/status")
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                status = data['status']
                if status['is_setup']:
                    print("✅ AI system ready!")
                    demo_chat()
                    break
                elif status['error']:
                    print(f"❌ AI setup failed: {status['error']}")
                    break
                else:
                    print(f"🧠 Progress: {status['setup_progress']}% - {status['setup_stage']}")
            time.sleep(5)
        else:
            print("❌ Error checking AI status")
            break

def demo_chat():
    """Demo the chat functionality"""
    print("\n4. 💬 Testing AI Chat...")
    
    # Get suggestions first
    response = requests.get(f"{API_BASE}/chat/suggestions")
    if response.status_code == 200:
        data = response.json()
        if data['success']:
            suggestions = data['suggestions']
            print(f"📝 Got {len(suggestions)} suggestions")
    
    # Test questions
    test_questions = [
        "What are the fundamental rights in Bhutan's Constitution?",
        "What is the penalty for corruption in Bhutan?",
        "How is land ownership regulated in Bhutan?"
    ]
    
    for i, question in enumerate(test_questions, 1):
        print(f"\n📋 Test {i}: {question}")
        
        response = requests.post(f"{API_BASE}/chat", 
                               headers={'Content-Type': 'application/json'},
                               json={'question': question})
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                result = data['result']
                print(f"🤖 Answer: {result['answer']}")
                if result['sources']:
                    print(f"📚 Sources: {', '.join(result['sources'])}")
            else:
                print(f"❌ Chat error: {data['error']}")
        else:
            print(f"❌ Chat request failed: {response.status_code}")
        
        print("-" * 50)

def interactive_chat():
    """Interactive chat mode"""
    print("\n🎉 Starting interactive chat mode...")
    print("Type 'quit' to exit")
    
    while True:
        try:
            question = input("\n❓ Ask about Bhutan's law: ").strip()
            
            if question.lower() == 'quit':
                print("👋 Goodbye!")
                break
            elif not question:
                continue
            
            response = requests.post(f"{API_BASE}/chat", 
                                   headers={'Content-Type': 'application/json'},
                                   json={'question': question})
            
            if response.status_code == 200:
                data = response.json()
                if data['success']:
                    result = data['result']
                    print(f"\n🤖 Answer: {result['answer']}")
                    if result['sources']:
                        print(f"📚 Sources: {', '.join(result['sources'])}")
                else:
                    print(f"❌ Error: {data['error']}")
            else:
                print(f"❌ Request failed: {response.status_code}")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    demo_api()
    
    # Ask if user wants interactive mode
    choice = input("\n🎮 Want to try interactive chat? (y/n): ").strip().lower()
    if choice == 'y':
        interactive_chat() 