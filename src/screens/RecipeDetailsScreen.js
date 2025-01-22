import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RecipeDetailsScreen = ({ route }) => {
  const { id } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const fetchedRecipe = response.data.meals[0];
        setRecipe(fetchedRecipe);

      
        const favorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
        setIsFavorite(favorites.some((fav) => fav.idMeal === fetchedRecipe.idMeal));
      } catch (error) {
        console.error('Error fetching recipe details');
      } 
        setLoading(false);
      
    };

    fetchRecipeDetails();
  }, [id]);

  const toggleFavorite = async () => {
    try {
      const favorites = JSON.parse(await AsyncStorage.getItem('favorites')) || [];
      let updatedFavorites;

      if (isFavorite) {
     
        updatedFavorites = favorites.filter((fav) => fav.idMeal !== recipe.idMeal);
      } else {
      
        updatedFavorites = [...favorites, recipe];
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(!isFavorite);

      Alert.alert(
        isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
        `${recipe.strMeal} has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  const ingredients = Array.from({ length: 20 }, (item, i) => ({
    ingredient: recipe[`strIngredient${i + 1}`],
    measure: recipe[`strMeasure${i + 1}`],
  })).filter(({ ingredient }) => ingredient);

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.strMeal}</Text>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Text style={{ fontSize: 28 }}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.category}>
        {recipe.strCategory} - {recipe.strArea}
      </Text>

      <Text style={styles.subtitle}>Ingredients:</Text>
      {ingredients.map(({ ingredient, measure }, index) => (
        <Text key={index} style={styles.ingredient}>
          - {measure} {ingredient}
        </Text>
      ))}

      <Text style={styles.subtitle}>Instructions:</Text>
      <Text style={styles.instructions}>{recipe.strInstructions}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
   
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6347',
    flex: 1,
  },
  favoriteButton: {
    marginLeft: 10,
  },
  category: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    marginRight: 250,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: -10,
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 20,
  },
});

export default RecipeDetailsScreen;
