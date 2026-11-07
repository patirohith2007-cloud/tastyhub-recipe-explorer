import React, { useState } from 'react';
import { useRecipeContext } from '../context/RecipeContext';
import { RecipeCard } from '../components/RecipeCard';
import { Heart, Search, ArrowLeft, UtensilsCrossed, Sparkles } from 'lucide-react';

export const FavoritesScreen: React.FC = () => {
  const { favorites, setCurrentScreen } = useRecipeContext();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredFavorites = favorites.filter((r) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#FBF8F5] pb-24">
      {/* Top Banner */}
      <section className="bg-white border-b border-[#EFE8DF] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => setCurrentScreen('home')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E65100] hover:underline mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Recipe Directory</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-red-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B18]">
                  My Favourites
                </h1>
                <p className="text-xs sm:text-sm text-[#5C554E]">
                  Your curated collection of favorite culinary creations
                </p>
              </div>
            </div>
          </div>

          {favorites.length > 0 && (
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D857B]" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter your favorites..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0D8CE] bg-white text-sm text-[#1E1B18] placeholder-[#8D857B] focus:border-[#E65100] focus:outline-none"
              />
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {favorites.length === 0 ? (
          /* Empty Favorites State */
          <div className="py-20 text-center">
            <div className="max-w-md mx-auto space-y-5">
              <div className="w-24 h-24 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100 shadow-inner">
                <Heart className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1E1B18]">
                  No Favourites Saved Yet
                </h2>
                <p className="mt-2 text-sm text-[#5C554E] leading-relaxed">
                  Browse delicious recipes and tap the heart icon on any dish to save it
                  to your personal cookbook for quick access anytime!
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E65100] hover:bg-[#D84315] text-white text-sm font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Discover Delicious Recipes</span>
                </button>
              </div>
            </div>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-base text-[#5C554E]">
              No favorites match &ldquo;{filterQuery}&rdquo;.
            </p>
            <button
              onClick={() => setFilterQuery('')}
              className="mt-3 text-xs font-bold text-[#E65100] underline cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between pb-4">
              <span className="text-xs font-bold text-[#8D857B] uppercase tracking-wider">
                {filteredFavorites.length} Saved {filteredFavorites.length === 1 ? 'Dish' : 'Dishes'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFavorites.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
