import { ReviewCard } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'scc_review_cards';

// Transform database row to ReviewCard type
const transformDbRowToCard = (row: any): ReviewCard => ({
  id: row.id,
  businessName: row.business_name,
  category: row.category,
  type: row.type,
  description: row.description || '',
  location: row.location || '',
  slug: row.slug,
  logoUrl: row.logo_url || '',
  googleMapsUrl: row.google_maps_url,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

// Transform ReviewCard to database insert format
const transformCardToDbInsert = (card: ReviewCard) => ({
  id: card.id,
  business_name: card.businessName,
  category: card.category,
  type: card.type,
  description: card.description || null,
  location: card.location || null,
  slug: card.slug,
  logo_url: card.logoUrl || null,
  google_maps_url: card.googleMapsUrl
});

// Transform ReviewCard to database update format
const transformCardToDbUpdate = (card: ReviewCard) => ({
  business_name: card.businessName,
  category: card.category,
  type: card.type,
  description: card.description || null,
  location: card.location || null,
  slug: card.slug,
  logo_url: card.logoUrl || null,
  google_maps_url: card.googleMapsUrl,
  updated_at: new Date().toISOString()
});

export const storage = {
  // Local storage helper methods
  _getLocalCards(): ReviewCard[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  _saveLocalCards(cards: ReviewCard[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  _addLocalCard(card: ReviewCard): void {
    const cards = this._getLocalCards();
    cards.unshift(card);
    this._saveLocalCards(cards);
  },

  _updateLocalCard(updatedCard: ReviewCard): void {
    const cards = this._getLocalCards();
    const index = cards.findIndex(card => card.id === updatedCard.id);
    if (index !== -1) {
      cards[index] = updatedCard;
      this._saveLocalCards(cards);
    }
  },

  _deleteLocalCard(cardId: string): void {
    const cards = this._getLocalCards();
    const filteredCards = cards.filter(card => card.id !== cardId);
    this._saveLocalCards(filteredCards);
  },

  _getLocalCardBySlug(slug: string): ReviewCard | null {
    const cards = this._getLocalCards();
    return cards.find(card => card.slug === slug) || null;
  },

  async getCards(): Promise<ReviewCard[]> {
    try {
      // Use Supabase if configured, otherwise fall back to localStorage
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from('review_cards')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching cards from Supabase:', error);
          return this._getLocalCards();
        }

        return (data || []).map(transformDbRowToCard);
      } else {
        return this._getLocalCards();
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      return this._getLocalCards();
    }
  },

  async addCard(card: ReviewCard): Promise<boolean> {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('review_cards')
          .insert([transformCardToDbInsert(card)]);

        if (error) {
          console.error('Error adding card to Supabase:', error);
          this._addLocalCard(card);
          return false;
        }
        return true;
      } else {
        this._addLocalCard(card);
        return true;
      }
    } catch (error) {
      console.error('Error adding card:', error);
      this._addLocalCard(card);
      return false;
    }
  },

  async updateCard(updatedCard: ReviewCard): Promise<boolean> {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('review_cards')
          .update(transformCardToDbUpdate(updatedCard))
          .eq('id', updatedCard.id);

        if (error) {
          console.error('Error updating card in Supabase:', error);
          this._updateLocalCard(updatedCard);
          return false;
        }
        return true;
      } else {
        this._updateLocalCard(updatedCard);
        return true;
      }
    } catch (error) {
      console.error('Error updating card:', error);
      this._updateLocalCard(updatedCard);
      return false;
    }
  },

  async deleteCard(cardId: string): Promise<boolean> {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('review_cards')
          .delete()
          .eq('id', cardId);

        if (error) {
          console.error('Error deleting card from Supabase:', error);
          this._deleteLocalCard(cardId);
          return false;
        }
        return true;
      } else {
        this._deleteLocalCard(cardId);
        return true;
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      this._deleteLocalCard(cardId);
      return false;
    }
  },

  async getCardBySlug(slug: string): Promise<ReviewCard | null> {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from('review_cards')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) {
          console.error('Error fetching card by slug from Supabase:', error);
          return this._getLocalCardBySlug(slug);
        }

        return data ? transformDbRowToCard(data) : null;
      } else {
        return this._getLocalCardBySlug(slug);
      }
    } catch (error) {
      console.error('Error loading card by slug:', error);
      return this._getLocalCardBySlug(slug);
    }
  },

  // Migration helper: Move data from localStorage to Supabase
  async migrateFromLocalStorage(): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) {
      console.log('Supabase not configured, skipping migration');
      return;
    }

    try {
      const localCards = this._getLocalCards();
      if (localCards.length === 0) return;

      console.log(`Migrating ${localCards.length} cards from localStorage to Supabase...`);

      for (const card of localCards) {
        const success = await this.addCard(card);
        if (success) {
          console.log(`Migrated card: ${card.businessName}`);
        } else {
          console.error(`Failed to migrate card: ${card.businessName}`);
        }
      }

      // Clear localStorage after successful migration
      localStorage.removeItem(STORAGE_KEY);
      console.log('Migration completed and localStorage cleared.');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  }
};