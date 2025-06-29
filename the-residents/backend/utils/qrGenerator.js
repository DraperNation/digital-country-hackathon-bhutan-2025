const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Directory to store generated QR codes
const QR_DIR = 'public/qrcodes';

// Create QR code directory if it doesn't exist
if (!fs.existsSync(QR_DIR)) {
  fs.mkdirSync(QR_DIR, { recursive: true });
}

/**
 * Generate a QR code and save it to disk
 * @param {string} data - The data to encode in the QR code
 * @param {Object} options - Options for the QR code
 * @param {string} [options.format='png'] - Output format (png, svg, pdf, etc.)
 * @param {number} [options.width=200] - Width in pixels
 * @param {number} [options.margin=1] - Margin size (in modules)
 * @param {string} [options.colorDark='#000000'] - Dark color (hex, rgb, rgba, etc.)
 * @param {string} [options.colorLight='#ffffff'] - Light color (hex, rgb, rgba, etc.)
 * @param {string} [options.errorCorrectionLevel='M'] - Error correction level (L, M, Q, H)
 * @returns {Promise<{url: string, path: string}>} - URL and file path of the generated QR code
 */
const generateQRCode = async (data, options = {}) => {
  try {
    // Default options
    const {
      format = 'png',
      width = 200,
      margin = 1,
      colorDark = '#000000',
      colorLight = '#ffffff',
      errorCorrectionLevel = 'M',
    } = options;

    // Generate a unique filename
    const filename = `qrcode-${uuidv4()}.${format}`;
    const filePath = path.join(QR_DIR, filename);
    const publicUrl = `/qrcodes/${filename}`;

    // QR code options
    const qrOptions = {
      type: format === 'svg' ? 'svg' : 'png',
      width: format === 'svg' ? undefined : width,
      margin,
      color: {
        dark: colorDark,
        light: colorLight,
      },
      errorCorrectionLevel,
    };

    // Generate and save the QR code
    await QRCode.toFile(filePath, data, qrOptions);

    return {
      url: publicUrl,
      path: filePath,
      filename,
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate a QR code as a data URL
 * @param {string} data - The data to encode in the QR code
 * @param {Object} options - Options for the QR code
 * @returns {Promise<string>} - Data URL of the generated QR code
 */
const generateQRCodeDataURL = async (data, options = {}) => {
  try {
    // Default options
    const {
      width = 200,
      margin = 1,
      colorDark = '#000000',
      colorLight = '#ffffff',
      errorCorrectionLevel = 'M',
    } = options;

    // QR code options
    const qrOptions = {
      width,
      margin,
      color: {
        dark: colorDark,
        light: colorLight,
      },
      errorCorrectionLevel,
    };

    // Generate and return the QR code as a data URL
    const dataUrl = await QRCode.toDataURL(data, qrOptions);
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code data URL:', error);
    throw new Error('Failed to generate QR code data URL');
  }
};

/**
 * Delete a QR code file
 * @param {string} filename - The filename of the QR code to delete
 * @returns {Promise<boolean>} - True if the file was deleted, false otherwise
 */
const deleteQRCode = async (filename) => {
  try {
    const filePath = path.join(QR_DIR, filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting QR code:', error);
    throw new Error('Failed to delete QR code');
  }
};

module.exports = {
  generateQRCode,
  generateQRCodeDataURL,
  deleteQRCode,
};
