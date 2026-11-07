import React, { useState } from 'react';
import { Recipe } from '../types/recipe';
import { useRecipeContext } from '../context/RecipeContext';
import { Clock, ChefHat, Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { openRecipeDetail, toggleFavorite, isFavorite } = useRecipeContext();
  const [imgError, setImgError] = useState(false);
  const favorite = isFavorite(recipe.id);

  const fallbackImage =
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => openRecipeDetail(recipe)}
      className="group bg-white rounded-2xl overflow-hidden border border-[#EFE8DF] shadow-xs hover:shadow-xl hover:shadow-orange-950/5 hover:border-[#FFB74D]/60 transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
        <img
          src={imgError ? fallbackImage : recipe.imageUrl || fallbackImage}
          alt={recipe.name}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for bottom text legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold tracking-wide">
          <ChefHat className="w-3.5 h-3.5 text-[#FFA726]" />
          <span>{recipe.category}</span>
        </div>

        {/* User Created Badge if applicable */}
        {recipe.isUserCreated && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E65100] text-white text-[11px] font-bold shadow-md">
            <Sparkles className="w-3 h-3 text-[#FFE0B2]" />
            <span>My Recipe</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all active:scale-80 cursor-pointer shadow-md ${
            favorite
              ? 'bg-white text-red-500 shadow-red-500/20'
              : 'bg-black/40 hover:bg-white text-white hover:text-red-500 backdrop-blur-xs'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              favorite ? 'fill-red-500 scale-110' : ''
            }`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Recipe Name */}
          <h3 className="font-bold text-[#1E1B18] text-base sm:text-lg line-clamp-1 group-hover:text-[#E65100] transition-colors">
            {recipe.name}
          </h3>

          {/* Short Description */}
          <p className="mt-1.5 text-xs sm:text-sm text-[#5C554E] line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Footer Meta: Prep Time & Ingredients Count */}
        <div className="mt-4 pt-3 border-t border-[#F2ECE4] flex items-center justify-between text-xs text-[#5C554E] font-medium">
          <div className="flex items-center gap-1.5 text-[#E65100]">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-semibold">{recipe.prepTime} min prep</span>
          </div>

          <div className="flex items-center gap-1 text-[#8D857B]">
            <span>{recipe.ingredients.length} ingredients</span>
            {recipe.difficulty && (
              <>
                <span>•</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    recipe.difficulty === 'Easy'
                      ? 'bg-green-100 text-green-700'
                      : recipe.difficulty === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {recipe.difficulty}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
