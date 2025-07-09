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
          return this.getLocalCards();
        }

        return data || [];
      } else {
        return this.getLocalCards();
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      return this.getLocalCards();
    }
  },

  async addCard(card: ReviewCard): Promise<void> {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('review_cards')
          .insert([card]);

        if (error) {
          console.error('Error adding card to Supabase:', error);
          this.addLocalCard(card);
          return;
        }
      } else {
        this.addLocalCard(card);
      }
    } catch (error) {
      console.error('Error adding card:', error);
      this.addLocalCard(card);
    }
  },

  async updateCard(updatedCard: ReviewCard): Promise<void> {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('review_cards')
          .update(updatedCard)
          .eq('id', updatedCard.id);

        if (error) {
          console.error('Error updating card in Supabase:', error);
          this.updateLocalCard(updatedCard);
          return;
        }
      } else {
        this.updateLocalCard(updatedCard);
      }
    } catch (error) {
      console.error('Error updating card:', error);
      this.updateLocalCard(updatedCard);
    }
  },

  async deleteCard(cardId: string): Promise<void> {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from('review_cards')
          .delete()
          .eq('id', cardId);

        if (error) {
          console.error('Error deleting card from Supabase:', error);
          this.deleteLocalCard(cardId);
          return;
        }
      } else {
        this.deleteLocalCard(cardId);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      this.deleteLocalCard(cardId);
    }
  },

  async getCardBySlug(slug: string): Promise<ReviewCard | null> {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from('review_cards')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching card by slug from Supabase:', error);
          return this.getLocalCardBySlug(slug);
        }

        return data;
      } else {
        return this.getLocalCardBySlug(slug);
      }
    } catch (error) {
      console.error('Error loading card by slug:', error);
      return this.getLocalCardBySlug(slug);
    }
  },

  // Migration helper: Move data from localStorage to Supabase
  async migrateFromLocalStorage(): Promise<void> {
    if (!isSupabaseConfigured() || !supabase) {
      console.log('Supabase not configured, skipping migration');
      return;
    }

    try {
      const localCards = this.getLocalCards();
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
      localStorage.removeItem('scc_review_cards');
      console.log('Migration completed and localStorage cleared.');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  }
};