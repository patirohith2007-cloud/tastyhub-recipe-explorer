export interface FlutterFile {
  path: string;
  name: string;
  language: string;
  content: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    language: 'yaml',
    content: `name: tastyhub_recipe_app
description: "TastyHub - Recipe Explorer Flutter Web and Android Application"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # State Management
  provider: ^6.1.2
  # HTTP networking for TheMealDB API
  http: ^1.2.1
  # Local Persistence
  shared_preferences: ^2.2.3
  # Google Fonts for Material 3 typography
  google_fonts: ^6.2.1
  # Icons & animations
  cached_network_image: ^3.3.1
  flutter_spinkit: ^5.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/recipe_provider.dart';
import 'screens/home_screen.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const TastyHubApp());
}

class TastyHubApp extends StatelessWidget {
  const TastyHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => RecipeProvider()..initialize(),
        ),
      ],
      child: MaterialApp(
        title: 'TastyHub – Recipe Explorer',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const HomeScreen(),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/theme/app_theme.dart',
    name: 'app_theme.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Central Application Theme generated from Warm Orange seed color.
class AppTheme {
  // Theme Seed Color
  static const Color seedColor = Color(0xFFE65100); // Warm Deep Orange
  static const Color primaryWarmOrange = Color(0xFFE65100);
  static const Color creamSecondary = Color(0xFFFFF8E7);
  static const Color neutralBackground = Color(0xFFFBF8F5);
  static const Color cardWhite = Colors.white;
  static const Color textDark = Color(0xFF1E1B18);

  static ThemeData get lightTheme {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: seedColor,
      primary: primaryWarmOrange,
      secondary: const Color(0xFFFFA726),
      surface: cardWhite,
      background: neutralBackground,
      surfaceVariant: const Color(0xFFF3ECE4),
      onPrimary: Colors.white,
      onSurface: textDark,
      brightness: Brightness.light,
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: neutralBackground,
      textTheme: GoogleFonts.interTextTheme().copyWith(
        headlineMedium: GoogleFonts.inter(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: textDark,
        ),
        titleLarge: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: textDark,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          color: const Color(0xFF4A443D),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: cardWhite,
        foregroundColor: textDark,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.w800,
          color: primaryWarmOrange,
        ),
      ),
      cardTheme: CardTheme(
        color: cardWhite,
        elevation: 2,
        shadowColor: Colors.black.withOpacity(0.06),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFFEFE8DF), width: 1),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryWarmOrange,
          foregroundColor: Colors.white,
          elevation: 1,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.inter(
            fontWeight: FontWeight.w600,
            fontSize: 15,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: cardWhite,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE0D8CE)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE0D8CE)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primaryWarmOrange, width: 2),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/models/recipe.dart',
    name: 'recipe.dart',
    language: 'dart',
    content: `class Ingredient {
  final String id;
  final String name;
  final String amount;

  const Ingredient({
    required this.id,
    required this.name,
    required this.amount,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'amount': amount,
  };

  factory Ingredient.fromJson(Map<String, dynamic> json) => Ingredient(
    id: json['id'] ?? '',
    name: json['name'] ?? '',
    amount: json['amount'] ?? '',
  );
}

class Recipe {
  final String id;
  final String name;
  final String description;
  final String category;
  final String? area;
  final String imageUrl;
  final int prepTime;
  final int cookTime;
  final int servings;
  final List<Ingredient> ingredients;
  final List<String> instructions;
  final bool isUserCreated;
  final String? createdAt;
  final String difficulty;

  const Recipe({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    this.area,
    required this.imageUrl,
    required this.prepTime,
    required this.cookTime,
    required this.servings,
    required this.ingredients,
    required this.instructions,
    this.isUserCreated = false,
    this.createdAt,
    this.difficulty = 'Easy',
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'category': category,
    'area': area,
    'imageUrl': imageUrl,
    'prepTime': prepTime,
    'cookTime': cookTime,
    'servings': servings,
    'ingredients': ingredients.map((i) => i.toJson()).toList(),
    'instructions': instructions,
    'isUserCreated': isUserCreated,
    'createdAt': createdAt,
    'difficulty': difficulty,
  };

  factory Recipe.fromJson(Map<String, dynamic> json) => Recipe(
    id: json['id'] ?? '',
    name: json['name'] ?? '',
    description: json['description'] ?? '',
    category: json['category'] ?? 'General',
    area: json['area'],
    imageUrl: json['imageUrl'] ?? '',
    prepTime: json['prepTime'] ?? 15,
    cookTime: json['cookTime'] ?? 20,
    servings: json['servings'] ?? 4,
    ingredients: (json['ingredients'] as List? ?? [])
        .map((i) => Ingredient.fromJson(i))
        .toList(),
    instructions: List<String>.from(json['instructions'] ?? []),
    isUserCreated: json['isUserCreated'] ?? false,
    createdAt: json['createdAt'],
    difficulty: json['difficulty'] ?? 'Easy',
  );
}
`,
  },
  {
    path: 'lib/services/storage_service.dart',
    name: 'storage_service.dart',
    language: 'dart',
    content: `import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/recipe.dart';

/// Local Persistence service using SharedPreferences
class StorageService {
  static const String _userRecipesKey = 'tastyhub_user_recipes';
  static const String _favoritesKey = 'tastyhub_favorites';

  Future<List<Recipe>> getUserRecipes() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonStr = prefs.getString(_userRecipesKey);
    if (jsonStr == null) return [];
    final List decoded = jsonDecode(jsonStr);
    return decoded.map((item) => Recipe.fromJson(item)).toList();
  }

  Future<void> saveUserRecipe(Recipe recipe) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getUserRecipes();
    current.insert(0, recipe);
    final encoded = jsonEncode(current.map((r) => r.toJson()).toList());
    await prefs.setString(_userRecipesKey, encoded);
  }

  Future<void> deleteUserRecipe(String recipeId) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getUserRecipes();
    current.removeWhere((r) => r.id == recipeId);
    final encoded = jsonEncode(current.map((r) => r.toJson()).toList());
    await prefs.setString(_userRecipesKey, encoded);
  }

  Future<List<String>> getFavoriteIds() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_favoritesKey) ?? [];
  }

  Future<bool> toggleFavorite(String recipeId) async {
    final prefs = await SharedPreferences.getInstance();
    final list = await getFavoriteIds();
    bool isNowFav;
    if (list.contains(recipeId)) {
      list.remove(recipeId);
      isNowFav = false;
    } else {
      list.add(recipeId);
      isNowFav = true;
    }
    await prefs.setStringList(_favoritesKey, list);
    return isNowFav;
  }
}
`,
  },
  {
    path: 'lib/services/recipe_service.dart',
    name: 'recipe_service.dart',
    language: 'dart',
    content: `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/recipe.dart';

