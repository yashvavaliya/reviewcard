import { ReviewCard } from '../types';
import { supabase } from './supabase';

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
      const { data, error } = await supabase
        .from('review_cards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cards:', error);
        return [];
      }

      return data?.map(transformDbRowToCard) || [];
    } catch (error) {
      console.error('Error loading cards from database:', error);
      return [];
    }
  },

  async addCard(card: ReviewCard): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('review_cards')
        .insert(transformCardToDbInsert(card));

      if (error) {
        console.error('Error adding card:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving card to database:', error);
      return false;
    }
  },

  async updateCard(updatedCard: ReviewCard): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('review_cards')
        .update(transformCardToDbUpdate(updatedCard))
        .eq('id', updatedCard.id);

      if (error) {
        console.error('Error updating card:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating card in database:', error);
      return false;
    }
  },

  async deleteCard(cardId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('review_cards')
        .delete()
        .eq('id', cardId);

      if (error) {
        console.error('Error deleting card:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting card from database:', error);
      return false;
    }
  },

  async getCardBySlug(slug: string): Promise<ReviewCard | null> {
    try {
      const { data, error } = await supabase
        .from('review_cards')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching card by slug:', error);
        return null;
      }

      return data ? transformDbRowToCard(data) : null;
    } catch (error) {
      console.error('Error loading card by slug from database:', error);
      return null;
    }
  },

  // Migration helper: Move data from localStorage to Supabase
  async migrateFromLocalStorage(): Promise<void> {
    try {
      const localData = localStorage.getItem('scc_review_cards');
      if (!localData) return;

      const localCards: ReviewCard[] = JSON.parse(localData);
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