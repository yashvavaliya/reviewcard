import { ReviewCard } from '../types';

const STORAGE_KEY = 'scc_review_cards';

export const storage = {
  getCards(): ReviewCard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading cards from storage:', error);
      return [];
    }
  },

  saveCards(cards: ReviewCard[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
      console.error('Error saving cards to storage:', error);
    }
  },

  addCard(card: ReviewCard): void {
    const cards = this.getCards();
    cards.push(card);
    this.saveCards(cards);
  },

  updateCard(updatedCard: ReviewCard): void {
    const cards = this.getCards();
    const index = cards.findIndex(card => card.id === updatedCard.id);
    if (index !== -1) {
      cards[index] = updatedCard;
      this.saveCards(cards);
    }
  },

  deleteCard(cardId: string): void {
    const cards = this.getCards();
    const filteredCards = cards.filter(card => card.id !== cardId);
    this.saveCards(filteredCards);
  },

  getCardBySlug(slug: string): ReviewCard | null {
    const cards = this.getCards();
    return cards.find(card => card.slug === slug) || null;
  }
};