/// Public Recipe API service interacting with TheMealDB
class RecipeService {
  static const String _baseUrl = 'https://www.themealdb.com/api/json/v1/1';

  Future<List<Recipe>> fetchRecipes({String query = '', String category = 'All'}) async {
    try {
      String url = '$_baseUrl/search.php?s=';
      if (query.isNotEmpty) {
        url = '$_baseUrl/search.php?s=\${Uri.encodeComponent(query)}';
      } else if (category != 'All' && category != 'User Created') {
        url = '$_baseUrl/filter.php?c=\${Uri.encodeComponent(category)}';
      }

      final response = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 8));

      if (response.statusCode != 200) {
        throw Exception('Server error: \${response.statusCode}');
      }

      final data = jsonDecode(response.body);
      final meals = data['meals'] as List?;
      if (meals == null || meals.isEmpty) {
        return [];
      }

      return meals.map<Recipe>((meal) {
        final ingredients = <Ingredient>[];
        for (int i = 1; i <= 20; i++) {
          final ing = meal['strIngredient\$i'];
          final measure = meal['strMeasure\$i'];
          if (ing != null && ing.toString().trim().isNotEmpty) {
            ingredients.add(
              Ingredient(
                id: 'ing-\${meal['idMeal']}-\$i',
                name: ing.toString().trim(),
                amount: measure?.toString().trim() ?? 'As needed',
              ),
            );
          }
        }

        final rawInstructions = meal['strInstructions']?.toString() ?? '';
        final steps = rawInstructions
            .split(RegExp(r'\\r?\\n'))
            .map((s) => s.trim())
            .filter((s) => s.length > 5)
            .toList();

        return Recipe(
          id: meal['idMeal'].toString(),
          name: meal['strMeal'].toString(),
          description: steps.isNotEmpty ? steps.first : 'Delicious culinary masterpiece.',
          category: meal['strCategory']?.toString() ?? 'General',
          area: meal['strArea']?.toString(),
          imageUrl: meal['strMealThumb']?.toString() ?? '',
          prepTime: 15,
          cookTime: 25,
          servings: 4,
          ingredients: ingredients,
          instructions: steps.isNotEmpty ? steps : ['Follow standard preparation procedures.'],
        );
      }).toList();
    } catch (e) {
      throw Exception('Failed to connect to recipe repository. \$e');
    }
  }
}

