#!/usr/bin/env python3
"""
🇧🇹 Bhutan E-Residency Agent Demo

This script demonstrates how to set up and use the Bhutan E-Residency Agent
for Digital Drukyul initiatives and e-residency support.

Usage:
    python bhutan_eresidency_demo.py
"""

import asyncio
import os
from dotenv import load_dotenv

# Import the Bhutan E-Residency Agent
from bhutan_eresidency_agent import (
    initialize_bhutan_eresidency_demo,
    create_eresidency_service_collection,
    ask_eresidency_agent,
    list_eresidency_services,
    test_bhutan_eresidency_system
)

load_dotenv()

async def demo_bhutan_eresidency():
    """Demo of Bhutan E-Residency Agent capabilities."""
    
    print("🇧🇹 Bhutan E-Residency Agent Demo")
    print("=" * 50)
    
    # Test system functionality
    print("\n1. Testing Bhutan E-Residency System...")
    test_result = await test_bhutan_eresidency_system()
    print(test_result)
    
    # Initialize demo with core Bhutan government services
    print("\n2. Initializing Core Bhutan Government Services...")
    demo_result = await initialize_bhutan_eresidency_demo()
    print(demo_result)
    
    # List available services
    print("\n3. Listing Available Bhutan Government Services...")
    services_list = await list_eresidency_services()
    print(services_list)
    
    # Example queries for e-residency
    example_queries = [
        "What are the visa requirements for foreign entrepreneurs wanting to start a business in Bhutan?",
        "How do I register a technology company in Bhutan as a foreign investor?",
        "What environmental clearances are needed for a sustainable tourism business?",
        "What are the steps to obtain a work permit through the Digital Drukyul initiative?",
        "How can I access citizen services as an e-resident of Bhutan?"
    ]
    
    print("\n4. Example E-Residency Queries...")
    print("-" * 40)
    
    for i, query in enumerate(example_queries, 1):
        print(f"\n🔍 Query {i}: {query}")
        print("📝 Response:")
        
        try:
            response = await ask_eresidency_agent(query)
            # Truncate long responses for demo
            if len(response) > 500:
                response = response[:500] + "... [response truncated for demo]"
            print(response)
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print("-" * 40)

async def create_custom_eresidency_collection():
    """Create a custom Bhutan e-residency service collection."""
    
    print("\n5. Creating Custom E-Residency Collection...")
    
    # Custom collection focused on business setup
    business_services = [
        "https://g2b.gov.bt",  # Business registration
        "https://bhutan.eregulations.org",  # Regulatory procedures
        "https://immi.gov.bt",  # Immigration for business
        "https://moic.gov.bt"  # Digital infrastructure
    ]
    
    result = await create_eresidency_service_collection(
        name="Bhutan Business Setup for E-Residents",
        description="Specialized collection for foreign entrepreneurs and investors setting up businesses in Bhutan under the e-residency program. Includes business registration, regulatory compliance, immigration procedures, and digital infrastructure services.",
        service_urls=business_services,
        max_workers=2
    )
    
    print(result)
    
    # Test query on custom collection
    print("\n6. Testing Custom Collection...")
    query = "What are the complete steps to establish a fintech startup in Bhutan as a foreign e-resident?"
    
    try:
        response = await ask_eresidency_agent(query)
        print(f"📝 Response to business setup query:\n{response[:800]}...")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Main demo function."""
    
    # Check for required API keys
    required_keys = ["OPENAI_API_KEY", "GOOGLE_API_KEY"]
    missing_keys = [key for key in required_keys if not os.getenv(key) and not os.getenv("GEMINI_API_KEY")]
    
    if missing_keys:
        print("❌ Missing required API keys:")
        for key in missing_keys:
            print(f"   - {key}")
        print("\nPlease set these in your .env file:")
        print("   OPENAI_API_KEY=your_openai_key")
        print("   GOOGLE_API_KEY=your_gemini_key")
        return
    
    print("🇧🇹 Welcome to the Bhutan E-Residency Agent Demo!")
    print("Supporting Digital Drukyul and Gross National Happiness through AI")
    print()
    
    # Run the demo
    try:
        asyncio.run(demo_bhutan_eresidency())
        
        # Optional: Run custom collection demo
        print("\n" + "=" * 50)
        user_input = input("Would you like to create a custom business collection? (y/N): ")
        if user_input.lower() in ['y', 'yes']:
            asyncio.run(create_custom_eresidency_collection())
        
    except KeyboardInterrupt:
        print("\n🇧🇹 Demo interrupted. Thank you for exploring Bhutan's E-Residency services!")
    except Exception as e:
        print(f"❌ Demo error: {e}")
    
    print("\n🇧🇹 Demo completed. Ready to support your e-residency journey in Bhutan!")

if __name__ == "__main__":
    main() 