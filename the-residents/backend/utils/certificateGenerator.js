import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a company incorporation certificate PDF
 * @param {Object} companyData - Company information
 * @returns {Object} Certificate data with path and hash
 */
export const generateCompanyIncorporationCertificate = async (companyData) => {
  try {
    const {
      companyName,
      registrationNumber,
      taxId,
      ownerDirector,
      businessActivity,
      jurisdiction = 'Bhutan',
      incorporationDate,
      address,
      companyType,
      governanceModel
    } = companyData;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const certificatesDir = path.join(uploadsDir, 'certificates');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // Generate filename
    const timestamp = Date.now();
    const filename = `incorporation-certificate-${registrationNumber}-${timestamp}.pdf`;
    const filePath = path.join(certificatesDir, filename);

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Pipe to file
    doc.pipe(fs.createWriteStream(filePath));

    // Add header with Bhutan branding
    doc.fontSize(24)
       .fillColor('#1a365d')
       .text('KINGDOM OF BHUTAN', { align: 'center' })
       .fontSize(18)
       .text('Digital Residency Authority', { align: 'center' })
       .moveDown(0.5);

    // Add decorative line
    doc.strokeColor('#2d3748')
       .lineWidth(2)
       .moveTo(50, doc.y)
       .lineTo(550, doc.y)
       .stroke()
       .moveDown(1);

    // Certificate title
    doc.fontSize(20)
       .fillColor('#2d3748')
       .text('CERTIFICATE OF INCORPORATION', { align: 'center' })
       .moveDown(1);

    // Certificate content
    doc.fontSize(12)
       .fillColor('#000000')
       .text('This is to certify that:', { align: 'center' })
       .moveDown(0.5);

    // Company name (highlighted)
    doc.fontSize(18)
       .fillColor('#1a365d')
       .text(companyName, { align: 'center' })
       .moveDown(1);

    // Certificate body
    doc.fontSize(12)
       .fillColor('#000000')
       .text(`has been duly incorporated under the laws of ${jurisdiction} as a ${companyType} ` +
             `and is authorized to conduct business activities related to ${businessActivity}.`, 
             { align: 'justify' })
       .moveDown(1);

    // Company details table
    const startY = doc.y;
    const leftColumn = 80;
    const rightColumn = 300;
    const lineHeight = 25;

    const details = [
      ['Registration Number:', registrationNumber],
      ['Tax Identification:', taxId],
      ['Incorporation Date:', incorporationDate ? new Date(incorporationDate).toLocaleDateString() : new Date().toLocaleDateString()],
      ['Director:', ownerDirector],
      ['Registered Address:', address],
      ['Governance Model:', governanceModel],
      ['Jurisdiction:', jurisdiction]
    ];

    details.forEach((detail, index) => {
      const y = startY + (index * lineHeight);
      doc.fontSize(10)
         .fillColor('#4a5568')
         .text(detail[0], leftColumn, y)
         .fillColor('#000000')
         .text(detail[1], rightColumn, y);
    });

    doc.y = startY + (details.length * lineHeight) + 20;

    // Legal text
    doc.fontSize(10)
       .fillColor('#4a5568')
       .text('This certificate is issued under the authority of the Digital Residency Act of Bhutan ' +
             'and is valid for all legal and business purposes. The company is subject to the laws ' +
             'and regulations of Bhutan and must comply with all applicable requirements.', 
             { align: 'justify' })
       .moveDown(2);

    // Signature section
    const signatureY = doc.y + 30;
    
    // Digital signature placeholder
    doc.fontSize(10)
       .fillColor('#000000')
       .text('Digitally Signed', 400, signatureY)
       .text('Registrar of Companies', 400, signatureY + 15)
       .text('Kingdom of Bhutan', 400, signatureY + 30);

    // Date and seal
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 400, signatureY + 50);
    
    // Add verification QR code placeholder
    doc.fontSize(8)
       .fillColor('#4a5568')
       .text('Certificate Hash (for verification):', 50, signatureY + 60)
       .fontSize(8)
       .fillColor('#2d3748');

    // Generate certificate hash
    const certificateContent = `${companyName}-${registrationNumber}-${taxId}-${Date.now()}`;
    const certificateHash = crypto.createHash('sha256').update(certificateContent).digest('hex');
    
    doc.text(certificateHash, 50, signatureY + 75);

    // Footer
    doc.fontSize(8)
       .fillColor('#4a5568')
       .text('This document is generated electronically and is valid without signature.', 
             { align: 'center' }, 
             signatureY + 100)
       .text('For verification, visit: https://bhutan-eresidency.gov.bt/verify', 
             { align: 'center' });

    // Finalize PDF
    doc.end();

    // Wait for PDF to be written
    await new Promise((resolve, reject) => {
      doc.on('end', resolve);
      doc.on('error', reject);
    });

    console.log(`Certificate generated: ${filename}`);

    return {
      success: true,
      certificatePath: filename, // Store relative path
      certificateHash,
      fullPath: filePath,
      message: 'Certificate generated successfully'
    };

  } catch (error) {
    console.error('Error generating certificate:', error);
    throw new Error(`Certificate generation failed: ${error.message}`);
  }
};

/**
 * Verify certificate hash
 * @param {string} certificateHash - Hash to verify
 * @param {Object} companyData - Company data to verify against
 * @returns {boolean} Verification result
 */
export const verifyCertificateHash = (certificateHash, companyData) => {
  try {
    const { companyName, registrationNumber, taxId } = companyData;
    const expectedContent = `${companyName}-${registrationNumber}-${taxId}`;
    const expectedHash = crypto.createHash('sha256').update(expectedContent).digest('hex');
    
    return certificateHash === expectedHash;
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return false;
  }
};

/**
 * Get certificate file path
 * @param {string} filename - Certificate filename
 * @returns {string} Full file path
 */
export const getCertificatePath = (filename) => {
  return path.join(process.cwd(), 'uploads', 'certificates', filename);
};