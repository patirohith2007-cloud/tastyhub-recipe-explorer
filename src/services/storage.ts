import { Recipe, ShoppingListItem } from '../types/recipe';

const USER_RECIPES_KEY = 'tastyhub_user_recipes_v1';
const FAVORITES_KEY = 'tastyhub_favorites_v1';
const SHOPPING_KEY = 'tastyhub_shopping_v1';

/**
 * Local Persistence Service
 * Modeled after SharedPreferences in Flutter
 */
export const storageService = {
  // Get all user-created recipes
  getUserRecipes(): Recipe[] {
    try {
      const data = localStorage.getItem(USER_RECIPES_KEY);
      if (!data) return [];
      return JSON.parse(data) as Recipe[];
    } catch (err) {
      console.error('Failed to parse user recipes from storage:', err);
      return [];
    }
  },

  // Save a new user recipe
  saveUserRecipe(recipe: Recipe): void {
    try {
      const current = this.getUserRecipes();
      const updated = [recipe, ...current.filter((r) => r.id !== recipe.id)];
      localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save user recipe:', err);
    }
  },

  // Update existing user recipe
  updateUserRecipe(recipe: Recipe): void {
    try {
      const current = this.getUserRecipes();
      const index = current.findIndex((r) => r.id === recipe.id);
      if (index !== -1) {
        current[index] = recipe;
      } else {
        current.unshift(recipe);
      }
      localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(current));
    } catch (err) {
      console.error('Failed to update user recipe:', err);
    }
  },

  // Delete a user recipe
  deleteUserRecipe(recipeId: string): void {
    try {
      const current = this.getUserRecipes();
      const updated = current.filter((r) => r.id !== recipeId);
      localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to delete user recipe:', err);
    }
  },

  // Get favorite recipe IDs
  getFavoriteIds(): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      if (!data) return ['tasty-1', 'tasty-3', 'tasty-5', 'tasty-7', 'tasty-9'];
      return JSON.parse(data) as string[];
    } catch (err) {
      console.error('Failed to parse favorites from storage:', err);
      return [];
    }
  },

  // Toggle favorite status
  toggleFavoriteId(recipeId: string): boolean {
    try {
      const current = this.getFavoriteIds();
      const exists = current.includes(recipeId);
      const updated = exists
        ? current.filter((id) => id !== recipeId)
        : [...current, recipeId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return !exists;
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      return false;
    }
  },

  // Check if a recipe is a favorite
  isFavorite(recipeId: string): boolean {
    const favorites = this.getFavoriteIds();
    return favorites.includes(recipeId);
  },

  // --- Shopping List Persistence ---
  getShoppingList(): ShoppingListItem[] {
    try {
      const data = localStorage.getItem(SHOPPING_KEY);
      if (!data) return [];
      return JSON.parse(data) as ShoppingListItem[];
    } catch (err) {
      console.error('Failed to parse shopping list:', err);
      return [];
    }
  },

  saveShoppingList(items: ShoppingListItem[]): void {
    try {
      localStorage.setItem(SHOPPING_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save shopping list:', err);
    }
  },

  addIngredientsToShoppingList(
    ingredients: Array<{ id: string; name: string; amount: string }>,
    recipeName?: string
  ): void {
    try {
      const current = this.getShoppingList();
      const newItems: ShoppingListItem[] = ingredients.map((ing) => ({
        id: `shop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: ing.name,
        amount: ing.amount,
        recipeName,
        checked: false,
      }));
      this.saveShoppingList([...current, ...newItems]);
    } catch (err) {
      console.error('Failed to add ingredients to shopping list:', err);
    }
  },
};
