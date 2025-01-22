import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchRecipes = async (query = '') => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      setRecipes(response.data.meals || []);
    } catch (err) {
      console.log('Error fetching recipes');
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        'https://www.themealdb.com/api/json/v1/1/categories.php'
      );
      setCategories([{ idCategory: '0', strCategory: 'ALL' }, ...response.data.categories]);
    } catch (err) {
      console.log('Error fetching categories');
    }
  };

  const fetchRecipesByCategory = async (category) => {
    if (category === 'ALL') {
      fetchRecipes();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      const filteredRecipes = response.data.meals || [];

      // Fetch full details for each recipe
      const detailedRecipes = await Promise.all(
        filteredRecipes.map(async (recipe) => {
          const detailsResponse = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`
          );
          console.log(detailsResponse.data);
          return detailsResponse.data.meals[0];
        })
      );

      setRecipes(detailedRecipes);
    } catch (err) {
      console.log('Error fetching recipes by category');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍴 Discover Delicious Recipes 🍲</Text>

      
      <View style={styles.searchContainer}>
        <Text style={styles.emoji}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search for a recipe"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => fetchRecipes(search)}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.idCategory}
            style={[
              styles.categoryButton,
              selectedCategory === category.strCategory && styles.categoryButtonSelected,
            ]}
            onPress={() => {
              setSelectedCategory(category.strCategory);
              fetchRecipesByCategory(category.strCategory);
            }}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.strCategory && styles.categoryTextSelected,
              ]}
            >
              {category.strCategory}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

     
      {loading && <ActivityIndicator size="large" color="#FF6347" />}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('RecipeDetails', { id: item.idMeal })
            }
          >
            <View style={styles.card}>
              <Image source={{ uri: item.strMealThumb }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.strMeal}</Text>
                <Text style={styles.category}>Category: {item.strCategory || 'N/A'}</Text>
                <Text numberOfLines={2} style={styles.description}>
                  {item.strInstructions ? item.strInstructions.slice(0, 60) : ''}...
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    padding: 20,
  },
  header: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#FF6347',
    marginBottom: 25,
    textAlign: 'center',
    textShadowColor: '#aaa',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#FF6347',
    marginBottom: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  emoji: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: '#FFF',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FF6347',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  categoryButtonSelected: {
    backgroundColor: '#FF6347',
  },
  categoryText: {
    fontSize: 16,
   marginTop:-5,
    color: '#FF6347',
    fontWeight: 'bold',
   
  },
  categoryTextSelected: {
    color: '#FFF',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  info: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  category: {
    fontSize: 14,
    color: '#FF6347',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: '#777',
  },
});

export default HomeScreen;