extension ListFilter<E> on Iterable<E> {
  Iterable<E> filter(bool Function(E element) test) => where(test);
}
`,
  },
  {
    path: 'lib/providers/recipe_provider.dart',
    name: 'recipe_provider.dart',
    language: 'dart',
    content: `import 'package:flutter/foundation.dart';
import '../models/recipe.dart';
import '../services/recipe_service.dart';
import '../services/storage_service.dart';

enum ViewState { loading, error, empty, data }

/// Main Provider managing recipes, 4 mandatory states, and local persistence
class RecipeProvider extends ChangeNotifier {
  final RecipeService _apiService = RecipeService();
  final StorageService _storageService = StorageService();

  List<Recipe> _recipes = [];
  List<Recipe> _userRecipes = [];
  List<String> _favoriteIds = [];
  ViewState _state = ViewState.loading;
  String? _errorMessage;
  String _searchQuery = '';
  String _selectedCategory = 'All';

  // Getters
  List<Recipe> get recipes => _recipes;
  List<Recipe> get userRecipes => _userRecipes;
  List<String> get favoriteIds => _favoriteIds;
  ViewState get state => _state;
  String? get errorMessage => _errorMessage;
  String get searchQuery => _searchQuery;
  String get selectedCategory => _selectedCategory;

  List<Recipe> get favorites {
    final all = [..._userRecipes, ..._recipes];
    return all.where((r) => _favoriteIds.contains(r.id)).toList();
  }

  bool isFavorite(String id) => _favoriteIds.contains(id);

  Future<void> initialize() async {
    _favoriteIds = await _storageService.getFavoriteIds();
    _userRecipes = await _storageService.getUserRecipes();
    await loadRecipes();
  }

