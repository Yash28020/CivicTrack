import React, { useState, useEffect } from 'react';
import { MapPin, Users, TrendingUp, Bell, Menu, X, Camera, Send, MessageSquare, ThumbsUp, Eye, Calendar, BarChart3, AlertTriangle, CheckCircle, Clock, Filter, Plus, Search } from 'lucide-react';

// Types
interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'reported' | 'in-progress' | 'resolved';
  location: { lat: number; lng: number; address: string };
  images: string[];
  reportedBy: string;
  reportedAt: Date;
  updatedAt: Date;
  votes: number;
  comments: Comment[];
  priority: 'low' | 'medium' | 'high';
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  votes: number;
}

// Sample data for demo
const generateSampleIssues = (): Issue[] => [
  {
    id: '1',
    title: 'Large pothole on Main Street',
    description: 'Deep pothole causing vehicle damage near the intersection of Main St and Oak Ave.',
    category: 'Roads',
    status: 'reported',
    location: { lat: 40.7128, lng: -74.0060, address: 'Main St & Oak Ave, Downtown' },
    images: ['https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=400'],
    reportedBy: 'Sarah Chen',
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    votes: 23,
    comments: [
      { id: '1', author: 'Mike Johnson', content: 'I hit this yesterday and damaged my tire. City needs to fix this urgently!', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), votes: 8 },
      { id: '2', author: 'Lisa Wang', content: 'Same issue here. Filing a claim with the city for vehicle damage.', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), votes: 5 }
    ],
    priority: 'high'
  },
  {
    id: '2',
    title: 'Broken streetlight on Elm Street',
    description: 'Streetlight has been out for over a week, creating safety concerns for pedestrians.',
    category: 'Lighting',
    status: 'in-progress',
    location: { lat: 40.7589, lng: -73.9851, address: 'Elm Street, Block 300' },
    images: ['https://images.pexels.com/photos/327472/pexels-photo-327472.jpeg?auto=compress&cs=tinysrgb&w=400'],
    reportedBy: 'David Rodriguez',
    reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    votes: 15,
    comments: [
      { id: '3', author: 'Emma Thompson', content: 'City responded that they will fix this by end of week. Great progress!', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), votes: 12 }
    ],
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Overflowing garbage bins in Central Park',
    description: 'Multiple bins overflowing, attracting pests and creating unsanitary conditions.',
    category: 'Cleanliness',
    status: 'resolved',
    location: { lat: 40.7831, lng: -73.9712, address: 'Central Park, Section B' },
    images: ['https://images.pexels.com/photos/2821823/pexels-photo-2821823.jpeg?auto=compress&cs=tinysrgb&w=400'],
    reportedBy: 'Anna Kim',
    reportedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    votes: 31,
    comments: [
      { id: '4', author: 'Parks Department', content: 'Thank you for reporting. We have increased pickup frequency in this area.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), votes: 18 }
    ],
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Water leak flooding sidewalk',
    description: 'Continuous water leak from underground pipe creating hazardous icy conditions.',
    category: 'Water Supply',
    status: 'reported',
    location: { lat: 40.7505, lng: -73.9934, address: 'Broadway & 42nd Street' },
    images: ['https://images.pexels.com/photos/4846251/pexels-photo-4846251.jpeg?auto=compress&cs=tinysrgb&w=400'],
    reportedBy: 'James Wilson',
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    votes: 45,
    comments: [],
    priority: 'high'
  },
  {
    id: '5',
    title: 'Graffiti on public building',
    description: 'Large graffiti covering the side wall of the community center.',
    category: 'Public Safety',
    status: 'in-progress',
    location: { lat: 40.7282, lng: -73.7949, address: 'Community Center, Queens Blvd' },
    images: ['https://images.pexels.com/photos/2832432/pexels-photo-2832432.jpeg?auto=compress&cs=tinysrgb&w=400'],
    reportedBy: 'Maria Garcia',
    reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    votes: 8,
    comments: [
      { id: '5', author: 'Community Manager', content: 'Cleanup crew scheduled for tomorrow morning. Thanks for keeping our community clean!', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), votes: 3 }
    ],
    priority: 'low'
  }
];

