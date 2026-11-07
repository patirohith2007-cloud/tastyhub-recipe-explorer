// TastyHub - Recipe Explorer App
// Dart + Flutter

import 'dart:convert';

enum Difficulty { easy, medium, hard }

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
  });

  Map<String, dynamic> toJson() => {
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
      };

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      imageUrl: json['imageUrl'],
      category: json['category'],
      cookTime: json['cookTime'],
      difficulty: Difficulty.values.byName(json['difficulty']),
      ingredients: List<String>.from(json['ingredients']),
      steps: List<String>.from(json['steps']),
      rating: (json['rating'] as num).toDouble(),
    );
  }
}

class TastyHubApp {
  List<Recipe> recipes = [];
  String searchQuery = '';
  String selectedCategory = 'All';

  void addRecipe(Recipe recipe) {
    recipes.add(recipe);
    print('Recipe Added: ${recipe.title}');
  }

  List<Recipe> getFilteredRecipes() {
    return recipes.where((r) {
      bool matchCat = selectedCategory == 'All' || r.category == selectedCategory;
      bool matchSearch = searchQuery.isEmpty ||
          r.title.toLowerCase().contains(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }).toList();
  }

  List<Recipe> getTopRated() {
    var sorted = [...recipes];
    sorted.sort((a, b) => b.rating.compareTo(a.rating));
    return sorted.take(5).toList();
  }
}

void main() {
  final app = TastyHubApp();

  app.addRecipe(Recipe(
    id: '1',
    title: 'Chicken Biryani',
    description: 'Authentic Hyderabadi Chicken Biryani with raita.',
    imageUrl: 'assets/biryani.jpg',
    category: 'Indian',
    cookTime: 45,
    difficulty: Difficulty.medium,
    ingredients: ['Chicken', 'Basmati Rice', 'Onions', 'Spices', 'Curd'],
    steps: ['Marinate chicken', 'Cook rice 70%', 'Layer and dum cook 20 mins'],
    rating: 4.8,
  ));

  app.addRecipe(Recipe(
    id: '2',
    title: 'Paneer Butter Masala',
    description: 'Creamy paneer curry, best with naan.',
    imageUrl: 'assets/paneer.jpg',
    category: 'Veg',
    cookTime: 30,
    difficulty: Difficulty.easy,
    ingredients: ['Paneer', 'Tomato', 'Butter', 'Cream', 'Spices'],
    steps: ['Make tomato gravy', 'Add paneer', 'Add cream and serve'],
    rating: 4.6,
  ));

  print('TastyHub Started - ${app.recipes.length} recipes');
  print('Top Rated: ${app.getTopRated().map((e) => e.title).toList()}');
}
