import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} 
       options={{ headerShown: false }}
       />
      <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} options={{ title: 'Recipe Details' }} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
