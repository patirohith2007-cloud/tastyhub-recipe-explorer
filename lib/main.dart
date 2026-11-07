// TastyHub - Recipe Explorer App
// Flutter + Dart + Provider State Management
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => RecipeProvider()..loadRecipes(),
      child: const TastyHubApp(),
    ),
  );
}

// ================= MODELS =================
enum Difficulty { easy, medium, hard }

extension DifficultyLabel on Difficulty {
  String get label {
    switch (this) {
      case Difficulty.easy:
        return 'Easy';
      case Difficulty.medium:
        return 'Medium';
      case Difficulty.hard:
        return 'Hard';
    }
  }

  Color get color {
    switch (this) {
      case Difficulty.easy:
        return Colors.green;
      case Difficulty.medium:
        return Colors.orange;
      case Difficulty.hard:
        return Colors.red;
    }
  }
}

class Recipe {
  final String id;
  final String title;
  final String description;
  final String imageUrl;
  final String category;
  final int cookTime;
  final Difficulty difficulty;
  final List<String> ingredients;
  final List<String> steps;
  final double rating;
  final int calories;
  final int servings;
  bool isFavorite;

  Recipe({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.category,
    required this.cookTime,
    required this.difficulty,
    required this.ingredients,
    required this.steps,
    required this.rating,
    required this.calories,
    required this.servings,
    this.isFavorite = false,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      id: json['id'].toString(),
      title: json['title'] ?? 'Untitled Recipe',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'] ?? 'https://picsum.photos/400/300',
      category: json['category'] ?? 'General',
      cookTime: json['cookTime'] ?? 30,
      difficulty: Difficulty.values.firstWhere(
        (e) => e.name == (json['difficulty'] ?? 'easy'),
        orElse: () => Difficulty.easy,
      ),
      ingredients: List<String>.from(json['ingredients'] ?? []),
      steps: List<String>.from(json['steps'] ?? []),
      rating: (json['rating'] ?? 4.0).toDouble(),
      calories: json['calories'] ?? 350,
      servings: json['servings'] ?? 2,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'imageUrl': imageUrl,
      'category': category,
      'cookTime': cookTime,
      'difficulty': difficulty.name,
      'ingredients': ingredients,
      'steps': steps,
      'rating': rating,
      'calories': calories,
      'servings': servings,
    };
  }
}

// ================= PROVIDER =================
class RecipeProvider extends ChangeNotifier {
  List<Recipe> _allRecipes = [];
  List<Recipe> _filteredRecipes = [];
  String _searchQuery = '';
  String _selectedCategory = 'All';
  bool _isLoading = true;
  bool _showFavoritesOnly = false;
  Set<String> _favoriteIds = {};

  List<Recipe> get recipes => _filteredRecipes;
  bool get isLoading => _isLoading;
  String get selectedCategory => _selectedCategory;
  bool get showFavoritesOnly => _showFavoritesOnly;

  List<String> get categories {
    final cats = _allRecipes.map((r) => r.category).toSet().toList();
    cats.sort();
    return ['All', ...cats];
  }