const categories = ['All', 'Roads', 'Lighting', 'Water Supply', 'Cleanliness', 'Public Safety', 'Obstructions'];
const statusColors = {
  reported: 'bg-red-500',
  'in-progress': 'bg-yellow-500',
  resolved: 'bg-green-500'
};

const statusIcons = {
  reported: AlertTriangle,
  'in-progress': Clock,
  resolved: CheckCircle
};

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'map' | 'report' | 'analytics' | 'issue'>('home');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: 'Roads',
    images: [] as string[]
  });

  useEffect(() => {
    setIssues(generateSampleIssues());
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      const randomUpdate = Math.random();
      if (randomUpdate > 0.8) {
        const updates = [
          'New issue reported in your area',
          'Issue status updated: Pothole on Main Street',
          'Community member commented on your report',
          'City department responded to water leak report'
        ];
        const randomNotification = updates[Math.floor(Math.random() * updates.length)];
        setNotifications(prev => [randomNotification, ...prev.slice(0, 4)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredIssues = issues.filter(issue => {
    const matchesCategory = filterCategory === 'All' || issue.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || issue.status === filterStatus;
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusStats = () => {
    const total = issues.length;
    const reported = issues.filter(i => i.status === 'reported').length;
    const inProgress = issues.filter(i => i.status === 'in-progress').length;
    const resolved = issues.filter(i => i.status === 'resolved').length;
    return { total, reported, inProgress, resolved };
  };

  const getCategoryStats = () => {
    const stats = categories.slice(1).map(category => ({
      category,
      count: issues.filter(i => i.category === category).length
    }));
    return stats.sort((a, b) => b.count - a.count);
  };

  const handleReportSubmit = () => {
    if (!newIssue.title.trim() || !newIssue.description.trim()) return;
    
    const issue: Issue = {
      id: Date.now().toString(),
      title: newIssue.title,
      description: newIssue.description,
      category: newIssue.category,
      status: 'reported',
      location: { lat: 40.7128 + (Math.random() - 0.5) * 0.01, lng: -74.0060 + (Math.random() - 0.5) * 0.01, address: 'Auto-detected location' },
      images: newIssue.images,
      reportedBy: 'You',
      reportedAt: new Date(),
      updatedAt: new Date(),
      votes: 0,
      comments: [],
      priority: 'medium'
    };
    
    setIssues(prev => [issue, ...prev]);
    setNewIssue({ title: '', description: '', category: 'Roads', images: [] });
    setNotifications(prev => ['Your issue has been successfully reported!', ...prev.slice(0, 4)]);
    setCurrentView('map');
  };

  const NavigationBar = () => (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CivicShinobi</h1>
              <p className="text-xs text-gray-500">AI-Powered Civic Engagement</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('map')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'map' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => setCurrentView('report')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'report' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Report Issue
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'analytics' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Analytics
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {['home', 'map', 'report', 'analytics'].map((view) => (
              <button
                key={view}
                onClick={() => {
                  setCurrentView(view as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                  currentView === view ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );

  const HomePage = () => {
    const stats = getStatusStats();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MapPin className="h-4 w-4 mr-2" />
              AI-Powered Civic Engagement Platform
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Make Your City <span className="text-blue-600">Better</span> Together
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Report civic issues, track their progress, and engage with your community to create lasting positive change in your neighborhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentView('report')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Report an Issue
              </button>
              <button
                onClick={() => setCurrentView('map')}
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <MapPin className="h-5 w-5 mr-2" />
                View Map
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Issues</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Reported</p>
                  <p className="text-3xl font-bold text-red-600">{stats.reported}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Issues */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Recent Issues</h2>
              <p className="text-gray-600 text-sm">Latest community reports in your area</p>
            </div>
            <div className="divide-y divide-gray-100">
              {issues.slice(0, 3).map((issue) => {
                const StatusIcon = statusIcons[issue.status];
                return (
                  <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => {
                    setSelectedIssue(issue);
                    setCurrentView('issue');
                  }}>
                    <div className="flex items-start space-x-4">
                      <img
                        src={issue.images[0] || 'https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={issue.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[issue.status]}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {issue.status.replace('-', ' ')}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            {issue.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{issue.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{issue.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {issue.location.address}
                          </span>
                          <span className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {issue.votes}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {issue.comments.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MapView = () => (
    <div className="h-screen flex flex-col">
      {/* Filters */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="reported">Reported</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Map Area */}
        <div className="flex-1 bg-gradient-to-br from-blue-100 to-green-100 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Map</h3>
              <p className="text-gray-600 mb-4">In production, this would show a Mapbox GL JS map with issue pins</p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {filteredIssues.slice(0, 4).map((issue) => {
                  const StatusIcon = statusIcons[issue.status];
                  return (
                    <div
                      key={issue.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 ${
                        issue.status === 'reported' ? 'border-red-200 bg-red-50' :
                        issue.status === 'in-progress' ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                      }`}
                      onClick={() => {
                        setSelectedIssue(issue);
                        setCurrentView('issue');
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <StatusIcon className={`h-4 w-4 ${
                          issue.status === 'reported' ? 'text-red-600' :
                          issue.status === 'in-progress' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                        <span className="text-xs font-medium text-gray-600">{issue.category}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 truncate">{issue.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{issue.votes} votes</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Issue List Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Issues in Area ({filteredIssues.length})</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredIssues.map((issue) => {
              const StatusIcon = statusIcons[issue.status];
              return (
                <div
                  key={issue.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedIssue(issue);
                    setCurrentView('issue');
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={issue.images[0] || 'https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=60'}
                      alt={issue.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${statusColors[issue.status]}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {issue.status.replace('-', ' ')}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm truncate">{issue.title}</h4>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">{issue.description}</p>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {issue.votes}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {issue.comments.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const ReportIssue = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-blue-50">
            <h2 className="text-2xl font-bold text-gray-900">Report a Civic Issue</h2>
            <p className="text-gray-600 mt-1">Help improve your community by reporting local issues</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title</label>
              <input
                type="text"
                value={newIssue.title}
                onChange={(e) => setNewIssue(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the issue"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{newIssue.title.length}/100 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newIssue.category}
                onChange={(e) => setNewIssue(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newIssue.description}
                onChange={(e) => setNewIssue(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about the issue..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{newIssue.description.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">Location auto-detected</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">GPS coordinates: 40.7128, -74.0060</p>
                <p className="text-sm text-gray-600">Address: Broadway & 42nd Street, NYC</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop images here, or click to select</p>
                <p className="text-sm text-gray-500">Up to 5 images, max 5MB each</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Select Images
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600 p-1 rounded-full flex-shrink-0 mt-0.5">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">AI Classification Enabled</h4>
                  <p className="text-sm text-blue-700 mt-1">Our AI will automatically categorize and prioritize your report for faster response times.</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleReportSubmit}
                disabled={!newIssue.title.trim() || !newIssue.description.trim()}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Submit Report
              </button>
              <button
                onClick={() => setCurrentView('home')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsDashboard = () => {
    const stats = getStatusStats();
    const categoryStats = getCategoryStats();
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-gray-600 mt-2">Community engagement and issue resolution insights</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Status Overview */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Issue Status Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">Reported Issues</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-red-600">{stats.reported}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{width: `${(stats.reported / stats.total) * 100}%`}}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">In Progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-yellow-600">{stats.inProgress}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(stats.inProgress / stats.total) * 100}%`}}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">Resolved Issues</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-green-600">{stats.resolved}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: `${(stats.resolved / stats.total) * 100}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Resolution Rate: {Math.round((stats.resolved / stats.total) * 100)}%</span>
                  <br />
                  Your community is actively working together to solve local issues!
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Community Impact</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Votes Cast</span>
                    <span className="text-xl font-bold text-blue-600">
                      {issues.reduce((sum, issue) => sum + issue.votes, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Community Comments</span>
                    <span className="text-xl font-bold text-blue-600">
                      {issues.reduce((sum, issue) => sum + issue.comments.length, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Contributors</span>
                    <span className="text-xl font-bold text-blue-600">47</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Response Times</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avg. First Response</span>
                    <span className="text-lg font-bold text-green-600">2.3 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avg. Resolution</span>
                    <span className="text-lg font-bold text-green-600">8.7 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Issues by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categoryStats.map((stat, index) => (
                  <div key={stat.category} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      index % 6 === 0 ? 'bg-blue-100 text-blue-600' :
                      index % 6 === 1 ? 'bg-green-100 text-green-600' :
                      index % 6 === 2 ? 'bg-yellow-100 text-yellow-600' :
                      index % 6 === 3 ? 'bg-red-100 text-red-600' :
                      index % 6 === 4 ? 'bg-purple-100 text-purple-600' :
                      'bg-indigo-100 text-indigo-600'
                    }`}>
                      <span className="text-2xl font-bold">{stat.count}</span>
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm">{stat.category}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const IssueDetail = () => {
    if (!selectedIssue) return null;
    
    const StatusIcon = statusIcons[selectedIssue.status];
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setCurrentView('map')}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Map
          </button>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${statusColors[selectedIssue.status]}`}>
                      <StatusIcon className="h-4 w-4 mr-1" />
                      {selectedIssue.status.replace('-', ' ')}
                    </span>
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                      {selectedIssue.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedIssue.priority === 'high' ? 'bg-red-100 text-red-800' :
                      selectedIssue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedIssue.priority} priority
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">{selectedIssue.title}</h1>
                  <p className="text-gray-600 mt-2">{selectedIssue.description}</p>
                </div>
                <div className="flex items-center space-x-4 ml-6">
                  <button className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{selectedIssue.votes}</span>
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Follow Updates
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Images */}
                {selectedIssue.images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Photos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedIssue.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Issue photo ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <MapPin className="h-5 w-5" />
                      <span>{selectedIssue.location.address}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Coordinates: {selectedIssue.location.lat.toFixed(4)}, {selectedIssue.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Discussion ({selectedIssue.comments.length})</h3>
                  
                  {/* Add Comment */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <textarea
                      placeholder="Share your thoughts or additional information..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-end mt-3">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Post Comment
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {selectedIssue.comments.map((comment) => (
                      <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {comment.author.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{comment.author}</h4>
                              <p className="text-sm text-gray-500">
                                {comment.timestamp.toLocaleDateString()} at {comment.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                              <ThumbsUp className="h-4 w-4" />
                              <span className="text-sm">{comment.votes}</span>
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Issue Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Issue Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reported by:</span>
                      <span className="font-medium">{selectedIssue.reportedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reported on:</span>
                      <span className="font-medium">{selectedIssue.reportedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last updated:</span>
                      <span className="font-medium">{selectedIssue.updatedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{selectedIssue.category}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Subscribe to Updates
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Share Issue
                  </button>
                  <button className="w-full text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm">
                    Report as Inappropriate
                  </button>
                </div>

                {/* Related Issues */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Similar Issues Nearby</h3>
                  <div className="space-y-3">
                    {issues.filter(i => i.id !== selectedIssue.id && i.category === selectedIssue.category).slice(0, 2).map((issue) => (
                      <div
                        key={issue.id}
                        className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedIssue(issue)}
                      >
                        <h4 className="font-medium text-gray-900 text-sm truncate">{issue.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{issue.location.address}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`w-2 h-2 rounded-full ${statusColors[issue.status]}`}></span>
                          <span className="text-xs text-gray-500">{issue.status.replace('-', ' ')}</span>
                          <span className="text-xs text-gray-500">• {issue.votes} votes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Notifications Panel
  const NotificationsPanel = () => (
    notifications.length > 0 && (
      <div className="fixed top-20 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Updates</h3>
            <button
              onClick={() => setNotifications([])}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.map((notification, index) => (
            <div key={index} className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <p className="text-sm text-gray-700">{notification}</p>
              <p className="text-xs text-gray-500 mt-1">Just now</p>
            </div>
          ))}
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <NotificationsPanel />
      
      {currentView === 'home' && <HomePage />}
      {currentView === 'map' && <MapView />}
      {currentView === 'report' && <ReportIssue />}
      {currentView === 'analytics' && <AnalyticsDashboard />}
      {currentView === 'issue' && <IssueDetail />}
    </div>
  );
}

export default App;