  Future<void> loadRecipes() async {
    _state = ViewState.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final fetched = await _apiService.fetchRecipes(
        query: _searchQuery,
        category: _selectedCategory,
      );
      _userRecipes = await _storageService.getUserRecipes();

      List<Recipe> combined = [..._userRecipes, ...fetched];

      if (_selectedCategory != 'All') {
        if (_selectedCategory == 'User Created') {
          combined = combined.where((r) => r.isUserCreated).toList();
        } else {
          combined = combined
              .where((r) => r.category.toLowerCase() == _selectedCategory.toLowerCase())
              .toList();
        }
      }

      if (_searchQuery.isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        combined = combined
            .where((r) =>
                r.name.toLowerCase().contains(q) ||
                r.description.toLowerCase().contains(q))
            .toList();
      }

      _recipes = combined;
      _state = _recipes.isEmpty ? ViewState.empty : ViewState.data;
    } catch (e) {
      _errorMessage = 'Unable to load recipes. Please check your network and retry.';
      _state = ViewState.error;
    }
    notifyListeners();
  }

  void search(String query) {
    _searchQuery = query;
    loadRecipes();
  }

  void selectCategory(String cat) {
    _selectedCategory = cat;
    loadRecipes();
  }

  Future<void> toggleFavorite(String recipeId) async {
    final isFav = await _storageService.toggleFavorite(recipeId);
    _favoriteIds = await _storageService.getFavoriteIds();
    notifyListeners();
  }

  Future<void> addRecipe(Recipe recipe) async {
    await _storageService.saveUserRecipe(recipe);
    _userRecipes = await _storageService.getUserRecipes();
    _recipes.insert(0, recipe);
    _state = ViewState.data;
    notifyListeners();
  }

  Future<void> deleteRecipe(String recipeId) async {
    await _storageService.deleteUserRecipe(recipeId);
    _userRecipes = await _storageService.getUserRecipes();
    _recipes.removeWhere((r) => r.id == recipeId);
    if (_favoriteIds.contains(recipeId)) {
      toggleFavorite(recipeId);
    }
    if (_recipes.isEmpty) {
      _state = ViewState.empty;
    }
    notifyListeners();
  }

  void retry() {
    loadRecipes();
  }
}
`,
  },
  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/recipe_provider.dart';
import '../widgets/recipe_card.dart';
import 'recipe_detail_screen.dart';
import 'add_recipe_screen.dart';
import 'favorites_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<RecipeProvider>();
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.restaurant_menu, color: Color(0xFFE65100)),
            const SizedBox(width: 8),
            Text(
              'TastyHub',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Favourites',
            icon: Badge(
              label: Text('\${provider.favoriteIds.length}'),
              child: const Icon(Icons.favorite, color: Colors.red),
            ),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const FavoritesScreen()),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          // Welcome Header & Search
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Discover & Cook Great Meals',
                    style: theme.textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    onChanged: (val) => provider.search(val),
                    decoration: InputDecoration(
                      hintText: 'Search delicious recipes, ingredients...',
                      prefixIcon: const Icon(Icons.search),
                      suffixIcon: provider.searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear),
                              onPressed: () => provider.search(''),
                            )
                          : null,
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Categories Row
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: ['All', 'Chicken', 'Breakfast', 'Dessert', 'Seafood', 'Pasta', 'Vegetarian', 'Beef', 'User Created']
                          .map((cat) {
                        final isSelected = provider.selectedCategory == cat;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: FilterChip(
                            label: Text(cat),
                            selected: isSelected,
                            onSelected: (_) => provider.selectCategory(cat),
                            selectedColor: const Color(0xFFFFE0B2),
                            checkmarkColor: const Color(0xFFE65100),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // 4 Mandatory States: Loading, Error, Empty, Data
          _buildStateView(context, provider),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFFE65100),
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add),
        label: const Text('Add Recipe'),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AddRecipeScreen()),
          );
        },
      ),
    );
  }

  Widget _buildStateView(BuildContext context, RecipeProvider provider) {
    // 1. Loading State
    if (provider.state == ViewState.loading) {
      return const SliverFillRemaining(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircularProgressIndicator(color: Color(0xFFE65100)),
              SizedBox(height: 16),
              Text('Fetching delicious recipes...'),
            ],
          ),
        ),
      );
    }

    // 2. Error State with Retry Button
    if (provider.state == ViewState.error) {
      return SliverFillRemaining(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.cloud_off, size: 64, color: Colors.redAccent),
                const SizedBox(height: 16),
                Text(
                  'Connection Error',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 8),
                Text(
                  provider.errorMessage ?? 'Failed to load recipes.',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  onPressed: () => provider.retry(),
                  icon: const Icon(Icons.refresh),
                  label: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    // 3. Empty State
    if (provider.state == ViewState.empty) {
      return SliverFillRemaining(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.search_off, size: 64, color: Colors.orangeAccent),
              const SizedBox(height: 16),
              const Text('No recipes found matching your criteria.'),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: () {
                  provider.search('');
                  provider.selectCategory('All');
                },
                child: const Text('Clear Filters'),
              ),
            ],
          ),
        ),
      );
    }

    // 4. Data State
    return SliverPadding(
      padding: const EdgeInsets.all(16.0),
      sliver: SliverGrid(
        gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
          maxCrossAxisExtent: 380,
          childAspectRatio: 0.85,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        delegate: SliverChildBuilderDelegate(
          (context, index) {
            final recipe = provider.recipes[index];
            return RecipeCard(
              recipe: recipe,
              isFavorite: provider.isFavorite(recipe.id),
              onFavoriteToggle: () => provider.toggleFavorite(recipe.id),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => RecipeDetailScreen(recipe: recipe),
                  ),
                );
              },
            );
          },
          childCount: provider.recipes.length,
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/recipe_detail_screen.dart',
    name: 'recipe_detail_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/recipe.dart';
import '../providers/recipe_provider.dart';

class RecipeDetailScreen extends StatelessWidget {
  final Recipe recipe;

  const RecipeDetailScreen({super.key, required this.recipe});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<RecipeProvider>();
    final isFav = provider.isFavorite(recipe.id);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 280,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                recipe.name,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  shadows: [Shadow(color: Colors.black80, blurRadius: 8)],
                ),
              ),
              background: Image.network(
                recipe.imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  color: Colors.orange.shade100,
                  child: const Icon(Icons.restaurant, size: 80, color: Colors.orange),
                ),
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Meta Info Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _infoBadge(Icons.timer_outlined, '\${recipe.prepTime}m Prep'),
                      _infoBadge(Icons.soup_kitchen_outlined, '\${recipe.cookTime}m Cook'),
                      _infoBadge(Icons.group_outlined, '\${recipe.servings} Servings'),
                      _infoBadge(Icons.bar_chart_outlined, recipe.difficulty),
                    ],
                  ),
                  const SizedBox(height: 24),
                  // Description
                  Text(
                    'About this Recipe',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 8),
                  Text(recipe.description),
                  const SizedBox(height: 24),
                  // Ingredients Section
                  Text(
                    'Ingredients (\${recipe.ingredients.length})',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 12),
                  ...recipe.ingredients.map(
                    (ing) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4.0),
                      child: Row(
                        children: [
                          const Icon(Icons.check_circle_outline, color: Color(0xFFE65100), size: 20),
                          const SizedBox(width: 8),
                          Expanded(child: Text(ing.name)),
                          Text(
                            ing.amount,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Instructions Section
                  Text(
                    'Step-by-Step Instructions',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const SizedBox(height: 12),
                  ...recipe.instructions.asMap().entries.map(
                    (entry) => Padding(
                      padding: const EdgeInsets.only(bottom: 16.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CircleAvatar(
                            radius: 14,
                            backgroundColor: const Color(0xFFE65100),
                            child: Text(
                              '\${entry.key + 1}',
                              style: const TextStyle(color: Colors.white, fontSize: 13),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(child: Text(entry.value)),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.white,
        onPressed: () => provider.toggleFavorite(recipe.id),
        child: Icon(
          isFav ? Icons.favorite : Icons.favorite_border,
          color: Colors.red,
        ),
      ),
    );
  }

  Widget _infoBadge(IconData icon, String label) {
    return Column(
      children: [
        Icon(icon, color: const Color(0xFFE65100)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
      ],
    );
  }
}
`,
  },
  {
    path: 'lib/screens/add_recipe_screen.dart',
    name: 'add_recipe_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/recipe.dart';
import '../providers/recipe_provider.dart';

class AddRecipeScreen extends StatefulWidget {
  const AddRecipeScreen({super.key});

  @override
  State<AddRecipeScreen> createState() => _AddRecipeScreenState();
}

class _AddRecipeScreenState extends State<AddRecipeScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _prepTimeController = TextEditingController(text: '15');
  final _cookTimeController = TextEditingController(text: '20');
  final _imageUrlController = TextEditingController();

  String _selectedCategory = 'Dinner';
  final List<TextEditingController> _ingredientControllers = [TextEditingController()];
  final List<TextEditingController> _amountControllers = [TextEditingController()];
  final List<TextEditingController> _instructionControllers = [TextEditingController()];

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _prepTimeController.dispose();
    _cookTimeController.dispose();
    _imageUrlController.dispose();
    for (var c in _ingredientControllers) c.dispose();
    for (var c in _amountControllers) c.dispose();
    for (var c in _instructionControllers) c.dispose();
    super.dispose();
  }

  void _submitForm() {
    if (!_formKey.currentState!.validate()) return;

    final ingredients = <Ingredient>[];
    for (int i = 0; i < _ingredientControllers.length; i++) {
      final name = _ingredientControllers[i].text.trim();
      final amount = _amountControllers[i].text.trim();
      if (name.isNotEmpty) {
        ingredients.add(
          Ingredient(
            id: 'ing-\${DateTime.now().millisecondsSinceEpoch}-\$i',
            name: name,
            amount: amount.isNotEmpty ? amount : '1 serving',
          ),
        );
      }
    }

    final instructions = _instructionControllers
        .map((c) => c.text.trim())
        .where((text) => text.isNotEmpty)
        .toList();

    if (ingredients.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add at least 1 ingredient!')),
      );
      return;
    }

    if (instructions.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add at least 1 instruction step!')),
      );
      return;
    }

    final newRecipe = Recipe(
      id: 'custom-\${DateTime.now().millisecondsSinceEpoch}',
      name: _nameController.text.trim(),
      description: _descriptionController.text.trim(),
      category: _selectedCategory,
      imageUrl: _imageUrlController.text.trim().isNotEmpty
          ? _imageUrlController.text.trim()
          : 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=900&q=80',
      prepTime: int.tryParse(_prepTimeController.text) ?? 15,
      cookTime: int.tryParse(_cookTimeController.text) ?? 20,
      servings: 4,
      ingredients: ingredients,
      instructions: instructions,
      isUserCreated: true,
      createdAt: DateTime.now().toIso8601String(),
    );

    context.read<RecipeProvider>().addRecipe(newRecipe);
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Recipe "\${newRecipe.name}" added successfully!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add New Recipe')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(labelText: 'Recipe Name *'),
              validator: (v) => v == null || v.trim().isEmpty ? 'Recipe name is required' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(labelText: 'Description *'),
              maxLines: 2,
              validator: (v) => v == null || v.trim().isEmpty ? 'Description is required' : null,
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: _selectedCategory,
              decoration: const InputDecoration(labelText: 'Category *'),
              items: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegetarian', 'Seafood', 'Pasta', 'Other']
                  .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                  .toList(),
              onChanged: (v) => setState(() => _selectedCategory = v!),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: TextFormField(
                    controller: _prepTimeController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Prep Time (mins) *'),
                    validator: (v) => (int.tryParse(v ?? '') ?? 0) <= 0 ? 'Must be > 0' : null,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextFormField(
                    controller: _cookTimeController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Cook Time (mins)'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _imageUrlController,
              decoration: const InputDecoration(
                labelText: 'Food Photo URL (Optional)',
                hintText: 'https://...',
              ),
            ),
            const SizedBox(height: 24),
            // Ingredients Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Ingredients *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                IconButton(
                  icon: const Icon(Icons.add_circle, color: Color(0xFFE65100)),
                  onPressed: () {
                    setState(() {
                      _ingredientControllers.add(TextEditingController());
                      _amountControllers.add(TextEditingController());
                    });
                  },
                ),
              ],
            ),
            ...List.generate(_ingredientControllers.length, (idx) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: TextFormField(
                        controller: _ingredientControllers[idx],
                        decoration: InputDecoration(hintText: 'Ingredient #\${idx + 1}'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      flex: 1,
                      child: TextFormField(
                        controller: _amountControllers[idx],
                        decoration: const InputDecoration(hintText: 'Amount (e.g. 1 cup)'),
                      ),
                    ),
                    if (_ingredientControllers.length > 1)
                      IconButton(
                        icon: const Icon(Icons.remove_circle, color: Colors.redAccent),
                        onPressed: () {
                          setState(() {
                            _ingredientControllers.removeAt(idx);
                            _amountControllers.removeAt(idx);
                          });
                        },
                      ),
                  ],
                ),
              );
            }),
            const SizedBox(height: 20),
            // Instructions Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Instructions *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                IconButton(
                  icon: const Icon(Icons.add_circle, color: Color(0xFFE65100)),
                  onPressed: () {
                    setState(() {
                      _instructionControllers.add(TextEditingController());
                    });
                  },
                ),
              ],
            ),
            ...List.generate(_instructionControllers.length, (idx) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  children: [
                    CircleAvatar(radius: 12, child: Text('\${idx + 1}')),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextFormField(
                        controller: _instructionControllers[idx],
                        decoration: InputDecoration(hintText: 'Step \${idx + 1} instructions...'),
                      ),
                    ),
                    if (_instructionControllers.length > 1)
                      IconButton(
                        icon: const Icon(Icons.remove_circle, color: Colors.redAccent),
                        onPressed: () {
                          setState(() {
                            _instructionControllers.removeAt(idx);
                          });
                        },
                      ),
                  ],
                ),
              );
            }),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _submitForm,
              child: const Text('Save and Publish Recipe'),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/favorites_screen.dart',
    name: 'favorites_screen.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/recipe_provider.dart';
