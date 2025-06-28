"use client";
import { useState } from "react";

const applicantTypes = [
  { value: "individual", label: "Individual" },
  { value: "foreign", label: "Foreign Resident" },
];

function IndividualForm({
  onSubmit,
}: Readonly<{ onSubmit: (data: any) => void }>) {
  const [name, setName] = useState("");
  const [cid, setCid] = useState("");
  return (
    <form
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, cid });
        setName("");
        setCid("");
      }}
    >
      <h3 className="font-semibold">Individual Details</h3>
      <input
        className="mt-2 block w-full rounded border px-2 py-1"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="mt-2 block w-full rounded border px-2 py-1"
        placeholder="CID Number"
        value={cid}
        onChange={(e) => setCid(e.target.value)}
        required
      />
      <button
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        type="submit"
      >
        Generate Tax ID
      </button>
    </form>
  );
}

function ForeignForm({
  onSubmit,
}: Readonly<{ onSubmit: (data: any) => void }>) {
  const [name, setName] = useState("");
  const [passport, setPassport] = useState("");
  return (
    <form
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, passport });
        setName("");
        setPassport("");
      }}
    >
      <h3 className="font-semibold">Foreign Resident Details</h3>
      <input
        className="mt-2 block w-full rounded border px-2 py-1"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="mt-2 block w-full rounded border px-2 py-1"
        placeholder="Passport Number"
        value={passport}
        onChange={(e) => setPassport(e.target.value)}
        required
      />
      <button
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        type="submit"
      >
        Generate Tax ID
      </button>
    </form>
  );
}

export default function TaxIDPage() {
  const [type, setType] = useState("individual");
  const [taxRecords, setTaxRecords] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("taxRecords");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  function saveRecord(record: any) {
    const id = "TAX-" + Math.floor(10000000 + Math.random() * 90000000);
    const newRecord = {
      type,
      ...record,
      taxId: id,
      date: new Date().toLocaleString(),
    };
    setTaxRecords((prev) => {
      const updated = [newRecord, ...prev];
      if (typeof window !== "undefined")
        localStorage.setItem("taxRecords", JSON.stringify(updated));
      return updated;
    });
  }

  let form = null;
  if (type === "individual") form = <IndividualForm onSubmit={saveRecord} />;
  if (type === "foreign") form = <ForeignForm onSubmit={saveRecord} />;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Tax ID Issuance</h2>
      <p>
        Select applicant type and fill in the details to generate a mock Tax ID.
      </p>
      <div className="mt-4 flex gap-4">
        {applicantTypes.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2">
            <input
              type="radio"
              name="applicantType"
              value={opt.value}
              checked={type === opt.value}
              onChange={() => setType(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
      {form}
      <div className="mt-8">
        <h3 className="mb-2 text-xl font-semibold">Generated Tax Records</h3>
        {taxRecords.length === 0 && (
          <div className="text-gray-500">No records yet.</div>
        )}
        <ul>
          {taxRecords.map((rec, idx) => (
            <li
              key={"tax-record-" + idx}
              className="mb-2 rounded border bg-gray-50 p-3"
            >
              <div>
                <b>Type:</b>{" "}
                {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
              </div>
              {rec.type === "individual" && (
                <div>
                  <b>Name:</b> {rec.name} <b>CID:</b> {rec.cid}
                </div>
              )}
              {rec.type === "foreign" && (
                <div>
                  <b>Name:</b> {rec.name} <b>Passport:</b> {rec.passport}
                </div>
              )}
              <div>
                <b>Tax ID:</b> <span className="font-mono">{rec.taxId}</span>
              </div>
              <div className="text-xs text-gray-400">{rec.date}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
