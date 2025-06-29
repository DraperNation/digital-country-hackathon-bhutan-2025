import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  BookOpen, 
  Trophy, 
  Star, 
  CheckCircle, 
  Lock,
  Play,
  Clock,
  Target,
  TrendingUp,
  Gift,
  Percent,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: 'business' | 'compliance' | 'culture' | 'tax' | 'technology';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  points: number;
  isCompleted: boolean;
  isLocked: boolean;
  prerequisites?: string[];
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'interactive';
  duration: string;
  isCompleted: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserProgress {
  totalPoints: number;
  level: number;
  completedModules: number;
  currentStreak: number;
  longestStreak: number;
  discountEarned: number; // Percentage discount earned
}

export const LearningSystem: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'modules' | 'achievements' | 'progress'>('modules');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'business' | 'compliance' | 'culture' | 'tax' | 'technology'>('all');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 1250,
    level: 3,
    completedModules: 8,
    currentStreak: 5,
    longestStreak: 12,
    discountEarned: 3.5
  });

  const [modules, setModules] = useState<LearningModule[]>([
    {
      id: '1',
      title: 'Introduction to Bhutan eResidency',
      description: 'Learn the basics of digital residency and its benefits',
      category: 'business',
      difficulty: 'beginner',
      duration: '30 minutes',
      points: 100,
      isCompleted: true,
      isLocked: false,
      lessons: [
        { id: '1-1', title: 'What is eResidency?', type: 'video', duration: '10 min', isCompleted: true },
        { id: '1-2', title: 'Benefits Overview', type: 'reading', duration: '15 min', isCompleted: true },
        { id: '1-3', title: 'Knowledge Check', type: 'quiz', duration: '5 min', isCompleted: true }
      ]
    },
    {
      id: '2',
      title: 'Business Formation Fundamentals',
      description: 'Master the process of incorporating your business in Bhutan',
      category: 'business',
      difficulty: 'intermediate',
      duration: '45 minutes',
      points: 150,
      isCompleted: true,
      isLocked: false,
      prerequisites: ['1'],
      lessons: [
        { id: '2-1', title: 'Entity Types', type: 'video', duration: '15 min', isCompleted: true },
        { id: '2-2', title: 'Incorporation Process', type: 'interactive', duration: '20 min', isCompleted: true },
        { id: '2-3', title: 'Legal Requirements', type: 'reading', duration: '10 min', isCompleted: true }
      ]
    },
    {
      id: '3',
      title: 'Tax Optimization Strategies',
      description: 'Learn how to optimize your tax structure legally',
      category: 'tax',
      difficulty: 'advanced',
      duration: '60 minutes',
      points: 200,
      isCompleted: false,
      isLocked: false,
      prerequisites: ['2'],
      lessons: [
        { id: '3-1', title: 'Tax Treaties', type: 'video', duration: '20 min', isCompleted: false },
        { id: '3-2', title: 'Optimization Techniques', type: 'reading', duration: '25 min', isCompleted: false },
        { id: '3-3', title: 'Case Studies', type: 'interactive', duration: '15 min', isCompleted: false }
      ]
    },
    {
      id: '4',
      title: 'Bhutanese Culture & Values',
      description: 'Understand Bhutan\'s unique culture and Gross National Happiness',
      category: 'culture',
      difficulty: 'beginner',
      duration: '40 minutes',
      points: 120,
      isCompleted: true,
      isLocked: false,
      lessons: [
        { id: '4-1', title: 'Gross National Happiness', type: 'video', duration: '15 min', isCompleted: true },
        { id: '4-2', title: 'Cultural Traditions', type: 'reading', duration: '20 min', isCompleted: true },
        { id: '4-3', title: 'Cultural Quiz', type: 'quiz', duration: '5 min', isCompleted: true }
      ]
    },
    {
      id: '5',
      title: 'Compliance & Regulatory Framework',
      description: 'Navigate Bhutan\'s regulatory requirements effectively',
      category: 'compliance',
      difficulty: 'intermediate',
      duration: '50 minutes',
      points: 180,
      isCompleted: false,
      isLocked: false,
      prerequisites: ['2'],
      lessons: [
        { id: '5-1', title: 'Regulatory Overview', type: 'video', duration: '20 min', isCompleted: false },
        { id: '5-2', title: 'Compliance Calendar', type: 'interactive', duration: '20 min', isCompleted: false },
        { id: '5-3', title: 'Best Practices', type: 'reading', duration: '10 min', isCompleted: false }
      ]
    },
    {
      id: '6',
      title: 'Digital Innovation in Bhutan',
      description: 'Explore Bhutan\'s digital transformation initiatives',
      category: 'technology',
      difficulty: 'intermediate',
      duration: '35 minutes',
      points: 140,
      isCompleted: false,
      isLocked: true,
      prerequisites: ['3', '5'],
      lessons: [
        { id: '6-1', title: 'Digital Bhutan Initiative', type: 'video', duration: '15 min', isCompleted: false },
        { id: '6-2', title: 'Tech Opportunities', type: 'reading', duration: '15 min', isCompleted: false },
        { id: '6-3', title: 'Innovation Quiz', type: 'quiz', duration: '5 min', isCompleted: false }
      ]
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first learning module',
      icon: '🎯',
      points: 50,
      isUnlocked: true,
      unlockedAt: new Date('2024-01-15'),
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Business Builder',
      description: 'Complete all business formation modules',
      icon: '🏢',
      points: 200,
      isUnlocked: true,
      unlockedAt: new Date('2024-02-01'),
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Culture Enthusiast',
      description: 'Complete the Bhutanese culture module',
      icon: '🏔️',
      points: 100,
      isUnlocked: true,
      unlockedAt: new Date('2024-02-10'),
      rarity: 'common'
    },
    {
      id: '4',
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      points: 150,
      isUnlocked: false,
      rarity: 'rare'
    },
    {
      id: '5',
      title: 'Tax Wizard',
      description: 'Master all tax optimization modules',
      icon: '🧙‍♂️',
      points: 300,
      isUnlocked: false,
      rarity: 'epic'
    },
    {
      id: '6',
      title: 'Bhutan Expert',
      description: 'Complete all learning modules',
      icon: '👑',
      points: 500,
      isUnlocked: false,
      rarity: 'legendary'
    }
  ]);

  const goBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'dashboard' });
  };

  const categories = [
    { id: 'all', name: 'All Modules', icon: BookOpen },
    { id: 'business', name: 'Business', icon: Target },
    { id: 'compliance', name: 'Compliance', icon: CheckCircle },
    { id: 'culture', name: 'Culture', icon: Star },
    { id: 'tax', name: 'Tax', icon: TrendingUp },
    { id: 'technology', name: 'Technology', icon: Play }
  ];

  const filteredModules = modules.filter(module => 
    selectedCategory === 'all' || module.category === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-success-600 bg-success-50';
      case 'intermediate': return 'text-warning-600 bg-warning-50';
      case 'advanced': return 'text-error-600 bg-error-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'rare': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'epic': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'legendary': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const calculateLevelProgress = () => {
    const pointsForCurrentLevel = userProgress.level * 500;
    const pointsForNextLevel = (userProgress.level + 1) * 500;
    const progressInLevel = userProgress.totalPoints - pointsForCurrentLevel;
    const pointsNeededForLevel = pointsForNextLevel - pointsForCurrentLevel;
    return (progressInLevel / pointsNeededForLevel) * 100;
  };

  const handleModuleStart = (moduleId: string) => {
    console.log('Starting module:', moduleId);
  };

  const handleModuleComplete = (moduleId: string) => {
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId 
          ? { ...module, isCompleted: true }
          : module
      )
    );
    
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      setUserProgress(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + module.points,
        completedModules: prev.completedModules + 1,
        discountEarned: Math.min(5, prev.discountEarned + 0.5)
      }));
    }
  };

  const renderModulesTab = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 ${
              module.isLocked ? 'opacity-60' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {module.description}
                  </p>
                </div>
                {module.isCompleted && (
                  <CheckCircle className="h-6 w-6 text-success-600 flex-shrink-0" />
                )}
                {module.isLocked && (
                  <Lock className="h-6 w-6 text-gray-400 flex-shrink-0" />
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </span>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{module.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>{module.points} pts</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">
                    {module.lessons.filter(l => l.isCompleted).length}/{module.lessons.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ 
                      width: `${(module.lessons.filter(l => l.isCompleted).length / module.lessons.length) * 100}%` 
                    }}
                  />
                </div>
              </div>

              {module.prerequisites && module.prerequisites.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Prerequisites:</p>
                  <div className="flex flex-wrap gap-1">
                    {module.prerequisites.map(prereqId => {
                      const prereq = modules.find(m => m.id === prereqId);
                      return (
                        <span key={prereqId} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {prereq?.title}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: module.isLocked ? 1 : 1.05 }}
                whileTap={{ scale: module.isLocked ? 1 : 0.95 }}
                onClick={() => !module.isLocked && handleModuleStart(module.id)}
                disabled={module.isLocked}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  module.isLocked
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : module.isCompleted
                    ? 'bg-success-100 text-success-800'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {module.isLocked ? 'Locked' : 
                 module.isCompleted ? 'Completed' : 
                 'Start Module'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 ${
            achievement.isUnlocked ? getRarityColor(achievement.rarity) : 'border-gray-200 opacity-60'
          }`}
        >
          <div className="p-6 text-center">
            <div className="text-4xl mb-4">{achievement.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {achievement.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {achievement.description}
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{achievement.points} pts</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRarityColor(achievement.rarity)}`}>
                {achievement.rarity}
              </span>
            </div>
            
            {achievement.isUnlocked && achievement.unlockedAt && (
              <p className="text-xs text-gray-500 mt-2">
                Unlocked {achievement.unlockedAt.toLocaleDateString()}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderProgressTab = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Level {userProgress.level}</h2>
            <p className="text-primary-100">
              {userProgress.totalPoints} total points earned
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-primary-100 text-sm">
              {Math.round(calculateLevelProgress())}% to next level
            </p>
          </div>
        </div>
        
        <div className="w-full bg-primary-700 rounded-full h-3 mb-2">
          <div 
            className="bg-accent-400 h-3 rounded-full transition-all"
            style={{ width: `${calculateLevelProgress()}%` }}
          />
        </div>
        
        <p className="text-primary-200 text-sm">
          {((userProgress.level + 1) * 500) - userProgress.totalPoints} points to level {userProgress.level + 1}
        </p>
      </div>

      <div className="bg-gradient-to-r from-accent-50 to-warning-50 border border-accent-200 rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-accent-600 rounded-full flex items-center justify-center">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-accent-900 mb-2">
              Discount Earned: {userProgress.discountEarned}%
            </h3>
            <p className="text-accent-700 mb-3">
              Your learning progress has earned you a discount on eResidency services!
            </p>
            <div className="w-full bg-accent-200 rounded-full h-2">
              <div 
                className="bg-accent-600 h-2 rounded-full transition-all"
                style={{ width: `${(userProgress.discountEarned / 5) * 100}%` }}
              />
            </div>
            <p className="text-accent-600 text-sm mt-1">
              Complete more modules to earn up to 5% discount
            </p>
          </div>
          <div className="text-center">
            <Percent className="h-8 w-8 text-accent-600 mx-auto mb-2" />
            <p className="text-accent-800 font-bold text-lg">
              {userProgress.discountEarned}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <BookOpen className="h-8 w-8 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {userProgress.completedModules}
          </div>
          <div className="text-sm text-gray-600">Modules Completed</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Trophy className="h-8 w-8 text-warning-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {achievements.filter(a => a.isUnlocked).length}
          </div>
          <div className="text-sm text-gray-600">Achievements Unlocked</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Target className="h-8 w-8 text-success-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {userProgress.currentStreak}
          </div>
          <div className="text-sm text-gray-600">Current Streak (days)</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Star className="h-8 w-8 text-accent-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {userProgress.longestStreak}
          </div>
          <div className="text-sm text-gray-600">Longest Streak (days)</div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'modules', name: 'Learning Modules', icon: BookOpen },
    { id: 'achievements', name: 'Achievement Badges', icon: Trophy },
    { id: 'progress', name: 'Progress & Rewards', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-primary-200 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
            
            <h1 className="text-3xl font-bold mb-2">
              Learning & Achievement System
            </h1>
            <p className="text-primary-100">
              Learn about business, compliance, and Bhutanese culture while earning rewards and discounts
            </p>
          </div>

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

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'modules' && renderModulesTab()}
                {activeTab === 'achievements' && renderAchievementsTab()}
                {activeTab === 'progress' && renderProgressTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};