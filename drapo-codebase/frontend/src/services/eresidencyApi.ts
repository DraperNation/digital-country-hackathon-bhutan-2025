import axios from "axios";

export async function registerUser(userData: any) {
  // userData: { name, email, password, ...personal/family info }
  const form = { ...userData };
  // Convert nested objects/arrays to JSON strings for backend
  if (form.mother) form.mother = JSON.stringify(form.mother);
  if (form.father) form.father = JSON.stringify(form.father);
  if (form.spouse) form.spouse = JSON.stringify(form.spouse);
  if (form.children) form.children = JSON.stringify(form.children);
  const res = await axios.post("/api/user/register", form);
  return res.data;
}

export async function submitKYC(userId: number, kycData: any) {
  // kycData: { files from document and KYC steps }
  const formData = new FormData();
  formData.append("userId", String(userId));
  // Required files
  formData.append("passport", kycData.passport);
  formData.append("proofOfAddress", kycData.proofOfAddress);
  formData.append("photo", kycData.photo);
  formData.append("selfie", kycData.selfie);
  // Optional files
  if (kycData.nationalId) formData.append("nationalId", kycData.nationalId);
  if (kycData.fingerprintScan)
    formData.append("fingerprintScan", kycData.fingerprintScan);
  if (kycData.fingerprintImage)
    formData.append("fingerprintImage", kycData.fingerprintImage);
  if (kycData.signature) formData.append("signature", kycData.signature);
  // Other documents
  if (Array.isArray(kycData.otherDocuments)) {
    kycData.otherDocuments.forEach((doc: any) => {
      if (doc.file)
        formData.append("otherDocuments", doc.file, doc.name || doc.file.name);
    });
  }
  const res = await axios.post("/api/kyc", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
