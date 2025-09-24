import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    axios.get('https://flavornest.onrender.com/api/recipes')
      .then(res => setRecipes(res.data))
      .catch(err => console.error(err));
  }, []);
  return (
    <div className="container mx-auto py-12 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-6">All Recipes</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
