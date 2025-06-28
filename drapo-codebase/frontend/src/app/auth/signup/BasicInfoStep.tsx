"use client";
import { useState } from "react";

interface FamilyMember {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
}

interface BasicInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  nationality: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  mother: FamilyMember;
  father: FamilyMember;
  spouse: FamilyMember;
  children: FamilyMember[];
}

export default function BasicInfoStep({
  onNext,
}: Readonly<{
  onNext: (data: BasicInfoForm) => void;
}>) {
  const [form, setForm] = useState<BasicInfoForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    nationality: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    mother: { fullName: "", dateOfBirth: "", nationality: "" },
    father: { fullName: "", dateOfBirth: "", nationality: "" },
    spouse: { fullName: "", dateOfBirth: "", nationality: "" },
    children: [],
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFamilyChange = (
    relation: keyof Omit<BasicInfoForm, "children">,
    field: keyof FamilyMember,
    value: string,
  ) => {
    setForm({
      ...form,
      [relation]: { ...(form[relation] as FamilyMember), [field]: value },
    });
  };

  const handleChildChange = (
    idx: number,
    field: keyof FamilyMember,
    value: string,
  ) => {
    const updated = form.children.map((child, i) =>
      i === idx ? { ...child, [field]: value } : child,
    );
    setForm({ ...form, children: updated });
  };

  const addChild = () => {
    setForm({
      ...form,
      children: [
        ...form.children,
        { fullName: "", dateOfBirth: "", nationality: "" },
      ],
    });
  };

  const removeChild = (idx: number) => {
    setForm({
      ...form,
      children: form.children.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="mb-4 text-xl font-bold">Step 1: Basic Information</h2>
      <div className="flex space-x-2">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-1/2 rounded border px-3 py-2"
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-1/2 rounded border px-3 py-2"
        />
      </div>
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full rounded border px-3 py-2"
      />
      <div className="flex space-x-2">
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-1/2 rounded border px-3 py-2"
        />
        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-1/2 rounded border px-3 py-2"
        />
      </div>
      <input
        name="dateOfBirth"
        type="date"
        value={form.dateOfBirth}
        onChange={handleChange}
        placeholder="Date of Birth"
        className="w-full rounded border px-3 py-2"
      />
      <input
        name="nationality"
        value={form.nationality}
        onChange={handleChange}
        placeholder="Nationality"
        className="w-full rounded border px-3 py-2"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full rounded border px-3 py-2"
      />
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full rounded border px-3 py-2"
      />
      <div className="flex space-x-2">
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-1/3 rounded border px-3 py-2"
        />
        <input
          name="state"
          value={form.state}
          onChange={handleChange}
          placeholder="State/Province"
          className="w-1/3 rounded border px-3 py-2"
        />
        <input
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          placeholder="Postal Code"
          className="w-1/3 rounded border px-3 py-2"
        />
      </div>
      <input
        name="country"
        value={form.country}
        onChange={handleChange}
        placeholder="Country"
        className="w-full rounded border px-3 py-2"
      />
      <h3 className="mt-6 text-lg font-semibold">Family Information</h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium">
            Mother&apos;s Full Name
          </label>
          <input
            name="motherFullName"
            value={form.mother.fullName}
            onChange={(e) =>
              handleFamilyChange("mother", "fullName", e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mother&apos;s DOB</label>
          <input
            name="motherDOB"
            type="date"
            value={form.mother.dateOfBirth}
            onChange={(e) =>
              handleFamilyChange("mother", "dateOfBirth", e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Mother&apos;s Nationality
          </label>
          <input
            name="motherNationality"
            value={form.mother.nationality}
            onChange={(e) =>
              handleFamilyChange("mother", "nationality", e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium">
            Father&apos;s Full Name
          </label>
          <input
            name="fatherFullName"
            value={form.father.fullName}
            onChange={(e) =>
              handleFamilyChange("father", "fullName", e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Father&apos;s DOB</label>
          <input
            name="fatherDOB"
            type="date"
            value={form.father.dateOfBirth}
            onChange={(e) =>
              handleFamilyChange("father", "dateOfBirth", e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Father&apos;s Nationality
          </label>
          <input
            name="fatherNationality"
            value={form.father.nationality}
            onChange={(e) =>
              handleFamilyChange("father", "nationality", e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium">
            Spouse&apos;s Full Name
          </label>
          <input
            name="spouseFullName"
            value={form.spouse.fullName}
            onChange={(e) =>
              handleFamilyChange("spouse", "fullName", e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Spouse&apos;s DOB</label>
          <input
            name="spouseDOB"
            type="date"
            value={form.spouse.dateOfBirth}
            onChange={(e) =>
              handleFamilyChange("spouse", "dateOfBirth", e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Spouse&apos;s Nationality
          </label>
          <input
            name="spouseNationality"
            value={form.spouse.nationality}
            onChange={(e) =>
              handleFamilyChange("spouse", "nationality", e.target.value)
            }
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Children</label>
        {form.children.map((child, idx) => (
          <div key={idx} className="mb-2 flex flex-wrap items-end gap-2">
            <input
              placeholder="Full Name"
              value={child.fullName}
              onChange={(e) =>
                handleChildChange(idx, "fullName", e.target.value)
              }
              className="rounded border px-3 py-2"
            />
            <input
              type="date"
              placeholder="DOB"
              value={child.dateOfBirth}
              onChange={(e) =>
                handleChildChange(idx, "dateOfBirth", e.target.value)
              }
              className="rounded border px-3 py-2"
            />
            <input
              placeholder="Nationality"
              value={child.nationality}
              onChange={(e) =>
                handleChildChange(idx, "nationality", e.target.value)
              }
              className="rounded border px-3 py-2"
            />
            <button
              type="button"
              onClick={() => removeChild(idx)}
              className="rounded bg-red-500 px-2 py-1 text-white"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addChild}
          className="rounded bg-blue-500 px-3 py-1 text-white"
        >
          Add Child
        </button>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button
        type="submit"
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Next
      </button>
    </form>
  );
}
