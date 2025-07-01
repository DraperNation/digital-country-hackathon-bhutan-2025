import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, Clock, Trash2, AreaChart as MarkAsUnread, Filter } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Notification {
  id: string;
  type: 'system' | 'user_action' | 'reminder' | 'warning' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'user_action' | 'reminder'>('all');

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'system',
        title: state.language === 'en' ? 'System Maintenance Scheduled' : 'རིམ་ལུགས་བསྐྱར་སྒྲིག་འཆར་གཞི',
        message: state.language === 'en' 
          ? 'Scheduled maintenance on March 25th from 2:00 AM to 4:00 AM BST'
          : 'ཟླ་༣ ཚེས་༢༥ ཉིན་མོ་ཆུ་ཚོད་༢ ནས་༤ བར་བསྐྱར་སྒྲིག་འཆར་གཞི',
        timestamp: new Date('2024-03-20T10:30:00'),
        isRead: false,
        priority: 'medium'
      },
      {
        id: '2',
        type: 'user_action',
        title: state.language === 'en' ? 'Document Successfully Uploaded' : 'ཡིག་ཆ་ལེགས་པར་ཡར་འཇུག',
        message: state.language === 'en' 
          ? 'Your passport document has been successfully uploaded and is being verified'
          : 'ཁྱེད་ཀྱི་ལག་ཁྱེར་ཡིག་ཆ་ལེགས་པར་ཡར་འཇུག་བྱས་ཏེ་ར་སྤྲོད་བྱེད་བཞིན་ཡོད',
        timestamp: new Date('2024-03-19T15:45:00'),
        isRead: true,
        priority: 'low'
      },
      {
        id: '3',
        type: 'reminder',
        title: state.language === 'en' ? 'Deadline Approaching' : 'དུས་ཚོད་ཉེ་བ',
        message: state.language === 'en' 
          ? 'Your quarterly tax filing is due in 5 days'
          : 'ཁྱེད་ཀྱི་དུས་གསུམ་ཁྲལ་འབུལ་ཉིན་༥ ནང་དུས་ཚོད་ཡིན',
        timestamp: new Date('2024-03-18T09:00:00'),
        isRead: false,
        priority: 'high'
      },
      {
        id: '4',
        type: 'success',
        title: state.language === 'en' ? 'Company Formation Complete' : 'ཚོང་ལས་གསར་འཛུགས་ཚར',
        message: state.language === 'en' 
          ? 'Your company "TechVision AI Ltd" has been successfully incorporated'
          : 'ཁྱེད་ཀྱི་ཚོང་ལས་"TechVision AI Ltd" ལེགས་པར་གསར་འཛུགས་བྱས',
        timestamp: new Date('2024-03-17T14:20:00'),
        isRead: true,
        priority: 'medium'
      },
      {
        id: '5',
        type: 'warning',
        title: state.language === 'en' ? 'KYC Document Expiring' : 'KYC ཡིག་ཆ་དུས་ཚོད་ཟིན',
        message: state.language === 'en' 
          ? 'Your passport will expire in 6 months. Please update your documents'
          : 'ཁྱེད་ཀྱི་ལག་ཁྱེར་ཟླ་༦ ནང་དུས་ཚོད་ཟིན། ཡིག་ཆ་གསར་བཅོས་གནང་རོགས',
        timestamp: new Date('2024-03-16T11:15:00'),
        isRead: false,
        priority: 'high'
      }
    ];
    setNotifications(mockNotifications);
  }, [state.language]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return Info;
      case 'user_action': return CheckCircle;
      case 'reminder': return Clock;
      case 'warning': return AlertTriangle;
      case 'success': return Check;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'text-blue-600 bg-blue-50';
      case 'user_action': return 'text-green-600 bg-green-50';
      case 'reminder': return 'text-yellow-600 bg-yellow-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      case 'success': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: false } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-[70] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className={`w-full max-w-md h-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${
            state.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b ${
            state.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Bell className={`h-6 w-6 ${
                  state.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <h2 className={`text-xl font-bold ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {state.language === 'en' ? 'Notifications' : 'བརྡ་ལན'}
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  state.theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-4">
              {[
                { id: 'all', label: state.language === 'en' ? 'All' : 'ཚང་མ' },
                { id: 'unread', label: state.language === 'en' ? 'Unread' : 'མ་ཀློག' },
                { id: 'system', label: state.language === 'en' ? 'System' : 'རིམ་ལུགས' },
                { id: 'reminder', label: state.language === 'en' ? 'Reminders' : 'དྲན་སྐུལ' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filter === tab.id
                      ? state.theme === 'dark'
                        ? 'bg-yellow-600 text-gray-900'
                        : 'bg-yellow-500 text-white'
                      : state.theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={markAllAsRead}
                className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                  state.theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {state.language === 'en' ? 'Mark All Read' : 'ཚང་མ་ཀློག་ཟིན'}
              </button>
              <button
                onClick={clearAll}
                className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors ${
                  state.theme === 'dark'
                    ? 'bg-red-900 text-red-200 hover:bg-red-800'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                {state.language === 'en' ? 'Clear All' : 'ཚང་མ་སུབ'}
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Bell className={`h-12 w-12 mb-4 ${
                  state.theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                }`} />
                <p className={`text-lg font-medium mb-2 ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {state.language === 'en' ? 'No notifications' : 'བརྡ་ལན་མེད'}
                </p>
                <p className={`text-sm ${
                  state.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {state.language === 'en' 
                    ? 'You\'re all caught up!' 
                    : 'ཁྱེད་ཀྱིས་ཚང་མ་མཐོང་ཟིན!'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredNotifications.map((notification, index) => {
                  const IconComponent = getTypeIcon(notification.type);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border-l-4 transition-all hover:shadow-md ${
                        getPriorityColor(notification.priority)
                      } ${
                        notification.isRead
                          ? state.theme === 'dark'
                            ? 'bg-gray-700/50'
                            : 'bg-gray-50'
                          : state.theme === 'dark'
                            ? 'bg-gray-700'
                            : 'bg-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className={`font-medium text-sm ${
                              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          
                          <p className={`text-xs mb-2 ${
                            state.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${
                              state.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {notification.timestamp.toLocaleDateString()} {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)}
                                className={`p-1 rounded transition-colors ${
                                  state.theme === 'dark'
                                    ? 'text-gray-400 hover:text-gray-200'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                                title={notification.isRead 
                                  ? state.language === 'en' ? 'Mark as unread' : 'མ་ཀློག་པར་རྟགས'
                                  : state.language === 'en' ? 'Mark as read' : 'ཀློག་ཟིན་པར་རྟགས'
                                }
                              >
                                {notification.isRead ? <MarkAsUnread className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                              </button>
                              
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className={`p-1 rounded transition-colors ${
                                  state.theme === 'dark'
                                    ? 'text-gray-400 hover:text-red-400'
                                    : 'text-gray-400 hover:text-red-600'
                                }`}
                                title={state.language === 'en' ? 'Delete' : 'སུབ'}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};