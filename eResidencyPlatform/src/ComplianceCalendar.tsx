import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Bell,
  FileText,
  DollarSign,
  Building2,
  Filter,
  Download,
  Plus
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  type: 'tax' | 'filing' | 'license' | 'audit' | 'renewal';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  estimatedTime: string;
  cost?: number;
  documents?: string[];
  autoReminder: boolean;
  companyId?: string;
}

export const ComplianceCalendar: React.FC = () => {
  const { state } = useApp();
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [filterType, setFilterType] = useState<'all' | 'tax' | 'filing' | 'license' | 'audit' | 'renewal'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'overdue'>('all');

  // Mock compliance data
  useEffect(() => {
    const mockItems: ComplianceItem[] = [
      {
        id: '1',
        title: 'Annual Tax Return Filing',
        description: 'Submit annual corporate tax return for fiscal year 2024',
        dueDate: new Date('2024-04-15'),
        type: 'tax',
        priority: 'high',
        status: 'pending',
        estimatedTime: '2-3 hours',
        cost: 500,
        documents: ['Financial Statements', 'Tax Computation', 'Supporting Documents'],
        autoReminder: true,
        companyId: state.user?.companies[0]?.id
      },
      {
        id: '2',
        title: 'Business License Renewal',
        description: 'Renew business operating license',
        dueDate: new Date('2024-03-30'),
        type: 'license',
        priority: 'medium',
        status: 'in_progress',
        estimatedTime: '1 hour',
        cost: 200,
        documents: ['Current License', 'Renewal Application'],
        autoReminder: true
      },
      {
        id: '3',
        title: 'Quarterly VAT Return',
        description: 'Submit Q1 2024 VAT return',
        dueDate: new Date('2024-04-30'),
        type: 'tax',
        priority: 'medium',
        status: 'pending',
        estimatedTime: '1-2 hours',
        cost: 150,
        autoReminder: true
      },
      {
        id: '4',
        title: 'Annual Audit Preparation',
        description: 'Prepare documents for annual audit',
        dueDate: new Date('2024-05-15'),
        type: 'audit',
        priority: 'high',
        status: 'pending',
        estimatedTime: '4-6 hours',
        cost: 2000,
        documents: ['Financial Records', 'Bank Statements', 'Invoices'],
        autoReminder: true
      },
      {
        id: '5',
        title: 'Employee Tax Withholding',
        description: 'Submit monthly employee tax withholding report',
        dueDate: new Date('2024-03-25'),
        type: 'tax',
        priority: 'low',
        status: 'completed',
        estimatedTime: '30 minutes',
        cost: 0,
        autoReminder: true
      }
    ];
    setComplianceItems(mockItems);
  }, [state.user]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error-600 bg-error-50 border-error-200';
      case 'medium': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'low': return 'text-success-600 bg-success-50 border-success-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success-600 bg-success-50';
      case 'in_progress': return 'text-warning-600 bg-warning-50';
      case 'overdue': return 'text-error-600 bg-error-50';
      case 'pending': return 'text-primary-600 bg-primary-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tax': return DollarSign;
      case 'filing': return FileText;
      case 'license': return Building2;
      case 'audit': return CheckCircle;
      case 'renewal': return Clock;
      default: return FileText;
    }
  };

  const getDaysUntilDue = (dueDate: Date): number => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredItems = complianceItems.filter(item => {
    const typeMatch = filterType === 'all' || item.type === filterType;
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const upcomingItems = filteredItems
    .filter(item => item.status !== 'completed')
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const overdueItems = filteredItems.filter(item => {
    const daysUntil = getDaysUntilDue(item.dueDate);
    return daysUntil < 0 && item.status !== 'completed';
  });

  const handleMarkComplete = (itemId: string) => {
    setComplianceItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status: 'completed' as const } : item
      )
    );
  };

  const handleAddReminder = () => {
    // Mock add reminder functionality
    console.log('Add new compliance reminder');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {state.language === 'en' ? 'Compliance Calendar' : 'མཐུན་སྒྲིག་ལོ་ཐོ'}
        </h1>
        <p className="text-gray-600">
          {state.language === 'en' 
            ? 'Stay on top of all your regulatory deadlines and compliance requirements'
            : 'ཁྱེད་ཀྱི་སྒྲིག་གཞི་དུས་ཚོད་དང་མཐུན་སྒྲིག་དགོས་མཁོ་ཚང་མའི་སྟེང་དུ་གནས་རོགས'
          }
        </p>
      </div>

      {/* Alert for Overdue Items */}
      {overdueItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-error-600" />
            <span className="font-semibold text-error-800">
              {overdueItems.length} Overdue Item{overdueItems.length > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-error-700 text-sm">
            You have overdue compliance items that require immediate attention.
          </p>
        </motion.div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Total Items</h3>
              <p className="text-2xl font-bold text-primary-600">{complianceItems.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Due This Month</h3>
              <p className="text-2xl font-bold text-warning-600">
                {complianceItems.filter(item => {
                  const daysUntil = getDaysUntilDue(item.dueDate);
                  return daysUntil <= 30 && daysUntil >= 0 && item.status !== 'completed';
                }).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-error-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-error-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Overdue</h3>
              <p className="text-2xl font-bold text-error-600">{overdueItems.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Completed</h3>
              <p className="text-2xl font-bold text-success-600">
                {complianceItems.filter(item => item.status === 'completed').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="tax">Tax</option>
              <option value="filing">Filing</option>
              <option value="license">License</option>
              <option value="audit">Audit</option>
              <option value="renewal">Renewal</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddReminder}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Reminder</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Compliance Items List */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => {
          const IconComponent = getTypeIcon(item.type);
          const daysUntil = getDaysUntilDue(item.dueDate);
          const isOverdue = daysUntil < 0 && item.status !== 'completed';
          const isUrgent = daysUntil <= 7 && daysUntil >= 0 && item.status !== 'completed';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 ${
                isOverdue ? 'border-error-500' : 
                isUrgent ? 'border-warning-500' : 
                'border-primary-500'
              } p-6`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isOverdue ? 'bg-error-100' : 
                    isUrgent ? 'bg-warning-100' : 
                    'bg-primary-100'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      isOverdue ? 'text-error-600' : 
                      isUrgent ? 'text-warning-600' : 
                      'text-primary-600'
                    }`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority} priority
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium text-gray-700">Due Date:</span>
                        <p className={`${isOverdue ? 'text-error-600 font-medium' : 'text-gray-600'}`}>
                          {item.dueDate.toLocaleDateString()}
                        </p>
                        {isOverdue && (
                          <p className="text-error-600 text-xs">
                            {Math.abs(daysUntil)} days overdue
                          </p>
                        )}
                        {isUrgent && (
                          <p className="text-warning-600 text-xs">
                            {daysUntil} days remaining
                          </p>
                        )}
                      </div>

                      <div>
                        <span className="font-medium text-gray-700">Estimated Time:</span>
                        <p className="text-gray-600">{item.estimatedTime}</p>
                      </div>

                      {item.cost && (
                        <div>
                          <span className="font-medium text-gray-700">Cost:</span>
                          <p className="text-gray-600">${item.cost}</p>
                        </div>
                      )}

                      <div>
                        <span className="font-medium text-gray-700">Auto Reminder:</span>
                        <p className="text-gray-600">
                          {item.autoReminder ? (
                            <span className="flex items-center space-x-1">
                              <Bell className="h-3 w-3 text-success-600" />
                              <span>Enabled</span>
                            </span>
                          ) : (
                            'Disabled'
                          )}
                        </p>
                      </div>
                    </div>

                    {item.documents && (
                      <div className="mb-4">
                        <span className="font-medium text-gray-700 text-sm">Required Documents:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.documents.map(doc => (
                            <span key={doc} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      {item.status !== 'completed' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMarkComplete(item.id)}
                          className="px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors text-sm font-medium"
                        >
                          Mark Complete
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                      >
                        View Details
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                      >
                        Set Reminder
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No compliance items found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or add a new compliance reminder
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddReminder}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Compliance Reminder
          </motion.button>
        </div>
      )}
    </div>
  );
};