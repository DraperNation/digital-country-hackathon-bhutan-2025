"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";

// Mock credentials data
const mockCredentials = [
  {
    id: "cred-1",
    type: ["VerifiableCredential", "DigitalPassport"],
    issuanceDate: "2024-06-01T12:00:00Z",
    credentialSubject: { name: "Kiran S.", id: "did:ebhutan:123" },
    issuer: "did:issuer:gov-bt",
    status: "valid",
    permissions: ["view", "share"],
  },
  {
    id: "cred-2",
    type: ["VerifiableCredential", "KYC"],
    issuanceDate: "2025-01-15T09:00:00Z",
    credentialSubject: { name: "Kiran S.", id: "did:ebhutan:123" },
    issuer: "did:issuer:bank-bt",
    status: "valid",
    permissions: ["view", "share", "verify"],
  },
];

function InfoTooltip() {
  const [show, setShow] = useState(false);
  return (
    <span className="relative ml-2 inline-block align-middle">
      <button
        className="text-blue-600 hover:text-blue-800 focus:outline-none"
        aria-label="Show info"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        tabIndex={0}
        type="button"
      >
        ℹ️
      </button>
      {show && (
        <div className="absolute left-6 top-0 z-10 w-64 rounded border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-lg">
          <div className="mb-2 font-semibold">What you can do here:</div>
          <ul className="list-disc space-y-1 pl-5">
            <li>View all your verifiable credentials</li>
            <li>Request new credentials from issuers</li>
            <li>Share credentials with third parties</li>
            <li>Verify credential authenticity</li>
            <li>Manage credential permissions</li>
          </ul>
        </div>
      )}
    </span>
  );
}

export default function VerifiableCredentialsPage() {
  const [credentials, setCredentials] = useState<any[]>(mockCredentials);
  const [loading] = useState(false);
  const [error] = useState("");
  const [showModal, setShowModal] = useState<null | string>(null);
  const [selected, setSelected] = useState<any>(null);
  const [showRequest, setShowRequest] = useState(false);
  const [showPermissions, setShowPermissions] = useState<null | any>(null);

  // Modal content for each action
  function renderModal() {
    if (!showModal || !selected) return null;
    if (showModal === "view") {
      return (
        <Modal onClose={() => setShowModal(null)} title="Credential Details">
          <pre className="overflow-x-auto rounded bg-gray-100 p-2 text-xs">
            {JSON.stringify(selected, null, 2)}
          </pre>
        </Modal>
      );
    }
    if (showModal === "share") {
      return (
        <Modal onClose={() => setShowModal(null)} title="Share Credential">
          <div className="mb-2">Share this credential with a third party:</div>
          <input
            className="mb-2 w-full rounded border p-2"
            placeholder="Enter recipient email or DID"
          />
          <button className="rounded bg-blue-600 px-4 py-2 text-white">
            Send
          </button>
        </Modal>
      );
    }
    if (showModal === "verify") {
      return (
        <Modal
          onClose={() => setShowModal(null)}
          title="Verify Credential Authenticity"
        >
          <div className="mb-2">Verification Result:</div>
          <div className="font-bold text-green-600">
            ✔️ Credential is valid and authentic.
          </div>
        </Modal>
      );
    }
    return null;
  }

  function renderPermissionsModal() {
    if (!showPermissions) return null;
    return (
      <Modal
        onClose={() => setShowPermissions(null)}
        title="Manage Permissions"
      >
        <div className="mb-2">Set permissions for this credential:</div>
        <div className="flex flex-col gap-2">
          {["view", "share", "verify"].map((perm) => (
            <label key={perm} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showPermissions.permissions.includes(perm)}
                onChange={() => {
                  setShowPermissions((prev: any) => {
                    const has = prev.permissions.includes(perm);
                    return {
                      ...prev,
                      permissions: has
                        ? prev.permissions.filter((p: string) => p !== perm)
                        : [...prev.permissions, perm],
                    };
                  });
                }}
              />
              {perm.charAt(0).toUpperCase() + perm.slice(1)}
            </label>
          ))}
        </div>
        <button
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
          onClick={() => {
            setCredentials((creds) =>
              creds.map((c) =>
                c.id === showPermissions.id
                  ? { ...c, permissions: showPermissions.permissions }
                  : c,
              ),
            );
            setShowPermissions(null);
          }}
        >
          Save
        </button>
      </Modal>
    );
  }

  function renderRequestModal() {
    if (!showRequest) return null;
    return (
      <Modal
        onClose={() => setShowRequest(false)}
        title="Request New Credential"
      >
        <div className="mb-2">Select credential type to request:</div>
        <select className="mb-4 w-full rounded border p-2">
          <option>Digital Passport</option>
          <option>KYC</option>
          <option>Business License</option>
        </select>
        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          Request
        </button>
      </Modal>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="flex items-center text-3xl font-bold text-gray-800">
          📜 Verifiable Credentials
          <InfoTooltip />
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your blockchain-based verifiable credentials and attestations
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800"></h2>
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            onClick={() => setShowRequest(true)}
          >
            Request Credential
          </button>
        </div>
        {loading ? (
          <div className="text-gray-500">Loading credentials...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : credentials.length === 0 ? (
          <div className="text-gray-500">No credentials found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {credentials.map((cred, i) => (
                <TableRow key={cred.id}>
                  <TableCell>{cred.type?.join(", ") || "-"}</TableCell>
                  <TableCell>
                    {cred.issuanceDate
                      ? new Date(cred.issuanceDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {cred.credentialSubject?.name ||
                      cred.credentialSubject?.id ||
                      "-"}
                  </TableCell>
                  <TableCell>{cred.issuer}</TableCell>
                  <TableCell>{cred.status}</TableCell>
                  <TableCell>
                    <button
                      className="mr-2 text-blue-600 hover:underline"
                      onClick={() => {
                        setSelected(cred);
                        setShowModal("view");
                      }}
                    >
                      View
                    </button>
                    <button
                      className="mr-2 text-green-600 hover:underline"
                      onClick={() => {
                        setSelected(cred);
                        setShowModal("share");
                      }}
                    >
                      Share
                    </button>
                    <button
                      className="mr-2 text-purple-600 hover:underline"
                      onClick={() => {
                        setSelected(cred);
                        setShowModal("verify");
                      }}
                    >
                      Verify
                    </button>
                    <button
                      className="text-gray-600 hover:underline"
                      onClick={() => setShowPermissions(cred)}
                    >
                      Permissions
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {renderModal()}
      {renderRequestModal()}
      {renderPermissionsModal()}
    </div>
  );
}

// Simple Modal component
function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative min-w-[320px] max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <button
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="mb-4 text-lg font-semibold">{title}</h3>
        {children}
      </div>
    </div>
  );
}
