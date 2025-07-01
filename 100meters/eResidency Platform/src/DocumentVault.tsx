import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Upload,
  Tag,
  Clock,
  Trash2,
  Share2
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface Document {
  id: string;
  name: string;
  type: 'passport' | 'incorporation' | 'tax_cert' | 'contract' | 'financial' | 'compliance' | 'other';
  category: string;
  uploadDate: Date;
  expiryDate?: Date;
  size: number;
  status: 'active' | 'expiring' | 'expired';
  tags: string[];
  description?: string;
  aiExtractedData?: any;
}

export const DocumentVault: React.FC = () => {
  const { state } = useApp();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'expiry'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Mock documents data
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Passport_John_Smith.pdf',
        type: 'passport',
        category: 'Identity',
        uploadDate: new Date('2024-01-15'),
        expiryDate: new Date('2030-01-15'),
        size: 2.5 * 1024 * 1024,
        status: 'active',
        tags: ['identity', 'kyc', 'verified'],
        description: 'Primary identification document',
        aiExtractedData: {
          documentNumber: 'P123456789',
          fullName: 'John Smith',
          nationality: 'US',
          dateOfBirth: '1990-01-01'
        }
      },
      {
        id: '2',
        name: 'Company_Incorporation_Certificate.pdf',
        type: 'incorporation',
        category: 'Business',
        uploadDate: new Date('2024-02-01'),
        size: 1.8 * 1024 * 1024,
        status: 'active',
        tags: ['incorporation', 'business', 'legal'],
        description: 'Official company incorporation certificate'
      },
      {
        id: '3',
        name: 'Tax_Registration_Certificate.pdf',
        type: 'tax_cert',
        category: 'Tax',
        uploadDate: new Date('2024-02-05'),
        expiryDate: new Date('2025-02-05'),
        size: 0.8 * 1024 * 1024,
        status: 'expiring',
        tags: ['tax', 'registration', 'compliance'],
        description: 'Tax registration and compliance certificate'
      },
      {
        id: '4',
        name: 'Service_Agreement_Template.pdf',
        type: 'contract',
        category: 'Legal',
        uploadDate: new Date('2024-01-20'),
        size: 1.2 * 1024 * 1024,
        status: 'active',
        tags: ['contract', 'template', 'legal'],
        description: 'Standard service agreement template'
      }
    ];
    setDocuments(mockDocuments);
  }, []);

  const categories = [
    { id: 'all', name: 'All Documents', count: documents.length },
    { id: 'identity', name: 'Identity', count: documents.filter(d => d.category === 'Identity').length },
    { id: 'business', name: 'Business', count: documents.filter(d => d.category === 'Business').length },
    { id: 'tax', name: 'Tax', count: documents.filter(d => d.category === 'Tax').length },
    { id: 'legal', name: 'Legal', count: documents.filter(d => d.category === 'Legal').length },
  ];

  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || doc.category.toLowerCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return b.uploadDate.getTime() - a.uploadDate.getTime();
        case 'expiry':
          if (!a.expiryDate && !b.expiryDate) return 0;
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          return a.expiryDate.getTime() - b.expiryDate.getTime();
        default:
          return 0;
      }
    });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-600 bg-success-50';
      case 'expiring': return 'text-warning-600 bg-warning-50';
      case 'expired': return 'text-error-600 bg-error-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'passport': return '🛂';
      case 'incorporation': return '🏢';
      case 'tax_cert': return '📊';
      case 'contract': return '📋';
      case 'financial': return '💰';
      case 'compliance': return '✅';
      default: return '📄';
    }
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleUpload = () => {
    // Mock upload functionality
    const newDoc: Document = {
      id: Date.now().toString(),
      name: 'New_Document.pdf',
      type: 'other',
      category: 'Other',
      uploadDate: new Date(),
      size: Math.random() * 5 * 1024 * 1024,
      status: 'active',
      tags: ['new', 'uploaded'],
      description: 'Recently uploaded document'
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {state.language === 'en' ? 'Smart Document Vault' : 'ཡོན་ཏན་ལྡན་པའི་ཡིག་ཆ་མཛོད'}
        </h1>
        <p className="text-gray-600">
          {state.language === 'en' 
            ? 'AI-powered document management with automatic organization and compliance monitoring'
            : 'AI ནུས་པ་ལྡན་པའི་ཡིག་ཆ་སྐྱོང་སྲུང་དང་རང་འགུལ་སྒྲིག་འཇུག་དང་མཐུན་སྒྲིག་ལྟ་རྟོག'
          }
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={state.language === 'en' ? 'Search documents, tags, or content...' : 'ཡིག་ཆ་དང་ཁ་འདེབས་འཚོལ་བ...'}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">{state.language === 'en' ? 'Sort by Date' : 'ཚེས་གྲངས་ལྟར་སྒྲིག'}</option>
              <option value="name">{state.language === 'en' ? 'Sort by Name' : 'མིང་ལྟར་སྒྲིག'}</option>
              <option value="expiry">{state.language === 'en' ? 'Sort by Expiry' : 'དུས་ཚོད་ལྟར་སྒྲིག'}</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>{state.language === 'en' ? 'Upload' : 'ཡར་འཇུག'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDocuments.map((document, index) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => handleDocumentClick(document)}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-100"
          >
            <div className="p-6">
              {/* Document Icon & Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{getTypeIcon(document.type)}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                  {document.status}
                </span>
              </div>

              {/* Document Info */}
              <h3 className="font-semibold text-gray-900 mb-2 truncate" title={document.name}>
                {document.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {document.description || 'No description available'}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {document.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
                {document.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                    +{document.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Metadata */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3" />
                  <span>Uploaded: {document.uploadDate.toLocaleDateString()}</span>
                </div>
                {document.expiryDate && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>Expires: {document.expiryDate.toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <FileText className="h-3 w-3" />
                  <span>{formatFileSize(document.size)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-error-600 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {state.language === 'en' ? 'No documents found' : 'ཡིག་ཆ་མ་རྙེད'}
          </h3>
          <p className="text-gray-600 mb-4">
            {state.language === 'en' 
              ? 'Try adjusting your search or upload your first document'
              : 'ཁྱེད་ཀྱི་འཚོལ་ཞིབ་བཅོས་སྒྲིག་བྱེད་པའམ་ཡིག་ཆ་དང་པོ་ཡར་འཇུག་བྱེད་རོགས'
            }
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {state.language === 'en' ? 'Upload Document' : 'ཡིག་ཆ་ཡར་འཇུག'}
          </motion.button>
        </div>
      )}

      {/* Document Detail Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedDocument.name}</h2>
                  <p className="text-gray-600">{selectedDocument.description}</p>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* AI Extracted Data */}
              {selectedDocument.aiExtractedData && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                    <span className="mr-2">🤖</span>
                    AI Extracted Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(selectedDocument.aiExtractedData).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium text-purple-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className="ml-2 text-purple-700">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Actions */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};