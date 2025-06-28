import QRCode from 'qrcode';
import { logger } from './logger.js';

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const qrDataUrl = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H' });
    return qrDataUrl;
  } catch (err) {
    logger.error('QR Code generation failed', err);
    throw new Error('QR Code generation failed');
  }
};
