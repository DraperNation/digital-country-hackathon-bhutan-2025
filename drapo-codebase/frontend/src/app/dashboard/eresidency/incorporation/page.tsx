"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

type LegalEntity = {
  id: number;
  name: string;
  type: string;
  address: string;
  director: string;
  status: string;
  documents?: { name: string; url: string }[];
  createdAt?: string;
  updatedAt?: string;
  ownerId?: number;
};

const steps = [
  "Enter Company Details",
  "Upload Required Documents",
  "Review & Submit",
];

export default function IncorporationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    type: "",
    address: "",
    director: "",
  });
  const [documents, setDocuments] = useState<File[]>([]);
  const [companies, setCompanies] = useState<LegalEntity[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [registrationDocs, setRegistrationDocs] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [inlineEditDetails, setInlineEditDetails] = useState<any>({});

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/legal-entities");
        if (!res.ok) throw new Error("Failed to fetch companies");
        const data = await res.json();
        setCompanies(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCompanyDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleProposalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProposalFile(e.target.files[0]);
    }
  };

  const handleRegistrationDocsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      setRegistrationDocs(Array.from(e.target.files));
    }
  };

  const handleAddCompany = () => {
    setShowForm(true);
    setIsEdit(false);
    setEditId(null);
    setCurrentStep(0);
    setCompanyDetails({ name: "", type: "", address: "", director: "" });
    setDocuments([]);
  };

  const handleEditCompany = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/legal-entities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyDetails),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update company");
      }
      const companiesRes = await fetch("/api/legal-entities");
      const data = await companiesRes.json();
      setCompanies(data);
      setShowForm(false);
      setIsEdit(false);
      setEditId(null);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/legal-entities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete company");
      }
      const companiesRes = await fetch("/api/legal-entities");
      const data = await companiesRes.json();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleFormNext = () => {
    setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
  };

  const handleFormBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const submitCompanyForm = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", companyDetails.name);
      formData.append("type", companyDetails.type);
      formData.append("address", companyDetails.address);
      formData.append("director", companyDetails.director);
      if (documents[0]) {
        formData.append("securityCertificate", documents[0]);
      }
      const res = await fetch("/api/legal-entities/reserve-name", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add company");
      }
      const companiesRes = await fetch("/api/legal-entities");
      const data = await companiesRes.json();
      setCompanies(data);
      setShowForm(false);
      setIsEdit(false);
      setEditId(null);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    if (isEdit && editId !== null) {
      await handleEditCompany(editId);
      return;
    }
    await submitCompanyForm();
  };

  const handleSubmitProposal = async (entityId: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!proposalFile) throw new Error("No proposal file selected");
      const formData = new FormData();
      formData.append("entityId", String(entityId));
      formData.append("proposal", proposalFile);
      const res = await fetch("/api/legal-entities/submit-proposal", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit proposal");
      }
      const companiesRes = await fetch("/api/legal-entities");
      const data = await companiesRes.json();
      setCompanies(data);
      setProposalFile(null);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterCompany = async (entityId: number) => {
    setLoading(true);
    setError(null);
    try {
      if (registrationDocs.length === 0)
        throw new Error("No registration documents selected");
      const formData = new FormData();
      formData.append("entityId", String(entityId));
      registrationDocs.forEach((file) => {
        formData.append("registrationDocs", file);
      });
      const res = await fetch("/api/legal-entities/register", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to register company");
      }
      const companiesRes = await fetch("/api/legal-entities");
      const data = await companiesRes.json();
      setCompanies(data);
      setRegistrationDocs([]);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const startInlineEdit = (company: any) => {
    setEditingId(company.id);
    setInlineEditDetails({ ...company });
  };

  const cancelInlineEdit = () => {
    setEditingId(null);
    setInlineEditDetails({});
  };

  const saveInlineEdit = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/legal-entities/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inlineEditDetails),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update company");
      }
      const companiesRes = await fetch("/api/legal-entities");
      const data = await companiesRes.json();
      setCompanies(data);
      setEditingId(null);
      setInlineEditDetails({});
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Company Incorporation</h2>
      {loading && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-20">
          <div className="rounded bg-white px-6 py-4 shadow">Processing...</div>
        </div>
      )}
      {!showForm && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Registered Companies</h3>
            <button
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              onClick={handleAddCompany}
            >
              + Add Company
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full max-w-xs rounded border px-3 py-2"
          />
          {loading && <div>Loading companies...</div>}
          {error && <div className="text-red-600">{error}</div>}
          <table className="mb-8 w-full border text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((c) => (
                <tr key={c.id} className="border-t">
                  {editingId === c.id ? (
                    <>
                      <td className="p-2">
                        <input
                          className="w-full rounded border px-2 py-1"
                          value={inlineEditDetails.name}
                          onChange={(e) =>
                            setInlineEditDetails((prev: any) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          className="w-full rounded border px-2 py-1"
                          value={inlineEditDetails.type}
                          onChange={(e) =>
                            setInlineEditDetails((prev: any) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="p-2">
                        <input
                          className="w-full rounded border px-2 py-1"
                          value={inlineEditDetails.status}
                          onChange={(e) =>
                            setInlineEditDetails((prev: any) => ({
                              ...prev,
                              status: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="flex gap-2 p-2">
                        <button
                          className="rounded bg-green-600 px-2 py-1 text-xs text-white"
                          onClick={() => saveInlineEdit(c.id)}
                        >
                          Save
                        </button>
                        <button
                          className="rounded bg-gray-400 px-2 py-1 text-xs text-white"
                          onClick={cancelInlineEdit}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{c.name}</td>
                      <td className="p-2">{c.type}</td>
                      <td className="p-2">
                        <span
                          className={
                            c.status === "Registered"
                              ? "font-semibold text-green-600"
                              : c.status === "Proposal Submitted"
                                ? "font-semibold text-blue-600"
                                : c.status === "Name Reserved"
                                  ? "font-semibold text-yellow-600"
                                  : "font-semibold text-gray-600"
                          }
                        >
                          {c.status}
                        </span>
                        {c.documents && c.documents.length > 0 && (
                          <ul className="mt-1 text-xs">
                            {c.documents.map((doc: any, idx: number) => (
                              <li key={idx} className="flex items-center gap-2">
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-700 underline"
                                >
                                  {doc.name}
                                </a>
                                <button
                                  className="text-xs text-red-500"
                                  onClick={async () => {
                                    setLoading(true);
                                    try {
                                      const res = await fetch(
                                        `/api/legal-entities/${c.id}/documents`,
                                        {
                                          method: "PATCH",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            remove: doc.url,
                                          }),
                                        },
                                      );
                                      if (res.ok) {
                                        const companiesRes = await fetch(
                                          "/api/legal-entities",
                                        );
                                        setCompanies(await companiesRes.json());
                                      }
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td className="flex gap-2 p-2">
                        <button
                          className="rounded bg-yellow-500 px-2 py-1 text-xs text-white"
                          onClick={() => startInlineEdit(c)}
                        >
                          Inline Edit
                        </button>
                        <button
                          className="rounded bg-red-600 px-2 py-1 text-xs text-white"
                          onClick={() => handleDeleteCompany(c.id)}
                        >
                          Delete
                        </button>
                        <label className="cursor-pointer rounded bg-blue-500 px-2 py-1 text-xs text-white">
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleProposalFileChange}
                          />
                          Upload Proposal
                        </label>
                        <button
                          className="rounded bg-green-600 px-2 py-1 text-xs text-white"
                          onClick={() => handleSubmitProposal(c.id)}
                          disabled={!proposalFile}
                        >
                          Submit Proposal
                        </button>
                        <label className="cursor-pointer rounded bg-purple-500 px-2 py-1 text-xs text-white">
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleRegistrationDocsChange}
                          />
                          Upload Registration Docs
                        </label>
                        <button
                          className="rounded bg-indigo-600 px-2 py-1 text-xs text-white"
                          onClick={() => handleRegisterCompany(c.id)}
                          disabled={registrationDocs.length === 0}
                        >
                          Register
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-2 text-gray-500">
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {showForm && (
        <div className="mb-4">
          <ol className="mb-6 list-inside list-decimal text-gray-700">
            {steps.map((step, idx) => (
              <li
                key={step}
                className={
                  idx === currentStep ? "font-semibold text-blue-700" : ""
                }
              >
                {step}
              </li>
            ))}
          </ol>
          {currentStep === 0 && (
            <form className="space-y-4">
              <div>
                <label className="mb-1 block font-medium">Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={companyDetails.name}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2"
                  placeholder="e.g. Bhutan Tech Ltd."
                />
              </div>
              <div>
                <label className="mb-1 block font-medium">Company Type</label>
                <select
                  name="type"
                  value={companyDetails.type}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="">Select type</option>
                  <option value="Private Limited">Private Limited</option>
                  <option value="Public Limited">Public Limited</option>
                  <option value="Sole Proprietorship">
                    Sole Proprietorship
                  </option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block font-medium">
                  Registered Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={companyDetails.address}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2"
                  placeholder="e.g. Thimphu, Bhutan"
                />
              </div>
              <div>
                <label className="mb-1 block font-medium">Director Name</label>
                <input
                  type="text"
                  name="director"
                  value={companyDetails.director}
                  onChange={handleInputChange}
                  className="w-full rounded border px-3 py-2"
                  placeholder="e.g. Karma Dorji"
                />
              </div>
            </form>
          )}
          {currentStep === 1 && (
            <div>
              <label className="mb-2 block font-medium">
                Upload Required Documents
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mb-2"
              />
              {documents.length > 0 && (
                <ul className="mt-2 text-sm text-gray-700">
                  {documents.map((file, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span>{file.name}</span>
                      {file.type.startsWith("image/") && (
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-8 w-8 rounded object-cover"
                          width={32}
                          height={32}
                          unoptimized
                        />
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {documents.length === 0 && (
                <ul className="text-sm text-gray-700">
                  <li>No documents uploaded yet.</li>
                </ul>
              )}
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <h3 className="mb-2 font-semibold">Review Information</h3>
              <div className="mb-2">
                <span className="font-medium">Company Name:</span>{" "}
                {companyDetails.name || (
                  <span className="text-gray-400">(not provided)</span>
                )}
              </div>
              <div className="mb-2">
                <span className="font-medium">Type:</span>{" "}
                {companyDetails.type || (
                  <span className="text-gray-400">(not provided)</span>
                )}
              </div>
              <div className="mb-2">
                <span className="font-medium">Address:</span>{" "}
                {companyDetails.address || (
                  <span className="text-gray-400">(not provided)</span>
                )}
              </div>
              <div className="mb-2">
                <span className="font-medium">Director:</span>{" "}
                {companyDetails.director || (
                  <span className="text-gray-400">(not provided)</span>
                )}
              </div>
              <div className="mb-2">
                <span className="font-medium">Documents:</span>
                <ul className="ml-4 list-disc">
                  {documents.length === 0 && (
                    <li className="text-gray-400">No documents uploaded</li>
                  )}
                  {documents.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  className="rounded bg-gray-300 px-4 py-2"
                  onClick={() => setShowForm(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded bg-green-600 px-4 py-2 text-white"
                  onClick={handleFormSubmit}
                  type="button"
                >
                  {isEdit ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <button
              className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
              onClick={handleFormBack}
              disabled={currentStep === 0}
              type="button"
            >
              Back
            </button>
            <button
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
              onClick={handleFormNext}
              disabled={currentStep === steps.length - 1}
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
