import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Building2, Calendar, LogOut, Database, Loader2 } from 'lucide-react';
import { ReviewCard } from '../types';
import { storage } from '../utils/storage';
import { formatDate } from '../utils/helpers';
import { CompactAddCardModal } from './CompactAddCardModal';
import { EditCardModal } from './EditCardModal';
import { ConfirmDialog } from './ConfirmDialog';
import { QRCodeCard } from './QRCodeCard';
import { auth } from '../utils/auth';

export const AdminDashboard: React.FC = () => {
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCard, setEditingCard] = useState<ReviewCard | null>(null);
  const [deletingCard, setDeletingCard] = useState<ReviewCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    loadCards();
    checkForMigration();
  }, []);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const savedCards = await storage.getCards();
      setCards(savedCards);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForMigration = async () => {
    const localData = localStorage.getItem('scc_review_cards');
    if (localData) {
      const localCards = JSON.parse(localData);
      if (localCards.length > 0) {
        setIsMigrating(true);
        await storage.migrateFromLocalStorage();
        setIsMigrating(false);
        // Reload cards after migration
        loadCards();
      }
    }
  };

  const handleAddCard = async (newCard: ReviewCard) => {
    const success = await storage.addCard(newCard);
    if (success) {
      loadCards();
      setShowAddModal(false);
    } else {
      alert('Failed to add card. Please try again.');
    }
  };

  const handleEditCard = async (updatedCard: ReviewCard) => {
    const success = await storage.updateCard(updatedCard);
    if (success) {
      loadCards();
      setEditingCard(null);
    } else {
      alert('Failed to update card. Please try again.');
    }
  };

  const handleDeleteCard = async () => {
    if (deletingCard) {
      const success = await storage.deleteCard(deletingCard.id);
      if (success) {
        loadCards();
        setDeletingCard(null);
      } else {
        alert('Failed to delete card. Please try again.');
      }
    }
  };

  const filteredCards = cards.filter(card =>
    card.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePreview = (slug: string) => {
    window.open(`/${slug}`, '_blank');
  };

  const handleLogout = () => {
    auth.logout();
    window.location.href = '/login';
  };

  if (isMigrating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Migrating Data</h1>
          <p className="text-slate-400 mb-8">
            Moving your review cards to cloud storage for cross-device sync...
          </p>
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin mr-2" />
            <span className="text-blue-400">Please wait...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center text-green-400 text-sm">
              <Database className="w-4 h-4 mr-2" />
              <span>Cloud Storage Active</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Review Cards Dashboard
          </h1>
          <p className="text-slate-300">
            Your review cards are now synced across all devices
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cards by business name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Card
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Cards</p>
                <p className="text-3xl font-bold text-white">{cards.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Today</p>
                <p className="text-3xl font-bold text-white">{cards.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold text-white">{cards.filter(card => {
                  const cardDate = new Date(card.createdAt);
                  const now = new Date();
                  return cardDate.getMonth() === now.getMonth() && cardDate.getFullYear() === now.getFullYear();
                }).length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">Loading Cards</h3>
            <p className="text-slate-400">Fetching your review cards from cloud storage...</p>
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              {searchTerm ? 'No cards found' : 'No review cards yet'}
            </h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search terms or create a new card.'
                : 'Get started by creating your first review card for your business.'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Card
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Review Cards Grid */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Building2 className="w-6 h-6 mr-3" />
                Review Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-lg">
                          {card.logoUrl ? (
                            <img
                              src={card.logoUrl}
                              alt={`${card.businessName} logo`}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {card.businessName}
                          </h3>
                          <p className="text-sm text-slate-400">/{card.slug}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-slate-400 mb-1">Created</p>
                        <p className="text-sm text-slate-300">{formatDate(card.createdAt)}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreview(card.slug)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </button>
                        <button
                          onClick={() => setEditingCard(card)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors duration-200"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingCard(card)}
                          className="inline-flex items-center justify-center px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Codes Grid */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <div className="w-6 h-6 mr-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-white">QR</span>
                </div>
                QR Codes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCards.map((card) => (
                  <QRCodeCard key={`qr-${card.id}`} card={card} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showAddModal && (
          <CompactAddCardModal
            onClose={() => setShowAddModal(false)}
            onSave={handleAddCard}
          />
        )}

        {editingCard && (
          <EditCardModal
            card={editingCard}
            onClose={() => setEditingCard(null)}
            onSave={handleEditCard}
          />
        )}

        {deletingCard && (
          <ConfirmDialog
            title="Delete Review Card"
            message={`Are you sure you want to delete the review card for "${deletingCard.businessName}"? This action cannot be undone.`}
            onConfirm={handleDeleteCard}
            onCancel={() => setDeletingCard(null)}
          />
        )}
      </div>
    </div>
  );
};