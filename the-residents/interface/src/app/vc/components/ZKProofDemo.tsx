'use client';

import { useState } from 'react';

// ZK Proof Integration for Bhutan e-Residency
// This simulates the ZK proof generation and verification process

interface UserIdentity {
  name: string;
  nationality: string;
  dob: string;
}

interface ZKProof {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
  };
  publicSignals: string[];
}

// Simulate encoding user data to field elements
function encodeUserData(identity: UserIdentity): {
  nationality: string;
  secret: string;
  expectedNationality: string;
  commitmentHash: string;
} {
  // In a real implementation, this would use proper hashing
  // For demo purposes, we'll use simple encoding
  
  const nationalityCode = identity.nationality === "Bhutan" ? "1234567" : "0000000";
  const secret = "9876543"; // Random secret for commitment
  const expectedNationality = "1234567"; // Hash of "Bhutan"
  
  // Simple commitment: nationality^2 + secret^2
  const nationalityNum = parseInt(nationalityCode);
  const secretNum = parseInt(secret);
  const commitmentHash = (nationalityNum * nationalityNum + secretNum * secretNum).toString();
  
  return {
    nationality: nationalityCode,
    secret,
    expectedNationality,
    commitmentHash
  };
}

// Simulate ZK proof generation (in reality, this would call SnarkJS)
async function generateZKProof(identity: UserIdentity): Promise<ZKProof> {
  console.log("🔐 Generating ZK proof for nationality verification...");
  
  const encodedData = encodeUserData(identity);
  
  // Simulate proof generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock proof structure (in reality, this comes from SnarkJS)
  const mockProof: ZKProof = {
    proof: {
      pi_a: ["0x123abc...", "0x456def..."],
      pi_b: [["0x789ghi...", "0xabcjkl..."], ["0xdefmno...", "0x012pqr..."]],
      pi_c: ["0x345stu...", "0x678vwx..."]
    },
    publicSignals: [encodedData.expectedNationality, encodedData.commitmentHash]
  };
  
  console.log("✅ ZK proof generated successfully!");
  return mockProof;
}

// Simulate proof verification
async function verifyZKProof(proof: ZKProof): Promise<boolean> {
  console.log("🔍 Verifying ZK proof...");
  
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In reality, this would use the verification key and SnarkJS
  const isValid = proof.publicSignals.length > 0;
  
  console.log(isValid ? "✅ Proof verified!" : "❌ Proof invalid!");
  return isValid;
}

// React component for ZK proof demonstration
export default function ZKProofDemo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [proof, setProof] = useState<ZKProof | null>(null);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleGenerateProof = async () => {
    setIsGenerating(true);
    setProof(null);
    setVerificationResult(null);
    
    try {
      addLog("🚀 Starting ZK proof generation...");
      
      const userIdentity: UserIdentity = {
        name: "Sahin",
        nationality: "Bhutan",
        dob: "1999-02-16"
      };
      
      addLog("🔒 Encoding private identity data...");
      addLog("📝 Private data will NOT be revealed in proof");
      
      const generatedProof = await generateZKProof(userIdentity);
      setProof(generatedProof);
      
      addLog("✅ ZK proof generated successfully!");
      addLog("🎯 Proof shows: User is from Bhutan (without revealing name/DOB)");
      
    } catch (error) {
      addLog(`❌ Error generating proof: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerifyProof = async () => {
    if (!proof) return;
    
    setIsVerifying(true);
    
    try {
      addLog("🔍 Starting proof verification...");
      const isValid = await verifyZKProof(proof);
      setVerificationResult(isValid);
      
      if (isValid) {
        addLog("🎉 VERIFICATION SUCCESS: User proven to be from Bhutan!");
        addLog("🔐 Privacy preserved: No personal details revealed");
      } else {
        addLog("❌ VERIFICATION FAILED: Invalid proof");
      }
      
    } catch (error) {
      addLog(`❌ Error verifying proof: ${error}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🔐 Zero-Knowledge Nationality Proof
        </h2>
        <p className="text-gray-600 mb-6">
          Prove you're from Bhutan without revealing your identity details using advanced cryptographic techniques.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-900">How it works</h3>
              <p className="text-sm text-blue-700 mt-1">
                Zero-Knowledge proofs allow you to prove specific facts (like nationality) without revealing any other personal information. 
                This demo simulates the process using Circom circuits and SnarkJS.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleGenerateProof}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isGenerating ? "🔄 Generating Proof..." : "🚀 Generate ZK Proof"}
          </button>
          
          {proof && (
            <button
              onClick={handleVerifyProof}
              disabled={isVerifying}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-medium transition-colors ml-4"
            >
              {isVerifying ? "🔄 Verifying..." : "🔍 Verify Proof"}
            </button>
          )}
        </div>
      </div>

      {/* Proof Display */}
      {proof && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📄 Generated ZK Proof
          </h3>
          <div className="bg-white p-4 rounded border font-mono text-sm overflow-x-auto">
            <pre>{JSON.stringify(proof, null, 2)}</pre>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Public Signals:</strong> Only these values are revealed to the verifier</p>
            <p><strong>Proof:</strong> Cryptographic proof that private inputs satisfy the circuit constraints</p>
          </div>
        </div>
      )}

      {/* Verification Result */}
      {verificationResult !== null && (
        <div className={`rounded-lg border p-6 ${
          verificationResult 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-3 ${
            verificationResult ? 'text-green-900' : 'text-red-900'
          }`}>
            {verificationResult ? '✅ Verification Successful!' : '❌ Verification Failed!'}
          </h3>
          <p className={verificationResult ? 'text-green-700' : 'text-red-700'}>
            {verificationResult 
              ? 'The user has successfully proven Bhutanese nationality without revealing personal details!'
              : 'The proof verification failed. The user may not be from Bhutan or the proof is invalid.'
            }
          </p>
        </div>
      )}

      {/* Technical Details */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          🔧 Technical Implementation
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Circuit Design</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Circom circuit with nationality verification</li>
              <li>• Private inputs: name, nationality, DOB</li>
              <li>• Public inputs: expected nationality hash</li>
              <li>• Constraint: nationality === "Bhutan"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Proof System</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Groth16 zk-SNARK protocol</li>
              <li>• Trusted setup with Powers of Tau</li>
              <li>• SnarkJS for proof generation/verification</li>
              <li>• BN128 elliptic curve</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-black rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">
          📋 Process Logs
        </h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-green-400 font-mono text-sm">
              {log}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-400 font-mono text-sm">
              Click "Generate ZK Proof" to start the demonstration...
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 