  Future<void> loadRecipes() async {
    _isLoading = true;
    notifyListeners();
    await _loadFavoritesFromStorage();
    try {
      final response = await http.get(
        Uri.parse('https://dummyjson.com/recipes?limit=20'),
      ).timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List list = data['recipes'] ?? [];
        _allRecipes = list.map((e) {
          final r = Recipe.fromJson({
            'id': e['id'],
            'title': e['name'],
            'description': 'Delicious ${(e['name'] as String?) ?? 'recipe'} - ${e['cuisine'] ?? 'World'} cuisine.',
            'imageUrl': e['image'],
            'category': e['mealType'] != null && (e['mealType'] as List).isNotEmpty ? e['mealType'][0] : 'General',
            'cookTime': ((e['prepTimeMinutes'] ?? 15) + (e['cookTimeMinutes'] ?? 15)) as int,
            'difficulty': (e['difficulty'] ?? 'Easy').toString().toLowerCase(),
            'ingredients': e['ingredients'],
            'steps': e['instructions'],
            'rating': e['rating'],
            'calories': e['caloriesPerServing'],
            'servings': e['servings'],
          });
          r.isFavorite = _favoriteIds.contains(r.id);
          return r;
        }).toList();
      } else {
        _allRecipes = _dummyRecipes();
      }
    } catch (e) {
      _allRecipes = _dummyRecipes();
    }
    _applyFilters();
    _isLoading = false;
    notifyListeners();
  }

  List<Recipe> _dummyRecipes() {
    return [
      Recipe(id: '1', title: 'Hyderabadi Chicken Biryani', description: 'Authentic dum biryani with saffron rice, tender chicken and raita.', imageUrl: 'https://picsum.photos/seed/biryani/400/300', category: 'Dinner', cookTime: 60, difficulty: Difficulty.hard, ingredients: ['500g Chicken', '2 cups Basmati Rice', 'Yogurt', 'Onions', 'Biryani Masala', 'Saffron'], steps: ['Marinate chicken with yogurt and spices for 1 hour.', 'Soak rice for 30 mins and par-boil.', 'Layer rice and chicken, dum on low flame 25 mins.', 'Serve hot with raita.'], rating: 4.9, calories: 520, servings: 4),
      Recipe(id: '2', title: 'Paneer Butter Masala', description: 'Creamy tomato gravy with soft paneer cubes.', imageUrl: 'https://picsum.photos/seed/paneer/400/300', category: 'Lunch', cookTime: 30, difficulty: Difficulty.medium, ingredients: ['200g Paneer', 'Tomatoes', 'Butter', 'Cream', 'Garam Masala'], steps: ['Make tomato puree and cook till oil separates.', 'Add butter, cream and spices.', 'Add paneer cubes, simmer 5 mins.'], rating: 4.8, calories: 380, servings: 3),
      Recipe(id: '3', title: 'Masala Dosa', description: 'Crispy dosa with spicy potato filling and chutney.', imageUrl: 'https://picsum.photos/seed/dosa/400/300', category: 'Breakfast', cookTime: 25, difficulty: Difficulty.medium, ingredients: ['Dosa Batter', 'Potatoes', 'Mustard', 'Curry Leaves', 'Chutney'], steps: ['Prepare potato palya.', 'Spread batter on hot tawa.', 'Add filling and fold.'], rating: 4.7, calories: 290, servings: 2),
      Recipe(id: '4', title: 'Chocolate Brownie', description: 'Fudgy chocolate brownie with walnuts.', imageUrl: 'https://picsum.photos/seed/brownie/400/300', category: 'Dessert', cookTime: 35, difficulty: Difficulty.easy, ingredients: ['Dark Chocolate', 'Butter', 'Sugar', 'Eggs', 'Flour'], steps: ['Melt chocolate and butter.', 'Mix sugar, eggs and flour.', 'Bake at 180C for 25 mins.'], rating: 4.9, calories: 420, servings: 4),
      Recipe(id: '5', title: 'Veg Fried Rice', description: 'Quick Indo-Chinese fried rice with veggies.', imageUrl: 'https://picsum.photos/seed/friedrice/400/300', category: 'Dinner', cookTime: 20, difficulty: Difficulty.easy, ingredients: ['Cooked Rice', 'Carrot', 'Capsicum', 'Soya Sauce', 'Garlic'], steps: ['Heat oil, fry garlic.', 'Add veggies and toss on high flame.', 'Add rice and soya sauce.'], rating: 4.5, calories: 310, servings: 2),
    ];
  }

  void setSearch(String query) {
    _searchQuery = query.toLowerCase();
    _applyFilters();
  }

  void setCategory(String category) {
    _selectedCategory = category;
    _applyFilters();
  }

  void toggleFavoritesOnly() {
    _showFavoritesOnly = !_showFavoritesOnly;
    _applyFilters();
  }

  void _applyFilters() {
    _filteredRecipes = _allRecipes.where((r) {
      final matchesSearch = _searchQuery.isEmpty || r.title.toLowerCase().contains(_searchQuery) || r.category.toLowerCase().contains(_searchQuery);
      final matchesCategory = _selectedCategory == 'All' || r.category == _selectedCategory;
      final matchesFav = !_showFavoritesOnly || r.isFavorite;
      return matchesSearch && matchesCategory && matchesFav;
    }).toList();
    notifyListeners();
  }

  Future<void> toggleFavorite(Recipe recipe) async {
    recipe.isFavorite = !recipe.isFavorite;
    if (recipe.isFavorite) {
      _favoriteIds.add(recipe.id);
    } else {
      _favoriteIds.remove(recipe.id);
    }
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('favorites', _favoriteIds.toList());
    _applyFilters();
  }

  Future<void> _loadFavoritesFromStorage() async {
    final prefs = await SharedPreferences.getInstance();
    _favoriteIds = (prefs.getStringList('favorites') ?? []).toSet();
  }
}

