import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Calendar, User } from 'lucide-react';
import { Announcement, AnnouncementCategory } from '@/types/announcements';
import { getAnnouncements, addReaction, removeReaction, searchAnnouncements, filterByCategory } from '@/services/announcementsApi';
import { AnnouncementCard } from '@/components/announcements/AnnouncementCard';

const CATEGORIES: { value: AnnouncementCategory | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
  { value: 'info', label: 'Info', color: 'bg-blue-100 text-blue-800' },
  { value: 'event', label: 'Events', color: 'bg-purple-100 text-purple-800' },
  { value: 'policy', label: 'Policy', color: 'bg-green-100 text-green-800' },
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' }
];

export const AnnouncementFeed: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AnnouncementCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  useEffect(() => {
    filterAndSortAnnouncements();
  }, [announcements, selectedCategory, sortBy, searchQuery]);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    const data = await getAnnouncements();
    setAnnouncements(data);
    setIsLoading(false);
  };

  const filterAndSortAnnouncements = () => {
    let filtered = [...announcements];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query) ||
        a.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    } else {
      filtered.sort((a, b) => b.totalReactions - a.totalReactions);
    }

    // Pinned first
    filtered.sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1));

    setFilteredAnnouncements(filtered);
  };

  const handleReaction = async (announcementId: string, emoji: string, hasReacted: boolean) => {
    if (hasReacted) {
      await removeReaction(announcementId, emoji);
    } else {
      await addReaction(announcementId, emoji);
    }
    loadAnnouncements();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Announcements</h1>
          <p className="text-gray-600">Stay updated with hospital news and updates</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.value
                    ? 'bg-purple-600 text-white shadow-lg'
                    : `${category.color} hover:shadow-md`
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <button
              onClick={() => setSortBy('recent')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                sortBy === 'recent'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Recent
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                sortBy === 'popular'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Popular
            </button>
          </div>
        </div>

        {/* Announcements Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.map((announcement, index) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onReaction={handleReaction}
                delay={index * 0.05}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
