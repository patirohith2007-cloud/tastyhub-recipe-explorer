import React from 'react';
import { RecipeProvider, useRecipeContext } from './context/RecipeContext';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { HomeScreen } from './screens/HomeScreen';
import { RecipeDetailScreen } from './screens/RecipeDetailScreen';
import { AddRecipeScreen } from './screens/AddRecipeScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { ShoppingListScreen } from './screens/ShoppingListScreen';
import { FlutterCodeModal } from './screens/FlutterCodeModal';
import { UtensilsCrossed, Heart, ShoppingCart, Code2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentScreen, setCurrentScreen, toastMessage } = useRecipeContext();

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF8F5] text-[#1E1B18] selection:bg-orange-200 selection:text-orange-950 font-sans">
      <Navbar />

      <div className="flex-1">
        {currentScreen === 'home' && <HomeScreen />}
        {currentScreen === 'detail' && <RecipeDetailScreen />}
        {(currentScreen === 'add' || currentScreen === 'edit') && <AddRecipeScreen />}
        {currentScreen === 'favorites' && <FavoritesScreen />}
        {currentScreen === 'shopping-list' && <ShoppingListScreen />}
        {currentScreen === 'flutter-code' && <FlutterCodeModal />}
      </div>

      <Toast message={toastMessage} />

      {/* Footer */}
      <footer className="bg-white border-t border-[#EFE8DF] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#5C554E]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E65100] text-white flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#1E1B18] text-sm">
                TastyHub – Recipe Explorer
              </p>
              <p>Flutter Application Development Programme Project</p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-medium flex-wrap justify-center">
            <button
              onClick={() => setCurrentScreen('home')}
              className="hover:text-[#E65100] transition-colors cursor-pointer"
            >
              Explore Recipes
            </button>
            <button
              onClick={() => setCurrentScreen('favorites')}
              className="hover:text-[#E65100] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 text-red-500" />
              <span>Favourites</span>
            </button>
            <button
              onClick={() => setCurrentScreen('shopping-list')}
              className="hover:text-[#E65100] transition-colors cursor-pointer flex items-center gap-1"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#E65100]" />
              <span>Grocery List</span>
            </button>
            <button
              onClick={() => setCurrentScreen('add')}
              className="hover:text-[#E65100] transition-colors cursor-pointer"
            >
              Add Recipe
            </button>
            <button
              onClick={() => setCurrentScreen('flutter-code')}
              className="hover:text-[#E65100] transition-colors cursor-pointer flex items-center gap-1 font-bold text-[#E65100]"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Flutter & APK Code</span>
            </button>
          </div>

          <p className="text-[#8D857B]">
            Built with Dart, Flutter & Provider architecture.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <RecipeProvider>
      <MainContent />
    </RecipeProvider>
  );
}
