import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Briefcase, 
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Heart,
  Share2,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  location: string;
  expertise: string[];
  rating: number;
  connections: number;
  joinDate: Date;
  isOnline: boolean;
  isMentor: boolean;
}

interface ForumPost {
  id: string;
  author: CommunityMember;
  title: string;
  content: string;
  category: string;
  timestamp: Date;
  likes: number;
  replies: number;
  tags: string[];
  isLiked: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: string;
  type: 'webinar' | 'networking' | 'workshop' | 'meetup';
  attendees: number;
  maxAttendees: number;
  host: CommunityMember;
  isRegistered: boolean;
}

export const CommunityPlatform: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'forum' | 'members' | 'events' | 'mentorship'>('forum');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  const members: CommunityMember[] = [
    {
      id: '1',
      name: 'Emma Chen',
      avatar: '👩‍💼',
      title: 'AI Startup Founder',
      company: 'TechVision AI',
      location: 'Singapore',
      expertise: ['AI/ML', 'Startup', 'Fundraising'],
      rating: 4.9,
      connections: 234,
      joinDate: new Date('2024-01-15'),
      isOnline: true,
      isMentor: true
    },
    {
      id: '2',
      name: 'Carlos Rodriguez',
      avatar: '👨‍💻',
      title: 'Full Stack Developer',
      company: 'Freelance',
      location: 'Mexico',
      expertise: ['Web Development', 'React', 'Node.js'],
      rating: 4.7,
      connections: 156,
      joinDate: new Date('2024-02-01'),
      isOnline: false,
      isMentor: false
    },
    {
      id: '3',
      name: 'Amara Okafor',
      avatar: '👩‍🚀',
      title: 'Fintech Entrepreneur',
      company: 'PayFlow Africa',
      location: 'Nigeria',
      expertise: ['Fintech', 'Blockchain', 'Africa Markets'],
      rating: 4.8,
      connections: 189,
      joinDate: new Date('2024-01-20'),
      isOnline: true,
      isMentor: true
    }
  ];

  const forumPosts: ForumPost[] = [
    {
      id: '1',
      author: members[0],
      title: 'Best practices for AI startup incorporation in Bhutan',
      content: 'I recently incorporated my AI startup through the eResidency platform and wanted to share some insights...',
      category: 'Business Formation',
      timestamp: new Date('2024-03-15T10:30:00'),
      likes: 24,
      replies: 8,
      tags: ['AI', 'Startup', 'Incorporation'],
      isLiked: false
    },
    {
      id: '2',
      author: members[2],
      title: 'Navigating international banking as an African entrepreneur',
      content: 'Here are some challenges I faced and solutions I found when setting up banking for my fintech...',
      category: 'Banking & Finance',
      timestamp: new Date('2024-03-14T15:45:00'),
      likes: 31,
      replies: 12,
      tags: ['Banking', 'Africa', 'Fintech'],
      isLiked: true
    },
    {
      id: '3',
      author: members[1],
      title: 'Tax optimization strategies for digital nomads',
      content: 'As a freelance developer, I\'ve learned several strategies for optimizing taxes...',
      category: 'Tax & Compliance',
      timestamp: new Date('2024-03-13T09:15:00'),
      likes: 18,
      replies: 6,
      tags: ['Tax', 'Digital Nomad', 'Freelance'],
      isLiked: false
    }
  ];

  const events: Event[] = [
    {
      id: '1',
      title: 'eResident Networking Hour',
      description: 'Monthly virtual networking session for all eResidents to connect and share experiences',
      date: new Date('2024-03-25T18:00:00'),
      duration: '1 hour',
      type: 'networking',
      attendees: 45,
      maxAttendees: 100,
      host: members[0],
      isRegistered: false
    },
    {
      id: '2',
      title: 'Blockchain for Business: Workshop',
      description: 'Learn how to integrate blockchain technology into your business operations',
      date: new Date('2024-03-28T14:00:00'),
      duration: '2 hours',
      type: 'workshop',
      attendees: 23,
      maxAttendees: 50,
      host: members[2],
      isRegistered: true
    },
    {
      id: '3',
      title: 'Tax Planning Webinar',
      description: 'Expert insights on international tax planning for eResidents',
      date: new Date('2024-04-02T16:00:00'),
      duration: '90 minutes',
      type: 'webinar',
      attendees: 67,
      maxAttendees: 200,
      host: members[1],
      isRegistered: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', count: forumPosts.length },
    { id: 'business', name: 'Business Formation', count: 1 },
    { id: 'banking', name: 'Banking & Finance', count: 1 },
    { id: 'tax', name: 'Tax & Compliance', count: 1 },
    { id: 'tech', name: 'Technology', count: 0 },
    { id: 'networking', name: 'Networking', count: 0 }
  ];

  const renderForumTab = () => (
    <div className="space-y-6">
      {/* Forum Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
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
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </motion.button>
        </div>
      </div>

      {/* Forum Posts */}
      <div className="space-y-4">
        {forumPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{post.author.avatar}</div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="font-medium">{post.author.name}</span>
                      <span>•</span>
                      <span>{post.author.title}</span>
                      <span>•</span>
                      <span>{post.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                    {post.category}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {post.content}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition-colors`}>
                      <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm">{post.replies}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
                  >
                    Read More
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMembersTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {members.map((member, index) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 p-6"
        >
          <div className="text-center mb-4">
            <div className="relative inline-block">
              <div className="text-4xl mb-2">{member.avatar}</div>
              {member.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 rounded-full border-2 border-white" />
              )}
            </div>
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.title}</p>
            <p className="text-sm text-gray-500">{member.company}</p>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{member.location}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Rating:</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium">{member.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Connections:</span>
              <span className="font-medium">{member.connections}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {member.expertise.slice(0, 3).map(skill => (
              <span key={skill} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Connect
            </motion.button>
            
            {member.isMentor && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium"
              >
                Mentor
              </motion.button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-6">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  event.type === 'webinar' ? 'bg-blue-100 text-blue-800' :
                  event.type === 'workshop' ? 'bg-purple-100 text-purple-800' :
                  event.type === 'networking' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.type}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3">{event.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{event.date.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{event.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{event.attendees}/{event.maxAttendees} attendees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{event.host.avatar}</span>
                  <span>by {event.host.name}</span>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                event.isRegistered
                  ? 'bg-success-100 text-success-800'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {event.isRegistered ? 'Registered' : 'Register'}
            </motion.button>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const tabs = [
    { id: 'forum', name: 'Forum', icon: MessageSquare },
    { id: 'members', name: 'Members', icon: Users },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'mentorship', name: 'Mentorship', icon: Star }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {state.language === 'en' ? 'eResident Community' : 'ཨི་རེསིཌེནཊ་སྤྱི་ཚོགས'}
        </h1>
        <p className="text-gray-600">
          {state.language === 'en' 
            ? 'Connect, learn, and grow with fellow entrepreneurs from around the world'
            : 'འཛམ་གླིང་ཡོངས་ནས་ཚོང་པ་མཉམ་རུབ་ཚོ་དང་འབྲེལ་བ་འདྲིས་ཏེ་སློབ་སྦྱོང་དང་འཕེལ་རྒྱས'
          }
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 text-center"
        >
          <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary-900">2,847</div>
          <div className="text-sm text-primary-700">Active Members</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-2xl p-6 text-center"
        >
          <MessageSquare className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-secondary-900">1,234</div>
          <div className="text-sm text-secondary-700">Discussions</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-2xl p-6 text-center"
        >
          <Calendar className="h-8 w-8 text-accent-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-accent-900">156</div>
          <div className="text-sm text-accent-700">Events Hosted</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-success-50 to-success-100 rounded-2xl p-6 text-center"
        >
          <TrendingUp className="h-8 w-8 text-success-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-success-900">89%</div>
          <div className="text-sm text-success-700">Success Rate</div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg mb-6">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'forum' && renderForumTab()}
          {activeTab === 'members' && renderMembersTab()}
          {activeTab === 'events' && renderEventsTab()}
          {activeTab === 'mentorship' && (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Mentorship Program Coming Soon
              </h3>
              <p className="text-gray-600">
                Connect with experienced entrepreneurs and industry experts
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};