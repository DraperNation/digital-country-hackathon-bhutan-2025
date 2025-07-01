import Kyc from '../models/Kyc.js';
import Company from '../models/Company.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Get all KYC submissions
const getAllKycSubmissions = async (req, res) => {
  try {
    const kycSubmissions = await Kyc.find()
      .populate('user', 'fullName email passportNumber')
      .sort({ submittedAt: -1 });

    return successResponse(res, kycSubmissions, 'KYC submissions retrieved successfully');
  } catch (error) {
    console.error('Error fetching KYC submissions:', error);
    return errorResponse(res, 'Failed to fetch KYC submissions', 500);
  }
};

// Approve KYC submission
const approveKyc = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    const kycRecord = await Kyc.findById(id);
    if (!kycRecord) {
      return errorResponse(res, 'KYC record not found', 404);
    }

    // Update KYC status
    kycRecord.status = 'approved';
    kycRecord.reviewedAt = new Date();
    kycRecord.comments = comments || 'KYC approved by admin';
    await kycRecord.save();

    // Update user KYC status
    await User.findByIdAndUpdate(kycRecord.user, { 
      kycStatus: 'approved' 
    });

    // Log the action
    await AuditLog.create({
      userId: kycRecord.user,
      action: 'KYC_APPROVED',
      details: `KYC approved by admin. Comments: ${comments || 'No comments'}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    return successResponse(res, kycRecord, 'KYC approved successfully');
  } catch (error) {
    console.error('Error approving KYC:', error);
    return errorResponse(res, 'Failed to approve KYC', 500);
  }
};

// Reject KYC submission
const rejectKyc = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    const kycRecord = await Kyc.findById(id);
    if (!kycRecord) {
      return errorResponse(res, 'KYC record not found', 404);
    }

    // Update KYC status
    kycRecord.status = 'rejected';
    kycRecord.reviewedAt = new Date();
    kycRecord.comments = comments || 'KYC rejected by admin';
    await kycRecord.save();

    // Update user KYC status
    await User.findByIdAndUpdate(kycRecord.user, { 
      kycStatus: 'rejected' 
    });

    // Log the action
    await AuditLog.create({
      userId: kycRecord.user,
      action: 'KYC_REJECTED',
      details: `KYC rejected by admin. Comments: ${comments || 'No comments'}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    return successResponse(res, kycRecord, 'KYC rejected successfully');
  } catch (error) {
    console.error('Error rejecting KYC:', error);
    return errorResponse(res, 'Failed to reject KYC', 500);
  }
};

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate('owner', 'fullName email')
      .sort({ registrationDate: -1 });

    return successResponse(res, companies, 'Companies retrieved successfully');
  } catch (error) {
    console.error('Error fetching companies:', error);
    return errorResponse(res, 'Failed to fetch companies', 500);
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalKycSubmissions,
      pendingKyc,
      approvedKyc,
      rejectedKyc,
      totalCompanies,
      recentUsers,
      recentCompanies
    ] = await Promise.all([
      User.countDocuments(),
      Kyc.countDocuments(),
      Kyc.countDocuments({ status: 'pending' }),
      Kyc.countDocuments({ status: 'approved' }),
      Kyc.countDocuments({ status: 'rejected' }),
      Company.countDocuments(),
      User.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      }),
      Company.countDocuments({ 
        registrationDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
      })
    ]);

    const stats = {
      totalUsers,
      totalKycSubmissions,
      pendingKyc,
      approvedKyc,
      rejectedKyc,
      totalCompanies,
      recentUsers,
      recentCompanies
    };

    return successResponse(res, stats, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return errorResponse(res, 'Failed to fetch dashboard statistics', 500);
  }
};

// Get recent audit logs
const getAuditLogs = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const auditLogs = await AuditLog.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    return successResponse(res, auditLogs, 'Audit logs retrieved successfully');
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return errorResponse(res, 'Failed to fetch audit logs', 500);
  }
};

export {
  getAllKycSubmissions,
  approveKyc,
  rejectKyc,
  getAllCompanies,
  getDashboardStats,
  getAuditLogs
}; 