import '../widgets/recipe_card.dart';
import 'recipe_detail_screen.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<RecipeProvider>();
    final favorites = provider.favorites;

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Favourites'),
      ),
      body: favorites.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.favorite_border, size: 72, color: Colors.orangeAccent),
                  const SizedBox(height: 16),
                  const Text(
                    'No favourite recipes yet!',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text('Tap the heart icon on any recipe to save it here.'),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Explore Recipes'),
                  ),
                ],
              ),
            )
          : GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                maxCrossAxisExtent: 380,
                childAspectRatio: 0.85,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: favorites.length,
              itemBuilder: (context, index) {
                final recipe = favorites[index];
                return RecipeCard(
                  recipe: recipe,
                  isFavorite: true,
                  onFavoriteToggle: () => provider.toggleFavorite(recipe.id),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => RecipeDetailScreen(recipe: recipe),
                      ),
                    );
                  },
                );
              },
            ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/recipe_card.dart',
    name: 'recipe_card.dart',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import '../models/recipe.dart';

class RecipeCard extends StatelessWidget {
  final Recipe recipe;
  final bool isFavorite;
  final VoidCallback onFavoriteToggle;
  final VoidCallback onTap;

  const RecipeCard({
    super.key,
    required this.recipe,
    required this.isFavorite,
    required this.onFavoriteToggle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                Image.network(
                  recipe.imageUrl,
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 180,
                    color: Colors.orange.shade50,
                    child: const Icon(Icons.fastfood, size: 60, color: Colors.orange),
                  ),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: CircleAvatar(
                    backgroundColor: Colors.white.withOpacity(0.9),
                    radius: 20,
                    child: IconButton(
                      iconSize: 20,
                      icon: Icon(
                        isFavorite ? Icons.favorite : Icons.favorite_border,
                        color: Colors.red,
                      ),
                      onPressed: onFavoriteToggle,
                    ),
                  ),
                ),
                Positioned(
                  bottom: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      recipe.category,
                      style: const TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    recipe.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    recipe.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 13, color: Colors.grey.shade700),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.access_time, size: 16, color: Color(0xFFE65100)),
                          const SizedBox(width: 4),
                          Text(
                            '\${recipe.prepTime}m prep',
                            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
                      if (recipe.isUserCreated)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.orange.shade100,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text('My Recipe', style: TextStyle(fontSize: 10, color: Color(0xFFE65100))),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    content: `# TastyHub – Recipe Explorer
**Flutter Application Development Programme Project**

A complete, professional, responsive Recipe Application Website and Android App built strictly following the college project specification using **Flutter**, **Dart** (null-safe), **Provider** state management, and **ChangeNotifier**.

---

## 🛠️ Technology Stack
- **Framework:** Flutter (stable channel 3.35+)
- **Programming Language:** Dart with null safety
- **Platforms:** Flutter Web & Android (APK release ready)
- **State Management:** Provider (\`provider: ^6.1.2\`)
- **Shared State:** \`ChangeNotifier\` (\`RecipeProvider\`)
- **Local Persistence:** \`shared_preferences\` (for user recipes & favorites)
- **Networking:** \`http\` (integrates with TheMealDB public REST API)
- **Theme:** Warm Food Palette seeded from Warm Orange (\`#E65100\`) and Soft Cream (\`#FFF8E7\`)

---

## 📱 Application Screens
1. **Screen 1: Home / Recipe List Page**
   - TastyHub branding & welcome message
   - Live Search bar with real-time query filtering
   - Category filter chips (Chicken, Breakfast, Dessert, Seafood, etc.)
   - Dynamic Recipe Cards with imagery, prep times, and instant favourite toggling
   - **4 Mandatory States Strictly Handled:**
     - ⏳ **Loading State**: CircularProgressIndicator / Skeleton loaders
     - ⚠️ **Error State**: Informative message with **Retry Button**
     - 🔍 **Empty State**: Friendly "No recipes found" message + reset filters button
     - 🍲 **Data State**: Responsive grid of recipes
2. **Screen 2: Recipe Detail Page**
   - High-res hero imagery with flexible app bar
   - Prep time, cooking time, servings, difficulty metadata
   - Structured ingredients checklist
   - Numbered step-by-step instructions
   - Floating favorite button
3. **Screen 3: Add Recipe Page**
   - Form fields: Recipe Name, Description, Category, Prep Time, Cook Time, Image URL
   - Dynamic multi-ingredient list (add/remove items)
   - Dynamic multi-instruction steps (add/remove steps)
   - Form validation on all required fields
   - Instant local persistence to \`shared_preferences\`
4. **Screen 4: Favourites Page**
   - Dedicated view for all saved favorite recipes
   - Empty state with redirect back to home

---

## 🚀 How to Run in Android Studio / VS Code

1. **Prerequisites:**
   - Flutter SDK 3.35 or newer installed
   - Android Studio with Android SDK & JDK 17 configured
   - Chrome browser for Flutter Web testing

2. **Install Dependencies:**
   \`\`\`bash
   flutter pub get
   \`\`\`

3. **Run on Flutter Web:**
   \`\`\`bash
   flutter run -d chrome
   \`\`\`

4. **Run on Android Emulator or Physical Device:**
   \`\`\`bash
   flutter run
   \`\`\`

5. **Generate Android Release APK:**
   \`\`\`bash
   flutter build apk --release
   \`\`\`
   The resulting APK will be saved to:
   \`build/app/outputs/flutter-apk/app-release.apk\`
`,
  },
];
