'use client';

import { useState } from 'react';

type VerifiableCredential = {
  '@context': string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string;
    name: string;
    email: string;
    country: string;
    residencyStatus: string;
    passportNumber?: string;
    kycVerified: boolean;
  };
  proof: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    jws: string;
  };
  id: string;
  credentialStatus?: {
    id: string;
    type: string;
  };
};

type VCViewerProps = {
  vc: VerifiableCredential;
};

export default function VCViewer({ vc }: VCViewerProps) {
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['all']));

  const jsonString = JSON.stringify(vc, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const SectionCollapse = ({ title, children, sectionKey }: { title: string; children: React.ReactNode; sectionKey: string }) => {
    const isExpanded = expandedSections.has(sectionKey) || expandedSections.has('all');
    
    return (
      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isExpanded && (
          <div className="px-4 pb-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Raw Credential Data</h2>
            <p className="text-sm text-gray-600 mt-1">W3C Verifiable Credential in JSON format</p>
          </div>
          <button
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              copied 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy JSON
              </>
            )}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium">Context</div>
            <div className="text-sm text-blue-900">{vc['@context'].length} schemas</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium">Types</div>
            <div className="text-sm text-green-900">{vc.type.length} types</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-purple-600 font-medium">Issuer</div>
            <div className="text-sm text-purple-900 font-mono">{vc.issuer.split(':').pop()}</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-xs text-orange-600 font-medium">Proof</div>
            <div className="text-sm text-orange-900">{vc.proof.type}</div>
          </div>
        </div>
      </div>

      {/* Structured View */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Structured View</h3>
          <button
            onClick={() => setExpandedSections(expandedSections.has('all') ? new Set() : new Set(['all']))}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {expandedSections.has('all') ? 'Collapse All' : 'Expand All'}
          </button>
        </div>

        <SectionCollapse title="Context & Types" sectionKey="context">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500">@context</label>
              <div className="mt-1 space-y-1">
                {vc['@context'].map((context, index) => (
                  <div key={index} className="text-sm font-mono text-blue-600 bg-blue-50 rounded px-2 py-1">
                    {context}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">type</label>
              <div className="mt-1 flex gap-2">
                {vc.type.map((type, index) => (
                  <span key={index} className="text-sm font-mono text-green-600 bg-green-50 rounded px-2 py-1">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCollapse>

        <SectionCollapse title="Credential Subject" sectionKey="subject">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(vc.credentialSubject).map(([key, value]) => (
              <div key={key}>
                <label className="text-xs font-medium text-gray-500">{key}</label>
                <p className="mt-1 text-sm text-gray-900 font-mono break-all">
                  {typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)}
                </p>
              </div>
            ))}
          </div>
        </SectionCollapse>

        <SectionCollapse title="Cryptographic Proof" sectionKey="proof">
          <div className="space-y-3">
            {Object.entries(vc.proof).map(([key, value]) => (
              <div key={key}>
                <label className="text-xs font-medium text-gray-500">{key}</label>
                <p className={`mt-1 text-sm text-gray-900 ${key === 'jws' ? 'font-mono break-all bg-gray-50 rounded p-2' : ''}`}>
                  {String(value)}
                </p>
              </div>
            ))}
          </div>
        </SectionCollapse>

        <SectionCollapse title="Credential Metadata" sectionKey="metadata">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500">id</label>
              <p className="mt-1 text-sm text-gray-900 font-mono break-all">{vc.id}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">issuer</label>
              <p className="mt-1 text-sm text-gray-900 font-mono">{vc.issuer}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">issuanceDate</label>
              <p className="mt-1 text-sm text-gray-900">{new Date(vc.issuanceDate).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">expirationDate</label>
              <p className="mt-1 text-sm text-gray-900">{new Date(vc.expirationDate).toLocaleString()}</p>
            </div>
            {vc.credentialStatus && (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-500">credentialStatus.id</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono break-all">{vc.credentialStatus.id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">credentialStatus.type</label>
                  <p className="mt-1 text-sm text-gray-900">{vc.credentialStatus.type}</p>
                </div>
              </>
            )}
          </div>
        </SectionCollapse>
      </div>

      {/* Raw JSON */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw JSON</h3>
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            <code>{jsonString}</code>
          </pre>
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors"
            title="Copy to clipboard"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}