// ================= APP =================
class TastyHubApp extends StatelessWidget {
  const TastyHubApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TastyHub',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFE65100)),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final provider = context.watch<RecipeProvider>();
    return Scaffold(
      appBar: AppBar(
        title: const Text('🍳 TastyHub - Recipe Explorer'),
        backgroundColor: const Color(0xFFE65100),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(provider.showFavoritesOnly ? Icons.favorite : Icons.favorite_border),
            onPressed: () => provider.toggleFavoritesOnly(),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              onChanged: provider.setSearch,
              decoration: InputDecoration(
                hintText: 'Search recipes... Biryani, Dosa...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
          SizedBox(
            height: 40,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: provider.categories.length,
              itemBuilder: (context, i) {
                final cat = provider.categories[i];
                final selected = cat == provider.selectedCategory;
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: ChoiceChip(
                    label: Text(cat),
                    selected: selected,
                    onSelected: (_) => provider.setCategory(cat),
                  ),
                );
              },
            ),
          ),
          Expanded(
            child: provider.isLoading
                ? const Center(child: CircularProgressIndicator())
                : provider.recipes.isEmpty
                    ? const Center(child: Text('No recipes found 😔'))
                    : ListView.builder(
                        itemCount: provider.recipes.length,
                        itemBuilder: (context, i) {
                          final recipe = provider.recipes[i];
                          return RecipeCard(recipe: recipe);
                        },
                      ),
          ),
        ],
      ),
    );
  }
}

class RecipeCard extends StatelessWidget {
  final Recipe recipe;
  const RecipeCard({super.key, required this.recipe});
  @override
  Widget build(BuildContext context) {
    final provider = context.read<RecipeProvider>();
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: InkWell(
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => DetailScreen(recipe: recipe))),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
              child: Image.network(recipe.imageUrl, height: 170, width: double.infinity, fit: BoxFit.cover),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(child: Text(recipe.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold))),
                      IconButton(
                        icon: Icon(recipe.isFavorite ? Icons.favorite : Icons.favorite_border, color: Colors.red),
                        onPressed: () => provider.toggleFavorite(recipe),
                      ),
                    ],
                  ),
                  Text(recipe.description, maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Chip(label: Text(recipe.category)),
                      const SizedBox(width: 6),
                      Chip(label: Text('⏱ ${recipe.cookTime} min')),
                      const SizedBox(width: 6),
                      Chip(label: Text('⭐ ${recipe.rating}'), backgroundColor: Colors.amber.shade100),
                      const SizedBox(width: 6),
                      Chip(label: Text(recipe.difficulty.label), backgroundColor: recipe.difficulty.color.withOpacity(0.15)),
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

class DetailScreen extends StatefulWidget {
  final Recipe recipe;
  const DetailScreen({super.key, required this.recipe});
  @override
  State<DetailScreen> createState() => _DetailScreenState();
}

class _DetailScreenState extends State<DetailScreen> {
  int currentStep = 0;
  bool cookMode = false;

  @override
  Widget build(BuildContext context) {
    final r = widget.recipe;
    return Scaffold(
      appBar: AppBar(title: Text(r.title), backgroundColor: const Color(0xFFE65100), foregroundColor: Colors.white),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(borderRadius: BorderRadius.circular(14), child: Image.network(r.imageUrl, height: 220, width: double.infinity, fit: BoxFit.cover)),
            const SizedBox(height: 12),
            Text(r.title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text('${r.category} • ${r.cookTime} min • ${r.calories} kcal • Serves ${r.servings} • ⭐ ${r.rating}'),
            const SizedBox(height: 12),
            Text(r.description),
            const SizedBox(height: 16),
            Row(
              children: [
                const Text('Cook Mode', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                Switch(value: cookMode, onChanged: (v) => setState(() => cookMode = v)),
              ],
            ),
            if (cookMode)
              Card(
                color: Colors.orange.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Step ${currentStep + 1} / ${r.steps.length}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 8),
                      Text(r.steps[currentStep], style: const TextStyle(fontSize: 17)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          if (currentStep > 0) ElevatedButton(onPressed: () => setState(() => currentStep--), child: const Text('Previous')),
                          const Spacer(),
                          if (currentStep < r.steps.length - 1) ElevatedButton(onPressed: () => setState(() => currentStep++), child: const Text('Next Step →')) else const Text('🎉 Done! Enjoy!'),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 16),
            const Text('Ingredients', style: TextStyle(fontSize: 19, fontWeight: FontWeight.bold)),
            ...r.ingredients.map((e) => ListTile(leading: const Icon(Icons.check_circle, color: Colors.green), title: Text(e))),
            const SizedBox(height: 10),
            const Text('Steps', style: TextStyle(fontSize: 19, fontWeight: FontWeight.bold)),
            ...r.steps.asMap().entries.map((e) => ListTile(leading: CircleAvatar(child: Text('${e.key + 1}')), title: Text(e.value))),
          ],
        ),
      ),
    );
  }
}
