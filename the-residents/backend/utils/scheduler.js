import cron from 'node-cron';
import mongoose from 'mongoose';
import Document from '../models/Document.js';
import Application from '../models/Application.js';
import AuditLog from '../models/AuditLog.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Clean up temporary files from uploads directory
 */
async function cleanupTempFiles() {
  try {
    const tempDir = path.join(__dirname, '../../uploads/temp');
    
    try {
      await fs.access(tempDir);
    } catch (err) {
      // Directory doesn't exist, nothing to clean up
      return;
    }
    
    const files = await fs.readdir(tempDir);
    const now = new Date();
    
    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);
      const fileAgeInHours = (now - stats.mtime) / (1000 * 60 * 60);
      
      // Delete files older than 24 hours
      if (fileAgeInHours > 24) {
        await fs.unlink(filePath);
        console.log(`Deleted temporary file: ${filePath}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up temporary files:', error);
  }
}

/**
 * Backup database
 */
async function backupDatabase() {
  try {
    if (!process.env.MONGO_URI || !process.env.BACKUP_DIR) {
      console.log('Backup: MONGO_URI or BACKUP_DIR not set, skipping backup');
      return;
    }
    
    const backupDir = path.resolve(process.env.BACKUP_DIR);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}.gz`);
    
    // Create backup directory if it doesn't exist
    try {
      await fs.mkdir(backupDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
    
    // Create backup using mongodump
    const { stderr } = await execAsync(
      `mongodump --uri="${process.env.MONGO_URI}" --archive=${backupPath} --gzip`
    );
    
    if (stderr) {
      console.error('MongoDB backup stderr:', stderr);
    }
    
    console.log(`Database backup created at: ${backupPath}`);
    
    // Clean up old backups (keep last 7 days)
    const files = (await fs.readdir(backupDir))
      .filter(file => file.endsWith('.gz') && file.startsWith('backup-'))
      .sort()
      .reverse();
    
    const backupsToDelete = files.slice(7);
    
    for (const file of backupsToDelete) {
      await fs.unlink(path.join(backupDir, file));
      console.log(`Deleted old backup: ${file}`);
    }
  } catch (error) {
    console.error('Error backing up database:', error);
  }
}

/**
 * Clean up old audit logs
 */
async function cleanupAuditLogs() {
  try {
    const retentionDays = parseInt(process.env.AUDIT_LOG_RETENTION_DAYS) || 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const result = await AuditLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    });
    
    console.log(`Cleaned up ${result.deletedCount} old audit logs`);
  } catch (error) {
    console.error('Error cleaning up audit logs:', error);
  }
}

/**
 * Send notifications for upcoming document expirations
 */
async function checkDocumentExpirations() {
  try {
    const warningDays = 30; // Notify if document expires within 30 days
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + warningDays);
    
    const expiringDocs = await Document.find({
      validUntil: { 
        $lte: warningDate,
        $gte: new Date() // Only future expirations
      },
      status: 'verified',
      notificationSent: { $ne: true }
    }).populate('user', 'email fullName');
    
    for (const doc of expiringDocs) {
      try {
        // In a real app, you would send an email notification here
        console.log(`Document expiration warning: ${doc._id} for user ${doc.user.email} expires on ${doc.validUntil}`);
        
        // Mark as notification sent
        doc.notificationSent = true;
        doc.notificationSentAt = new Date();
        await doc.save();
        
        // Log the notification
        await AuditLog.create({
          action: 'document.expiration_warning',
          user: doc.user._id,
          entityType: 'Document',
          entityId: doc._id,
          metadata: {
            documentType: doc.type,
            expiresAt: doc.validUntil,
            daysUntilExpiry: Math.ceil((doc.validUntil - new Date()) / (1000 * 60 * 60 * 24))
          }
        });
      } catch (err) {
        console.error(`Error processing document ${doc._id}:`, err);
      }
    }
  } catch (error) {
    console.error('Error checking document expirations:', error);
  }
}

/**
 * Initialize all scheduled tasks
 */
export function initScheduledJobs() {
  console.log('Initializing scheduled jobs...');
  
  // Clean up temporary files every hour
  cron.schedule('0 * * * *', cleanupTempFiles);
  
  // Backup database daily at midnight
  if (process.env.NODE_ENV === 'production') {
    cron.schedule('0 0 * * *', backupDatabase);
  }
  
  // Clean up old audit logs weekly on Sunday at 1 AM
  cron.schedule('0 1 * * 0', cleanupAuditLogs);
  
  // Check for document expirations daily at 9 AM
  cron.schedule('0 9 * * *', checkDocumentExpirations);
  
  console.log('Scheduled jobs initialized');
  
  // Run initial cleanup
  cleanupTempFiles().catch(console.error);
}

// For testing
export const scheduler = {
  cleanupTempFiles,
  backupDatabase,
  cleanupAuditLogs,
  checkDocumentExpirations
};
