export interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  area?: string;
  imageUrl: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  isFavorite?: boolean;
  isUserCreated?: boolean;
  createdAt?: string;
  tags?: string[];
  youtubeUrl?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: string;
  recipeName?: string;
  checked: boolean;
}

export type ViewState = 'loading' | 'error' | 'empty' | 'data';

export type ScreenType =
  | 'home'
  | 'detail'
  | 'add'
  | 'edit'
  | 'favorites'
  | 'shopping-list'
  | 'flutter-code';

export interface CategoryInfo {
  id: string;
  name: string;
  iconName: string;
}
